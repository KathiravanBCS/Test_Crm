import type { MasterStatus, MasterService, MasterCurrency, VstnBranch } from '@/types/common';

// Master Status Data
export const masterStatuses: MasterStatus[] = [
  // Task Statuses
  { id: 1, context: 'TASK', statusCode: 'todo', statusName: 'To Do', sequence: 10, isFinal: false, isActive: true },
  { id: 2, context: 'TASK', statusCode: 'in_progress', statusName: 'In Progress', sequence: 20, isFinal: false, isActive: true },
  { id: 3, context: 'TASK', statusCode: 'review', statusName: 'Under Review', sequence: 30, isFinal: false, isActive: true },
  { id: 4, context: 'TASK', statusCode: 'completed', statusName: 'Completed', sequence: 40, isFinal: true, isActive: true },
  { id: 5, context: 'TASK', statusCode: 'cancelled', statusName: 'Cancelled', sequence: 50, isFinal: true, isActive: true },

  // Proposal Statuses
  { id: 6, context: 'PROPOSAL', statusCode: 'draft', statusName: 'Draft', sequence: 10, isFinal: false, isActive: true },
  { id: 7, context: 'PROPOSAL', statusCode: 'sent', statusName: 'Sent', sequence: 20, isFinal: false, isActive: true },
  { id: 8, context: 'PROPOSAL', statusCode: 'under_review', statusName: 'Under Review', sequence: 30, isFinal: false, isActive: true },
  { id: 9, context: 'PROPOSAL', statusCode: 'negotiation', statusName: 'Negotiation', sequence: 40, isFinal: false, isActive: true },
  { id: 10, context: 'PROPOSAL', statusCode: 'approved', statusName: 'Approved', sequence: 50, isFinal: true, isActive: true },
  { id: 11, context: 'PROPOSAL', statusCode: 'rejected', statusName: 'Rejected', sequence: 60, isFinal: true, isActive: true },

  // Engagement Letter Statuses
  { id: 12, context: 'ENGAGEMENT', statusCode: 'draft', statusName: 'Draft', sequence: 10, isFinal: false, isActive: true },
  { id: 13, context: 'ENGAGEMENT', statusCode: 'sent_for_approval', statusName: 'Sent for Approval', sequence: 20, isFinal: false, isActive: true },
  { id: 14, context: 'ENGAGEMENT', statusCode: 'approved', statusName: 'Approved', sequence: 30, isFinal: false, isActive: true },
  { id: 15, context: 'ENGAGEMENT', statusCode: 'active', statusName: 'Active', sequence: 40, isFinal: false, isActive: true },
  { id: 16, context: 'ENGAGEMENT', statusCode: 'completed', statusName: 'Completed', sequence: 50, isFinal: true, isActive: true },
  { id: 17, context: 'ENGAGEMENT', statusCode: 'terminated', statusName: 'Terminated', sequence: 60, isFinal: true, isActive: true },
  { id: 33, context: 'ENGAGEMENT', statusCode: 'rejected', statusName: 'Rejected', sequence: 35, isFinal: true, isActive: true },

  // Invoice Statuses
  { id: 18, context: 'INVOICE', statusCode: 'draft', statusName: 'Draft', sequence: 10, isFinal: false, isActive: true },
  { id: 19, context: 'INVOICE', statusCode: 'sent', statusName: 'Sent', sequence: 20, isFinal: false, isActive: true },
  { id: 20, context: 'INVOICE', statusCode: 'overdue', statusName: 'Overdue', sequence: 30, isFinal: false, isActive: true },
  { id: 21, context: 'INVOICE', statusCode: 'paid', statusName: 'Paid', sequence: 40, isFinal: true, isActive: true },
  { id: 22, context: 'INVOICE', statusCode: 'cancelled', statusName: 'Cancelled', sequence: 50, isFinal: true, isActive: true },

  // Employee Statuses
  { id: 23, context: 'EMPLOYEE', statusCode: 'active', statusName: 'Active', sequence: 10, isFinal: false, isActive: true },
  { id: 24, context: 'EMPLOYEE', statusCode: 'on_leave', statusName: 'On Leave', sequence: 20, isFinal: false, isActive: true },
  { id: 25, context: 'EMPLOYEE', statusCode: 'resigned', statusName: 'Resigned', sequence: 30, isFinal: true, isActive: true },
  { id: 26, context: 'EMPLOYEE', statusCode: 'terminated', statusName: 'Terminated', sequence: 40, isFinal: true, isActive: true },

  // Payroll Statuses
  { id: 27, context: 'PAYROLL', statusCode: 'pending', statusName: 'Pending', sequence: 10, isFinal: false, isActive: true },
  { id: 28, context: 'PAYROLL', statusCode: 'processed', statusName: 'Processed', sequence: 20, isFinal: false, isActive: true },
  { id: 29, context: 'PAYROLL', statusCode: 'paid', statusName: 'Paid', sequence: 30, isFinal: true, isActive: true },

  // Commission Statuses
  { id: 30, context: 'COMMISSION', statusCode: 'due', statusName: 'Due', sequence: 10, isFinal: false, isActive: true },
  { id: 31, context: 'COMMISSION', statusCode: 'approved', statusName: 'Approved', sequence: 20, isFinal: false, isActive: true },
  { id: 32, context: 'COMMISSION', statusCode: 'paid', statusName: 'Paid', sequence: 30, isFinal: true, isActive: true },
];

