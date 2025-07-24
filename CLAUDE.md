# Project Guide & Coding Standards

**Version:** 2.1
**Last Updated:** 2025-07-14

This document provides guidance for AI assistants and human developers working on the VSTN CRM repository. Adhering to these standards is crucial for maintaining code quality, consistency, and scalability.

## 1. Guiding Principles

* **Developer Experience is User Experience:** A clean, well-documented, and type-safe codebase enables faster, more reliable feature development, which directly benefits the end-user.
* **Backend is the Single Source of Truth:** The frontend is responsible for presentation and user interaction. All business logic, validation rules, and permissions are owned and enforced by the backend API.
* **Composition over Inheritance:** Build complex UIs by combining small, focused components.
* **Convention over Configuration:** Follow the established patterns in this guide to minimize boilerplate and ensure predictability across the codebase.

## 2. Project Overview

This is an enterprise-grade CRM Dashboard UI built with **React 19** and **TypeScript**. The application is designed for data-dense layouts, optimized for professional use on laptop and desktop screens, and leverages a modern, type-safe technology stack.

## 3. Key Commands

* `npm run dev`: Start the Vite development server with HMR.
* `npm run build`: Run TypeScript checks and build the application for production.
* `npm run lint`: Run ESLint and Prettier to identify and fix code quality issues.
* `npm run test`: Run unit and integration tests using Vitest.
* **Golden Rule:** Always ensure `npm run lint` and `npm run build` pass without errors before committing code.

## 4. Architecture & Technology Stack

* **Framework:** React 19 & Vite 5.4+
* **Language:** TypeScript 5.7+ (with strict mode fully enabled)
* **UI Library:** Mantine UI 8.1+
* **Styling:** Vanilla Extract for zero-runtime, type-safe CSS.
* **Routing:** React Router 7.6+
* **Server State:** TanStack Query 5.81+ for all asynchronous API interactions.
* **Client State:** Zustand for lightweight, global client-side state management.
* **Authentication:** MSAL React for Azure AD integration.
* **Authorization:** CASL.js for granular, attribute-based access control (ABAC/RBAC).

## 5. Project Structure (Feature-Sliced Design)

This project follows a **feature-sliced design** pattern optimized for Mantine UI and TanStack Query. Each feature is self-contained with its own pages, components, and API hooks.

