import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { Card, Center, Group, ActionIcon, Menu, Box } from '@mantine/core';
import { IconDatabaseOff, IconDotsVertical } from '@tabler/icons-react';
import { EmptyState } from '@/components/display/EmptyState';
import { TablePagination } from './TablePagination';
import { ReactNode } from 'react';
import classes from './ListTable.module.css';
import './ListTable.fix.css';

interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (record: T) => void;
  color?: string;
  hidden?: (record: T) => boolean;
}

interface ListTableProps<T extends Record<string, any>> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  error?: Error | null;
  onRowClick?: (record: T) => void;
  emptyState?: {
    title: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  page: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  storeColumnsKey?: string;
  rowActions?: RowAction<T>[];
  selectedRecords?: T[];
  onSelectedRecordsChange?: (records: T[]) => void;
  highlightOnHover?: boolean;
  withBorder?: boolean;
  withColumnBorders?: boolean;
  striped?: boolean;
  minHeight?: number | string;
  sortStatus?: DataTableSortStatus<T>;
  onSortStatusChange?: (status: DataTableSortStatus<T>) => void;
}

const PAGE_SIZES = [10, 25, 50, 100];

export function ListTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  onRowClick,
  emptyState,
  page,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  storeColumnsKey = "vstn-crm-table",
  rowActions,
  selectedRecords,
  onSelectedRecordsChange,
  highlightOnHover = true,
  withBorder = true,
  withColumnBorders = true,
  striped = true,
  minHeight = 400,
  sortStatus,
  onSortStatusChange
}: ListTableProps<T>) {
  // Add actions column if rowActions are provided
  const enhancedColumns = [...columns];
  if (rowActions && rowActions.length > 0) {
    enhancedColumns.push({
      accessor: '_actions',
      title: '',
      width: 50,
      resizable: false,
      sortable: false,
      cellsStyle: () => ({ padding: '8px' }),
      render: (record) => (
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {rowActions
              .filter(action => !action.hidden || !action.hidden(record))
              .map((action, index) => (
                <Menu.Item
                  key={index}
                  leftSection={action.icon}
                  color={action.color}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(record);
                  }}
                >
                  {action.label}
                </Menu.Item>
              ))}
          </Menu.Dropdown>
        </Menu>
      )
    });
  }

  if (error) {
    return (
      <Card withBorder={withBorder}>
        <EmptyState
          icon={<IconDatabaseOff size={48} />}
          title="Error loading data"
          description={error.message}
        />
      </Card>
    );
  }

  // Build base props
  const dataTableProps: any = {
    records: data,
    columns: enhancedColumns,
    idAccessor: "id",
    fetching: loading,
    highlightOnHover,
    striped,
    minHeight,
    // Force empty state to never show by providing a non-renderable element
    emptyState: <></>,
    noRecordsText: '',
    onRowClick: onRowClick ? ({ record, event }: any) => {
      if (event && event.target instanceof HTMLElement) {
        const isActionClick = event.target.closest('button') || event.target.closest('[role="menu"]');
        if (!isActionClick) {
          onRowClick(record);
        }
      }
    } : undefined,
    selectedRecords,
    onSelectedRecordsChange,
    styles: {
      root: { border: 'none' },
      header: { 
        backgroundColor: 'var(--mantine-color-gray-0)',
        borderBottom: '2px solid var(--mantine-color-gray-2)',
        fontWeight: 600,
        userSelect: 'none'
      },
      table: {
        fontSize: 'var(--mantine-font-size-sm)'
      }
    },
    rowStyle: () => ({
      cursor: onRowClick ? 'pointer' : 'default'
    }),
    className: classes.dataTable,
    storeColumnsKey,
    withColumnBorders,
    withTableBorder: false
  };


  // Add sorting props only if both are provided
  if (sortStatus && onSortStatusChange) {
    dataTableProps.sortStatus = sortStatus;
    dataTableProps.onSortStatusChange = onSortStatusChange;
  }

  return (
    <Card withBorder={withBorder} p={0}>
      <Box>
        {data.length === 0 && !loading ? (
          // Show our custom empty state when there's no data
          <EmptyState
            icon={<IconDatabaseOff size={48} />}
            title={emptyState?.title || "No records found"}
            description={emptyState?.description}
            action={emptyState?.action}
          />
        ) : (
          // Show the data table when there's data (or loading)
          <>
            <DataTable {...dataTableProps} />
            {!loading && data.length > 0 && (
              <TablePagination
                page={page}
                totalRecords={totalRecords}
                recordsPerPage={pageSize}
                onPageChange={onPageChange}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={onPageSizeChange}
                loading={loading}
              />
            )}
          </>
        )}
      </Box>
    </Card>
  );
}