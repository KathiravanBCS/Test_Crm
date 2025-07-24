# Full Stack DateTime Best Practices - React + FastAPI + PostgreSQL

**Date:** 2025-07-20  
**Stack:** React (Mantine UI) → FastAPI → PostgreSQL

## Overview

This document provides comprehensive best practices for handling dates and times across the entire stack, building upon the initial analysis report.

## 1. Database Layer (PostgreSQL)

### Recommended Schema Changes

```sql
-- ❌ AVOID: Current inconsistent approach
onboarded_date TIMESTAMP,  -- No timezone info
start_date DATE,           -- Different type
created_at TIMESTAMP DEFAULT currunt_timestamp  -- Typo + no timezone

-- ✅ PREFER: Consistent timezone-aware approach
onboarded_at TIMESTAMPTZ NOT NULL,  -- Always use TIMESTAMPTZ for moments in time
start_date DATE NOT NULL,           -- Use DATE only for calendar dates
created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
```

### PostgreSQL Best Practices

1. **Use TIMESTAMPTZ for all timestamps**
   - Stores as UTC internally
   - Converts to client timezone automatically
   - Handles DST changes correctly

2. **Use DATE only for calendar dates**
   - Birthdays, holidays, due dates without time component
   - Contract start/end dates

3. **Never use TIMESTAMP (without timezone)**
   - Ambiguous and error-prone
   - Exception: Only if storing "wall clock time" that should be same regardless of timezone

## 2. Backend Layer (FastAPI)

### Pydantic Models with Timezone-Aware Datetimes

```python
from datetime import datetime, date
from pydantic import BaseModel, Field
from zoneinfo import ZoneInfo

class CustomerBase(BaseModel):
    name: str
    onboarded_at: datetime = Field(default_factory=lambda: datetime.now(ZoneInfo("UTC")))
    
class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    updated_at: datetime | None = None
    
    class Config:
        # Ensures datetime objects are serialized as ISO 8601 strings
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class ProposalBase(BaseModel):
    title: str
    proposal_date: date  # Date only, no time component
    valid_until: date
    submitted_at: datetime  # Exact moment with timezone
```

### FastAPI DateTime Handling

```python
from fastapi import FastAPI, Query
from datetime import datetime, timezone
import pytz

app = FastAPI()

@app.get("/api/customers")
async def get_customers(
    # Accept ISO 8601 datetime strings in query params
    created_after: datetime | None = Query(None, description="Filter by creation date"),
    onboarded_before: datetime | None = Query(None)
):
    # FastAPI automatically parses ISO 8601 strings to datetime objects
    # Always work with UTC in the backend
    if created_after and created_after.tzinfo is None:
        created_after = created_after.replace(tzinfo=timezone.utc)
    
    # Query database with timezone-aware datetimes
    return await fetch_customers(created_after, onboarded_before)

@app.post("/api/proposals")
async def create_proposal(proposal: ProposalBase):
    # Store with current UTC timestamp
    proposal_dict = proposal.dict()
    proposal_dict['created_at'] = datetime.now(timezone.utc)
    
    # FastAPI will serialize datetime as ISO 8601 in response
    return await save_proposal(proposal_dict)
```

### Database Query Best Practices

```python
# Using SQLAlchemy with PostgreSQL
from sqlalchemy import DateTime, Date
from sqlalchemy.dialects.postgresql import TIMESTAMP

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True)
    onboarded_at = Column(TIMESTAMP(timezone=True), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    
class Proposal(Base):
    __tablename__ = "proposals"
    
    id = Column(Integer, primary_key=True)
    proposal_date = Column(Date, nullable=False)  # Date only
    submitted_at = Column(TIMESTAMP(timezone=True), nullable=False)
```

## 3. Frontend Layer (React + Mantine)

### Updated Date Utilities

```typescript
// src/lib/utils/date.ts
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// Set default timezone (should match your business timezone)
dayjs.tz.setDefault('Asia/Kolkata'); // For India-based business

// Format for display
export function formatDate(date: string | Date | null): string {
  if (!date) return '-';
  return dayjs(date).format('DD MMM YYYY');
}

export function formatDateTime(date: string | Date | null): string {
  if (!date) return '-';
  // Convert UTC to local timezone for display
  return dayjs(date).tz().format('DD MMM YYYY, hh:mm A');
}

// API communication helpers
export function toApiDateTime(date: Date | null): string | null {
  if (!date) return null;
  // Always send as UTC ISO string
  return dayjs(date).utc().toISOString();
}

export function toApiDate(date: Date | null): string | null {
  if (!date) return null;
  // Send date only as YYYY-MM-DD
  return dayjs(date).format('YYYY-MM-DD');
}

export function fromApiDateTime(isoString: string | null): Date | null {
  if (!isoString) return null;
  // Parse ISO string and convert to Date object
  return dayjs(isoString).toDate();
}
```

### Updated DatesProvider Configuration