```
src/
├── app/                    # Application-level setup and configuration
│   ├── providers/          # All React providers (wrapped in order)
│   │   ├── index.tsx       # Main provider wrapper composing all providers
│   │   ├── query.tsx       # TanStack Query configuration
│   │   └── auth.tsx        # MSAL authentication provider
│   ├── store/              # Zustand stores for global UI state
│   │   ├── ui.store.ts     # UI preferences (sidebar, theme, etc.)
│   │   └── notification.store.ts  # Global notification state
│   └── router.tsx          # Single source of truth for routes
│
├── components/             # ONLY shared, reusable UI components
│   ├── auth/               # Authorization components
│   │   ├── Can.tsx         # CASL permission component
│   │   └── RoleVisibility.tsx  # Role-based visibility
│   ├── display/            # Pure display components
│   │   ├── StatusBadge.tsx # Status indicator
│   │   ├── MoneyDisplay.tsx # Currency formatting
│   │   ├── EmptyState.tsx  # Empty/error states
│   │   └── InfoField.tsx   # Info display field
│   ├── forms/              # Form components
│   │   ├── inputs/         # Form input components
│   │   │   ├── SearchInput.tsx      # Search input
│   │   │   ├── CurrencyAmountInput.tsx # Currency input
│   │   │   └── GstinInput.tsx       # GST validation
│   │   ├── pickers/        # Entity selection
│   │   │   ├── CustomerPicker.tsx   # Customer selector
│   │   │   └── EmployeePicker.tsx   # Employee selector
│   │   └── ContactPersonForm.tsx    # Contact form
│   ├── tables/             # Table components
│   │   ├── DataTable.tsx   # Generic data table
│   │   ├── ListTable.tsx   # List table wrapper
│   │   └── ColumnSelector.tsx # Column management
│   ├── list-page/          # List page composition
│   │   ├── ListPageLayout.tsx    # Page layout
│   │   ├── FilterDrawer.tsx      # Filter UI
│   │   └── DetailDrawer.tsx      # Detail view
│   ├── theme/              # Theme components
│   │   ├── ThemeToggle.tsx # Theme switcher
│   │   └── ThemeSettings.tsx # Theme config
│   └── layout/             # App-level layout components
│       ├── AppShell.tsx    # Main application shell
│       ├── Header.tsx      # Top navigation bar
│       └── Sidebar.tsx     # Side navigation
│
├── features/               # Business features (self-contained modules)
│   ├── customers/          # Customer management feature
│   │   ├── pages/          # Page components (route endpoints)
│   │   │   ├── CustomerListPage.tsx    # List view page
│   │   │   ├── CustomerDetailPage.tsx  # Detail view page
│   │   │   └── CustomerEditPage.tsx    # Edit/Create page
│   │   ├── components/     # Feature-specific components
│   │   │   ├── CustomerForm.tsx         # Form component
│   │   │   ├── CustomerCard.tsx         # Display component
│   │   │   └── CustomerFilters.tsx      # Filter controls
│   │   ├── api/            # TanStack Query hooks
│   │   │   ├── useGetCustomers.ts       # List query
│   │   │   ├── useGetCustomer.ts        # Single query
│   │   │   ├── useCreateCustomer.ts     # Create mutation
│   │   │   └── useUpdateCustomer.ts     # Update mutation
│   │   ├── types.ts        # Feature-specific TypeScript types
│   │   └── utils.ts        # Feature-specific utilities
│   │
│   └── auth/               # Authentication feature
│       ├── pages/          # Auth pages (login, logout, etc.)
│       ├── components/     # Auth UI components
│       └── hooks/          # Auth-specific hooks
│
├── lib/                    # Shared libraries and utilities
│   ├── api.ts              # Main API service layer
│   ├── api-client.ts       # HTTP client with auth interceptors
│   ├── api-endpoints.ts    # API endpoint URL definitions
│   ├── casl/               # CASL authorization setup
│   │   ├── ability.ts      # Ability definition
│   │   ├── context.tsx     # React context provider
│   │   └── hooks.ts        # useAbility hook
│   ├── hooks/              # Shared custom hooks
│   └── utils/              # Shared utility functions
│
├── services/               # Mock services (to be removed in production)
├── styles/                 # Global styles and theme
└── types/                  # Global TypeScript types
```

### Key Principles:

1. **Features are self-contained**: Each feature has its own pages, components, and API hooks
2. **No barrel exports in features**: Import directly from files to improve tree-shaking
3. **Pages vs Components**: 
   - **Pages** are route endpoints that compose components and handle data fetching
   - **Components** are reusable UI pieces within a feature
4. **Shared components are truly shared**: Only put components in `src/components` if they're used across multiple features
5. **Co-locate related code**: Keep API hooks, types, and utilities within their feature

---

## 6. Authorization (RBAC with CASL.js)

We use **CASL.js** to manage all user permissions, enabling complex, attribute-based rules.

### 6.1. Core Concepts

1.  **Backend is the Source of Truth:** On login, the API provides a set of CASL rules in JSON format.
2.  **`Ability` Instance:** The frontend creates a single CASL `Ability` object from these rules.
3.  **React Context:** The `Ability` object is provided to the entire app via an `AbilityContext`.

### 6.2. Implementation

* **`AbilityContext.tsx`:** Located in `src/lib/casl/`, this file defines the React Context, the provider, and a `useAbility` hook.
* **Subject Type Detection:** To make CASL work with our data, we must configure it to recognize our object types. This is critical.
    ```typescript
    // src/lib/casl/ability.ts
    import { createMongoAbility, MongoAbility, Subject } from '@casl/ability';
    import { Proposal, Task } from '@/types'; // Import your main types

    // Define the shape of CASL's `subject`
    type AppSubjects = 'all' | typeof Proposal | typeof Task; // Add all entities
    export type AppAbility = MongoAbility<[string, AppSubjects]>;

    // Helper function for CASL to identify object types
    function subjectName(subject: Subject): string {
      if (typeof subject === 'string') return subject;
      // Map your objects to a name CASL can use
      if (subject instanceof Proposal) return 'Proposal';
      if (subject instanceof Task) return 'Task';
      throw new Error(`Unknown subject type: ${subject}`);
    }

    export const ability = createMongoAbility([], { subjectName });
    ```
