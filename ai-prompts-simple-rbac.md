# Simplified RBAC Patterns for UX

## Overview
Simple client-side RBAC patterns focused on improving user experience. The backend handles all actual data security - these patterns just hide/show UI elements to prevent user confusion and errors.

## Advantages of This Approach
1. **Simplicity**: No complex permission logic on the client
2. **Performance**: No client-side data filtering
3. **UX Focus**: Users only see actions they can perform
4. **Backend Authority**: All security is enforced server-side
5. **Less Code**: Minimal client complexity

## Simple Implementation

### Prompt 1: Basic User Role Hook
```
Create a simple hook to get the current user's role for UI decisions:

```tsx
// src/lib/hooks/useUserRole.ts
export function useUserRole() {
  const { user } = useAuth();
  
  return {
    role: user?.role || 'guest',
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isConsultant: user?.role === 'consultant',
    canViewFinancial: user?.role === 'admin' || user?.role === 'manager'
  };
}
```
```

### Prompt 2: Simple Column Configuration
```
Create a simple pattern for hiding financial columns from consultants:

```tsx
// In your list component
const { canViewFinancial } = useUserRole();

// Define columns with simple hidden property
const columns: DataTableColumn<Customer>[] = [
  {
    accessor: 'name',
    title: 'Customer Name',
    render: (record) => <Text>{record.name}</Text>
  },
  {
    accessor: 'revenue',
    title: 'Revenue',
    hidden: !canViewFinancial, // Simply hide for consultants
    render: (record) => <MoneyDisplay amount={record.revenue} />
  },
  {
    accessor: 'profitMargin',
    title: 'Profit Margin',
    hidden: !canViewFinancial, // Another financial column
    render: (record) => <Text>{record.profitMargin}%</Text>
  }
];
```
```

### Prompt 3: Simple UI Visibility Components
```
Create simple components to show/hide UI based on roles:

```tsx
// src/components/ui/RoleVisibility.tsx
import { useUserRole } from '@/lib/hooks/useUserRole';

// Show content only for specific roles
export function ShowForRoles({ 
  roles, 
  children 
}: { 
  roles: string[]; 
  children: React.ReactNode;
}) {
  const { role } = useUserRole();
  
  if (!roles.includes(role)) {
    return null;
  }
  
  return <>{children}</>;
}

