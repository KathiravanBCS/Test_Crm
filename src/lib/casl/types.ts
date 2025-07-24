import { MongoAbility, AbilityClass } from '@casl/ability';
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

export type Actions = 
  | 'create' 
  | 'read' 
  | 'update' 
  | 'delete' 
  | 'manage' // full access
  | 'approve' // for approvals
  | 'pay' // for payments
  | 'export' // for data export
  | 'view_financial' // for sensitive financial data
  | 'bulk_action'; // for bulk operations

export type Subjects = 
  | 'all'
  | Customer
  | Partner
  | Proposal
  | EngagementLetter
  | Invoice
  | Task
  | EmployeeProfile
  | Payroll
  | LeaveRequest
  | Comment
  | Document
  | 'Customer'
  | 'Partner'
  | 'Proposal'
  | 'EngagementLetter'
  | 'Invoice'
  | 'Task'
  | 'EmployeeProfile'
  | 'Payroll'
  | 'LeaveRequest'
  | 'Comment'
  | 'Document'
  | 'PartnerCommission'
  | 'ContactPerson'
  | 'ProposalComment'
  | 'ProposalDocument'
  | string; // Allow any string for flexibility while maintaining specific types above

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export interface CaslRule {
  action: Actions | Actions[];
  subject: string | string[];
  conditions?: any;
  fields?: string[];
  inverted?: boolean;
}

export interface UserPermissions {
  userId: number;
  role: 'Admin' | 'Manager' | 'Consultant';
  rules: CaslRule[];
}

export type ResourceType = 
  | 'Customer'
  | 'Partner'
  | 'Employee'
  | 'Proposal'
  | 'EngagementLetter'
  | 'Engagement'
  | 'Invoice'
  | 'Task'
  | 'Comment'
  | 'Document'
  | 'ServiceItem'
  | 'MasterService'
  | 'MasterStatus'
  | 'MasterCurrency'
  | 'LeaveRequest'
  | 'Payroll'
  | 'PartnerCommission'
  | 'AuditLog';