* **`<Can>` Component:** We use the official `@casl/react` package for declarative permission checks.

### 6.3. Usage Patterns

**Correct Usage:**

```tsx
import { useAbility } from '@/lib/casl/useAbility';
import { Can } from '@casl/react';
import { Proposal } from '@/types'; // Use the class/type for checks

// In a component...
const { ability } = useAbility();
const proposal = new Proposal({ id: 1, authorId: 123 }); // Instantiate with a class

// Imperative check in logic
if (ability.can('update', proposal)) { /* ... */ }

// Declarative check in JSX
<Can I="create" a={Proposal}> {/* Pass the class itself */}
  <Button>+ New Proposal</Button>
</Can>

<Can I="edit" on={proposal}> {/* Pass the instance */}
  <Button>Edit</Button>
</Can>
```

---

## 7. Mantine v8 Migration Guide

This project uses **Mantine v8**, which has significant breaking changes from v7. To avoid compilation errors, follow these guidelines:

### 7.1. Component Prop Changes

| v7 Prop | v8 Replacement | Example |
|---------|---------------|---------|
| `spacing` | `gap` | `<Group gap="md">` |
| `position` | `justify` | `<Group justify="space-between">` |
| `noWrap` | `wrap="nowrap"` | `<Group wrap="nowrap">` |
| `weight` | `fw` | `<Text fw={500}>` |
| `align` (Text) | `ta` | `<Text ta="center">` |
| `color` | `c` | `<Text c="dimmed">` |
| `sx` | `styles` or inline `style` | Use `styles` prop for component-specific styles |
| `icon` (TextInput) | `leftSection` | `<TextInput leftSection={<IconUser />}>` |
| `itemComponent` | `renderOption` | `<Select renderOption={CustomItem}>` |
| `precision` (NumberInput) | `decimalScale` | `<NumberInput decimalScale={2}>` |
| `removeTrailingZeros` | `fixedDecimalScale` | `<NumberInput fixedDecimalScale={false}>` |
| `thousandsSeparator` | `thousandSeparator` | `<NumberInput thousandSeparator=",">` |
| `page` (Pagination) | `value` | `<Pagination value={page}>` |
| `nothingFound` | `nothingFoundMessage` | `<Select nothingFoundMessage="No results">` |

### 7.2. Style System Changes

- **No more `sx` prop**: Use the `styles` prop for component-specific styles or inline `style` for simple cases
- **CSS-in-JS removed**: Use Vanilla Extract for all custom styling
- **Theme tokens**: Access design tokens via CSS variables (e.g., `var(--mantine-color-gray-2)`)

### 7.3. Common Patterns

```tsx
// ❌ Old (v7)
<Group spacing="md" position="apart" noWrap>
  <Text weight={500} color="dimmed" align="center">Title</Text>
</Group>

// ✅ New (v8)
<Group gap="md" justify="space-between" wrap="nowrap">
  <Text fw={500} c="dimmed" ta="center">Title</Text>
</Group>

// ❌ Old (v7)
<TextInput 
  icon={<IconUser />}
  sx={{ '& input': { textTransform: 'uppercase' } }}
/>

// ✅ New (v8)
<TextInput 
  leftSection={<IconUser />}
  styles={{ input: { textTransform: 'uppercase' } }}
/>
```

## 8. Naming Conventions

### Folder Names

1. **Use lowercase with hyphens** for all folders:
   ```
   ✅ Good:
   src/
   ├── components/
   ├── features/
   ├── lib/
   └── customer-management/  # Multi-word folders use kebab-case
   
   ❌ Bad:
   ├── Components/
   ├── customerManagement/
   └── customer_management/
   ```

2. **Standard folder names**:
   - `app/` - Application-level setup
   - `components/` - Shared UI components
   - `features/` - Business features
   - `lib/` - Shared libraries and utilities
   - `types/` - Global TypeScript types
   - `styles/` - Global styles
   - `services/` - API services
   - `assets/` - Static assets

