# Outlook Integration Feature

## Overview
This feature integrates Microsoft Outlook 365 (Email and Calendar) into the CRM application using Microsoft Graph API.

## Current Status
The integration is now working with a client-side filtering approach to avoid Graph API filter limitations.

## Components

### Widgets
- **RecentEmailWidget** - Shows recent emails for an entity
- **RecentMeetingsWidget** - Shows upcoming meetings for an entity

### Full Viewers
- **EmailViewer** - Full email inbox with split-pane layout
- **CalendarViewer** - Calendar view with list/week/month/day views
- **EmailDetailPanel** - Email detail view with full content
- **CalendarDetailPanel** - Meeting detail view

### Test Components (for debugging)
- **GraphAPITest** - Tests various Graph API approaches
- **SimpleGraphTest** - Tests the simplified services
- **DebugEmailWidget** - Shows filter details and responses
- **OutlookDebug** - Shows initialization status

## Architecture

### Service Layer
```
/src/services/graph/
├── services/
│   ├── graph-email.service.ts            # Email service with client-side filtering
│   ├── graph-calendar.service.ts         # Calendar service with client-side filtering
│   ├── backend-email.service.ts          # Backend API implementation
│   ├── backend-calendar.service.ts       # Backend API implementation
│   └── service-factory.ts                # Service factory
├── mappers/                               # Type converters
├── types/                                 # TypeScript types
└── index.ts                              # Public API
```

### How It Works
1. **Authentication**: Uses existing MSAL configuration
2. **Service Selection**: Can switch between Graph API and Backend API
3. **Client-Side Filtering**: Fetches more data and filters locally to avoid Graph API limitations
4. **Entity Code Detection**: Automatically detects entity codes in email/meeting content

## Usage

### In a Component
```tsx
import { RecentEmailWidget } from '@/features/outlook/components/RecentEmailWidget';
import { RecentMeetingsWidget } from '@/features/outlook/components/RecentMeetingsWidget';

// In your component
<RecentEmailWidget
  entityType="partner"
  entityId={partnerId}
  entityCode={partner.partnerCode}
  maxItems={5}
/>

<RecentMeetingsWidget
  entityType="partner"
  entityId={partnerId}
  entityCode={partner.partnerCode}
  maxItems={5}
  showUpcoming={true}
/>
```

### Configuration
Set environment variable to switch between Graph API and Backend:
```
VITE_USE_GRAPH_BACKEND=false  # Use direct Graph API (default)
VITE_USE_GRAPH_BACKEND=true   # Use backend API
```

## Entity Code Patterns
The system automatically detects these entity codes:
- Partners: `PRTN-YYYY-NNN` or `PART-YYYY-NNN`
- Proposals: `PROP-YYYY-NNN`
- Engagement Letters: `EL-YYYY-NNN`
- Engagements: `ENG-YYYY-NNN`
- Service Items: `SI-YYYY-NNN`

## Known Issues & Solutions
1. **Graph API "InefficientFilter" Error**: Solved by using client-side filtering
2. **Performance**: Currently fetches up to 100 items for filtering
3. **Historical Data**: Limited to recent items due to client-side approach

## Next Steps
1. Implement caching to reduce API calls
2. Add pagination for large result sets
3. Consider moving complex filtering to backend
4. Add email composition and calendar event creation