// Hide financial data from consultants
export function FinancialData({ 
  children,
  fallback = '—' 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { canViewFinancial } = useUserRole();
  
  if (!canViewFinancial) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Usage:
<ShowForRoles roles={['admin', 'manager']}>
  <Button>Export All Data</Button>
</ShowForRoles>

<FinancialData fallback="Hidden">
  <Text>${record.revenue}</Text>
</FinancialData>
```
```

### Prompt 4: Simple Action Visibility
```
Create a pattern for showing/hiding actions based on roles:

```tsx
// In your list component
const { role } = useUserRole();

// Simple action visibility
const rowActions = (record: Customer) => {
  const actions = [
    {
      label: 'View',
      icon: <IconEye />,
      onClick: () => navigate(`/customers/${record.id}`),
      visible: true // Everyone can view
    },
    {
      label: 'Edit',
      icon: <IconEdit />,
      onClick: () => navigate(`/customers/${record.id}/edit`),
      visible: true // Let backend handle if they can actually edit
    },
    {
      label: 'Delete',
      icon: <IconTrash />,
      onClick: () => handleDelete(record),
      visible: role !== 'consultant', // Hide confusing actions
      color: 'red'
    }
  ];

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="subtle">
          <IconDots />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {actions
          .filter(action => action.visible)
          .map(action => (
            <Menu.Item
              key={action.label}
              leftSection={action.icon}
              onClick={action.onClick}
              color={action.color}
            >
              {action.label}
            </Menu.Item>
          ))}
      </Menu.Dropdown>
    </Menu>
  );
};
```
```

### Prompt 5: Complete Simple List Page Example
```
Create a complete list page with simple role-based UI:

```tsx
import { DataTable } from 'mantine-datatable';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { ShowForRoles, FinancialData } from '@/components/ui/RoleVisibility';

export function CustomerList() {
  const { canViewFinancial, role } = useUserRole();
  const { data: customers = [], isLoading } = useGetCustomers();
  
  // Simple columns with financial hiding
  const columns: DataTableColumn<Customer>[] = [
    {
      accessor: 'name',
      title: 'Customer',
      render: (record) => (
        <Group>
          <Avatar>{record.name[0]}</Avatar>
          <Text>{record.name}</Text>
        </Group>
      )
    },
    {
      accessor: 'type',
      title: 'Type',
      render: (record) => <Badge>{record.type}</Badge>
    },
    {
      accessor: 'revenue',
      title: 'Revenue',
      hidden: !canViewFinancial, // Hide from consultants
      render: (record) => <MoneyDisplay amount={record.revenue} />
    },
    {
      accessor: 'actions',
      title: '',
      render: (record) => (
        <Menu>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item 
              leftSection={<IconEye />}
              onClick={() => navigate(`/customers/${record.id}`)}
            >
              View
            </Menu.Item>
            <Menu.Item 
              leftSection={<IconEdit />}
              onClick={() => navigate(`/customers/${record.id}/edit`)}
            >
              Edit
            </Menu.Item>
            {role !== 'consultant' && (
              <>
                <Menu.Divider />
                <Menu.Item 
                  color="red"
                  leftSection={<IconTrash />}
                  onClick={() => handleDelete(record)}
                >
                  Delete
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      )
    }
  ];
  
  return (
    <Stack>
      {/* Header */}
      <Group justify="space-between">
        <Title>Customers</Title>
        <Group>
          <ShowForRoles roles={['admin', 'manager']}>
            <Button variant="default" leftSection={<IconDownload />}>
              Export
            </Button>
          </ShowForRoles>
          <Button leftSection={<IconPlus />}>
            New Customer
          </Button>
        </Group>
      </Group>
      
      {/* Simple search */}
      <TextInput
        placeholder="Search customers..."
        leftSection={<IconSearch />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      {/* Data table */}
      <DataTable
        records={filteredCustomers}
        columns={columns}
        fetching={isLoading}
        highlightOnHover
        onRowClick={(record) => setSelectedCustomer(record)}
      />
    </Stack>
  );
}
```
```

### Prompt 6: Simple Export Pattern
```
Create a simple export pattern that respects role-based UI:

```tsx
// Simple export that only shows for appropriate roles
export function ExportButton({ data, filename }: ExportButtonProps) {
  const { role } = useUserRole();
  
  // Don't show export for consultants
  if (role === 'consultant') {
    return null;
  }
  
  const handleExport = (format: 'csv' | 'excel') => {
    // Simple export - backend will filter data appropriately
    if (format === 'csv') {
      // Export whatever data the backend sent
      exportToCSV(data, filename);
    } else {
      exportToExcel(data, filename);
    }
  };
  
  return (
    <Menu>
      <Menu.Target>
        <Button variant="default" leftSection={<IconDownload />}>
          Export
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => handleExport('csv')}>
          Export as CSV
        </Menu.Item>
        <Menu.Item onClick={() => handleExport('excel')}>
          Export as Excel
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
```
```

## Key Principles

1. **Backend Handles Security**: The client just improves UX
2. **Simple Role Checks**: Just check user.role, no complex logic
3. **Hide Confusing Options**: If consultants can't delete, don't show the button
4. **Trust Backend Data**: Display whatever data the backend sends
5. **No Client Filtering**: Backend sends only what user can see

## Benefits

- **Less Code**: No complex permission logic
- **Better Performance**: No client-side filtering
- **Clear UX**: Users only see what they can do
- **Easy Testing**: Just test role-based UI visibility
- **Backend Authority**: Security stays where it belongs

## Usage Example

```tsx
// Super simple list page
export function SimpleListPage() {
  const { canViewFinancial, role } = useUserRole();
  const { data, isLoading } = useGetData(); // Backend filters data
  
  return (
    <div>
      {/* Only show what makes sense for the user */}
      <ShowForRoles roles={['admin', 'manager']}>
        <ExportButton data={data} />
      </ShowForRoles>
      
      <DataTable
        records={data}
        columns={columns.filter(col => !col.hidden)}
      />
    </div>
  );
}
```