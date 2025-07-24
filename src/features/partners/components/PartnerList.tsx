import { useNavigate } from 'react-router-dom';
import { Button, Card, Group, Select, Badge, Text, Avatar, ActionIcon, Menu, Checkbox } from '@mantine/core';
import { IconPlus, IconBriefcase, IconEdit, IconEye, IconTrash, IconDots } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { DataTableColumn } from 'mantine-datatable';
import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { ListTable } from '@/components/tables/ListTable';
import { SearchInput } from '@/components/forms/inputs/SearchInput';
import { FilterDrawer } from '@/components/list-page/FilterDrawer';
import { FilterTrigger } from '@/components/list-page/FilterDrawer';
import { DetailDrawer } from '@/components/list-page/DetailDrawer';
import { ExportMenu } from '@/components/list-page/ExportMenu';
import { MoneyDisplay } from '@/components/display/MoneyDisplay';
import { useListPageState } from '@/lib/hooks/useListPageState';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useGetBranches } from '@/lib/hooks/useGetBranches';
import { useGetPartners } from '../api/useGetPartners';
import { useDeletePartner } from '../api/useDeletePartner';
import { exportToCSV, exportToExcel } from '@/lib/utils/export';
import { toApiDate } from '@/lib/utils/date';
import { PartnerDetailContent } from './PartnerDetailContent';
import type { Partner, PartnerFilters } from '../types';
import { ColumnDefinition } from '@/components/tables/ColumnSelector';

