import { useCallback, useMemo } from 'react';
import { useAbility } from './AbilityContext';
import { Actions, Subjects } from './types';

// Hook to check multiple permissions at once
export function usePermissions() {
  const { ability } = useAbility();

  const can = useCallback((action: Actions, subject: Subjects | string | any, field?: string) => {
    if (field && typeof subject === 'object') {
      return ability.can(action, subject, field);
    }
    return ability.can(action, subject);
  }, [ability]);

  const cannot = useCallback((action: Actions, subject: Subjects | string | any, field?: string) => {
    if (field && typeof subject === 'object') {
      return ability.cannot(action, subject, field);
    }
    return ability.cannot(action, subject);
  }, [ability]);

  return { can, cannot, ability };
}

// Hook for checking entity-specific permissions
export function useEntityPermissions(entity: any, entityType: string) {
  const { ability } = useAbility();

  return useMemo(() => ({
    canRead: ability.can('read', entity || entityType),
    canCreate: ability.can('create', entityType),
    canUpdate: ability.can('update', entity || entityType),
    canDelete: ability.can('delete', entity || entityType),
    canApprove: ability.can('approve', entity || entityType),
    canExport: ability.can('export', entityType),
    canBulkAction: ability.can('bulk_action', entityType),
    canViewFinancial: ability.can('view_financial', entity || entityType)
  }), [ability, entity, entityType]);
}

// Hook for list view permissions
export function useListPermissions(entityType: string) {
  const { ability } = useAbility();

  return useMemo(() => ({
    canView: ability.can('read', entityType),
    canCreate: ability.can('create', entityType),
    canExport: ability.can('export', entityType),
    canBulkAction: ability.can('bulk_action', entityType),
    canBulkDelete: ability.can('bulk_action', entityType) && ability.can('delete', entityType)
  }), [ability, entityType]);
}

// Hook for form permissions
export function useFormPermissions(entity: any, entityType: string, mode: 'create' | 'edit') {
  const { ability } = useAbility();

  const basePermission = mode === 'create' 
    ? ability.can('create', entityType)
    : ability.can('update', entity || entityType);

  const fieldPermissions = useMemo(() => {
    if (!entity) return {};
    
    const fields = Object.keys(entity);
    const permissions: Record<string, boolean> = {};
    
    fields.forEach(field => {
      permissions[field] = ability.can('update', entity, field);
    });
    
    return permissions;
  }, [ability, entity]);

  return {
    canSubmit: basePermission,
    fieldPermissions,
    canViewField: (field: string) => entity ? ability.can('read', entity, field) : ability.can('read', entityType),
    canEditField: (field: string) => entity ? ability.can('update', entity, field) : ability.can('update', entityType)
  };
}

// Hook for workflow permissions
export function useWorkflowPermissions(entity: any, entityType: string) {
  const { ability } = useAbility();

  return useMemo(() => ({
    canChangeStatus: entity ? ability.can('update', entity, 'statusId') : ability.can('update', entityType),
    canApprove: ability.can('approve', entity || entityType),
    canReject: ability.can('approve', entity || entityType),
    canDelete: ability.can('delete', entity || entityType)
  }), [ability, entity, entityType]);
}

// Hook for financial permissions
export function useFinancialPermissions() {
  const { ability } = useAbility();

  return useMemo(() => ({
    canViewInvoiceAmount: ability.can('view_financial', 'Invoice'),
    canViewPayrollData: ability.can('view_financial', 'Payroll'),
    canProcessPayment: ability.can('pay', 'Invoice'),
    canApproveCommission: ability.can('approve', 'PartnerCommission')
  }), [ability]);
}

// Hook to get all permissions for current user
export function useCurrentUserPermissions() {
  const { ability } = useAbility();

  return useMemo(() => {
    const permissions = {
      customers: {
        create: ability.can('create', 'Customer'),
        read: ability.can('read', 'Customer'),
        update: ability.can('update', 'Customer'),
        delete: ability.can('delete', 'Customer'),
        export: ability.can('export', 'Customer'),
        bulkAction: ability.can('bulk_action', 'Customer')
      },
      partners: {
        create: ability.can('create', 'Partner'),
        read: ability.can('read', 'Partner'),
        update: ability.can('update', 'Partner'),
        delete: ability.can('delete', 'Partner'),
        export: ability.can('export', 'Partner'),
        bulkAction: ability.can('bulk_action', 'Partner')
      },
      proposals: {
        create: ability.can('create', 'Proposal'),
        read: ability.can('read', 'Proposal'),
        update: ability.can('update', 'Proposal'),
        delete: ability.can('delete', 'Proposal'),
        approve: ability.can('approve', 'Proposal'),
        export: ability.can('export', 'Proposal'),
        bulkAction: ability.can('bulk_action', 'Proposal')
      },
      invoices: {
        create: ability.can('create', 'Invoice'),
        read: ability.can('read', 'Invoice'),
        update: ability.can('update', 'Invoice'),
        delete: ability.can('delete', 'Invoice'),
        pay: ability.can('pay', 'Invoice'),
        viewFinancial: ability.can('view_financial', 'Invoice'),
        export: ability.can('export', 'Invoice'),
        bulkAction: ability.can('bulk_action', 'Invoice')
      },
      tasks: {
        create: ability.can('create', 'Task'),
        read: ability.can('read', 'Task'),
        update: ability.can('update', 'Task'),
        delete: ability.can('delete', 'Task'),
        approve: ability.can('approve', 'Task')
      },
      employees: {
        read: ability.can('read', 'EmployeeProfile'),
        update: ability.can('update', 'EmployeeProfile'),
        viewPayroll: ability.can('view_financial', 'Payroll')
      }
    };

    return permissions;
  }, [ability]);
}