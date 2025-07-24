# VSTN CRM Dashboard

A modern, enterprise-grade CRM Dashboard UI for VSTN Consultancy Pvt. Ltd., specializing in Operational Transfer Pricing (OTP). Built with React 19, TypeScript, and Vite for optimal performance.

> **Last Updated**: 2025-07-20 - Standardized date handling with dayjs and reusable date components

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## 📁 Quick Reference

- **Components**: `src/components/` - Shared UI components (organized by category)
- **Features**: `src/features/` - Business feature modules
- **Pages**: `src/features/*/pages/` - Route page components
- **API Service**: `src/lib/api.ts` - Main API service layer
- **API Hooks**: `src/features/*/api/` - TanStack Query hooks
- **Types**: `src/types/` - Global TypeScript types
- **Utils**: `src/lib/utils/` - Utility functions
- **Date Utils**: `src/lib/utils/date.ts` - Date formatting and parsing functions
- **Date Components**: `src/components/forms/inputs/DateField.tsx` - Standardized date inputs

## Features

- 🏢 **Customer Management**: Direct, partner-referred, and partner-managed customers
- 🤝 **Partner Management**: Track partners and commission management
- 📄 **Proposal Workflow**: Multi-phase proposals with service items
- 📊 **Engagement Tracking**: From proposal to engagement letter to execution
- 🔐 **RBAC Authorization**: Fine-grained permissions with CASL.js
- 🇮🇳 **Indian Business Focus**: PAN, GSTIN, TAN validation and formatting
- 🔗 **Microsoft Integration**: Azure AD auth, SharePoint docs, Office 365 email
- 📱 **Responsive Design**: Optimized for desktop and laptop screens

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

This project follows a **feature-sliced design** pattern with strict naming conventions:

```
src/
├── app/                    # Application-level setup
│   ├── layouts/           # App layout components
│   ├── providers/         # React context providers
│   │   └── dates.tsx      # DatesProvider configuration
│   ├── store/             # Zustand global state stores
│   └── router.tsx         # Route definitions
├── components/            # Shared UI components (organized by category)
│   ├── auth/             # Authorization components
│   ├── display/          # Display components (badges, money display, etc.)
│   ├── forms/            # Form components (inputs, pickers)
│   ├── layout/           # Layout components (Sidebar, etc.)
│   ├── list-page/        # List page composition components
│   ├── tables/           # Table-related components
│   └── theme/            # Theme components
├── features/             # Business feature modules
│   ├── customers/        # Customer management feature
│   │   ├── api/         # TanStack Query hooks
│   │   ├── components/  # Feature-specific components
│   │   ├── pages/       # Page components
│   │   └── types.ts     # Feature types
│   └── partners/         # Partner management feature
├── lib/                  # Shared libraries and utilities
│   ├── api.ts           # Main API service layer
│   ├── api-client.ts    # API client (fetch wrapper)
│   ├── api-endpoints.ts # API endpoint definitions
│   ├── auth/            # Authentication utilities
│   ├── casl/            # Authorization (CASL.js)
│   ├── hooks/           # Shared custom hooks
│   └── utils/           # Utility functions
├── services/            # Mock services (development only)
├── styles/              # Global styles and theme
├── types/               # Global TypeScript types
├── App.tsx              # Application root
└── main.tsx             # Application entry point
```

## Naming Conventions

### Folder Names
- Use **lowercase** with **kebab-case** for multi-word folders
- Examples: `customer-management`, `auth-flow`, `ui-components`

### File Names
- **Components**: PascalCase (e.g., `CustomerForm.tsx`, `DataTable.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`, `useCustomerData.ts`)
- **Utilities**: camelCase (e.g., `formatters.ts`, `validators.ts`)
- **Types**: camelCase for files (e.g., `types.ts`, `api.types.ts`)
- **Stores**: camelCase with '.store' suffix (e.g., `ui.store.ts`)

### Import Organization
```tsx
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { useForm } from '@mantine/form';
import { IconUser } from '@tabler/icons-react';

// 3. Internal absolute imports
import { DataTable } from '@/components/tables/DataTable';
import { useAuth } from '@/lib/hooks/useAuth';

// 4. Internal relative imports
import { CustomerForm } from './components/CustomerForm';
import type { Customer } from './types';

// 5. Style imports
import classes from './styles.module.css';
```

## Available Routes