// Master Service Data
export const masterServices: MasterService[] = [
  // OTP Services
  { id: 1, name: 'Transfer Pricing Study', description: 'Comprehensive transfer pricing analysis and documentation', defaultRate: 500000, category: 'OTP', isActive: true },
  { id: 2, name: 'Benchmarking Analysis', description: 'Comparative analysis with industry benchmarks', defaultRate: 300000, category: 'OTP', isActive: true },
  { id: 3, name: 'Country-by-Country Reporting', description: 'CbCR preparation and filing', defaultRate: 200000, category: 'OTP', isActive: true },
  { id: 4, name: 'Master File Preparation', description: 'Master file documentation for MNCs', defaultRate: 400000, category: 'OTP', isActive: true },
  { id: 5, name: 'Local File Preparation', description: 'Local file documentation', defaultRate: 350000, category: 'OTP', isActive: true },
  { id: 6, name: 'APA Assistance', description: 'Advance Pricing Agreement support', defaultRate: 750000, category: 'OTP', isActive: true },
  
  // Advisory Services
  { id: 7, name: 'TP Planning', description: 'Transfer pricing planning and structuring', defaultRate: 600000, category: 'Advisory', isActive: true },
  { id: 8, name: 'TP Risk Assessment', description: 'Identify and mitigate transfer pricing risks', defaultRate: 250000, category: 'Advisory', isActive: true },
  { id: 9, name: 'TP Policy Design', description: 'Design and implementation of TP policies', defaultRate: 450000, category: 'Advisory', isActive: true },
  { id: 10, name: 'Controversy Management', description: 'Support during TP audits and disputes', defaultRate: 800000, category: 'Advisory', isActive: true },
  
  // Compliance Services
  { id: 11, name: 'Annual TP Compliance', description: 'Annual transfer pricing compliance and filing', defaultRate: 150000, category: 'Compliance', isActive: true },
  { id: 12, name: 'TP Certification', description: 'Transfer pricing certificate preparation', defaultRate: 100000, category: 'Compliance', isActive: true },
  { id: 13, name: 'Audit Support', description: 'Support during tax audits', defaultRate: 300000, category: 'Compliance', isActive: true },
  
  // Training Services
  { id: 14, name: 'TP Training - Basic', description: 'Basic transfer pricing training program', defaultRate: 50000, category: 'Training', isActive: true },
  { id: 15, name: 'TP Training - Advanced', description: 'Advanced transfer pricing training program', defaultRate: 100000, category: 'Training', isActive: true },
];

// Master Currency Data
export const masterCurrencies: MasterCurrency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', isBaseCurrency: true },
  { code: 'USD', name: 'United States Dollar', symbol: '$', isBaseCurrency: false },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', isBaseCurrency: false },
  { code: 'EUR', name: 'Euro', symbol: '€', isBaseCurrency: false },
  { code: 'GBP', name: 'British Pound', symbol: '£', isBaseCurrency: false },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', isBaseCurrency: false },
];

// VSTN Branch Data
export const vstnBranches: VstnBranch[] = [
  { id: 1, branchName: 'VSTN Pvt Ltd.', branchCode: 'VSTN_IN', country: 'India', baseCurrencyCode: 'INR', isActive: true },
  { id: 2, branchName: 'VSTN LLC', branchCode: 'VSTN_AE', country: 'UAE', baseCurrencyCode: 'AED', isActive: true },
  { id: 3, branchName: 'VSTN Sg Ltd.', branchCode: 'VSTN_SG', country: 'Singapore', baseCurrencyCode: 'SGD', isActive: true },
];