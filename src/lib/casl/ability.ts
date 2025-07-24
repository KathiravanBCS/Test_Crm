import { createMongoAbility, Subject } from '@casl/ability';
import { AppAbility, CaslRule } from './types';
import { 
  Customer, 
  EngagementLetter, 
  Invoice, 
  Task,
  EmployeeProfile,
  Payroll,
  LeaveRequest,
  Comment,
  Document
} from '@/types';
import { Partner } from '@/features/partners/types';
import { Proposal } from '@/features/proposals/types';

// Subject type detection for CASL
function detectSubjectType(subject: Subject): string {
  if (typeof subject === 'string') return subject;
  
  // Check if it's a class/constructor function
  if (typeof subject === 'function') {
    return subject.name;
  }
  
  // Check for instances with constructor name
  if (subject?.constructor?.name) {
    return subject.constructor.name;
  }
  
  // Check for explicit __typename property (useful for API responses)
  if ('__typename' in subject) {
    return subject.__typename as string;
  }
  
  // Fallback: detect by presence of specific properties
  if ('customerId' in subject && 'statusId' in subject && 'phases' in subject) return 'Proposal';
  if ('type' in subject && ('pan' in subject || 'gstin' in subject)) return 'Customer';
  if ('commission_rate' in subject || ('type' in subject && 'registration_type' in subject)) return 'Partner';
  if ('invoiceNumber' in subject && 'dueDate' in subject) return 'Invoice';
  if ('assignedTo' in subject && 'priority' in subject) return 'Task';
  if ('role' in subject && 'dateOfJoining' in subject) return 'EmployeeProfile';
  if ('baseSalary' in subject && 'netPay' in subject) return 'Payroll';
  if ('leaveType' in subject && 'leaveDate' in subject) return 'LeaveRequest';
  if ('entityType' in subject && 'content' in subject) return 'Comment';
  if ('fileName' in subject && 'filePath' in subject) return 'Document';
  
  console.warn('Unknown subject type:', subject);
  return 'Unknown';
}

// Create ability instance with rules
export function createAbility(rules: CaslRule[] = []): AppAbility {
  return createMongoAbility(rules, {
    detectSubjectType
  });
}

// Default abilities by role
export function getDefaultRulesByRole(role: 'Admin' | 'Manager' | 'Consultant', userId: number): CaslRule[] {
  switch (role) {
    case 'Admin':
      return [
        // Admins can manage everything
        { action: 'manage', subject: 'all' }
      ];
    
    case 'Manager':
      return [
        // Customers - full access
        { action: ['create', 'read', 'update', 'delete', 'export'], subject: 'Customer' },
        
        // Partners - full access
        { action: ['create', 'read', 'update', 'delete', 'export'], subject: 'Partner' },
        
        // Proposals - full access
        { action: ['create', 'read', 'update', 'delete', 'approve', 'export'], subject: 'Proposal' },
        
        // Engagement Letters - full access
        { action: ['create', 'read', 'update', 'delete', 'approve', 'export'], subject: 'EngagementLetter' },
        
        // Invoices - full access including payments
        { action: ['create', 'read', 'update', 'delete', 'pay', 'export', 'view_financial'], subject: 'Invoice' },
        
        // Tasks - full access
        { action: ['create', 'read', 'update', 'delete', 'approve'], subject: 'Task' },
        
        // Employee Profiles - read only, can update own profile
        { action: 'read', subject: 'EmployeeProfile' },
        { action: 'update', subject: 'EmployeeProfile', conditions: { id: userId } },
        
        // Payroll - view access
        { action: ['read', 'view_financial'], subject: 'Payroll' },
        
        // Leave Requests - can approve others, manage own
        { action: ['create', 'read', 'update'], subject: 'LeaveRequest', conditions: { employeeId: userId } },
        { action: ['read', 'approve'], subject: 'LeaveRequest' },
        
        // Comments & Documents - full access
        { action: ['create', 'read', 'update', 'delete'], subject: 'Comment' },
        { action: ['create', 'read', 'delete'], subject: 'Document' },
        
        // Bulk actions
        { action: 'bulk_action', subject: ['Customer', 'Partner', 'Proposal', 'Invoice'] }
      ];
    
    case 'Consultant':
      return [
        // Customers - read only
        { action: 'read', subject: 'Customer' },
        
        // Partners - read only
        { action: 'read', subject: 'Partner' },
        
        // Proposals - can create and edit assigned/created ones
        { action: 'create', subject: 'Proposal' },
        { action: ['read', 'update'], subject: 'Proposal', conditions: { createdBy: userId } },
        { action: 'read', subject: 'Proposal', conditions: { assignedTo: userId } },
        
        // Engagement Letters - read only for assigned ones
        { action: 'read', subject: 'EngagementLetter', conditions: { assignedTo: userId } },
        
        // Invoices - no access to financial data
        { action: 'read', subject: 'Invoice', fields: ['id', 'invoiceNumber', 'status', 'dueDate'] },
        
        // Tasks - manage assigned tasks, create new ones
        { action: 'create', subject: 'Task' },
        { action: ['read', 'update'], subject: 'Task', conditions: { assignedTo: userId } },
        { action: ['read', 'update'], subject: 'Task', conditions: { createdBy: userId } },
        
        // Employee Profile - can only update own
        { action: 'read', subject: 'EmployeeProfile', conditions: { id: userId } },
        { action: 'update', subject: 'EmployeeProfile', conditions: { id: userId } },
        
        // Payroll - can only view own
        { action: 'read', subject: 'Payroll', conditions: { employeeId: userId } },
        
        // Leave Requests - manage own only
        { action: ['create', 'read', 'update'], subject: 'LeaveRequest', conditions: { employeeId: userId } },
        
        // Comments - can create and manage own
        { action: 'create', subject: 'Comment' },
        { action: ['read', 'update', 'delete'], subject: 'Comment', conditions: { createdBy: userId } },
        
        // Documents - can upload and read
        { action: ['create', 'read'], subject: 'Document' },
        { action: 'delete', subject: 'Document', conditions: { uploadedBy: userId } }
      ];
    
    default:
      return [];
  }
}

// Helper to update ability with new rules
export function updateAbility(ability: AppAbility, rules: CaslRule[]) {
  ability.update(rules);
}

// Export helper to check if user can perform bulk actions
export function canPerformBulkAction(ability: AppAbility, subject: string): boolean {
  return ability.can('bulk_action', subject);
}

// Export helper to check financial data access
export function canViewFinancialData(ability: AppAbility, subject: string): boolean {
  return ability.can('view_financial', subject);
}