### File Names

1. **Components** - Use PascalCase:
   ```
   ✅ CustomerForm.tsx
   ✅ DataTable.tsx
   ✅ StatusBadge.tsx
   ❌ customer-form.tsx
   ❌ dataTable.tsx
   ```

2. **Hooks** - Use camelCase with 'use' prefix:
   ```
   ✅ useAuth.ts
   ✅ useCustomerData.ts
   ✅ useFilteredResults.ts
   ❌ UseAuth.ts
   ❌ use-auth.ts
   ```

3. **Utilities/Helpers** - Use camelCase:
   ```
   ✅ formatters.ts
   ✅ validators.ts
   ✅ dateHelpers.ts
   ❌ Formatters.ts
   ❌ date-helpers.ts
   ```

4. **Types/Interfaces** - Use camelCase for files:
   ```
   ✅ types.ts
   ✅ api.types.ts
   ✅ customer.types.ts
   ❌ Types.ts
   ❌ TYPES.ts
   ```

5. **Constants** - Use camelCase for files:
   ```
   ✅ constants.ts
   ✅ apiEndpoints.ts
   ❌ CONSTANTS.ts
   ❌ api-endpoints.ts
   ```

6. **Store files** - Use camelCase with '.store' suffix:
   ```
   ✅ ui.store.ts
   ✅ notification.store.ts
   ❌ UIStore.ts
   ❌ ui-store.ts
   ```

### Import Organization

Organize imports in this order:
```tsx
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { useForm } from '@mantine/form';
import { IconUser } from '@tabler/icons-react';

// 3. Internal absolute imports
import { DataTable } from '@/components/ui/DataTable';
import { useAuth } from '@/lib/hooks/useAuth';

// 4. Internal relative imports
import { CustomerForm } from '../components/CustomerForm';
import type { Customer } from '../types';

// 5. Style imports
import classes from './styles.module.css';
```

### Type/Interface Naming

1. **Interfaces** - Use PascalCase with descriptive names:
   ```typescript
   interface CustomerFormProps { ... }
   interface UserState { ... }
   interface ApiResponse<T> { ... }
   ```

2. **Type aliases** - Use PascalCase:
   ```typescript
   type CustomerStatus = 'active' | 'inactive';
   type ID = string | number;
   ```

3. **Enums** - Use PascalCase for enum and UPPER_SNAKE_CASE for values:
   ```typescript
   enum CustomerStatus {
     ACTIVE = 'ACTIVE',
     INACTIVE = 'INACTIVE',
     PENDING = 'PENDING'
   }
   ```

### Function Naming

1. **Event handlers** - Use 'handle' prefix:
   ```typescript
   handleSubmit
   handleClick
   handleInputChange
   ```

2. **Boolean returns** - Use 'is', 'has', 'should' prefixes:
   ```typescript
   isValid()
   hasPermission()
   shouldUpdate()
   ```

3. **Data fetchers** - Use descriptive names:
   ```typescript
   getCustomers()
   fetchUserProfile()
   loadMoreData()
   ```

## 9. Coding Standards & Best Practices

### Component Design

1. **Component Types:**
   - **Page Components** (`features/*/pages/`): Route endpoints that orchestrate data fetching and compose other components
   - **Feature Components** (`features/*/components/`): Business-specific UI components used within a single feature
   - **Shared Components** (`components/ui/`): Pure, reusable UI components used across multiple features

2. **File Organization:**
   - **Single File Rule**: Always use single `.tsx` files for components
   - **No Barrel Exports**: Import components directly (e.g., `import { CustomerForm } from '../components/CustomerForm'`)
   - **No Index Files**: Do not create `index.ts` files for re-exporting components
   - **Flat Structure**: Avoid unnecessary nesting - keep components as direct children of their parent folder

3. **Component Patterns:**
   ```tsx
   // ✅ Good: Direct imports
   import { CustomerForm } from './components/CustomerForm';
   import { DataTable } from '@/components/ui/DataTable';
   
   // ❌ Bad: Barrel imports
   import { CustomerForm, CustomerCard } from './components';
   ```

