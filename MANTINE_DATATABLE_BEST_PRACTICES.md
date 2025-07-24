# Mantine DataTable Best Practices

## Overview

This document outlines best practices for using `mantine-datatable` in the VSTN CRM project. The library provides powerful built-in features that should be leveraged instead of reimplementing them.

## Key Principles

### 1. Let Mantine DataTable Handle Data Operations

**DON'T** pre-sort, pre-filter, or pre-paginate your data:
```tsx
// ❌ Bad - Custom sorting and pagination
const sortedData = useMemo(() => {
  return [...data].sort((a, b) => /* custom logic */);
}, [data, sortStatus]);

const paginatedData = useMemo(() => {
  return sortedData.slice((page - 1) * pageSize, page * pageSize);
}, [sortedData, page, pageSize]);

<DataTable records={paginatedData} />
```

**DO** pass the full filtered dataset and let mantine-datatable handle it:
```tsx
// ✅ Good - Let mantine handle sorting and pagination
<DataTable 
  records={filteredData}
  sortStatus={sortStatus}
  onSortStatusChange={setSortStatus}
  page={page}
  onPageChange={setPage}
  totalRecords={filteredData.length}
/>
```

### 2. Column Configuration for Sorting

**DON'T** disable sorting on columns that should be sortable:
```tsx
// ❌ Bad - Disabling sorting unnecessarily
{
  accessor: 'status',
  title: 'Status',
  sortable: false, // Why disable if the data can be sorted?
}
```

**DO** use proper accessors for nested properties:
```tsx
// ✅ Good - Use dot notation for nested properties
{
  accessor: 'status.statusName', // Mantine can sort by nested props
  title: 'Status',
  sortable: true,
  render: (record) => <StatusBadge status={record.status} />
}
```

### 3. State Management

**DON'T** maintain separate state for sorted/paginated data:
```tsx
// ❌ Bad - Redundant state management
const [sortedData, setSortedData] = useState([]);
const [paginatedData, setPaginatedData] = useState([]);
```

**DO** only maintain filter state and let mantine handle the rest:
```tsx
// ✅ Good - Minimal state
const [filters, setFilters] = useState({});
const [sortStatus, setSortStatus] = useState({ columnAccessor: 'id', direction: 'asc' });

const filteredData = useMemo(() => {
  // Only apply filters, no sorting
  return data.filter(/* filter logic */);
}, [data, filters]);
```

### 4. Performance Optimization

**DON'T** filter columns in render:
```tsx
// ❌ Bad - Filtering in render
<DataTable 
  columns={allColumns.filter(col => visibleColumns.includes(col.accessor))}
/>
```

**DO** use mantine's built-in column toggling:
```tsx
// ✅ Good - Use storeColumnsKey for persistence
<DataTable 
  columns={columns}
  storeColumnsKey="customers-table" // Mantine handles column visibility
/>
```

## Common Patterns

### 1. Basic Table with Sorting and Pagination
```tsx
<DataTable
  records={data}
  columns={columns}
  // Sorting
  sortStatus={sortStatus}
  onSortStatusChange={setSortStatus}
  // Pagination
  page={page}
  onPageChange={setPage}
  recordsPerPage={pageSize}
  onRecordsPerPageChange={setPageSize}
  totalRecords={data.length}
  // Features
  highlightOnHover
  striped
  withColumnBorders
/>
```

### 2. Table with Row Selection
```tsx
<DataTable
  records={data}
  columns={columns}
  selectedRecords={selectedRecords}
  onSelectedRecordsChange={setSelectedRecords}
  // Enable checkbox column
  withBorder
  withColumnBorders
/>
```

### 3. Table with Custom Row Actions
```tsx
const columns = [
  // ... data columns
  {
    accessor: 'actions',
    title: '',
    width: 50,
    render: (record) => (
      <ActionIcon onClick={() => handleAction(record)}>
        <IconDots />
      </ActionIcon>
    )
  }
];
```

### 4. Proper Column Definition for Different Data Types
```tsx
const columns: DataTableColumn<Customer>[] = [
  // Text column
  {
    accessor: 'name',
    title: 'Name',
    sortable: true,
  },
  
  // Nested property
  {
    accessor: 'address.city',
    title: 'City',
    sortable: true,
  },
  
  // Number with custom render
  {
    accessor: 'revenue',
    title: 'Revenue',
    sortable: true,
    render: (record) => formatCurrency(record.revenue),
  },
  
  // Date column
  {
    accessor: 'createdAt',
    title: 'Created',
    sortable: true,
    render: (record) => format(new Date(record.createdAt), 'PP'),
  },
  
  // Enum/Status column
  {
    accessor: 'status',
    title: 'Status',
    sortable: true,
    render: (record) => <Badge>{record.status}</Badge>,
  }
];
```

## Migration Guide

### From Custom Implementation to Mantine Native

1. **Remove custom sorting logic** from `useListPageState`
2. **Pass full filtered dataset** to DataTable instead of paginated slice
3. **Update column definitions** to use proper accessors for nested properties
4. **Remove column filtering** - use mantine's column toggling
5. **Test all sorting columns** to ensure they work correctly

### Example Migration

Before:
```tsx
// In useListPageState
const sortedData = useMemo(() => /* custom sort */, []);
const paginatedData = useMemo(() => /* slice data */, []);

// In component
<ListTable data={paginatedData} />
```

After:
```tsx
// In useListPageState
const filteredData = useMemo(() => /* only filter */, []);

// In component
<ListTable data={filteredData} />
```

## Troubleshooting

### Sorting Not Working

1. **Check column accessor** - Use dot notation for nested properties
2. **Ensure sortable: true** is set on the column
3. **Pass full dataset** not pre-sorted or paginated data
4. **Check data types** - Ensure consistent types in column data

### Performance Issues

1. **Memoize filtered data** but not sorted/paginated data
2. **Use virtual scrolling** for very large datasets
3. **Implement server-side operations** for datasets > 10,000 rows

### Column Features Not Working

1. **Use storeColumnsKey** for column persistence
2. **Set proper defaultColumnProps** for resizing/dragging
3. **Don't filter columns array** - let mantine handle visibility

## References

- [Mantine DataTable Documentation](https://icflorescu.github.io/mantine-datatable/)
- [Column Configuration](https://icflorescu.github.io/mantine-datatable/examples/column-properties)
- [Sorting](https://icflorescu.github.io/mantine-datatable/examples/sorting)
- [Row Selection](https://icflorescu.github.io/mantine-datatable/examples/row-selection)