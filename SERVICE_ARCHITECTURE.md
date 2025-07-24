# Service Layer Architecture for VSTN CRM

## Overview
Centralized service layer design with easy switching between mock and FastAPI REST services. Optimized for small data volumes with client-side filtering.

## Core Principles
1. **Single API Interface**: One consistent interface regardless of mock/real implementation
2. **Client-Side Operations**: Search, filter, sort operations happen in the browser
3. **Simple REST Endpoints**: Basic CRUD operations only
4. **Type Safety**: Full TypeScript support throughout
5. **Easy Switching**: Environment variable to toggle mock/real services

## API Structure

### Base Service Pattern
```typescript
interface BaseService<T, CreateDTO, UpdateDTO> {
  // Simple CRUD operations
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T>;
  create(data: CreateDTO): Promise<T>;
  update(id: number, data: UpdateDTO): Promise<T>;
  delete(id: number): Promise<void>;
}
```

### FastAPI Endpoint Pattern
```
GET    /api/v1/{entity}          # Get all records
GET    /api/v1/{entity}/{id}     # Get single record
POST   /api/v1/{entity}          # Create new record
PUT    /api/v1/{entity}/{id}     # Update record
DELETE /api/v1/{entity}/{id}     # Delete record
```

## Service Implementation Structure

```
src/
├── lib/
│   ├── api.ts                    # Main API service layer
│   ├── api-client.ts             # HTTP client with auth
│   └── api-endpoints.ts          # API endpoint definitions
├── services/
│   └── mock/
│       ├── index.ts              # Mock service implementations
│       ├── data/
│       │   ├── customers.ts      # Mock customer data
│       │   ├── partners.ts       # Mock partner data
│       │   ├── employees.ts      # Mock employee data
│       │   ├── proposals.ts      # Mock proposal data
│       │   └── master.ts         # Mock master data
│       ├── implementations/
│       │   ├── CustomerService.ts
│       │   ├── PartnerService.ts
│       │   ├── ProposalService.ts
│       │   ├── EmployeeService.ts
│       │   └── MasterDataService.ts
│       └── utils.ts              # Mock data generators
```

## Service Interfaces

### Customer Service
```typescript
interface CustomerService {
  getAll(): Promise<Customer[]>;
  getById(id: number): Promise<Customer>;
  create(data: CustomerFormData): Promise<Customer>;
  update(id: number, data: CustomerFormData): Promise<Customer>;
  delete(id: number): Promise<void>;
  
  // Related data (also client-filtered)
  getContacts(customerId: number): Promise<ContactPerson[]>;
  addContact(customerId: number, contact: ContactPersonFormData): Promise<ContactPerson>;
  updateContact(contactId: number, contact: ContactPersonFormData): Promise<ContactPerson>;
  deleteContact(contactId: number): Promise<void>;
}
```

### Master Data Service
```typescript
interface MasterDataService {
  // Cached on client - rarely changes
  getStatuses(): Promise<MasterStatus[]>;
  getServices(): Promise<MasterService[]>;
  getCurrencies(): Promise<MasterCurrency[]>;
  
  // For admin updates
  updateStatus(id: number, data: Partial<MasterStatus>): Promise<MasterStatus>;
  updateService(id: number, data: Partial<MasterService>): Promise<MasterService>;
}
```

## Mock Data Strategy

### Data Volume Estimates
- Customers: ~50-100 records
- Partners: ~10-20 records
- Employees: ~10-15 records
- Proposals: ~100-200 records
- Master Data: ~50-100 records total

### Mock Data Structure
```typescript
// Consistent ID generation
let nextId = 1000;
const generateId = () => nextId++;

// Realistic data generators
const generateCustomer = (overrides?: Partial<Customer>): Customer => ({
  id: generateId(),
  name: faker.company.name(),
  type: faker.helpers.arrayElement(['direct', 'partner_referred', 'partner_managed']),
  currencyCode: faker.helpers.arrayElement(['INR', 'USD', 'AED']),
  pan: generatePAN(),
  gstin: generateGSTIN(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides
});
```

## Client-Side Operations

### Filter/Search Hook
```typescript
export const useFilteredData = <T>(
  data: T[],
  filters: Record<string, any>,
  searchFields: (keyof T)[]
) => {
  return useMemo(() => {
    let filtered = data;
    
    // Apply search
    if (filters.search) {
      filtered = filtered.filter(item =>
        searchFields.some(field =>
          String(item[field]).toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    }
    
    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== 'search' && value !== undefined) {
        filtered = filtered.filter(item => item[key] === value);
      }
    });
    
    return filtered;
  }, [data, filters, searchFields]);
};
```

### Sort Hook
```typescript
export const useSortedData = <T>(
  data: T[],
  sortConfig: { key: keyof T; direction: 'asc' | 'desc' } | null
) => {
  return useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);
};
```

## Environment Configuration

```typescript
// .env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:8000/api/v1

// lib/api.ts
import { MockServices } from '@/services/mock';
import { apiClient } from './api-client';
import { API_ENDPOINTS } from './api-endpoints';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const api = USE_MOCK ? MockServices : RealServices;
```

## Data Synchronization

### Optimistic Updates
```typescript
const mutation = useMutation({
  mutationFn: (data: CustomerFormData) => api.customers.create(data),
  onMutate: async (newCustomer) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['customers'] });
    
    // Snapshot previous value
    const previousCustomers = queryClient.getQueryData(['customers']);
    
    // Optimistically update
    queryClient.setQueryData(['customers'], old => [...old, newCustomer]);
    
    return { previousCustomers };
  },
  onError: (err, newCustomer, context) => {
    // Rollback on error
    queryClient.setQueryData(['customers'], context.previousCustomers);
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['customers'] });
  },
});
```

## Performance Optimizations

### Data Caching Strategy
```typescript
// Cache master data for 1 hour
export const useMasterData = () => {
  const statuses = useQuery({
    queryKey: ['master', 'statuses'],
    queryFn: api.masterData.getStatuses,
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
  });
  
  // Similar for services and currencies
};
```

### Prefetching
```typescript
// Prefetch related data
export const useCustomerDetail = (id: number) => {
  const queryClient = useQueryClient();
  
  // Prefetch contacts when viewing customer
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['contacts', id],
      queryFn: () => api.customers.getContacts(id),
    });
  }, [id]);
  
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => api.customers.getById(id),
  });
};
```

Please confirm if you want me to proceed with implementing this service architecture.