4. **Styling:** Use Mantine's `styles` prop or CSS modules. Vanilla Extract can be used for complex styling needs.

### State Management

1. **Server State (TanStack Query):**
   - **Query Hooks**: Create separate files for each query/mutation in `features/*/api/`
   - **Hook Naming**: `useGet*`, `useCreate*`, `useUpdate*`, `useDelete*`
   - **Query Keys**: Use hierarchical keys: `['customers']`, `['customers', id]`, `['customers', 'list', filters]`
   - **Configuration**:
     ```typescript
     // app/providers/query.tsx
     const queryClient = new QueryClient({
       defaultOptions: {
         queries: {
           staleTime: 5 * 60 * 1000,    // 5 minutes
           gcTime: 10 * 60 * 1000,      // 10 minutes
           retry: (failureCount, error) => {
             if (error.status >= 400 && error.status < 500) return false;
             return failureCount < 3;
           },
         },
         mutations: {
           onError: (error) => {
             notifications.show({
               title: 'Error',
               message: error.message,
               color: 'red',
             });
           },
         },
       },
     });
     ```

2. **Client State (Zustand):**
   - Use for global UI state only (sidebar, theme, modals)
   - Keep stores small and focused
   - Example:
     ```typescript
     // app/store/ui.store.ts
     export const useUIStore = create<UIState>((set) => ({
       sidebarOpen: true,
       toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
     }));
     ```

3. **Local State**: Use React's `useState` for component-specific state

### API Layer

The API layer is centralized in `src/lib/` with three key files:

1. **`src/lib/api.ts`** - Main API service layer
   - Exports the `api` object with all service methods
   - Automatically switches between mock and real services based on environment
   - Provides TypeScript-typed methods for all endpoints

2. **`src/lib/api-client.ts`** - HTTP client wrapper
   - Pre-configured fetch wrapper with:
     - Automatic authentication headers (MSAL integration)
     - Error handling and response parsing
     - Request timeout support
     - File upload capabilities
   - Exports `apiClient` instance for direct use

3. **`src/lib/api-endpoints.ts`** - Endpoint URL definitions
   - Single source of truth for all API endpoints
   - Organized by feature/resource
   - Supports dynamic URLs with parameters

#### Usage Pattern

```typescript
// 1. Import the API service
import { api } from '@/lib/api';

// 2. Use in TanStack Query hooks
export const useGetCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: api.customers.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// 3. Use in mutations
export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: api.customers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
```

#### Adding New API Endpoints

1. **Define the endpoint** in `src/lib/api-endpoints.ts`:
   ```typescript
   invoices: {
     list: '/invoices',
     get: (id: number) => `/invoices/${id}`,
     create: '/invoices',
     update: (id: number) => `/invoices/${id}`,
     delete: (id: number) => `/invoices/${id}`,
   }
   ```

2. **Add service methods** in `src/lib/api.ts`:
   ```typescript
   invoices: {
     getAll: () => apiClient.get<Invoice[]>(API_ENDPOINTS.invoices.list),
     getById: (id: number) => apiClient.get<Invoice>(API_ENDPOINTS.invoices.get(id)),
     create: (data: InvoiceFormData) => apiClient.post<Invoice>(API_ENDPOINTS.invoices.create, data),
     update: (id: number, data: InvoiceFormData) => apiClient.put<Invoice>(API_ENDPOINTS.invoices.update(id), data),
     delete: (id: number) => apiClient.delete(API_ENDPOINTS.invoices.delete(id)),
   }
   ```

3. **Create TanStack Query hooks** in `features/invoices/api/`:
   ```typescript
   // features/invoices/api/useGetInvoices.ts
   import { useQuery } from '@tanstack/react-query';
   import { api } from '@/lib/api';
   
   export const useGetInvoices = () => {
     return useQuery({
       queryKey: ['invoices'],
       queryFn: api.invoices.getAll,
     });
   };
   ```

#### Mock Services

- Mock services are located in `src/services/mock/`
- Automatically used when `VITE_USE_MOCK_API !== 'false'`
- Must implement the same interface as real services
- Useful for development and testing without backend

