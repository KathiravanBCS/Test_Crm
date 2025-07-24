import { useNavigate } from 'react-router-dom';
import { Button, Card, Group, Select, Text, Avatar, ActionIcon, Menu, NumberInput, Badge } from '@mantine/core';
import { DateField } from '@/components/forms/inputs/DateField';
import { IconPlus, IconEdit, IconEye, IconTrash, IconDots, IconCopy, IconFileInvoice } from '@tabler/icons-react';
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
import { useListPageState } from '@/lib/hooks/useListPageState';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useGetBranches } from '@/lib/hooks/useGetBranches';
import { useGetProposals } from '../api/useGetProposals';
import { useDeleteProposal } from '../api/useDeleteProposal';
import { exportToCSV, exportToExcel } from '@/lib/utils/export';
import { formatDate as formatDateUtil } from '@/lib/utils/date';
import { ProposalDetailContent } from './ProposalDetailContent';
import type { Proposal, ProposalFilters } from '../types';
import { ColumnDefinition } from '@/components/tables/ColumnSelector';
import { CURRENCY_CODES, CURRENCY_NAMES } from '@/types/common';

export function ProposalsList() {
  const navigate = useNavigate();
  const { canViewFinancial, role } = useUserRole();
  const { data: proposalsData, isLoading, error } = useGetProposals();
  const { data: branches = [] } = useGetBranches();
  const proposals = (proposalsData as Proposal[]) || [];
  const deleteProposalMutation = useDeleteProposal();

  // Define columns for column selector
  const columnDefinitions: ColumnDefinition[] = [
    { accessor: 'proposal_number', title: 'Proposal #', defaultVisible: true },
    { accessor: 'proposal_target', title: 'Target', defaultVisible: true },
    { accessor: 'recipient', title: 'Recipient', alwaysVisible: true },
    { accessor: 'branch', title: 'Branch', defaultVisible: true },
    { accessor: 'proposal_date', title: 'Date', defaultVisible: true },
    { accessor: 'valid_until', title: 'Valid Until', defaultVisible: true },
    { accessor: 'total_amount', title: 'Value', description: 'Total proposal value', defaultVisible: true },
    { accessor: 'status.status_name', title: 'Status', defaultVisible: true },
    { accessor: 'created_by_name', title: 'Created By', defaultVisible: false },
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
    setColumnOrder,
    sortStatus,
    setSortStatus
  } = useListPageState<Proposal>({
    data: proposals,
    searchFields: ['proposal_number', 'notes'],
    columns: columnDefinitions,
    storageKey: 'proposals-list'
  });

  const handleDelete = (proposal: Proposal) => {
    modals.openConfirmModal({
      title: 'Delete Proposal',
      children: (
        <Text size="sm">
          Are you sure you want to delete proposal <strong>{proposal.proposal_number}</strong>? 
          This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteProposalMutation.mutate(proposal.id, {
          onSuccess: () => {
            // The query will automatically refetch
          }
        });
      }
    });
  };

  const handleDuplicate = (proposal: Proposal) => {
    navigate('/proposals/new', { 
      state: { duplicateFrom: proposal.id } 
    });
  };

  const handleExport = (format: 'csv' | 'excel') => {
    const exportData = filteredData.map(proposal => {
      const isCustomer = proposal.proposal_target === 'customer';
      const recipientName = isCustomer ? proposal.customer?.customerName : proposal.partner?.partnerName;
      const branchId = proposal.customer?.vstnBranchId || proposal.partner?.vstnBranchId;
      const branch = branches.find(b => b.id === branchId);
      return {
        'Proposal #': proposal.proposal_number || '',
        'Target': proposal.proposal_target?.charAt(0).toUpperCase() + proposal.proposal_target?.slice(1) || 'Customer',
        'Recipient': recipientName || '',
        'Branch': branch?.branchName || '—',
        'Date': formatDateUtil(proposal.proposal_date),
        'Valid Until': formatDateUtil(proposal.valid_until),
        'Status': proposal.status?.status_name || '',
        'Value': proposal.total_amount || 0,
        'Currency': proposal.currency_code || 'INR',
        'Created By': proposal.created_by || '—',
      };
    });

    if (format === 'csv') {
      exportToCSV(exportData, 'proposals');
    } else {
      exportToExcel(exportData, 'proposals');
    }
  };

  const allColumns: DataTableColumn<Proposal>[] = [
    {
      accessor: 'proposal_number',
      title: 'Proposal #',
      width: 150,
      sortable: true,
      resizable: true,
      render: (proposal) => (
        <Text fw={500} size="sm">
          {proposal.proposal_number || `#${proposal.id}`}
        </Text>
      ),
    },
    {
      accessor: 'proposal_target',
      title: 'Target',
      width: 100,
      sortable: true,
      resizable: true,
      render: (proposal) => (
        <Badge 
          color={proposal.proposal_target === 'customer' ? 'blue' : 'green'}
          variant="light"
          size="sm"
        >
          {proposal.proposal_target?.charAt(0).toUpperCase() + proposal.proposal_target?.slice(1) || 'Customer'}
        </Badge>
      ),
    },
    {
      accessor: 'recipient',
      title: 'Recipient',
      width: 200,
      sortable: true,
      resizable: true,
      render: (proposal) => {
        const isCustomer = proposal.proposal_target === 'customer';
        const name = isCustomer ? proposal.customer?.customerName : proposal.partner?.partnerName;
        const code = isCustomer ? proposal.customer?.customerCode : proposal.partner?.partnerCode;
        const initial = name?.charAt(0) || (isCustomer ? 'C' : 'P');
        
        return (
          <Group gap="sm">
            <Avatar size="sm" radius="xl" color={isCustomer ? 'blue' : 'green'}>
              {initial}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>
                {name || '—'}
              </Text>
              <Text size="xs" c="dimmed">
                {code || ''}
              </Text>
            </div>
          </Group>
        );
      },
    },
    {
      accessor: 'branch',
      title: 'Branch',
      width: 150,
      sortable: true,
      resizable: true,
      render: (proposal) => {
        const branchId = proposal.customer?.vstnBranchId;
        const branch = branches.find(b => b.id === branchId);
        return (
          <Text size="sm">
            {branch?.branchName || '—'}
          </Text>
        );
      },
    },
    {
      accessor: 'proposal_date',
      title: 'Date',
      width: 120,
      sortable: true,
      resizable: true,
      render: (proposal) => (
        <Text size="sm">
          {formatDateUtil(proposal.proposal_date)}
        </Text>
      ),
    },
    {
      accessor: 'valid_until',
      title: 'Valid Until',
      width: 120,
      sortable: true,
      resizable: true,
      render: (proposal) => (
        <Text size="sm">
          {formatDateUtil(proposal.valid_until)}
        </Text>
      ),
    },
    {
      accessor: 'total_amount',
      title: 'Value',
      width: 150,
      hidden: !canViewFinancial,
      sortable: true,
      resizable: true,
      render: (proposal) => (
        <MoneyDisplay 
          amount={proposal.total_amount || 0} 
          currency={proposal.currency_code || 'INR'}
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
      render: (proposal) => proposal.status && (
        <StatusBadge 
          status={{
            statusCode: proposal.status.status_code,
            statusName: proposal.status.status_name
          }} 
        />
      ),
    },
    {
      accessor: 'created_by_name',
      title: 'Created By',
      width: 150,
      sortable: true,
      resizable: true,
      render: (proposal) => (
        <Text size="sm">{proposal.created_by || '—'}</Text>
      ),
    },
    {
      accessor: 'actions',
      title: '',
      width: 50,
      sortable: false,
      resizable: false,
      render: (proposal) => (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" size="sm">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={14} />}
              onClick={() => navigate(`/proposals/${proposal.id}`)}
            >
              View Details
            </Menu.Item>
            
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={() => navigate(`/proposals/${proposal.id}/edit`)}
            >
              Edit
            </Menu.Item>
            
            <Menu.Item
              leftSection={<IconCopy size={14} />}
              onClick={() => handleDuplicate(proposal)}
            >
              Duplicate
            </Menu.Item>
            
            <Menu.Divider />
            
            <Menu.Item
              leftSection={<IconFileInvoice size={14} />}
              onClick={() => navigate(`/proposals/${proposal.id}/engagement-letter`)}
            >
              Create Engagement Letter
            </Menu.Item>
            
            <Menu.Divider />
            
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={() => handleDelete(proposal)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  const columns = allColumns.filter(col => 
    visibleColumns.includes(col.accessor as string)
  );

  return (
    <>
      <ListPageLayout
        title="Proposals"
        description="Manage your business proposals"
        actions={
          <>
            {role !== 'Consultant' && (
              <ExportMenu onExport={handleExport} />
            )}
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={() => navigate('/proposals/new')}
            >
              New Proposal
            </Button>
          </>
        }
        filters={
          <Card mb="md">
            <Group>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by proposal number, customer, or notes..."
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
          data={paginatedData as Proposal[]}
          columns={columns}
          loading={isLoading}
          error={error}
          onRowClick={handleRowClick}
          page={page}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          storeColumnsKey="proposals-table"
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          emptyState={{
            title: 'No proposals found',
            description: activeFilterCount > 0 || search
              ? 'Try adjusting your filters'
              : 'Create your first proposal to get started',
            action: !activeFilterCount && !search ? {
              label: 'New Proposal',
              onClick: () => navigate('/proposals/new')
            } : undefined
          }}
        />
      </ListPageLayout>

      <DetailDrawer
        opened={detailDrawerOpened}
        onClose={() => setDetailDrawerOpened(false)}
        title={selectedItem?.proposal_number || `Proposal #${selectedItem?.id}`}
        onFullPageClick={() => selectedItem && navigate(`/proposals/${selectedItem.id}`)}
      >
        {selectedItem && <ProposalDetailContent proposalId={selectedItem.id} proposal={selectedItem} />}
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
          value={(filters as ProposalFilters).vstnBranchId?.toString() || ''}
          onChange={(value) => setFilters({ ...filters, vstnBranchId: value ? parseInt(value) : undefined })}
          clearable
        />
        
        <Select
          label="Status"
          placeholder="All statuses"
          data={[
            { value: 'draft', label: 'Draft' },
            { value: 'submitted', label: 'Submitted' },
            { value: 'under_review', label: 'Under Review' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'withdrawn', label: 'Withdrawn' }
          ]}
          value={(filters as ProposalFilters).status_id?.toString() || ''}
          onChange={(value) => setFilters({ ...filters, status_id: value ? parseInt(value) : undefined })}
          clearable
        />
        
        <DateField
          label="Date From"
          placeholder="Select start date"
          value={(filters as ProposalFilters).date_from || null}
          onChange={(value) => setFilters({ ...filters, date_from: value || undefined })}
          clearable
        />
        
        <DateField
          label="Date To"
          placeholder="Select end date"
          value={(filters as ProposalFilters).date_to || null}
          onChange={(value) => setFilters({ ...filters, date_to: value || undefined })}
          clearable
        />
        
        <NumberInput
          label="Min Amount"
          placeholder="Enter minimum amount"
          value={(filters as ProposalFilters).amount_min || ''}
          onChange={(value) => setFilters({ ...filters, amount_min: value || undefined })}
        />
        
        <NumberInput
          label="Max Amount"
          placeholder="Enter maximum amount"
          value={(filters as ProposalFilters).amount_max || ''}
          onChange={(value) => setFilters({ ...filters, amount_max: value || undefined })}
        />
        
        <Select
          label="Currency"
          placeholder="All currencies"
          data={Object.entries(CURRENCY_CODES).map(([key, code]) => ({
            value: code,
            label: `${CURRENCY_NAMES[code]} (${code})`
          }))}
          value={(filters as ProposalFilters).currency_code || ''}
          onChange={(value) => setFilters({ ...filters, currency_code: value || undefined })}
          clearable
        />
      </FilterDrawer>
    </>
  );
}