export function PartnerList() {
  const navigate = useNavigate();
  const { canViewFinancial, role } = useUserRole();
  const { data: partners = [], isLoading, error } = useGetPartners();
  const { data: branches = [] } = useGetBranches();
  const deletePartnerMutation = useDeletePartner();

  // Define columns for column selector - must match actual table columns
  const columnDefinitions: ColumnDefinition[] = [
    { accessor: 'partnerName', title: 'Partner', alwaysVisible: true },
    { accessor: 'partnerCode', title: 'Code', defaultVisible: true },
    { accessor: 'branch', title: 'Branch', defaultVisible: true },
    { accessor: 'partnerType', title: 'Type', defaultVisible: true },
    { accessor: 'commissionInfo', title: 'Commission', defaultVisible: true },
    { accessor: 'pan', title: 'PAN', defaultVisible: true },
    { accessor: 'gstin', title: 'GSTIN', defaultVisible: true },
    { accessor: 'referredCustomersCount', title: 'Referrals', defaultVisible: true },
    { accessor: 'totalCommissionAmount', title: 'Total Commission', description: 'Total commission earned', defaultVisible: true },
    { accessor: 'activeStatus', title: 'Status', defaultVisible: true },
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
  } = useListPageState<Partner>({
    data: partners as Partner[],
    searchFields: ['partnerName', 'partnerCode', 'pan', 'gstin'],
    columns: columnDefinitions,
    storageKey: 'partners-list'
  });

  const handleDelete = (partner: Partner) => {
    modals.openConfirmModal({
      title: 'Delete Partner',
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{partner.partnerName}</strong>? 
          This action cannot be undone and will affect all related commissions.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deletePartnerMutation.mutate(partner.id),
    });
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    const exportData = (filteredData as unknown as Partner[]).map(partner => {
      const branch = branches.find(b => b.id === partner.vstnBranchId);
      return {
        Name: partner.partnerName,
        Code: partner.partnerCode || '',
        Branch: branch?.branchName || '—',
        Type: partner.partnerType === 'individual' ? 'Individual' : 'Firm',
        PAN: partner.pan || '',
        GSTIN: partner.gstin || '',
        'Commission Type': partner.commissionType === 'percentage' ? 'Percentage' : 'Fixed',
        'Commission Rate': partner.commissionType === 'percentage' ? `${partner.commissionRate}%` : `${partner.commissionCurrencyCode || 'INR'} ${partner.commissionRate}`,
        'Referred Customers': partner.referredCustomersCount || 0,
        ...(canViewFinancial ? {
          'Total Commission': partner.totalCommissionAmount || 0,
        } : {}),
        Status: partner.activeStatus ? 'Active' : 'Inactive'
      };
    });

    const filename = `partners-${toApiDate(new Date())}`;
    
    if (format === 'csv') {
      exportToCSV(exportData, filename);
    } else {
      exportToExcel(exportData, filename);
    }
  };

  // Define all columns for the table
  const allColumns: DataTableColumn<Partner>[] = [
    {
      accessor: 'partnerName',
      title: 'Partner',
      sortable: true,
      resizable: true,
      render: (partner) => (
        <Group gap="sm">
          <Avatar size="sm" radius="xl" color="indigo">
            <IconBriefcase size={16} />
          </Avatar>
          <div>
            <Text size="sm" fw={500}>{partner.partnerName}</Text>
            {partner.referredCustomersCount && partner.referredCustomersCount > 0 && (
              <Badge size="xs" variant="dot" color="blue">
                {partner.referredCustomersCount} referrals
              </Badge>
            )}
          </div>
        </Group>
      ),
    },
    {
      accessor: 'partnerCode',
      title: 'Code',
      width: 120,
      sortable: true,
      resizable: true,
      render: (partner) => (
        <Text size="sm" ff="monospace">{partner.partnerCode || partner.id}</Text>
      ),
    },
    {
      accessor: 'branch',
      title: 'Branch',
      width: 150,
      sortable: true,
      resizable: true,
      render: (partner) => {
        const branch = branches.find(b => b.id === partner.vstnBranchId);
        return (
          <Text size="sm">{branch?.branchName || '—'}</Text>
        );
      },
    },
    {
      accessor: 'partnerType',
      title: 'Type',
      width: 100,
      sortable: true,
      resizable: true,
      render: (partner) => (
        <Badge variant="light" color={partner.partnerType === 'individual' ? 'orange' : 'blue'}>
          {partner.partnerType === 'individual' ? 'Individual' : 'Firm'}
        </Badge>
      ),
    },
    {
      accessor: 'commissionInfo',
      title: 'Commission',
      width: 150,
      sortable: true,
      resizable: true,
      render: (partner) => {
        if (!partner.commissionType) return <Text size="sm" c="dimmed">—</Text>;
        
        return (
          <Group gap="xs">
            <Badge variant="light" color="teal" size="sm">
              {partner.commissionType === 'percentage' 
                ? `${partner.commissionRate}%` 
                : `${partner.commissionCurrencyCode || 'INR'} ${partner.commissionRate}`
              }
            </Badge>
          </Group>
        );
      },
    },
    {
      accessor: 'pan',
      title: 'PAN',
      width: 120,
      sortable: true,
      resizable: true,
      render: (partner) => (
        <Text size="sm" ff="monospace">{partner.pan || '—'}</Text>
      ),
    },
    {
      accessor: 'gstin',
      title: 'GSTIN',
      width: 150,
      sortable: true,
      resizable: true,
      render: (partner) => (
        <Text size="sm" ff="monospace">{partner.gstin || '—'}</Text>
      ),
    },
    {
      accessor: 'referredCustomersCount',
      title: 'Referrals',
      width: 100,
      sortable: true,
      resizable: true,
      render: (partner) => (
        <Badge variant="filled" color="gray">{partner.referredCustomersCount || 0}</Badge>
      ),
    },
    {
      accessor: 'totalCommissionAmount',
      title: 'Total Commission',
      width: 150,
      hidden: !canViewFinancial,
      sortable: true,
      resizable: true,
      render: (partner) => (
        <MoneyDisplay 
          amount={partner.totalCommissionAmount || 0} 
          currencyCode="INR"
          color="green"
        />
      ),
    },
    {
      accessor: 'activeStatus',
      title: 'Status',
      width: 100,
      sortable: true,
      resizable: true,
      render: (partner) => (
        <Badge 
          color={partner.activeStatus ? 'green' : 'gray'} 
          variant="light"
        >
          {partner.activeStatus ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessor: 'actions',
      title: '',
      width: 50,
      sortable: false,
      toggleable: false,
      resizable: false,
      render: (partner) => (
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
                navigate(`/partners/${partner.id}`);
              }}
            >
              View Details
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/partners/${partner.id}/edit`);
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
                    handleDelete(partner);
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
        title="Partners"
        description="Manage business partners and commission tracking"
        actions={
          <>
            {role !== 'Consultant' && (
              <ExportMenu onExport={handleExport} />
            )}
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={() => navigate('/partners/new')}
            >
              New Partner
            </Button>
          </>
        }
        filters={
          <Card mb="md">
            <Group>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by name, code, PAN, or GSTIN..."
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
          data={paginatedData as Partner[]}
          columns={columns}
          loading={isLoading}
          error={error}
          onRowClick={handleRowClick}
          page={page}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          storeColumnsKey="partners-table"
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          emptyState={{
            title: 'No partners found',
            description: activeFilterCount > 0 || search
              ? 'Try adjusting your filters'
              : 'Add your first partner to start managing referrals and commissions',
            action: !activeFilterCount && !search ? {
              label: 'New Partner',
              onClick: () => navigate('/partners/new')
            } : undefined
          }}
        />
      </ListPageLayout>

      <DetailDrawer
        opened={detailDrawerOpened}
        onClose={() => setDetailDrawerOpened(false)}
        title={selectedItem?.partnerName}
        onFullPageClick={() => selectedItem && navigate(`/partners/${selectedItem.id}`)}
      >
        {selectedItem && <PartnerDetailContent partnerId={selectedItem.id} />}
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
          value={(filters as PartnerFilters).vstnBranchId?.toString() || ''}
          onChange={(value) => setFilters({ ...filters, vstnBranchId: value ? parseInt(value) : undefined })}
          clearable
        />
        
        <Checkbox
          label="Has GSTIN"
          checked={(filters as PartnerFilters).hasGstin || false}
          onChange={(e) => setFilters({ ...filters, hasGstin: e.currentTarget.checked || undefined })}
        />
        
        <Checkbox
          label="Has PAN"
          checked={(filters as PartnerFilters).hasPan || false}
          onChange={(e) => setFilters({ ...filters, hasPan: e.currentTarget.checked || undefined })}
        />
      </FilterDrawer>
    </>
  );
}