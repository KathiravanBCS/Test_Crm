# List Page Patterns Guide

This guide explains how to implement consistent list pages using the reusable components provided in this project.

## Overview

The list page pattern provides a standardized way to build data-heavy list pages with:
- Consistent layout and styling
- Search and filtering capabilities
- Pagination
- Detail views in drawers
- Export functionality
- Role-based column visibility

## Core Components

### 1. ListPageLayout

Provides the standard page structure with header, actions, filters, and content areas.

```tsx
interface ListPageLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;    // Buttons like "New", "Export"
  filters?: ReactNode;    // Search bar and filter trigger
  children: ReactNode;    // The table and drawers
}
```

### 2. ListTable

A wrapper around `mantine-datatable` that handles loading, error, and empty states. This component now includes:
- **Column Sorting**: Click on column headers to sort data
- **Column Resizing**: Drag column edges to resize
- **Column Visibility**: Toggle columns on/off via the column selector
- **Pagination Controls**: Select rows per page

```tsx
interface ListTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  error?: Error | null;
  onRowClick?: (record: T) => void;
  emptyState?: {
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void; };
  };
  // Pagination props
  page: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}
```

### 3. AdvancedFilters

Advanced filtering UI with a collapsible section (as per business requirements FR-L-04). Filters are revealed via a button click, keeping the primary UI clean.

```tsx
interface AdvancedFiltersProps {
  opened: boolean;
  onToggle: () => void;
  onReset: () => void;
  filterCount: number;
  children: ReactNode;  // Your filter fields
}
```

### 3.1 FilterDrawer (Alternative)

For complex filtering needs, a slide-out drawer is also available:

```tsx
interface FilterDrawerProps {
  opened: boolean;
  onClose: () => void;
  onReset: () => void;
  filterCount: number;
  children: ReactNode;
}
```

### 4. DetailDrawer

For viewing record details in a drawer.

```tsx
interface DetailDrawerProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  loading?: boolean;
  error?: Error | null;
  onFullPageClick?: () => void;  // Navigate to full detail page
  children: ReactNode;
}
```

### 5. SearchInput

Debounced search input with clear functionality.

```tsx
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number;  // Default: 300ms
}
```

### 6. ExportMenu

Dropdown menu for CSV/Excel export.

```tsx
interface ExportMenuProps {
  onExport: (format: 'csv' | 'excel') => Promise<void> | void;
  disabled?: boolean;
}
```

### 7. useListPageState Hook

Manages all the state for a list page.

```tsx
interface UseListPageStateProps<T> {
  data: T[];
  pageSize?: number;
  searchFields?: (keyof T)[];
  searchDebounce?: number;
}

// Returns
{
  // Search
  search: string;
  setSearch: (value: string) => void;
  
  // Filters
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  filterDrawerOpened: boolean;
  setFilterDrawerOpened: (opened: boolean) => void;
  activeFilterCount: number;
  
  // Pagination
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalRecords: number;
  
  // Data
  filteredData: T[];
  paginatedData: T[];
  
  // Detail view
  selectedItem: T | null;
  setSelectedItem: (item: T | null) => void;
  detailDrawerOpened: boolean;
  setDetailDrawerOpened: (opened: boolean) => void;
  handleRowClick: (item: T) => void;
  
  // Utilities
  resetFilters: () => void;
}
```

## Implementation Example

Here's a complete example of implementing a customer list page:

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Group, Select } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { ListPageLayout, DetailDrawer, ExportMenu, AdvancedFilters } from '@/components/list-page';
import { ListTable } from '@/components/tables/ListTable';
import { SearchInput } from '@/components/forms/inputs/SearchInput';
import { useListPageState } from '@/lib/hooks/useListPageState';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useGetCustomers } from '../api/useGetCustomers';
import { CustomerDetailContent } from './CustomerDetailContent';
import type { Customer } from '../types';

