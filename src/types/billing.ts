// Billing types for managing payment schedules across modules

export interface BillingTemplate {
  id: string;
  name: string;                           // e.g., '50-50 Payment'
  description: string;
  is_default?: boolean;
}

// Pre-defined templates
export const DEFAULT_BILLING_TEMPLATES: BillingTemplate[] = [
  {
    id: '50-50',
    name: '50-50 Payment',
    description: 'Equal payment at start and completion',
    is_default: true
  },
  {
    id: '30-40-30',
    name: '30-40-30 Payment',
    description: 'Three-stage payment plan'
  },
  {
    id: 'monthly',
    name: 'Monthly Milestones',
    description: 'Equal monthly payments over 4 months'
  },
  {
    id: 'upfront',
    name: '100% Upfront',
    description: 'Full payment before commencement'
  }
];

// Invoice related types
export interface Invoice {
  id: number;
  invoice_number: string;
  invoice_date: Date;
  due_date?: Date;
  amount: number;
  tax_amount: number;
  total_amount: number;
  currency_code: string;
  status_id: number;
  notes?: string;
}