### Form Handling

1. **Mantine Forms**: Use `@mantine/form` for all forms
2. **Form Pattern**:
   ```tsx
   const form = useForm<FormData>({
     initialValues: { ... },
     validate: { ... },
   });

   const mutation = useCreateResource();

   const handleSubmit = form.onSubmit((values) => {
     mutation.mutate(values, {
       onSuccess: (data) => {
         navigate(`/resource/${data.id}`);
       },
     });
   });
   ```
3. **Reusable Input Components**: Create single-file form components in `components/ui/` that work with Mantine form

### Data Tables

1. **Mantine DataTable**: Use `mantine-datatable` package for all data tables (NOT the custom DataTable component)
2. **Standard Implementation**: All list pages must use `DataTable` from `mantine-datatable`
3. **Pattern**:
   ```tsx
   import { DataTable } from 'mantine-datatable';
   
   <DataTable
     records={data}
     columns={columns}
     totalRecords={totalRecords}
     recordsPerPage={PAGE_SIZE}
     page={page}
     onPageChange={setPage}
     fetching={isLoading}
     highlightOnHover
     striped
     minHeight={400}
     noRecordsText="No records found"
   />
   ```
4. **Column Definition with Financial Flag**:
   ```tsx
   const columns: DataTableColumn<T>[] = [
     {
       accessor: 'amount',
       title: 'Amount',
       hidden: !canViewFinancial, // Hide for consultants
       render: (record) => <MoneyDisplay {...} />
     }
   ];
   ```

### UI/UX Guidelines

* **Modals vs. Drawers:** Use **`Drawer`** for complex forms or detail views that preserve background context (e.g., editing a task from a list). Use **`Modal`** for critical, blocking actions that require the user's full attention (e.g., "Confirm Delete?").

### TypeScript

* Use **`interface`** for defining the shape of API objects and public component `props`.
* Use **`type`** for utility types, unions, or intersections.
* Leverage TypeScript generics to create strongly-typed, reusable components (`DataTable<T>`) and functions.

### Error Handling

1. **Error Boundaries**: Implement at route level to catch rendering errors
2. **API Errors**: Handle globally in TanStack Query configuration
3. **User Feedback**:
   - Use Mantine `notifications` for all user feedback
   - Success: Green notification with checkmark
   - Error: Red notification with error icon
   - Loading: Show inline loading states, not notifications
4. **Pattern**:
   ```tsx
   // In mutations
   onSuccess: () => {
     notifications.show({
       title: 'Success',
       message: 'Customer created successfully',
       color: 'green',
     });
   }
   ```

## 10. Date and Time Handling

### Overview
The application uses **dayjs** for all date/time operations (required by Mantine v8). All date handling follows these standardized patterns to ensure consistency across the codebase.

### Date Utilities
Location: `/src/lib/utils/date.ts`

```typescript
import { formatDate, formatDateTime, toApiDate, toApiDateTime, fromApiDate } from '@/lib/utils/date';

// Display formatting
formatDate(date);        // "20 Jan 2025"
formatDateTime(date);    // "20 Jan 2025, 3:30 PM"

// API communication
toApiDate(date);         // "2025-01-20" (for date-only fields)
toApiDateTime(date);     // "2025-01-20T15:30:00Z" (ISO 8601 UTC)

// Parsing from API
fromApiDate("2025-01-20");     // Date object
fromApiDateTime("2025-01-20T15:30:00Z"); // Date object
```

### Date Components

#### DateField Component
Use for date-only selection:
```typescript
import { DateField } from '@/components/forms/inputs/DateField';

<DateField
  label="Start Date"
  value={startDate}
  onChange={setStartDate}
  placeholder="Select start date"  // Optional, defaults to "Select date"
  minDate={new Date()}
  required
/>
```

#### DateTimeField Component
Use for date and time selection:
```typescript
import { DateTimeField } from '@/components/forms/inputs/DateTimeField';

<DateTimeField
  label="Meeting Time"
  value={meetingTime}
  onChange={setMeetingTime}
  placeholder="Select meeting time"  // Optional
  minDate={new Date()}
/>
```

### Important Patterns

