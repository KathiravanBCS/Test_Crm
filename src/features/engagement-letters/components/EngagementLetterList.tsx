import { useNavigate } from 'react-router-dom';
import { Button, Card, Group, Select, Badge, Text, Avatar, ActionIcon, Menu } from '@mantine/core';
import { DateField } from '@/components/forms/inputs/DateField';
import { IconPlus, IconFile, IconEdit, IconEye, IconTrash, IconDots, IconCheck, IconFileInvoice } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { DataTableColumn } from 'mantine-datatable';
import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { ListTable } from '@/components/tables/ListTable';
import { SearchInput } from '@/components/forms/inputs/SearchInput';
import { FilterDrawer } from '@/components/list-page/FilterDrawer';
import { FilterTrigger } from '@/components/list-page/FilterDrawer';
import { DetailDrawer } from '@/components/list-page/DetailDrawer';
import { ExportMenu } from '@/components/list-page/ExportMenu';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { StatusBadge } from '@/components/display/StatusBadge';
import { InfoField } from '@/components/display/InfoField';
import { CustomerPicker } from '@/components/forms/pickers/CustomerPicker';
import { useListPageState } from '@/lib/hooks/useListPageState';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useGetBranches } from '@/lib/hooks/useGetBranches';
import { useGetEngagementLetters } from '../api/useGetEngagementLetters';
import { useDeleteEngagementLetter } from '../api/useDeleteEngagementLetter';
import { useApproveEngagementLetter } from '../api/useApproveEngagementLetter';
import { exportToCSV, exportToExcel } from '@/lib/utils/export';
import { toApiDate, formatDate } from '@/lib/utils/date';
import { EngagementLetterDetailContent } from './EngagementLetterDetailContent';
import type { EngagementLetter, EngagementLetterFilters } from '../types';
import { ColumnDefinition } from '@/components/tables/ColumnSelector';

// Status configuration for visual consistency
const statusConfig: Record<string, { color: string }> = {
  'draft': { color: 'gray' },
  'sent_for_approval': { color: 'blue' },
  'approved': { color: 'green' },
  'active': { color: 'teal' },
  'completed': { color: 'gray' },
  'rejected': { color: 'red' }
};

