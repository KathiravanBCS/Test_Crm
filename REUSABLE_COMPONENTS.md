# Reusable Components for VSTN CRM

## Overview
This document describes the enhanced reusable components for building professional, feature-rich list pages and data management interfaces in the CRM application. These components provide advanced features like column management, bulk actions, context menus, and sophisticated filtering while maintaining a clean, professional UX.

## 1. Entity Selector Components

### EmployeePicker
- Used in: Task assignment, approvals, payroll, leave management
- Features: Search, role filtering, status filtering, multi-select option
- Props: `multiple`, `roleFilter`, `excludeInactive`, `onChange`

### CustomerPicker
- Used in: Proposals, engagement letters, invoices, tasks
- Features: Search, type filtering, partner filtering
- Props: `customerTypeFilter`, `partnerFilter`, `onChange`

### PartnerPicker
- Used in: Customer creation (for referred/managed), commission tracking
- Features: Search, active/inactive filtering
- Props: `excludeInactive`, `onChange`

### ServicePicker
- Used in: Proposal service items, engagement letter items
- Features: Search, category filtering, rate display
- Props: `categoryFilter`, `showRates`, `multiple`, `onChange`

### StatusPicker
- Used in: All workflow entities (proposals, tasks, invoices, etc.)
- Features: Context-based filtering, sequence ordering
- Props: `context`, `currentStatus`, `onChange`

## 2. Display Components

### StatusBadge
- Used in: All lists and details showing status
- Features: Color coding, final status indication
- Props: `status`, `context`, `size`

### MoneyDisplay
- Used in: Invoices, proposals, financial displays
- Features: Currency symbol, formatting, INR conversion display
- Props: `amount`, `currencyCode`, `showInr`, `format`

### ContactPersonCard
- Used in: Customer details, partner details
- Features: Contact info display, actions (email, call)
- Props: `contact`, `onEdit`, `onDelete`

### DateRangeDisplay
- Used in: Engagement phases, leave cycles, project timelines
- Features: Relative time, duration display
- Props: `startDate`, `endDate`, `format`

## 3. Form Components

### PanInput
- Used in: Customer, partner, employee forms
- Features: PAN validation, formatting
- Props: Standard form input props

### GstinInput
- Used in: Customer, partner forms
- Features: GSTIN validation, state code extraction
- Props: Standard form input props

### BankDetailsInput
- Used in: Employee, partner forms
- Features: IFSC validation, bank name lookup
- Props: `showIfsc`, `showAccountNumber`

### CurrencyAmountInput
- Used in: Proposals, invoices, financial forms
- Features: Currency selection, amount input, exchange rate
- Props: `currencies`, `baseCurrency`, `showExchangeRate`

### AddressFormFields
- Used in: Customer, employee forms
- Features: Address, city, state, pincode fields
- Props: `prefix`, `required`

## 4. Enhanced List Components

### ListTable
Enhanced data table with professional styling, row actions, bulk selection, and column management.

**Features:**
- Professional row hover effects with visual feedback
- Integrated row action menus
- Bulk row selection support
- Sticky header option
- Customizable styling
- Context menu support
- Column resizing and reordering
- Sortable columns

**Props:**
```tsx
interface ListTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  error?: Error | null;
  onRowClick?: (record: T) => void;
  emptyState?: EmptyState;
  page: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  sortable?: boolean;
  storeColumnsKey?: string;
  rowActions?: RowAction<T>[];
  selectedRecords?: T[];
  onSelectedRecordsChange?: (records: T[]) => void;
  highlightOnHover?: boolean;
  withBorder?: boolean;
  withColumnBorders?: boolean;
  striped?: boolean;
  stickyHeader?: boolean;
  minHeight?: number | string;
}
```

### Enhanced FilterDrawer
Advanced filtering drawer with integrated column management.

**Features:**
- Tabbed interface for filters and columns
- Column visibility management
- Drag-and-drop column reordering
- Better visual design with smooth animations
- Integrated with ColumnSelector component
- Filter count badges
- Clear all filters functionality

**Props:**
```tsx
interface FilterDrawerProps {
  opened: boolean;
  onClose: () => void;
  onReset: () => void;
  filterCount: number;
  children: ReactNode;
  columns?: ColumnDefinition[];
  visibleColumns?: string[];
  onColumnVisibilityChange?: (columns: string[]) => void;
  onColumnReorder?: (columns: string[]) => void;
  defaultTab?: 'filters' | 'columns';
}
```

### ColumnSelector
Powerful column management component with search and drag-and-drop.