1. **Always use Date objects in components**:
   ```typescript
   // ✅ Correct
   const [startDate, setStartDate] = useState<Date | null>(null);
   
   // ❌ Incorrect
   const [startDate, setStartDate] = useState<string>('');
   ```

2. **Convert strings to Date for display**:
   ```typescript
   // From API response
   const date = fromApiDate(response.start_date);
   ```

3. **Convert Date to string for API**:
   ```typescript
   // For API payload
   const payload = {
     start_date: toApiDate(startDate),
     created_at: toApiDateTime(new Date())
   };
   ```

4. **Form integration with Mantine**:
   ```typescript
   <DateField
     label="Proposal Date"
     value={form.values.proposalDate}
     onChange={(value) => form.setFieldValue('proposalDate', value)}
     error={form.errors.proposalDate}
     required
   />
   ```

5. **Date validation**:
   ```typescript
   import { isValidDateRange, isFutureDate } from '@/lib/utils/date';
   
   // In form validation
   validate: {
     endDate: (value, values) => 
       !isValidDateRange(values.startDate, value) 
         ? 'End date must be after start date' 
         : null
   }
   ```

### Database & API Contract

1. **Database Schema**:
   - Use `TIMESTAMPTZ` for all timestamps (stored as UTC)
   - Use `DATE` for calendar dates without time
   - Never use `TIMESTAMP` without timezone

2. **API Format**:
   - Dates: `YYYY-MM-DD` format (e.g., "2025-01-20")
   - DateTimes: ISO 8601 UTC format (e.g., "2025-01-20T15:30:00Z")
   - Always send/receive in UTC, display in local time

### Common Mistakes to Avoid

1. **Don't use date-fns** - Use dayjs exclusively
2. **Don't use toLocaleDateString()** - Use formatDate()
3. **Don't use toISOString().split('T')[0]** - Use toApiDate()
4. **Don't mix string and Date types** - Always use Date objects in UI
5. **Don't forget timezone considerations** - Store UTC, display local

## 11. TanStack Query Best Practices

### Query Patterns

1. **File Structure**: One hook per file in `features/*/api/`
2. **Query Keys**: Use consistent, hierarchical keys
3. **Optimistic Updates**:
   ```typescript
   useMutation({
     mutationFn: updateCustomer,
     onMutate: async (newData) => {
       await queryClient.cancelQueries(['customers', id]);
       const previous = queryClient.getQueryData(['customers', id]);
       queryClient.setQueryData(['customers', id], newData);
       return { previous };
     },
     onError: (err, newData, context) => {
       queryClient.setQueryData(['customers', id], context.previous);
     },
     onSettled: () => {
       queryClient.invalidateQueries(['customers']);
     },
   });
   ```

### Loading States

1. **Skeleton Loaders**: Use for initial page loads
2. **Loading Overlays**: Use for form submissions
3. **Inline Spinners**: Use for small updates

## 12. Routing Best Practices

1. **Single Router**: All routes defined in `app/router.tsx`
2. **Route Structure**:
   ```tsx
   const router = createBrowserRouter([
     {
       path: '/',
       element: <AppShell />,
       children: [
         { path: 'customers', element: <CustomerListPage /> },
         { path: 'customers/:id', element: <CustomerDetailPage /> },
         { path: 'customers/:id/edit', element: <CustomerEditPage /> },
         { path: 'customers/new', element: <CustomerEditPage /> },
       ],
     },
   ]);
   ```
3. **Lazy Loading**: Use React.lazy for feature pages

## 13. Storybook Best Practices

### Setup
Storybook is configured for testing UI components with minimal boilerplate:
- **Location**: Stories are colocated with components (`.stories.tsx` files)
- **Commands**: 
  - `npm run storybook` - Start development server
  - `npm run build-storybook` - Build static Storybook

### Writing Stories
1. **Use CSF3 format** for less boilerplate:
   ```tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { MyComponent } from './MyComponent';

   const meta: Meta<typeof MyComponent> = {
     title: 'UI/MyComponent',
     component: MyComponent,
     parameters: {
       layout: 'centered',
     },
     tags: ['autodocs'],
   };

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Default: Story = {
     args: {
       prop1: 'value',
     },
   };
   ```

