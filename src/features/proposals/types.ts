import type { Customer } from '../customers/types';
import type { Partner } from '../partners/types';
import type { ServiceItemLineItem } from '@/types/service-item';
import type { EmployeeProfile, CurrencyCode } from '@/types/common';
import type { MasterServiceItem } from '@/types/masters';

export type ProposalTarget = 'customer' | 'partner';

export interface Proposal {
  id: number;
  customer_id?: number; // Now optional since proposal can be for partner
  customer?: Customer;
  partner_id?: number;
  partner?: Partner; // Partner type from partners module
  proposal_target: ProposalTarget; // New field to identify target
  proposal_number: string;
  proposal_date: string | Date;
  proposalTitle?: string;
  proposalDescription?: string;
  valid_until?: string | Date;
  termsAndConditions?: string;
  timelines?: string;
  status_id: number;
  status?: ProposalStatus;
  statusUpdatedDate?: string | Date;
  currency_code: CurrencyCode;
  proposalPreparedBy?: number;
  proposalReviewedBy?: number;
  isDeleted?: boolean;
  created_at: string | Date;
  created_by?: number;
  updated_at?: string | Date;
  updated_by?: number;
  notes?: string;
  total_amount?: number;
  
  // Relations
  service_items?: ServiceItemLineItem[];
  clauses?: ProposalClause[];
  preparedBy?: EmployeeProfile; // Employee type
  reviewedBy?: EmployeeProfile; // Employee type
  commentsCount?: number;
  documentsCount?: number;
  
  // Legacy camelCase support
  customerId?: number;
  partnerId?: number;
  proposalCode?: string;
  proposalDate?: string | Date;
  statusId?: number;
  currencyCode?: string;
  serviceItems?: ServiceItemLineItem[];
  createdAt?: string | Date;
  createdBy?: number;
  updatedAt?: string | Date;
  updatedBy?: number;
}

export interface ProposalStatus {
  id: number;
  context: string;
  status_code: string;
  status_name: string;
  sequence: number;
  is_final: boolean;
}

export interface ProposalServiceItem {
  id: number;
  proposalId: number;
  masterServiceItemId?: number;
  serviceName: string;
  serviceDescription: string;
  serviceRate: number;
  isDeleted?: boolean;
  createdAt?: string | Date;
  createdBy?: number;
  updatedAt?: string | Date;
  updatedBy?: number;
  // Relations
  masterServiceItem?: MasterServiceItem; // MasterServiceItem type
}

export interface ProposalClause {
  id: number;
  proposal_id: number;
  title: string;
  content: string;
  sequence: number;
}

export interface ProposalFilters {
  customer_id?: number;
  vstnBranchId?: number;
  status_id?: number;
  date_from?: Date;
  date_to?: Date;
  amount_min?: number;
  amount_max?: number;
  currency_code?: CurrencyCode;
}

export interface ProposalFormData {
  proposal_target: ProposalTarget;
  customer_id?: number; // Optional since it could be partner
  partner_id?: number; // Optional since it could be customer
  proposal_date?: Date;
  valid_until?: Date;
  currency_code?: CurrencyCode;
  notes?: string;
  service_items: ServiceItemLineItem[];
  clauses: ProposalClause[];
}

export interface ProposalSummary {
  total_count: number;
  total_value: number;
  by_status: {
    status: string;
    count: number;
    value: number;
  }[];
  by_currency: {
    currency: string;
    count: number;
    value: number;
  }[];
}