- `/dashboard` - Main dashboard
- `/customers` - Customer management
- `/partners` - Partner management
- `/proposals` - Proposal tracking
- `/engagement-letters` - Engagement letter management
- `/engagements` - Active engagements
- `/documents` - Document management
- `/tasks` - Task management
- `/employees` - Employee directory
- `/my-profile` - User profile
- `/leaves` - Leave calendar
- `/org-chart` - Organization structure
- `/reports` - Analytics and reports
- `/service-items` - Service item catalog
- `/settings` - Application settings

## Key Development Principles

### 1. Feature-Sliced Design
- Each feature is self-contained with its own pages, components, API hooks, and types
- Features should not import from other features
- Shared code goes in `lib/` or `components/`

### 2. No Barrel Exports
- Import components directly from their files
- Do not create `index.ts` files for re-exporting
- This improves tree-shaking and build performance

### 3. Component Organization
- **Page Components**: Route endpoints in `features/*/pages/`
- **Feature Components**: Business logic in `features/*/components/`
- **Shared Components**: Reusable UI in `components/` (organized by category)

### 4. State Management
- **Server State**: TanStack Query for all API data
- **Client State**: Zustand for global UI state
- **Local State**: React useState for component state
- **List Page State**: useListPageState hook for managing complex list pages

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 5.4+
- **UI Library**: Mantine v8
- **Date Library**: dayjs (required by Mantine)
- **Routing**: React Router v7
- **Server State**: TanStack Query v5
- **Client State**: Zustand
- **Authentication**: MSAL React (Azure AD)
- **Authorization**: CASL.js
- **Form Handling**: @mantine/form
- **Data Tables**: mantine-datatable
- **Icons**: Tabler Icons

## API Architecture

The application uses a centralized API service layer located in `src/lib/`:

### API Files
- `api.ts` - Main API service with all endpoint methods
- `api-client.ts` - Fetch wrapper with authentication and error handling
- `api-endpoints.ts` - All API endpoint URL definitions

### Usage Example
```tsx
// In a TanStack Query hook
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useGetCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: api.customers.getAll,
  });
};
```

### Adding New API Endpoints
1. Add endpoint URL in `src/lib/api-endpoints.ts`
2. Add service method in `src/lib/api.ts`
3. Create TanStack Query hook in `features/*/api/`

## Date and Time Handling

The application uses **dayjs** for all date operations (required by Mantine v8). All date handling follows standardized patterns.

### DatesProvider Configuration

The application uses Mantine's `DatesProvider` to configure global date settings. This is configured in `src/app/providers/dates.tsx` and included in the main App component:

```typescript
// Configuration includes:
- Locale: English
- First day of week: Monday
- Weekend days: Sunday and Saturday
- Consistent weeks: Always show 6 weeks in calendar
```

### Date Utilities

Located in `src/lib/utils/date.ts`:

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

Use the standardized date components for consistent UI:

```tsx
import { DateField } from '@/components/forms/inputs/DateField';
import { DateTimeField } from '@/components/forms/inputs/DateTimeField';

// Date-only selection
<DateField
  label="Start Date"
  value={startDate}
  onChange={setStartDate}
  placeholder="Select start date"  // Optional
  minDate={new Date()}
  required
/>

// Date and time selection
<DateTimeField
  label="Meeting Time"
  value={meetingTime}
  onChange={setMeetingTime}
/>
```

### Important Rules

1. **Always use dayjs** - Do NOT use date-fns or moment.js
2. **Use Date objects in UI** - Components work with Date objects, not strings
3. **Convert for API** - Use `toApiDate()` or `toApiDateTime()` when sending to backend
4. **Consistent formatting** - Always use the utility functions for display
5. **DatesProvider is required** - All Mantine date components must be wrapped in DatesProvider

### Customizing Date Settings

To change global date settings, modify `src/app/providers/dates.tsx`:

```typescript
<DatesProvider
  settings={{
    locale: 'en',           // Change locale here
    firstDayOfWeek: 1,      // 0 = Sunday, 1 = Monday
    weekendDays: [0, 6],    // Array of weekend day numbers
    consistentWeeks: true,  // Always show 6 weeks in calendar
  }}
>
```

## Authentication

The application uses Microsoft Authentication Library (MSAL) for Azure AD authentication. Configuration is located in `src/lib/auth/`.

## Code Quality

### Linting & Formatting
```bash
npm run lint        # Run ESLint and Prettier
npm run lint:fix    # Auto-fix linting issues
```