export function CustomerListPage() {
  const navigate = useNavigate();
  const { canViewFinancial } = useUserRole();
  const { data: customers = [], isLoading, error } = useGetCustomers();

  // Initialize list page state
  const {
    search,
    setSearch,
    filters,
    setFilters,
    filterDrawerOpened,
    setFilterDrawerOpened,
    activeFilterCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalRecords,
    paginatedData,
    selectedItem,
    detailDrawerOpened,
    setDetailDrawerOpened,
    handleRowClick,
    resetFilters,
    filteredData
  } = useListPageState({
    data: customers,
    searchFields: ['name', 'email', 'phone']
  });

  // Define columns with role-based visibility
  const columns: DataTableColumn<Customer>[] = [
    {
      accessor: 'name',
      title: 'Customer Name',
      render: (customer) => (
        <Text fw={500}>{customer.name}</Text>
      ),
    },
    {
      accessor: 'type',
      title: 'Type',
      render: (customer) => (
        <Badge>{customer.type}</Badge>
      ),
    },
    {
      accessor: 'revenue',
      title: 'Revenue',
      hidden: !canViewFinancial,  // Hide for consultants
      render: (customer) => (
        <MoneyDisplay amount={customer.revenue} />
      ),
    },
    {
      accessor: 'status',
      title: 'Status',
      render: (customer) => (
        <StatusBadge status={customer.status} />
      ),
    },
  ];

  // Export handler
  const handleExport = async (format: 'csv' | 'excel') => {
    const exportData = filteredData.map(customer => ({
      Name: customer.name,
      Type: customer.type,
      Email: customer.email || '',
      Phone: customer.phone || '',
      Status: customer.status,
      ...(canViewFinancial ? {
        Revenue: customer.revenue || 0,
      } : {})
    }));

    if (format === 'csv') {
      await exportToCSV(exportData, 'customers');
    } else {
      await exportToExcel(exportData, 'customers');
    }
  };

  return (
    <>
      {/* Main Layout */}
      <ListPageLayout
        title="Customers"
        description="Manage your customer relationships"
        actions={
          <>
            <ExportMenu onExport={handleExport} />
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={() => navigate('/customers/new')}
            >
              New Customer
            </Button>
          </>
        }
        filters={
          <>
            <Card mb="md">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by name, email, or phone..."
              />
            </Card>
            
            <AdvancedFilters
              opened={filterDrawerOpened}
              onToggle={() => setFilterDrawerOpened(!filterDrawerOpened)}
              onReset={resetFilters}
              filterCount={activeFilterCount}
            >
              <Group grow>
                <Select 
                  label="Customer Type"
                  placeholder="All types"
                  data={[
                    { value: 'direct', label: 'Direct' },
                    { value: 'partner_referred', label: 'Partner Referred' },
                    { value: 'partner_managed', label: 'Partner Managed' }
                  ]}
                  value={filters.type || ''}
                  onChange={(value) => setFilters({ ...filters, type: value || undefined })}
                  clearable
                />
                <Select
                  label="Status"
                  placeholder="All statuses"
                  data={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]}
                  value={filters.status || ''}
                  onChange={(value) => setFilters({ ...filters, status: value || undefined })}
                  clearable
                />
              </Group>
            </AdvancedFilters>
          </>
        }
      >
        {/* Data Table */}
        <ListTable
          data={paginatedData}
          columns={columns}
          loading={isLoading}
          error={error}
          onRowClick={handleRowClick}
          page={page}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          emptyState={{
            title: 'No customers found',
            description: activeFilterCount > 0 
              ? 'Try adjusting your filters'
              : 'Create your first customer to get started',
            action: !activeFilterCount ? {
              label: 'New Customer',
              onClick: () => navigate('/customers/new')
            } : undefined
          }}
        />
      </ListPageLayout>

      {/* Detail Drawer */}
      <DetailDrawer
        opened={detailDrawerOpened}
        onClose={() => setDetailDrawerOpened(false)}
        title={selectedItem?.name}
        onFullPageClick={() => navigate(`/customers/${selectedItem?.id}`)}
      >
        {selectedItem && (
          <CustomerDetailContent customerId={selectedItem.id} />
        )}
      </DetailDrawer>
    </>
  );
}
```

## Best Practices

### 1. Column Configuration

Always define columns with proper TypeScript types and role-based visibility:

```tsx
const columns: DataTableColumn<YourType>[] = [
  {
    accessor: 'sensitiveField',
    title: 'Sensitive Data',
    hidden: !canViewSensitive,  // Role-based visibility
    render: (record) => <YourComponent data={record.sensitiveField} />
  }
];
```

### 2. Search Configuration

Configure searchable fields when initializing the hook:

```tsx
const listState = useListPageState({
  data: yourData,
  searchFields: ['name', 'email', 'description']  // Fields to search
});
```

### 3. Filter Management

Keep filters in the drawer for complex filtering:

```tsx
<FilterDrawer>
  <Select label="Type" {...} />
  <Select label="Status" {...} />
  <DateRangePicker label="Date Range" {...} />