```typescript
// src/app/providers/dates.tsx
import { DatesProvider } from '@mantine/dates';
import 'dayjs/locale/en-in'; // For India
import dayjs from 'dayjs';

export function AppDatesProvider({ children }: { children: React.ReactNode }) {
  return (
    <DatesProvider
      settings={{
        locale: 'en-in',
        firstDayOfWeek: 1, // Monday
        weekendDays: [0, 6], // Sunday, Saturday
        // Don't set timezone here - handle it in utility functions
      }}
    >
      {children}
    </DatesProvider>
  );
}
```

### API Integration Pattern

```typescript
// src/features/customers/api/useCreateCustomer.ts
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toApiDateTime } from '@/lib/utils/date';

interface CustomerFormData {
  name: string;
  onboardedAt: Date;
}

export function useCreateCustomer() {
  return useMutation({
    mutationFn: async (data: CustomerFormData) => {
      // Transform dates before sending to API
      const payload = {
        ...data,
        onboarded_at: toApiDateTime(data.onboardedAt), // Convert to ISO string
      };
      
      return api.customers.create(payload);
    },
  });
}

// src/features/customers/components/CustomerList.tsx
import { formatDateTime } from '@/lib/utils/date';

const columns = [
  {
    accessor: 'onboarded_at',
    title: 'Onboarded',
    render: (record) => formatDateTime(record.onboarded_at), // Display in local time
  },
];
```

## 4. Complete Data Flow Example

### 1. User Selects Date in UI
```typescript
// User picks date in their local timezone (e.g., IST)
<DatePickerInput
  value={selectedDate} // Date object in local time
  onChange={setSelectedDate}
/>
```

### 2. Send to API
```typescript
// Convert to UTC ISO string
const payload = {
  proposal_date: toApiDate(selectedDate), // "2025-01-15"
  submitted_at: toApiDateTime(new Date()), // "2025-01-15T10:30:00.000Z"
};
```

### 3. FastAPI Receives & Validates
```python
# Automatically parsed by Pydantic
proposal_date: date  # 2025-01-15
submitted_at: datetime  # 2025-01-15 10:30:00+00:00 (UTC)
```

### 4. Store in PostgreSQL
```sql
-- Stored as UTC internally
INSERT INTO proposals (proposal_date, submitted_at) 
VALUES ('2025-01-15', '2025-01-15 10:30:00+00');
```

### 5. Retrieve & Send Back
```python
# FastAPI serializes as ISO 8601
{
  "proposal_date": "2025-01-15",
  "submitted_at": "2025-01-15T10:30:00+00:00"
}
```

### 6. Display in UI
```typescript
// Convert UTC to user's local time for display
formatDateTime(proposal.submitted_at) // "15 Jan 2025, 04:00 PM" (IST)
```

## 5. Testing Strategies

### Frontend Tests
```typescript
describe('Date utilities', () => {
  it('should handle timezone conversions', () => {
    const utcDate = '2025-01-15T10:30:00Z';
    const formatted = formatDateTime(utcDate);
    // Test depends on system timezone
    expect(formatted).toMatch(/15 Jan 2025/);
  });
});
```

### Backend Tests
```python
def test_datetime_serialization():
    from datetime import datetime, timezone
    
    dt = datetime(2025, 1, 15, 10, 30, tzinfo=timezone.utc)
    response = client.post("/api/proposals", json={
        "submitted_at": dt.isoformat()
    })
    
    assert response.json()["submitted_at"] == "2025-01-15T10:30:00+00:00"
```

## 6. Common Pitfalls to Avoid

1. **Don't mix timezone-aware and naive datetimes**
   ```python
   # ❌ Bad
   datetime.now()  # Naive datetime
   
   # ✅ Good
   datetime.now(timezone.utc)  # Timezone-aware
   ```

2. **Don't store local times in database**
   ```sql
   -- ❌ Bad
   meeting_time TIMESTAMP  -- Ambiguous
   
   -- ✅ Good
   meeting_time TIMESTAMPTZ  -- Clear and unambiguous
   ```

3. **Don't format dates on the backend**
   ```python
   # ❌ Bad
   return {"date": dt.strftime("%d/%m/%Y")}  # Locale-specific
   
   # ✅ Good
   return {"date": dt.isoformat()}  # Standard ISO 8601
   ```

## 7. Migration Checklist

- [ ] Update PostgreSQL schema to use TIMESTAMPTZ
- [ ] Update Pydantic models to use timezone-aware datetime
- [ ] Configure dayjs with timezone plugins
- [ ] Create standardized date utility functions
- [ ] Update all API calls to use ISO 8601 format
- [ ] Add timezone display to UI where relevant
- [ ] Test with different timezones
- [ ] Document timezone assumptions

## 8. Summary

For a React + FastAPI + PostgreSQL stack:

1. **Database**: Use TIMESTAMPTZ for all timestamps
2. **Backend**: Work with UTC, serialize as ISO 8601
3. **Frontend**: Display in user's timezone, send as UTC
4. **API Contract**: Always use ISO 8601 strings

This approach ensures:
- No timezone ambiguity
- Consistent data handling
- Proper DST support
- International readiness