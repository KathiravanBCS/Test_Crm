import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Group, Select, Text, Avatar, ActionIcon, Menu, Badge, NumberInput } from '@mantine/core';
import { DateField } from '@/components/forms/inputs/DateField';
import { IconPlus, IconEdit, IconEye, IconTrash, IconDots, IconBriefcase, IconAlertCircle } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { DataTableColumn } from 'mantine-datatable';
import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { ListTable } from '@/components/tables/ListTable';
import { SearchInput } from '@/components/forms/inputs/SearchInput';
import { FilterDrawer } from '@/components/list-page/FilterDrawer';
import { FilterTrigger } from '@/components/list-page/FilterDrawer';
import { DetailDrawer } from '@/components/list-page/DetailDrawer';
import { ExportMenu } from '@/components/list-page/ExportMenu';
import { StatusBadge } from '@/components/display/StatusBadge';
import { useListPageState } from '@/lib/hooks/useListPageState';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useGetBranches } from '@/lib/hooks/useGetBranches';
import { useGetEngagements } from '../api/useGetEngagements';
import { exportToCSV, exportToExcel } from '@/lib/utils/export';
import { toApiDate, formatDate as formatDateUtil, getDaysDifference } from '@/lib/utils/date';
import { EngagementDetailContent } from './EngagementDetailContent';
import { SelectEngagementLetterModal } from './SelectEngagementLetterModal';
import type { Engagement, EngagementFilters } from '../types';
import { ColumnDefinition } from '@/components/tables/ColumnSelector';

