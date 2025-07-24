import type { BaseEntity, EmployeeProfile } from '@/types/common';
import type { MasterStatus, MasterServiceItem } from '@/types/masters';
import type { Customer, Partner } from '../customers/types';
import type { Proposal, ProposalServiceItem } from '../proposals/types';

export interface EngagementLetter extends BaseEntity {
  proposalId: number;
  customerId: number;
  partnerId?: number;
  engagementLetterCode: string;
  engagementLetterDate: Date | string;
  engagementLetterTitle: string;
  engagementLetterDescription?: string;
  currencyCode: string;
  statusId: number;
  approvalDate?: Date | string | null;
  signOffNotes?: string;
  engagementResourceId?: number;
  scopeOfWork?: string;
  deliverables?: string;
  timelines?: string;
  paymentTerms?: string;
  specialConditions?: string;
  termsAndConditions?: string;
  paymentRequiredPercentageBeforeWorkStart?: number;
  
  // Relations
  proposal?: Proposal;
  customer?: Customer;
  partner?: Partner;
  status?: MasterStatus;
  engagementResource?: EmployeeProfile;
  serviceItems?: EngagementLetterServiceItem[];
  commentsCount?: number;
  documentsCount?: number;
}

export interface EngagementLetterServiceItem {
  id: number;
  engagementLetterId: number;
  proposalServiceItemId?: number;
  masterServiceItemId?: number;
  serviceName: string;
  serviceDescription: string;
  serviceRate: number;
  
  // Relations
  proposalServiceItem?: ProposalServiceItem;
  masterServiceItem?: MasterServiceItem;
}

export interface EngagementLetterFilters {
  customerId?: number;
  vstnBranchId?: number;
  statusId?: number;
  partnerId?: number;
  engagementResourceId?: number;
  approvalDateFrom?: Date;
  approvalDateTo?: Date;
  search?: string;
}

export type EngagementLetterTarget = 'customer' | 'partner';

export interface EngagementLetterFormData {
  engagementTarget: EngagementLetterTarget;
  proposalId: number;
  customerId: number;
  partnerId?: number;
  targetCustomerId?: number; // When partner is selected as target
  engagementLetterTitle: string;
  engagementLetterDescription?: string;
  currencyCode: string;
  engagementResourceId?: number;
  scopeOfWork?: string;
  deliverables?: string;
  timelines?: string;
  paymentTerms?: string;
  specialConditions?: string;
  termsAndConditions?: string;
  paymentRequiredPercentageBeforeWorkStart?: number;
  selectedServiceItems: SelectedServiceItem[];
}

export interface SelectedServiceItem {
  proposalServiceItemId: number;
  serviceName: string;
  serviceDescription: string;
  serviceRate: number;
  originalRate?: number; // To track if rate was modified
  originalDescription?: string; // To track if description was modified
}

export interface EngagementLetterListResponse {
  data: EngagementLetter[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EngagementLetterSummary {
  totalCount: number;
  totalValue: number;
  byStatus: {
    status: string;
    count: number;
    value: number;
  }[];
  byCurrency: {
    currency: string;
    count: number;
    value: number;
  }[];
}