### Type Checking
```bash
npm run typecheck   # Run TypeScript compiler
```

### Testing
```bash
npm run test        # Run tests with Vitest
npm run test:ui     # Run tests with UI
```

## Best Practices

1. **Always run build before committing**: Ensure no TypeScript errors
2. **Follow naming conventions**: Consistent file and folder names
3. **Direct imports only**: No barrel exports in features
4. **Type everything**: Avoid `any` types
5. **Co-locate related code**: Keep feature code together
6. **Reuse shared components**: Don't duplicate UI components
7. **Use standardized date handling**: Always use DateField/DateTimeField components and date utilities
8. **Date formatting consistency**: Never use `toLocaleDateString()` or `toISOString().split('T')[0]`

## Theming

Custom theme configuration is available in `src/styles/` using Mantine's theming system.

## Contributing

1. Follow the established patterns in this codebase
2. Ensure all tests pass
3. Run `npm run lint` and fix any issues
4. Test your changes thoroughly
5. Update documentation if needed

For detailed coding standards and architectural decisions, see [CLAUDE.md](./CLAUDE.md).

## Reusable Components

### List Page Components

The project includes standardized components for building consistent list pages:

- **ListPageLayout** - Standard page structure with header, actions, and content areas
- **ListTable** - Enhanced DataTable with loading, error, and empty states
- **FilterDrawer** - Slide-out drawer for advanced filtering
- **DetailDrawer** - Slide-out drawer for viewing record details
- **SearchInput** - Debounced search with clear functionality
- **ExportMenu** - Dropdown menu for CSV/Excel export
- **useListPageState** - Hook that manages all list page state

See [LIST_PAGE_PATTERNS.md](./LIST_PAGE_PATTERNS.md) for detailed implementation guide.

### Simple RBAC Components

For role-based UI/UX improvements (not security):

- **useUserRole** - Hook for accessing user role and permissions
- **ShowForRoles** - Conditionally show content based on roles
- **FinancialData** - Show/hide financial data with fallback

## Common Development Tasks

### Adding a New Feature

1. Create feature folder: `src/features/your-feature/`
2. Add subdirectories: `api/`, `components/`, `pages/`, `types.ts`
3. Create page components in `pages/`
4. Add route in `src/app/router.tsx`
5. Create API hooks in `api/` folder

### Creating a List Page

1. Import reusable components from their specific paths in `@/components/`
2. Use `useListPageState` hook with your data
3. Configure columns with role-based visibility
4. Add filters in FilterDrawer
5. Implement export functionality

Example:
```tsx
import { ListPageLayout, FilterDrawer } from '@/components/list-page';
import { ListTable } from '@/components/tables/ListTable';
import { SearchInput } from '@/components/forms/inputs/SearchInput';
import { useListPageState } from '@/lib/hooks';

export function YourListPage() {
  const { data, isLoading, error } = useGetYourData();
  const listState = useListPageState({
    data,
    searchFields: ['name', 'email']
  });

  return (
    <ListPageLayout title="Your Items" {...}>
      <ListTable data={listState.paginatedData} {...} />
    </ListPageLayout>
  );
}
```

### Adding a Shared Component

1. Create component in appropriate category folder under `src/components/`
2. Use PascalCase naming: `YourComponent.tsx`
3. Import directly: `import { YourComponent } from '@/components/category/YourComponent'`
4. No barrel exports - import components directly from their files

### Adding a Custom Hook

1. Create hook in `src/lib/hooks/`
2. Use camelCase with 'use' prefix: `useYourHook.ts`
3. Export from `src/lib/hooks/index.ts`

### Working with API

1. Create query/mutation hooks in `features/*/api/`
2. Use naming convention: `useGetResource`, `useCreateResource`, etc.
3. Configure in the hook file, not in components
4. Handle errors in mutations with notifications

### Working with Dates

Example of proper date handling in a form:

```tsx
import { DateField } from '@/components/forms/inputs/DateField';
import { toApiDate, fromApiDate } from '@/lib/utils/date';

// In your component
const [startDate, setStartDate] = useState<Date | null>(null);

// When receiving from API
useEffect(() => {
  if (data?.start_date) {
    setStartDate(fromApiDate(data.start_date));
  }
}, [data]);

// In your form
<DateField
  label="Start Date"
  value={startDate}
  onChange={setStartDate}
  minDate={new Date()}
  required
/>

// When sending to API
const payload = {
  start_date: toApiDate(startDate),
  // ... other fields
};
```