export function EngagementLetterList() {
  const navigate = useNavigate();
  const { canViewFinancial, role } = useUserRole();
  const { data: engagementLettersData, isLoading, error } = useGetEngagementLetters();
  const { data: branches = [] } = useGetBranches();
  const engagementLetters = engagementLettersData?.data || [];
  const deleteEngagementLetterMutation = useDeleteEngagementLetter();
  const approveEngagementLetterMutation = useApproveEngagementLetter();

  // Define columns for column selector
  const columnDefinitions: ColumnDefinition[] = [
    { accessor: 'id', title: 'EL #', defaultVisible: true },
    { accessor: 'customer.name', title: 'Customer', alwaysVisible: true },
    { accessor: 'branch', title: 'Branch', defaultVisible: true },
    { accessor: 'proposal.proposal_number', title: 'Proposal #', defaultVisible: true },
    { accessor: 'approvalDate', title: 'Approval Date', defaultVisible: true },
    { accessor: 'totalValue', title: 'Total Value', description: 'Total engagement value', defaultVisible: true },
    { accessor: 'status.status_name', title: 'Status', defaultVisible: true },
    { accessor: 'service_items_count', title: 'Service Items', defaultVisible: false },
    { accessor: 'createdAt', title: 'Created Date', defaultVisible: false },
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
  } = useListPageState<EngagementLetter>({
    data: engagementLetters,
    searchFields: ['engagementLetterCode', 'engagementLetterTitle'],
    columns: columnDefinitions,
    storageKey: 'engagement-letters-list'
  });

  const handleDelete = (engagementLetter: EngagementLetter) => {
    modals.openConfirmModal({
      title: 'Delete Engagement Letter',
      children: (
        <Text size="sm">
          Are you sure you want to delete engagement letter <strong>EL-{engagementLetter.id}</strong>? 
          This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteEngagementLetterMutation.mutate(engagementLetter.id),
    });
  };

  const handleApprove = (engagementLetter: EngagementLetter) => {
    modals.openConfirmModal({
      title: 'Approve Engagement Letter',
      children: (
        <Text size="sm">
          Are you sure you want to approve engagement letter <strong>EL-{engagementLetter.id}</strong>? 
          This will make it active and ready for execution.
        </Text>
      ),
      labels: { confirm: 'Approve', cancel: 'Cancel' },
      confirmProps: { color: 'green' },
      onConfirm: () => approveEngagementLetterMutation.mutate(engagementLetter.id),
    });
  };

  const handleCreateEngagement = (engagementLetter: EngagementLetter) => {
    if (engagementLetter.status?.statusCode !== 'approved' && engagementLetter.status?.statusName?.toLowerCase() !== 'approved') {
      modals.openConfirmModal({
        title: 'Cannot Create Engagement',
        children: (
          <Text size="sm">
            Engagements can only be created from approved engagement letters. 
            Please get this engagement letter approved first.
          </Text>
        ),
        labels: { confirm: 'OK', cancel: '' },
        cancelProps: { style: { display: 'none' } },
      });
      return;
    }
    navigate(`/engagements/new?engagementLetterId=${engagementLetter.id}`);
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    const exportData = (filteredData as unknown as EngagementLetter[]).map(el => {
      const branch = branches.find(b => b.id === el.customer?.vstnBranchId);
      return {
        'EL #': `EL-${el.id}`,
        'Customer': el.customer?.customerName || '',
        'Branch': branch?.branchName || '—',
        'Proposal #': el.proposal?.proposal_number || '',
        'Approval Date': toApiDate(el.approvalDate ? new Date(el.approvalDate) : null) || '',
        'Status': el.status?.statusName || '',
        'Service Items': el.serviceItems?.length || 0,
        ...(canViewFinancial ? {
          'Total Value': calculateTotalValue(el),
          'Currency': 'INR', // Assuming INR as base currency
        } : {})
      };
    });

    const filename = `engagement-letters-${toApiDate(new Date())}`;
    
    if (format === 'csv') {
      exportToCSV(exportData, filename);
    } else {
      exportToExcel(exportData, filename);
    }
  };

  // Helper function to calculate total value
  const calculateTotalValue = (el: EngagementLetter): number => {
    if (!el.serviceItems) return 0;
    return el.serviceItems.reduce((sum, item) => sum + (item.serviceRate || 0), 0);
  };

  // Define all columns for the table
  const allColumns: DataTableColumn<EngagementLetter>[] = [
    {
      accessor: 'id',
      title: 'EL #',
      width: 100,
      sortable: true,
      resizable: true,
      render: (el) => (
        <Text size="sm" fw={500}>EL-{el.id}</Text>
      ),
    },
    {
      accessor: 'customer.name',
      title: 'Customer',
      sortable: true,
      resizable: true,
      render: (el) => (
        <Group gap="sm">
          <Avatar size="sm" radius="xl" color="indigo">
            <IconFile size={16} />
          </Avatar>
          <div>
            <Text size="sm" fw={500}>{el.customer?.customerName}</Text>
            {el.customer?.customerType !== 'direct' && (
              <Text size="xs" c="dimmed">{el.customer?.customerType?.replace('_', ' ')}</Text>
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
      render: (el) => {
        const branch = branches.find(b => b.id === el.customer?.vstnBranchId);
        return (
          <Text size="sm">{branch?.branchName || '—'}</Text>
        );
      },
    },
    {
      accessor: 'proposal.proposal_number',
      title: 'Proposal #',
      width: 140,
      sortable: true,
      resizable: true,
      render: (el) => (
        <Text size="sm">{el.proposal?.proposal_number || `PROP-${el.proposalId}`}</Text>
      ),
    },
    {
      accessor: 'approvalDate',
      title: 'Approval Date',
      width: 130,
      sortable: true,
      resizable: true,
      render: (el) => (
        <Text size="sm">
          {formatDate(el.approvalDate)}
        </Text>
      ),
    },
    {
      accessor: 'totalValue',
      title: 'Total Value',
      width: 150,
      hidden: !canViewFinancial,
      sortable: true,
      resizable: true,
      render: (el) => (
        <MoneyDisplay 
          amount={calculateTotalValue(el)} 
          currency="INR"
          compact
        />
      ),
    },
    {
      accessor: 'status.status_name',
      title: 'Status',
      width: 140,
      sortable: true,
      resizable: true,
      render: (el) => el.status && (
        <StatusBadge 
          status={{
            statusCode: el.status.statusCode,
            statusName: el.status.statusName
          }} 
        />
      ),
    },
    {
      accessor: 'service_items_count',
      title: 'Service Items',
      width: 120,
      sortable: true,
      resizable: true,
      render: (el) => (
        <Badge variant="outline" color="gray">
          {el.serviceItems?.length || 0} items
        </Badge>
      ),
    },
    {
      accessor: 'createdAt',
      title: 'Created Date',
      width: 130,
      sortable: true,
      resizable: true,
      render: (el) => (
        <Text size="sm">
          {formatDate(el.createdAt)}
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
      render: (el) => (
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
                navigate(`/engagement-letters/${el.id}`);
              }}
            >
              View Details
            </Menu.Item>
            {el.status?.statusCode === 'draft' && (
              <Menu.Item
                leftSection={<IconEdit size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/engagement-letters/${el.id}/edit`);
                }}
              >
                Edit
              </Menu.Item>
            )}
            {el.status?.statusCode === 'sent_for_approval' && role !== 'Consultant' && (
              <Menu.Item
                color="green"
                leftSection={<IconCheck size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(el);
                }}
              >
                Approve
              </Menu.Item>
            )}
            {el.status?.statusCode === 'approved' && (
              <Menu.Item
                leftSection={<IconFileInvoice size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateEngagement(el);
                }}
              >
                Create Engagement
              </Menu.Item>
            )}
            {role !== 'Consultant' && el.status?.statusCode === 'draft' && (
              <>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={14} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(el);
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
    if (col.accessor === 'actions') return true;
    
    const colDef = columnDefinitions.find(def => def.accessor === col.accessor);
    if (colDef?.alwaysVisible) return true;
    
    return visibleColumns.includes(col.accessor as string);
  });

  return (
    <>
      <ListPageLayout
        title="Engagement Letters"
        description="Manage engagement letters and contracts"
        actions={
          <>
            {role !== 'Consultant' && (
              <ExportMenu onExport={handleExport} />
            )}
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={() => navigate('/engagement-letters/new')}
            >
              New Engagement Letter
            </Button>
          </>
        }
        filters={
          <Card mb="md">
            <Group>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by customer, proposal number, or notes..."
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
          data={paginatedData as EngagementLetter[]}
          columns={columns}
          loading={isLoading}
          error={error}
          onRowClick={handleRowClick}
          page={page}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          storeColumnsKey="engagement-letters-table"
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          emptyState={{
            title: 'No engagement letters found',
            description: activeFilterCount > 0 || search
              ? 'Try adjusting your filters'
              : 'Create your first engagement letter to get started',
            action: !activeFilterCount && !search ? {
              label: 'New Engagement Letter',
              onClick: () => navigate('/engagement-letters/new')
            } : undefined
          }}
        />
      </ListPageLayout>

      <DetailDrawer
        opened={detailDrawerOpened}
        onClose={() => setDetailDrawerOpened(false)}
        title={`Engagement Letter #${selectedItem?.id}`}
        onFullPageClick={() => selectedItem && navigate(`/engagement-letters/${selectedItem.id}`)}
      >
        {selectedItem && <EngagementLetterDetailContent engagementLetterId={selectedItem.id} />}
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
          value={(filters as EngagementLetterFilters).vstnBranchId?.toString() || ''}
          onChange={(value) => setFilters({ ...filters, vstnBranchId: value ? parseInt(value) : undefined })}
          clearable
        />
        
        <CustomerPicker
          label="Customer"
          placeholder="All customers"
          value={filters.customerId}
          onChange={(value) => setFilters({ ...filters, customerId: value || undefined })}
          clearable
        />
        
        <Select
          label="Status"
          placeholder="All statuses"
          data={[
            { value: 'draft', label: 'Draft' },
            { value: 'sent_for_approval', label: 'Sent for Approval' },
            { value: 'approved', label: 'Approved' },
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
            { value: 'rejected', label: 'Rejected' }
          ]}
          value={(filters as EngagementLetterFilters).statusId?.toString() || ''}
          onChange={(value) => setFilters({ ...filters, statusId: value ? parseInt(value) : undefined })}
          clearable
        />
        
        <DateField
          label="Approval Date From"
          placeholder="Select start date"
          value={(filters as EngagementLetterFilters).approvalDateFrom || null}
          onChange={(value) => setFilters({ ...filters, approvalDateFrom: value || undefined })}
          clearable
        />
        
        <DateField
          label="Approval Date To"
          placeholder="Select end date"
          value={(filters as EngagementLetterFilters).approvalDateTo || null}
          onChange={(value) => setFilters({ ...filters, approvalDateTo: value || undefined })}
          clearable
        />
      </FilterDrawer>
    </>
  );
}