2. **Focus on UI components** in `src/components/ui/`
3. **Create variant stories** to showcase different states
4. **Use render function** for complex compositions
5. **Keep stories simple** - they're for visual testing

### What to Test
- **Shared UI components** - Priority for components in `components/ui/`
- **Component states** - Default, loading, error, empty
- **Prop variations** - Different sizes, colors, variants
- **Edge cases** - Long text, missing data, extreme values

## 14. List Page Pattern

### Reusable Components
The project includes a set of reusable components for building consistent list pages:

1. **ListPageLayout** - Provides standard page structure with header, actions, filters, and content areas
2. **FilterDrawer & FilterTrigger** - Advanced filtering UI with drawer and trigger button
3. **ListTable** - Wrapper around mantine-datatable with loading, error, and empty states
4. **DetailDrawer** - Right-side drawer for viewing record details
5. **ExportMenu** - Dropdown menu for CSV/Excel export functionality
6. **SearchInput** - Debounced search input with clear button
7. **useListPageState** - Hook that manages all list page state (search, filters, pagination, selection)

### Implementation Pattern
```tsx
// Example: Customer List Page
import { 
  ListPageLayout, ListTable, SearchInput, FilterDrawer, 
  FilterTrigger, DetailDrawer, ExportMenu 
} from '@/components/ui';
import { useListPageState } from '@/lib/hooks';

export function CustomerListPage() {
  const { data, isLoading, error } = useGetCustomers();
  const listState = useListPageState({
    data: customers,
    searchFields: ['name', 'email', 'phone']
  });

  return (
    <ListPageLayout
      title="Customers"
      actions={<>
        <ExportMenu onExport={handleExport} />
        <Button>New Customer</Button>
      </>}
      filters={<Card>
        <Group>
          <SearchInput {...} />
          <FilterTrigger {...} />
        </Group>
      </Card>}
    >
      <ListTable
        data={listState.paginatedData}
        columns={columns}
        {...listState}
      />
      <FilterDrawer {...} />
      <DetailDrawer {...} />
    </ListPageLayout>
  );
}
```

### Benefits
- **Consistency**: All list pages look and behave the same
- **Reusability**: Components work across all features
- **Type Safety**: Full TypeScript support with generics
- **Performance**: Built-in debouncing and memoization
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 15. Simple RBAC Pattern

### Overview
The project includes a simple role-based access control pattern for UI/UX improvements. This is NOT for security (backend handles that), but for better user experience.

### Components
1. **useUserRole** - Hook that returns user role and permissions
2. **ShowForRoles** - Component that shows/hides content based on roles
3. **FinancialData** - Component that shows financial data with fallback for non-authorized users

### Usage
```tsx
// Hook usage
const { role, isAdmin, isManager, isConsultant, canViewFinancial } = useUserRole();

// Component usage
<ShowForRoles roles={['admin', 'manager']}>
  <Button color="red">Delete All</Button>
</ShowForRoles>

<FinancialData fallback="—">
  <MoneyDisplay amount={revenue} />
</FinancialData>

// Table column visibility
const columns = [
  {
    accessor: 'revenue',
    hidden: !canViewFinancial,
    render: (record) => <MoneyDisplay amount={record.revenue} />
  }
];
```

### User Roles
- **Admin**: Full access to all features and data
- **Manager**: Can view financial data, limited admin features
- **Consultant**: Cannot view financial data, read-only access

# important-instruction-reminders
- Follow the feature-sliced design pattern strictly
- NO barrel exports (index.ts) for components in features
- Import components directly from their files
- Keep features self-contained with their own pages, components, and API
- Only put truly shared components in src/components/ui/
- Use single-file components, no unnecessary folders
- Pages go in features/*/pages/, not a global pages directory
- Use lowercase for all folder names (kebab-case for multi-word)
- Use PascalCase for component files, camelCase for hooks and utilities
- Move hooks to lib/hooks/, not in components folders
- Keep flat folder structure, avoid unnecessary nesting
- Use dayjs for all date operations (NOT date-fns)
- Always use DateField/DateTimeField components for date inputs
- Store dates as UTC in database, display in local time