**Features:**
- Toggle column visibility
- Search columns by name
- Drag-and-drop reordering
- Reset to defaults
- Show/hide all columns
- Column descriptions support
- Always visible columns

**Props:**
```tsx
interface ColumnDefinition {
  accessor: string;
  title: string;
  defaultVisible?: boolean;
  alwaysVisible?: boolean;
  description?: string;
}
```

### BulkActions
Floating action bar for handling multiple selected rows.

**Features:**
- Smooth slide-in animation
- Configurable actions with icons
- Confirmation dialogs
- Clear selection button
- Sticky positioning

**Props:**
```tsx
interface BulkAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  color?: string;
  variant?: 'filled' | 'light' | 'outline' | 'subtle';
  confirmMessage?: string;
  disabled?: boolean;
}
```

### RowContextMenu
Right-click context menu for table rows.

**Features:**
- Right-click to open
- Positioned at cursor
- Auto-close on scroll/click
- Conditional menu items
- Divider support

### Enhanced useListPageState Hook
Comprehensive state management for list pages with column persistence.

**Features:**
- Search with debouncing
- Advanced filtering
- Pagination
- Column visibility persistence
- Column order persistence
- Bulk selection management
- Local storage integration
- Reset all functionality

**Returns:**
```tsx
{
  // Search
  search: string;
  setSearch: (value: string) => void;
  
  // Filters
  filters: Record<string, unknown>;
  setFilters: (filters: Record<string, unknown>) => void;
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
  
  // Column management
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  columnOrder: string[];
  setColumnOrder: (columns: string[]) => void;
  
  // Selected records
  selectedRecords: T[];
  setSelectedRecords: (records: T[]) => void;
  clearSelection: () => void;
  
  // Utilities
  resetFilters: () => void;
  resetAll: () => void;
}
```

### ListPageLayout
- Used in: All list pages
- Features: Standardized layout with header, filters, and content areas
- Props: `title`, `description`, `actions`, `filters`, `children`

### EmptyState
- Used in: All lists and detail views
- Features: Icon, message, action button
- Props: `icon`, `title`, `description`, `action`

## 5. Action Components

### ConfirmDialog
- Used in: Delete operations, status changes
- Features: Title, message, danger styling
- Props: `title`, `message`, `confirmText`, `onConfirm`, `danger`

### ActionMenu
- Used in: Row actions, detail page actions
- Features: Icon buttons, dropdown menu
- Props: `actions`, `size`, `position`

### QuickActions
- Used in: Floating action buttons
- Features: Primary action, secondary actions
- Props: `primaryAction`, `secondaryActions`

## 6. Navigation Components

### Breadcrumbs
- Used in: All detail pages
- Features: Auto-generation from route, custom items
- Props: `items`, `maxItems`

### TabNavigation
- Used in: Detail pages with multiple sections
- Features: Tab counts, lazy loading
- Props: `tabs`, `defaultTab`, `onChange`

### StepIndicator
- Used in: Multi-step forms (proposals, engagement letters)
- Features: Step status, clickable navigation
- Props: `steps`, `currentStep`, `onStepClick`

## 7. Data Display Components

### TimelineDisplay
- Used in: Proposal history, task activity
- Features: Vertical timeline, icons, timestamps
- Props: `items`, `orientation`, `showConnector`

### StatCard
- Used in: Dashboards, analytics sections
- Features: Title, value, change indicator, icon
- Props: `title`, `value`, `change`, `icon`, `format`

### ProgressIndicator
- Used in: Engagement progress, task completion
- Features: Percentage, label, color coding
- Props: `value`, `max`, `label`, `color`

## 8. Integration Components

### DocumentLink
- Used in: All document references
- Features: SharePoint/OneDrive icon, file info, click to open
- Props: `document`, `showSize`, `showUploader`

### EmailThreadViewer
- Used in: Customer/proposal email history
- Features: Thread display, attachment indicators
- Props: `emails`, `entityType`, `entityId`

### CommentThread
- Used in: All entities supporting comments
- Features: Nested replies, user avatars, timestamps
- Props: `entityType`, `entityId`, `allowReplies`

## 9. Export Components

### ExportButton
- Used in: All list views
- Features: Format selection (CSV, Excel, PDF), field selection
- Props: `data`, `columns`, `filename`, `formats`

### PrintPreview
- Used in: Proposals, invoices, reports
- Features: Print layout, page breaks, headers/footers
- Props: `content`, `title`, `orientation`

## 10. Utility Components

### ErrorBoundary
- Used in: Wrapping all features
- Features: Error display, retry action, error reporting
- Props: `fallback`, `onError`

