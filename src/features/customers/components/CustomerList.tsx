import { useNavigate } from 'react-router-dom';
import { Button, Card, Group, Select, Badge, Text, Avatar, ActionIcon, Menu } from '@mantine/core';
import { IconPlus, IconBuilding, IconEdit, IconEye, IconTrash, IconDots } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { DataTableColumn } from 'mantine-datatable';
import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { ListTable } from '@/components/tables/ListTable';
import { SearchInput } from '@/components/forms/inputs/SearchInput';
import { FilterDrawer } from '@/components/list-page/FilterDrawer';
import { FilterTrigger } from '@/components/list-page/FilterDrawer';
import { DetailDrawer } from '@/components/list-page/DetailDrawer';
import { ExportMenu } from '@/components/list-page/ExportMenu';
import { useListPageState } from '@/lib/hooks/useListPageState';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useGetBranches } from '@/lib/hooks/useGetBranches';
import { useGetCustomers } from '../api/useGetCustomers';
import { useDeleteCustomer } from '../api/useDeleteCustomer';
import { exportToCSV, exportToExcel } from '@/lib/utils/export';
import { formatDate, toApiDate } from '@/lib/utils/date';
import { CustomerDetailContent } from './CustomerDetailContent';
import type { Customer, CustomerFilters } from '../types';
import { ColumnDefinition } from '@/components/tables/ColumnSelector';

