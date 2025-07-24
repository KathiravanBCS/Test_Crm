import React from 'react';
import { Badge, BadgeProps, MantineColor } from '@mantine/core';
import { MasterStatus } from '@/types/common';

interface StatusBadgeProps extends Omit<BadgeProps, 'color'> {
  status: MasterStatus | { statusCode: string; statusName: string };
  context?: string;
  showFinalIndicator?: boolean;
}

// Define color mappings for different status contexts
const statusColors: Record<string, Record<string, MantineColor>> = {
  TASK: {
    todo: 'gray',
    in_progress: 'blue',
    review: 'yellow',
    completed: 'green',
    cancelled: 'red'
  },
  PROPOSAL: {
    draft: 'gray',
    sent: 'blue',
    under_review: 'yellow',
    negotiation: 'orange',
    approved: 'green',
    rejected: 'red'
  },
  ENGAGEMENT: {
    draft: 'gray',
    sent_for_approval: 'blue',
    approved: 'teal',
    active: 'green',
    completed: 'green',
    terminated: 'red'
  },
  INVOICE: {
    draft: 'gray',
    sent: 'blue',
    overdue: 'red',
    paid: 'green',
    cancelled: 'gray'
  },
  EMPLOYEE: {
    active: 'green',
    on_leave: 'yellow',
    resigned: 'gray',
    terminated: 'red'
  },
  PAYROLL: {
    pending: 'yellow',
    processed: 'blue',
    paid: 'green'
  },
  COMMISSION: {
    due: 'yellow',
    approved: 'blue',
    paid: 'green'
  }
};

// Default colors for unknown contexts
const defaultColors: Record<string, MantineColor> = {
  draft: 'gray',
  pending: 'yellow',
  active: 'green',
  completed: 'green',
  cancelled: 'red',
  rejected: 'red',
  approved: 'green'
};

export function StatusBadge({ 
  status, 
  context,
  showFinalIndicator = false,
  size = 'sm',
  variant = 'light',
  ...props 
}: StatusBadgeProps) {
  // Determine the context
  const statusContext = context || (status as MasterStatus).context || 'DEFAULT';
  
  // Get the color
  const contextColors = statusColors[statusContext] || {};
  const color = contextColors[status.statusCode] || defaultColors[status.statusCode] || 'gray';
  
  // Check if it's a final status
  const isFinal = 'isFinal' in status ? status.isFinal : false;
  
  return (
    <Badge
      color={color}
      size={size}
      variant={variant}
      {...props}
    >
      {status.statusName}
      {showFinalIndicator && isFinal && ' ✓'}
    </Badge>
  );
}