### LoadingOverlay
- Used in: Forms, data operations
- Features: Spinner, message, backdrop
- Props: `loading`, `message`, `fullScreen`

### NotificationToast
- Used in: Global notifications
- Features: Success/error/info types, auto-dismiss
- Props: `type`, `message`, `duration`, `action`

## Usage Example with All Enhanced Features

```tsx
import { useGetCustomers } from '../api/useGetCustomers';
import { useListPageState } from '@/lib/hooks/useListPageState';
import { ListPageLayout, FilterDrawer, DetailDrawer, ExportMenu } from '@/components/list-page';
import { ListTable, BulkActions, RowContextMenu } from '@/components/tables';
import { SearchInput } from '@/components/forms/inputs/SearchInput';
import { FilterTrigger } from '@/components/list-page/FilterDrawer';

const columns: ColumnDefinition[] = [
  { accessor: 'id', title: 'ID', alwaysVisible: true },
  { accessor: 'name', title: 'Customer Name' },
  { accessor: 'email', title: 'Email' },
  { accessor: 'phone', title: 'Phone', defaultVisible: false },
  { accessor: 'revenue', title: 'Revenue', description: 'Total revenue from customer' },
  { accessor: 'status', title: 'Status' }
];

export function CustomerList() {
  const { data: customers = [], isLoading, error } = useGetCustomers();
  const listState = useListPageState({
    data: customers,
    searchFields: ['name', 'email', 'phone'],
    columns,
    storageKey: 'customers-list'
  });

  // Define row actions
  const rowActions = [
    {
      label: 'View Details',
      icon: <IconEye size={16} />,
      onClick: (record) => handleViewDetails(record)
    },
    {
      label: 'Edit',
      icon: <IconEdit size={16} />,
      onClick: (record) => navigate(`/customers/${record.id}/edit`)
    },
    {
      label: 'Delete',
      icon: <IconTrash size={16} />,
      color: 'red',
      onClick: (record) => handleDelete(record.id),
      confirmMessage: 'Are you sure you want to delete this customer?'
    }
  ];

  return (
    <ListPageLayout
      title="Customers"
      description="Manage your customer relationships"
      actions={
        <>
          <ExportMenu onExport={handleExport} />
          <Button leftSection={<IconPlus />}>New Customer</Button>
        </>
      }
      filters={
        <Card>
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
      }
    >
      <ListTable
        data={listState.paginatedData}
        columns={columns.filter(col => listState.visibleColumns.includes(col.accessor))}
        loading={isLoading}
        error={error}
        onRowClick={listState.handleRowClick}
        page={listState.page}
        pageSize={listState.pageSize}
        totalRecords={listState.totalRecords}
        onPageChange={listState.setPage}
        onPageSizeChange={listState.setPageSize}
        rowActions={rowActions}
        selectedRecords={listState.selectedRecords}
        onSelectedRecordsChange={listState.setSelectedRecords}
      />
      
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
        {/* Filter fields */}
      </FilterDrawer>
    </ListPageLayout>
  );
}
```

## Key Improvements

### Professional UX Enhancements
1. **Row Hover Effects**: Smooth transitions with visual indicators (shadow, transform, border)
2. **Column Management**: Drag-and-drop reordering, visibility toggle, search
3. **Advanced Filtering**: Tabbed interface combining filters and column management
4. **Bulk Actions**: Floating action bar with smooth animations
5. **Context Menus**: Right-click support for quick actions
6. **Professional Styling**: Enhanced headers, borders, spacing, and typography

### Developer Experience
1. **Type Safety**: Full TypeScript support with generics
2. **State Persistence**: User preferences saved to local storage
3. **Composable Architecture**: Mix and match components as needed
4. **Performance**: Built-in memoization and optimizations
5. **Accessibility**: ARIA labels, keyboard navigation, focus management

### Required Dependencies
```json
{
  "@hello-pangea/dnd": "^17.0.0",  // For drag-and-drop
  "@mantine/core": "^8.1.2",
  "@mantine/hooks": "^8.1.2",
  "mantine-datatable": "^8.1.2",
  "@tabler/icons-react": "^3.34.0"
}
```

## Implementation Status
✅ **Completed:**
- ListTable with enhanced styling and features
- FilterDrawer with column management
- ColumnSelector with drag-and-drop
- BulkActions component
- RowContextMenu component
- Enhanced useListPageState hook
- Professional FilterTrigger button

🔲 **Still Available from Original List:**
All other components from sections 1-3 and 5-10 remain as specified in the original document.