export function CustomerList() {
  const navigate = useNavigate();
  const { role } = useUserRole();
  const { data: customers = [], isLoading, error } = useGetCustomers();
  const { data: branches = [] } = useGetBranches();
  const deleteCustomerMutation = useDeleteCustomer();

  // Define columns for column selector - must match actual table columns
  const columnDefinitions: ColumnDefinition[] = [
    { accessor: 'customerCode', title: 'Code', defaultVisible: true },
    { accessor: 'customerName', title: 'Customer', alwaysVisible: true },
    { accessor: 'branch', title: 'Branch', defaultVisible: true },
    { accessor: 'customerType', title: 'Type', defaultVisible: true },
    { accessor: 'industry', title: 'Industry', defaultVisible: false },
    { accessor: 'customerSegment', title: 'Segment', defaultVisible: false },
    { accessor: 'currencyCode', title: 'Currency', defaultVisible: true },
    { accessor: 'paymentTerm', title: 'Payment Terms', defaultVisible: false },
    { accessor: 'pan', title: 'PAN', defaultVisible: false },
    { accessor: 'gstin', title: 'GSTIN', defaultVisible: false },
    { accessor: 'onboardedDate', title: 'Onboarded', defaultVisible: false },
    { accessor: 'actions', title: '', alwaysVisible: true }
  ];

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
    filteredData,
    visibleColumns,
    setVisibleColumns,
    columnOrder,
    setColumnOrder,
    sortStatus,
    setSortStatus
  } = useListPageState<Customer>({
    data: customers,
    searchFields: ['customerName', 'customerCode', 'pan', 'gstin'],
    columns: columnDefinitions,
    storageKey: 'customers-list'
  });

  const handleDelete = (customer: Customer) => {
    modals.openConfirmModal({
      title: 'Delete Customer',
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{customer.customerName}</strong>? 
          This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteCustomerMutation.mutate(customer.id),
    });
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    const exportData = (filteredData as unknown as Customer[]).map(customer => {
      const branch = branches.find(b => b.id === customer.vstnBranchId);
      return {
        Code: customer.customerCode,
        Name: customer.customerName,
        Branch: branch?.branchName || '—',
        Type: customer.customerType,
        Industry: customer.industry || '',
        Segment: customer.customerSegment || '',
        Currency: customer.currencyCode,
        'Payment Terms': customer.paymentTerm || '',
        PAN: customer.pan || '',
        GSTIN: customer.gstin || '',
        'Onboarded Date': formatDate(customer.onboardedDate),
      };
    });

    const filename = `customers-${toApiDate(new Date())}`;
    
    if (format === 'csv') {
      exportToCSV(exportData, filename);
    } else {
      exportToExcel(exportData, filename);
    }
  };

  // Define all columns for the table
  const allColumns: DataTableColumn<Customer>[] = [
    {
      accessor: 'customerCode',
      title: 'Code',
      width: 120,
      sortable: true,
      resizable: true,
      render: (customer) => (
        <Text size="sm" fw={500}>{customer.customerCode}</Text>
      ),
    },
    {
      accessor: 'customerName',
      title: 'Customer',
      sortable: true,
      resizable: true,
      render: (customer) => (
        <Group gap="sm">
          <Avatar size="sm" radius="xl" color="blue">
            <IconBuilding size={16} />
          </Avatar>
          <div>
            <Text size="sm" fw={500}>{customer.customerName}</Text>
            {customer.customerSegment && (
              <Text size="xs" c="dimmed">
                {customer.customerSegment.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Text>
            )}
          </div>
        </Group>
      ),
    },
    {
      accessor: 'branch',
      title: 'Branch',
      width: 150,
      sortable: true,
      resizable: true,
      render: (customer) => {
        const branch = branches.find(b => b.id === customer.vstnBranchId);
        return (
          <Text size="sm">{branch?.branchName || '—'}</Text>
        );
      },
    },
    {
      accessor: 'customerType',
      title: 'Type',
      width: 150,
      sortable: true,
      resizable: true,
      render: (customer) => (
        <Badge 
          variant="dot" 
          color={
            customer.customerType === 'direct' ? 'blue' : 
            customer.customerType === 'partner_referred' ? 'green' : 'orange'
          }
        >
          {customer.customerType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </Badge>
      ),
    },
    {
      accessor: 'industry',
      title: 'Industry',
      width: 150,
      sortable: true,
      resizable: true,
      render: (customer) => (
        <Text size="sm">{customer.industry ? customer.industry.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '—'}</Text>
      ),
    },
    {
      accessor: 'customerSegment',
      title: 'Segment',
      width: 150,
      sortable: true,
      resizable: true,
      render: (customer) => (
        <Badge variant="light" size="sm">
          {customer.customerSegment ? customer.customerSegment.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '—'}
        </Badge>
      ),
    },
    {
      accessor: 'currencyCode',
      title: 'Currency',
      width: 100,
      sortable: true,
      resizable: true,
      render: (customer) => (
        <Badge variant="outline">{customer.currencyCode}</Badge>
      ),
    },
    {
      accessor: 'paymentTerm',
      title: 'Payment Terms',
      width: 150,
      sortable: true,
      resizable: true,
      render: (customer) => (
        <Text size="sm">
          {customer.paymentTerm ? customer.paymentTerm.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '—'}
        </Text>
      ),
    },
    {
      accessor: 'pan',
      title: 'PAN',
      width: 120,
      sortable: true,
      resizable: true,
      render: (customer) => (
        <Text size="sm" ff="monospace">{customer.pan || '—'}</Text>
      ),
    },
    {
      accessor: 'gstin',
      title: 'GSTIN',
      width: 150,
      sortable: true,
      resizable: true,
      render: (customer) => (
        <Text size="sm" ff="monospace">{customer.gstin || '—'}</Text>
      ),
    },
    {
      accessor: 'onboardedDate',
      title: 'Onboarded',
      width: 120,
      sortable: true,
      resizable: true,
      render: (customer) => (
        <Text size="sm">
          {formatDate(customer.onboardedDate)}
        </Text>
      ),
    },
    {
      accessor: 'actions',
      title: '',
      width: 50,
      sortable: false,
      toggleable: false,
      resizable: false,
      render: (customer) => (
        <Menu shadow="sm" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/customers/${customer.id}`);
              }}
            >
              View Details
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/customers/${customer.id}/edit`);
              }}
            >
              Edit
            </Menu.Item>
            {role !== 'Consultant' && (
              <>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={14} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(customer);
                  }}
                >
                  Delete
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  // Filter columns based on visibility
  const columns = allColumns.filter(col => {
    // Always include actions column
    if (col.accessor === 'actions') return true;
    
    // Check if column should be visible
    const colDef = columnDefinitions.find(def => def.accessor === col.accessor);
    if (colDef?.alwaysVisible) return true;
    
    // Use visibleColumns to determine visibility
    return visibleColumns.includes(col.accessor as string);
  });

  return (
    <>
      <ListPageLayout
        title="Customers"
        description="Manage your customer relationships"
        actions={
          <>
            {role !== 'Consultant' && (
              <ExportMenu onExport={handleExport} />
            )}
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={() => navigate('/customers/new')}
            >
              New Customer
            </Button>
          </>
        }
        filters={
          <Card mb="md">
            <Group>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by customer name, code, PAN or GSTIN..."
              />
              <FilterTrigger
                onClick={() => setFilterDrawerOpened(true)}
                filterCount={activeFilterCount}
                hasColumns={true}
              />
            </Group>
          </Card>
        }
      >
        <ListTable
          data={paginatedData as Customer[]}
          columns={columns}
          loading={isLoading}
          error={error}
          onRowClick={handleRowClick}
          page={page}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          storeColumnsKey="customers-table"
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          emptyState={{
            title: 'No customers found',
            description: activeFilterCount > 0 || search
              ? 'Try adjusting your filters'
              : 'Create your first customer to get started',
            action: !activeFilterCount && !search ? {
              label: 'New Customer',
              onClick: () => navigate('/customers/new')
            } : undefined
          }}
        />
      </ListPageLayout>

      <DetailDrawer
        opened={detailDrawerOpened}
        onClose={() => setDetailDrawerOpened(false)}
        title={selectedItem?.customerName}
        onFullPageClick={() => selectedItem && navigate(`/customers/${selectedItem.id}`)}
      >
        {selectedItem && <CustomerDetailContent customerId={selectedItem.id} />}
      </DetailDrawer>

      <FilterDrawer
        opened={filterDrawerOpened}
        onClose={() => setFilterDrawerOpened(false)}
        onReset={resetFilters}
        filterCount={activeFilterCount}
        columns={columnDefinitions}
        visibleColumns={visibleColumns}
        onColumnVisibilityChange={setVisibleColumns}
        onColumnReorder={setColumnOrder}
      >
        <Select
          label="Branch"
          placeholder="All branches"
          data={branches.map(branch => ({
            value: branch.id.toString(),
            label: branch.branchName
          }))}
          value={(filters as CustomerFilters).vstnBranchId?.toString() || ''}
          onChange={(value) => setFilters({ ...filters, vstnBranchId: value ? parseInt(value) : undefined })}
          clearable
        />
        
        <Select
          label="Customer Type"
          placeholder="All types"
          data={[
            { value: 'direct', label: 'Direct' },
            { value: 'partner_referred', label: 'Partner Referred' },
            { value: 'partner_managed', label: 'Partner Managed' }
          ]}
          value={(filters as CustomerFilters).customerType || ''}
          onChange={(value) => setFilters({ ...filters, customerType: value || undefined })}
          clearable
        />
        
        <Select
          label="Status"
          placeholder="All statuses"
          data={[
            { value: '1', label: 'Active' },
            { value: '2', label: 'Inactive' }
          ]}
          value={(filters as CustomerFilters).statusId?.toString() || ''}
          onChange={(value) => setFilters({ ...filters, statusId: value ? parseInt(value) : undefined })}
          clearable
        />
        
        <Select
          label="Currency"
          placeholder="All currencies"
          data={[
            { value: 'INR', label: 'INR' },
            { value: 'USD', label: 'USD' },
            { value: 'AED', label: 'AED' }
          ]}
          value={(filters as CustomerFilters).currencyCode || ''}
          onChange={(value) => setFilters({ ...filters, currencyCode: value || undefined })}
          clearable
        />
      </FilterDrawer>
    </>
  );
}