export function EngagementList() {
  const navigate = useNavigate();
  const { role } = useUserRole();
  const { data: engagements = [], isLoading, error } = useGetEngagements();
  const { data: branches = [] } = useGetBranches();
  const [selectLetterModalOpened, setSelectLetterModalOpened] = useState(false);

  // Define columns for column selector
  const columnDefinitions: ColumnDefinition[] = [
    { accessor: 'engagementCode', title: 'Engagement Code', defaultVisible: true },
    { accessor: 'engagementName', title: 'Engagement Name', alwaysVisible: true },
    { accessor: 'customer', title: 'Customer', defaultVisible: true },
    { accessor: 'status', title: 'Status', defaultVisible: true },
    { accessor: 'progress', title: 'Progress', defaultVisible: true },
    { accessor: 'scheduleVariance', title: 'Schedule Variance', defaultVisible: true },
    { accessor: 'endDate', title: 'End Date', defaultVisible: true },
    { accessor: 'manager', title: 'Manager', defaultVisible: false },
    { accessor: 'startDate', title: 'Start Date', defaultVisible: false },
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
  } = useListPageState<Engagement>({
    data: engagements,
    searchFields: ['engagementName', 'engagementCode'],
    columns: columnDefinitions,
    storageKey: 'engagements-list'
  });

  const handleDelete = (engagement: Engagement) => {
    modals.openConfirmModal({
      title: 'Delete Engagement',
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{engagement.engagementName}</strong>? 
          This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        // Delete mutation would go here
        console.log('Delete engagement:', engagement.id);
      },
    });
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    const exportData = (filteredData as unknown as Engagement[]).map(engagement => {
      const customerName = engagement.customer?.customerName || engagement.partner?.partnerName || '—';
      const partnerName = engagement.partner?.partnerName || '';
      const branchId = engagement.customer?.vstnBranchId || engagement.partner?.vstnBranchId;
      const branch = branches.find(b => b.id === branchId);
      
      return {
        'Engagement Code': engagement.engagementCode,
        'Engagement Name': engagement.engagementName,
        'Customer': customerName,
        'Partner': partnerName,
        'Branch': branch?.branchName || '—',
        'Status': engagement.status?.statusName || '—',
        'Progress (%)': engagement.progressPercentage || 0,
        'Schedule Variance (days)': engagement.scheduleVariance || 0,
        'Start Date': formatDateUtil(engagement.startDate),
        'End Date': formatDateUtil(engagement.endDate),
        'Manager': engagement.manager ? engagement.manager.name : '—',
      };
    });

    const filename = `engagements-${toApiDate(new Date())}`;
    
    if (format === 'csv') {
      exportToCSV(exportData, filename);
    } else {
      exportToExcel(exportData, filename);
    }
  };

  // Calculate schedule variance for display
  const getScheduleVarianceDisplay = (engagement: Engagement) => {
    const variance = engagement.scheduleVariance || 0;
    if (variance === 0) return { text: 'On Track', color: 'green' };
    if (variance > 0) return { text: `${variance} days late`, color: 'red' };
    return { text: `${Math.abs(variance)} days early`, color: 'blue' };
  };

  // Define all columns for the table
  const allColumns: DataTableColumn<Engagement>[] = [
    {
      accessor: 'engagementCode',
      title: 'Engagement Code',
      width: 150,
      sortable: true,
      resizable: true,
      render: (engagement) => (
        <Text size="sm" fw={500}>{engagement.engagementCode}</Text>
      ),
    },
    {
      accessor: 'engagementName',
      title: 'Engagement Name',
      sortable: true,
      resizable: true,
      render: (engagement) => (
        <Group gap="sm">
          <Avatar size="sm" radius="xl" color="indigo">
            <IconBriefcase size={16} />
          </Avatar>
          <div>
            <Text size="sm" fw={500}>{engagement.engagementName}</Text>
            <Text size="xs" c="dimmed">
              From: {engagement.engagementLetter?.engagementLetterCode || 'N/A'}
            </Text>
          </div>
        </Group>
      ),
    },
    {
      accessor: 'customer',
      title: 'Customer',
      width: 250,
      sortable: true,
      resizable: true,
      render: (engagement) => {
        const customerName = engagement.customer?.customerName || engagement.partner?.partnerName || '—';
        const partnerName = engagement.partner?.partnerName;
        const branchId = engagement.customer?.vstnBranchId || engagement.partner?.vstnBranchId;
        const branch = branches.find(b => b.id === branchId);
        
        return (
          <div>
            <Text size="sm" fw={500}>{customerName}</Text>
            {partnerName && (
              <Text size="xs" c="dimmed">Partner: {partnerName}</Text>
            )}
            {branch && (
              <Text size="xs" c="dimmed">{branch.branchName}</Text>
            )}
          </div>
        );
      },
    },
    {
      accessor: 'status',
      title: 'Status',
      width: 140,
      sortable: true,
      resizable: true,
      render: (engagement) => engagement.status && (
        <StatusBadge 
          status={{
            statusCode: engagement.status.statusCode,
            statusName: engagement.status.statusName
          }} 
        />
      ),
    },
    {
      accessor: 'progress',
      title: 'Progress',
      width: 120,
      sortable: true,
      resizable: true,
      render: (engagement) => (
        <Group gap="xs">
          <Text size="sm" fw={500}>
            {engagement.progressPercentage || 0}%
          </Text>
          <div style={{ flex: 1, height: 6, backgroundColor: 'var(--mantine-color-gray-2)', borderRadius: 3 }}>
            <div 
              style={{ 
                width: `${engagement.progressPercentage || 0}%`, 
                height: '100%', 
                backgroundColor: 
                  engagement.progressPercentage >= 80 ? 'var(--mantine-color-green-6)' :
                  engagement.progressPercentage >= 50 ? 'var(--mantine-color-blue-6)' :
                  engagement.progressPercentage >= 30 ? 'var(--mantine-color-yellow-6)' :
                  'var(--mantine-color-red-6)',
                borderRadius: 3,
                transition: 'width 0.3s ease'
              }} 
            />
          </div>
        </Group>
      ),
    },
    {
      accessor: 'scheduleVariance',
      title: 'Schedule Variance',
      width: 150,
      sortable: true,
      resizable: true,
      render: (engagement) => {
        const { text, color } = getScheduleVarianceDisplay(engagement);
        return (
          <Badge 
            variant="light" 
            color={color}
            leftSection={engagement.isDelayed ? <IconAlertCircle size={14} /> : null}
          >
            {text}
          </Badge>
        );
      },
    },
    {
      accessor: 'endDate',
      title: 'End Date',
      width: 120,
      sortable: true,
      resizable: true,
      render: (engagement) => (
        <div>
          <Text size="sm">
            {formatDateUtil(engagement.endDate)}
          </Text>
          {engagement.endDate && (
            <Text size="xs" c="dimmed">
              {(() => {
                const daysLeft = getDaysDifference(new Date(), new Date(engagement.endDate));
                if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`;
                if (daysLeft === 0) return 'Due today';
                return `${daysLeft} days left`;
              })()}
            </Text>
          )}
        </div>
      ),
    },
    {
      accessor: 'manager',
      title: 'Manager',
      width: 150,
      sortable: true,
      resizable: true,
      render: (engagement) => (
        <Text size="sm">
          {engagement.manager ? engagement.manager.name : '—'}
        </Text>
      ),
    },
    {
      accessor: 'startDate',
      title: 'Start Date',
      width: 120,
      sortable: true,
      resizable: true,
      render: (engagement) => (
        <Text size="sm">
          {formatDateUtil(engagement.startDate)}
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
      render: (engagement) => (
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
                navigate(`/engagements/${engagement.id}`);
              }}
            >
              View Details
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/engagements/${engagement.id}/edit`);
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
                    handleDelete(engagement);
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
        title="Engagements"
        description="Manage ongoing client engagements and track progress"
        actions={
          <>
            {role !== 'Consultant' && (
              <ExportMenu onExport={handleExport} />
            )}
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={() => setSelectLetterModalOpened(true)}
            >
              New Engagement
            </Button>
          </>
        }
        filters={
          <Card mb="md">
            <Group>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by engagement name or code..."
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
          data={paginatedData as Engagement[]}
          columns={columns}
          loading={isLoading}
          error={error}
          onRowClick={handleRowClick}
          page={page}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          storeColumnsKey="engagements-table"
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          emptyState={{
            title: 'No engagements found',
            description: activeFilterCount > 0 || search
              ? 'Try adjusting your filters'
              : 'Create your first engagement to get started',
            action: !activeFilterCount && !search ? {
              label: 'New Engagement',
              onClick: () => navigate('/engagements/new')
            } : undefined
          }}
        />
      </ListPageLayout>

      <DetailDrawer
        opened={detailDrawerOpened}
        onClose={() => setDetailDrawerOpened(false)}
        title={selectedItem?.engagementName}
        onFullPageClick={() => selectedItem && navigate(`/engagements/${selectedItem.id}`)}
      >
        {selectedItem && <EngagementDetailContent engagementId={selectedItem.id} />}
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
          label="Status"
          placeholder="All statuses"
          data={[
            { value: '9', label: 'Not Started' },
            { value: '10', label: 'In Progress' },
            { value: '11', label: 'Completed' },
            { value: '12', label: 'On Hold' }
          ]}
          value={(filters as EngagementFilters).statusId?.toString() || ''}
          onChange={(value) => setFilters({ ...filters, statusId: value ? parseInt(value) : undefined })}
          clearable
        />
        
        <Select
          label="Schedule Status"
          placeholder="All"
          data={[
            { value: 'on-track', label: 'On Track' },
            { value: 'delayed', label: 'Delayed' }
          ]}
          value={(filters as EngagementFilters).isDelayed !== undefined ? 
            ((filters as EngagementFilters).isDelayed ? 'delayed' : 'on-track') : ''}
          onChange={(value) => setFilters({ 
            ...filters, 
            isDelayed: value ? value === 'delayed' : undefined 
          })}
          clearable
        />
        
        <DateField
          label="Start Date From"
          placeholder="Select start date"
          value={(filters as EngagementFilters).startDateFrom || null}
          onChange={(value) => setFilters({ ...filters, startDateFrom: value || undefined })}
          clearable
        />
        
        <DateField
          label="Start Date To"
          placeholder="Select end date"
          value={(filters as EngagementFilters).startDateTo || null}
          onChange={(value) => setFilters({ ...filters, startDateTo: value || undefined })}
          clearable
        />
        
        <DateField
          label="End Date From"
          placeholder="Select start date"
          value={(filters as EngagementFilters).endDateFrom || null}
          onChange={(value) => setFilters({ ...filters, endDateFrom: value || undefined })}
          clearable
        />
        
        <DateField
          label="End Date To"
          placeholder="Select end date"
          value={(filters as EngagementFilters).endDateTo || null}
          onChange={(value) => setFilters({ ...filters, endDateTo: value || undefined })}
          clearable
        />
        
        <NumberInput
          label="Min Progress (%)"
          placeholder="0"
          value={(filters as EngagementFilters).progressMin || ''}
          onChange={(value) => setFilters({ ...filters, progressMin: value || undefined })}
          min={0}
          max={100}
        />
        
        <NumberInput
          label="Max Progress (%)"
          placeholder="100"
          value={(filters as EngagementFilters).progressMax || ''}
          onChange={(value) => setFilters({ ...filters, progressMax: value || undefined })}
          min={0}
          max={100}
        />
      </FilterDrawer>

      <SelectEngagementLetterModal
        opened={selectLetterModalOpened}
        onClose={() => setSelectLetterModalOpened(false)}
      />
    </>
  );
}