</FilterDrawer>
```

### 4. Empty States

Provide helpful empty states with actions:

```tsx
emptyState={{
  title: 'No records found',
  description: activeFilterCount > 0 
    ? 'Try adjusting your filters'
    : 'Get started by creating your first record',
  action: !activeFilterCount ? {
    label: 'Create New',
    onClick: () => navigate('/create')
  } : undefined
}}
```

### 5. Export Implementation

Include role-based data in exports:

```tsx
const handleExport = async (format: 'csv' | 'excel') => {
  const exportData = filteredData.map(item => ({
    // Always include basic fields
    Name: item.name,
    Status: item.status,
    // Conditionally include sensitive data
    ...(canViewFinancial ? {
      Revenue: item.revenue,
      Profit: item.profit
    } : {})
  }));
  
  // Export logic
};
```

## Common Patterns

### Server-Side Pagination

If using server-side pagination, modify the pattern:

```tsx
// Use server query with pagination params
const { data, isLoading } = useGetCustomers({
  page,
  pageSize,
  search: debouncedSearch,
  filters
});

// Don't use filteredData/paginatedData from hook
// Use data directly from server
<ListTable
  data={data.items}
  totalRecords={data.totalCount}
  // ... other props
/>
```

### Inline Actions

Add row actions using a column:

```tsx
{
  accessor: 'actions',
  title: '',
  width: 50,
  render: (record) => (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="subtle">
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => handleEdit(record)}>
          Edit
        </Menu.Item>
        <Menu.Item onClick={() => handleDelete(record)}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ),
}
```

### Bulk Selection

For bulk operations, extend the pattern:

```tsx
const [selectedRecords, setSelectedRecords] = useState<T[]>([]);

<ListTable
  selectedRecords={selectedRecords}
  onSelectedRecordsChange={setSelectedRecords}
  // ... other props
/>

// Show bulk actions when records selected
{selectedRecords.length > 0 && (
  <Group>
    <Button onClick={handleBulkDelete}>
      Delete {selectedRecords.length} items
    </Button>
  </Group>
)}
```

## Migration Guide

To convert an existing list page to use these patterns:

1. **Import Components**:
   ```tsx
   import { ListPageLayout, FilterDrawer, DetailDrawer, ExportMenu } from '@/components/list-page';
   import { ListTable } from '@/components/tables/ListTable';
   import { SearchInput } from '@/components/forms/inputs/SearchInput';
   import { FilterTrigger } from '@/components/list-page/FilterDrawer';
   import { useListPageState } from '@/lib/hooks';
   ```

2. **Replace State Management**:
   ```tsx
   // Before
   const [search, setSearch] = useState('');
   const [filters, setFilters] = useState({});
   const [page, setPage] = useState(1);
   // ... many more state variables
   
   // After
   const listState = useListPageState({
     data: yourData,
     searchFields: ['name', 'email']
   });
   ```

3. **Update Layout**:
   ```tsx
   // Wrap everything in ListPageLayout
   <ListPageLayout
     title="Your Title"
     actions={/* Your action buttons */}
     filters={/* Search and filter trigger */}
   >
     {/* Table and drawers */}
   </ListPageLayout>
   ```

4. **Replace Table**:
   ```tsx
   // Replace DataTable with ListTable
   <ListTable
     data={listState.paginatedData}
     columns={columns}
     {...listState}
   />
   ```

5. **Add Drawers**:
   ```tsx
   // Add FilterDrawer and DetailDrawer
   <FilterDrawer {...listState}>
     {/* Your filter fields */}
   </FilterDrawer>
   
   <DetailDrawer {...listState}>
     {/* Your detail view */}
   </DetailDrawer>
   ```

## Troubleshooting

### Search Not Working

Ensure you've configured searchFields:
```tsx
useListPageState({
  data: yourData,
  searchFields: ['name', 'email']  // Must match your data structure
});
```

### Filters Not Applying

Check that filter keys match your data:
```tsx
// If your data has { customerType: 'direct' }
// Your filter should use the same key:
setFilters({ ...filters, customerType: value });
```

### Pagination Issues

Ensure you're using paginatedData from the hook:
```tsx
// ✅ Correct
<ListTable data={listState.paginatedData} />

// ❌ Wrong
<ListTable data={listState.filteredData} />
```

### Role-Based Visibility

Always check permissions before showing sensitive data:
```tsx
const { canViewFinancial } = useUserRole();

// In columns
hidden: !canViewFinancial

// In export
...(canViewFinancial ? { Revenue: item.revenue } : {})
```