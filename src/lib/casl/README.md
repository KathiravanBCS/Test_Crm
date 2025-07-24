# CASL Authorization Guide

## Overview

This guide explains how to use CASL for Role-Based Access Control (RBAC) in the VSTN CRM application.

## Setup

The CASL configuration is already integrated into the application. The main components are:

1. **AbilityProvider**: Wraps the app and provides permissions context
2. **Ability Types**: Define actions and subjects
3. **Permission Rules**: Define what each role can do
4. **Components & Hooks**: Easy-to-use permission checks

## Employee Roles & Default Permissions

### Admin
- Full access to everything (`manage all`)

### Manager
- Full CRUD on: Customers, Partners, Proposals, Engagement Letters, Invoices, Tasks
- Can approve proposals and tasks
- Can process payments
- Can view financial data
- Can perform bulk actions
- Read-only access to employee profiles (except own)
- Can approve leave requests

### Consultant
- Read-only access to Customers and Partners
- Can create proposals and tasks
- Can update own proposals and assigned tasks
- Limited invoice access (no financial data)
- Can only manage own profile and leave requests

## Usage Examples

### 1. Component-Level Permissions

```tsx
import { Can, ProtectedComponent } from '@/lib/casl/components';

// Simple permission check
<Can I="create" a="Customer">
  <Button>New Customer</Button>
</Can>

// With fallback
<Can I="delete" a={customer} fallback={<Text>Cannot delete</Text>}>
  <Button color="red">Delete</Button>
</Can>

// Protected component with error message
<ProtectedComponent action="update" subject={proposal}>
  <ProposalForm proposal={proposal} />
</ProtectedComponent>
```

### 2. Using Hooks

```tsx
import { usePermissions, useEntityPermissions } from '@/lib/casl/hooks';

function CustomerDetail({ customer }) {
  const permissions = useEntityPermissions(customer, 'Customer');
  
  return (
    <div>
      {permissions.canUpdate && <Button>Edit</Button>}
      {permissions.canDelete && <Button color="red">Delete</Button>}
      {permissions.canViewFinancial && <FinancialInfo />}
    </div>
  );
}
```

### 3. List View Permissions

```tsx
import { useListPermissions } from '@/lib/casl/hooks';

function CustomerList() {
  const permissions = useListPermissions('Customer');
  
  return (
    <>
      {permissions.canCreate && (
        <Button onClick={handleCreate}>New Customer</Button>
      )}
      
      <DataTable
        data={customers}
        showBulkActions={permissions.canBulkAction}
        showExport={permissions.canExport}
      />
    </>
  );
}
```

### 4. Form Field Permissions

```tsx
import { useFormPermissions, FieldPermission } from '@/lib/casl/hooks';

function CustomerForm({ customer, mode }) {
  const { canSubmit, canEditField } = useFormPermissions(customer, 'Customer', mode);
  
  return (
    <form>
      <TextInput
        label="Name"
        disabled={!canEditField('name')}
      />
      
      <FieldPermission entity={customer} field="pan" action="update">
        {(hasPermission) => (
          <TextInput
            label="PAN"
            disabled={!hasPermission}
          />
        )}
      </FieldPermission>
      
      <Button type="submit" disabled={!canSubmit}>
        Save
      </Button>
    </form>
  );
}
```

### 5. Financial Data Protection

```tsx
import { FinancialDataPermission } from '@/lib/casl/components';

function InvoiceCard({ invoice }) {
  return (
    <Card>
      <Text>Invoice #{invoice.invoiceNumber}</Text>
      
      <FinancialDataPermission subject="Invoice">
        <Text size="xl">₹{invoice.amount}</Text>
      </FinancialDataPermission>
      
      <Can I="pay" a={invoice}>
        <Button>Process Payment</Button>
      </Can>
    </Card>
  );
}
```

### 6. Bulk Actions

```tsx
import { BulkActionPermission } from '@/lib/casl/components';

function CustomerTable({ customers }) {
  return (
    <DataTable
      data={customers}
      bulkActions={
        <BulkActionPermission subject="Customer">
          <Button.Group>
            <Button>Export Selected</Button>
            <Button color="red">Delete Selected</Button>
          </Button.Group>
        </BulkActionPermission>
      }
    />
  );
}
```

### 7. Conditional Rendering Based on Role

```tsx
import { useCurrentUserPermissions } from '@/lib/casl/hooks';

function NavigationMenu() {
  const permissions = useCurrentUserPermissions();
  
  return (
    <nav>
      {permissions.customers.read && <Link to="/customers">Customers</Link>}
      {permissions.proposals.create && <Link to="/proposals/new">New Proposal</Link>}
      {permissions.invoices.viewFinancial && <Link to="/reports/financial">Financial Reports</Link>}
      {permissions.employees.viewPayroll && <Link to="/payroll">Payroll</Link>}
    </nav>
  );
}
```

## Backend Integration

The system attempts to fetch permissions from the backend API first:

```typescript
// Expected backend response format
{
  "userId": 123,
  "role": "Manager",
  "rules": [
    {
      "action": ["read", "update"],
      "subject": "Proposal",
      "conditions": { "assignedTo": 123 }
    }
  ]
}
```

If the backend is unavailable, it falls back to default role-based permissions.

## Best Practices

1. **Always check permissions in UI**: Hide/disable elements users can't access
2. **Use specific subjects**: Check permissions on actual instances when possible
3. **Handle loading states**: Permissions are async, show loaders while checking
4. **Provide fallbacks**: Always show meaningful messages for denied access
5. **Check field-level permissions**: For sensitive data like financial information
6. **Test all roles**: Ensure each role has appropriate access

## Adding Custom Permissions

To add custom permissions for specific users:

1. Backend returns custom rules in the permissions API
2. Rules are automatically applied by the AbilityProvider
3. Custom rules override default role-based rules

Example custom rule:
```json
{
  "action": "update",
  "subject": "Customer",
  "conditions": { "partnerId": 5 },
  "fields": ["name", "email"]
}
```

This allows updating only name and email fields for customers with partnerId = 5.