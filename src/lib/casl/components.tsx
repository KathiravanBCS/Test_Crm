import React from 'react';
import { Can as CaslCan } from './AbilityContext';
import { useAbility } from './AbilityContext';
import { Actions, Subjects } from './types';
import { Loader, Alert } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';

interface CanProps {
  I: Actions;
  a?: Subjects | string;
  this?: any;
  field?: string;
  passThrough?: boolean;
  not?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Enhanced Can component with better TypeScript support
export function Can({ 
  I, 
  a, 
  this: subject, 
  field, 
  passThrough = false, 
  not = false,
  children, 
  fallback = null 
}: CanProps) {
  const { isLoading } = useAbility();

  if (isLoading) {
    return <Loader size="sm" />;
  }

  return (
    <CaslCan
      I={I}
      a={a}
      this={subject}
      {...(field ? { field } : {})}
      passThrough={passThrough}
      not={not}
    >
      {(allowed, ability) => (allowed ? children : fallback)}
    </CaslCan>
  );
}

interface ProtectedComponentProps {
  action: Actions;
  subject: Subjects | string;
  instance?: any;
  fallback?: React.ReactNode;
  showError?: boolean;
  children: React.ReactNode;
}

// Protected component wrapper with customizable fallback
export function ProtectedComponent({
  action,
  subject,
  instance,
  fallback,
  showError = true,
  children
}: ProtectedComponentProps) {
  const defaultFallback = showError ? (
    <Alert 
      icon={<IconLock size={16} />} 
      color="red" 
      variant="light"
      title="Access Denied"
    >
      You don't have permission to {action} {typeof subject === 'string' ? subject : 'this resource'}.
    </Alert>
  ) : null;

  return (
    <Can I={action} a={subject} this={instance} fallback={fallback || defaultFallback}>
      {children}
    </Can>
  );
}

interface ConditionalButtonProps extends React.ComponentProps<'button'> {
  action: Actions;
  subject: Subjects | string;
  instance?: any;
  children: React.ReactNode;
}

// Button that's automatically disabled based on permissions
export function ConditionalButton({
  action,
  subject,
  instance,
  children,
  disabled,
  ...props
}: ConditionalButtonProps) {
  const { ability } = useAbility();
  const hasPermission = ability.can(action, instance || subject);

  return (
    <button
      {...props}
      disabled={disabled || !hasPermission}
      title={!hasPermission ? `You don't have permission to ${action} ${typeof subject === 'string' ? subject : 'this'}` : undefined}
    >
      {children}
    </button>
  );
}

interface FieldPermissionProps {
  entity: any;
  field: string;
  action?: Actions;
  children: (hasPermission: boolean) => React.ReactNode;
}

// Check field-level permissions
export function FieldPermission({
  entity,
  field,
  action = 'read',
  children
}: FieldPermissionProps) {
  const { ability } = useAbility();
  const hasPermission = ability.can(action, entity, field);
  
  return <>{children(hasPermission)}</>;
}

interface BulkActionPermissionProps {
  subject: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Special component for bulk action permissions
export function BulkActionPermission({
  subject,
  children,
  fallback = null
}: BulkActionPermissionProps) {
  return (
    <Can I="bulk_action" a={subject} fallback={fallback}>
      {children}
    </Can>
  );
}

interface FinancialDataPermissionProps {
  subject: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Special component for financial data permissions
export function FinancialDataPermission({
  subject,
  children,
  fallback = <span>***</span>
}: FinancialDataPermissionProps) {
  return (
    <Can I="view_financial" a={subject} fallback={fallback}>
      {children}
    </Can>
  );
}