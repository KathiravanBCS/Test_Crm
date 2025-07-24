import { ListTable } from './ListTable';
import { FilterDrawer, FilterTrigger } from '@/components/list-page/FilterDrawer';
import { SearchInput } from '@/components/forms/inputs/SearchInput';
import { BulkActions } from './BulkActions';
import { useListPageState } from '@/lib/hooks/useListPageState';
import { Card, Group, Select, Button } from '@mantine/core';
import { IconTrash, IconEdit, IconEye, IconDownload } from '@tabler/icons-react';
import { ColumnDefinition } from '@/components/tables/ColumnSelector';

// Example data type
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  revenue: number;
}

// Example columns definition
const columns: ColumnDefinition[] = [
  { accessor: 'id', title: 'ID', alwaysVisible: true },
  { accessor: 'name', title: 'Customer Name' },
  { accessor: 'email', title: 'Email Address' },
  { accessor: 'phone', title: 'Phone', defaultVisible: false },
  { accessor: 'status', title: 'Status' },
  { accessor: 'revenue', title: 'Revenue', description: 'Total revenue from customer' }
];

// Example usage component
export function CustomerListExample() {
  // Mock data
  const customers: Customer[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    phone: `+1 555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
    revenue: Math.floor(Math.random() * 100000)
  }));

  // Use the enhanced list page state hook
  const listState = useListPageState({
    data: customers,
    searchFields: ['name', 'email', 'phone'],
    columns,
    storageKey: 'example-customers'
  });

  // Define row actions
  const rowActions = [
    {
      label: 'View',
      icon: <IconEye size={16} />,
      onClick: (record: Customer) => console.log('View', record)
    },
    {
      label: 'Edit',
      icon: <IconEdit size={16} />,
      onClick: (record: Customer) => console.log('Edit', record)
    },
    {
      label: 'Delete',
      icon: <IconTrash size={16} />,
      color: 'red',
      onClick: (record: Customer) => console.log('Delete', record)
    }
  ];

  // Define bulk actions
  const bulkActions = [
    {
      label: 'Export',
      icon: <IconDownload size={16} />,
      onClick: () => console.log('Export', listState.selectedRecords)
    },
    {
      label: 'Delete',
      icon: <IconTrash size={16} />,
      color: 'red',
      variant: 'light' as const,
      onClick: () => console.log('Bulk delete', listState.selectedRecords),
      confirmMessage: `Delete ${listState.selectedRecords.length} customers?`
    }
  ];

  return (
    <>
      {/* Search and filter controls */}
      <Card mb="md">
        <Group>
          <SearchInput
            value={listState.search}
            onChange={listState.setSearch}
            placeholder="Search customers..."
          />
          <FilterTrigger
            onClick={() => listState.setFilterDrawerOpened(true)}
            filterCount={listState.activeFilterCount}
            hasColumns={true}
          />
        </Group>
      </Card>

      {/* Bulk actions bar */}
      {listState.selectedRecords.length > 0 && (
        <BulkActions
          selectedCount={listState.selectedRecords.length}
          actions={bulkActions}
          onClear={listState.clearSelection}
        />
      )}

      {/* Enhanced data table */}
      <ListTable
        data={listState.paginatedData}
        columns={columns.filter(col => 
          listState.visibleColumns.includes(col.accessor)
        )}
        loading={false}
        onRowClick={listState.handleRowClick}
        page={listState.page}
        pageSize={listState.pageSize}
        totalRecords={listState.totalRecords}
        onPageChange={listState.setPage}
        onPageSizeChange={listState.setPageSize}
        rowActions={rowActions}
        selectedRecords={listState.selectedRecords}
        onSelectedRecordsChange={listState.setSelectedRecords}
        emptyState={{
          title: 'No customers found',
          description: 'Try adjusting your filters or search criteria'
        }}
      />

      {/* Enhanced filter drawer with column management */}
      <FilterDrawer
        opened={listState.filterDrawerOpened}
        onClose={() => listState.setFilterDrawerOpened(false)}
        onReset={listState.resetFilters}
        filterCount={listState.activeFilterCount}
        columns={columns}
        visibleColumns={listState.visibleColumns}
        onColumnVisibilityChange={listState.setVisibleColumns}
        onColumnReorder={listState.setColumnOrder}
      >
        <Select
          label="Status"
          placeholder="All statuses"
          data={['active', 'inactive', 'pending']}
          value={listState.filters.status as string || ''}
          onChange={(value) => 
            listState.setFilters({ 
              ...listState.filters, 
              status: value || undefined 
            })
          }
          clearable
        />
      </FilterDrawer>
    </>
  );
}