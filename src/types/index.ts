// Common types
export type {
  BaseEntity,
  ContactPerson,
  CustomerType,
  MasterStatus,
  MasterService,
  MasterCurrency,
  EmployeeProfile,
  EmployeeProfile as Employee, // Alias for backward compatibility
  Comment,
  Document,
  MoneyAmount,
} from './common';

// Domain types
export type { 
  Customer,
  CustomerFormData,
  CustomerFilters,
  CustomerStats
} from './customer';


export type {
  EngagementLetter
} from './engagement';

export type {
  Invoice
} from './invoice';

// Re-export feature-specific types that are used globally
export type { Proposal } from '../features/proposals/types';

// Placeholder types for missing entities
export interface Task {
  id: number;
  assignedTo: number;
  priority: string;
  [key: string]: any;
}

export interface Payroll {
  id: number;
  employeeId: number;
  baseSalary: number;
  netPay: number;
  [key: string]: any;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  leaveType: string;
  leaveDate: string;
  [key: string]: any;
}