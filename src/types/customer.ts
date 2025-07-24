import type { BaseEntity, ContactPerson, CustomerType, Comment, Document, AddressFormData, ContactPersonFormData } from './common';

export interface Customer extends BaseEntity {
  customerCode: string;
  customerName: string;
  customerType: CustomerType;
  vstnBranchId?: number;
  industry?: string;
  customerSegment?: string;
  partnerId?: number;
  partner?: Partner;
  partnershipNote?: string;
  currencyCode: string;
  pan?: string;
  gstin?: string;
  tan?: string;
  webUrl?: string;
  paymentTerm?: string;
  customerDescription?: string;
  onboardedDate?: Date | string;
  email?: string;
  phone?: string;
  // Relationships
  contacts?: ContactPerson[];
  addresses?: Address[];
  proposals?: Proposal[];
  engagementLetters?: EngagementLetter[];
  comments?: Comment[];
  documents?: Document[];
}

export interface CustomerFormData {
  customerCode?: string;
  customerName: string;
  customerType: CustomerType;
  vstnBranchId?: number;
  industry?: string;
  customerSegment?: string;
  partnerId?: number;
  partnershipNote?: string;
  currencyCode: string;
  pan?: string;
  gstin?: string;
  tan?: string;
  webUrl?: string;
  paymentTerm?: string;
  customerDescription?: string;
  onboardedDate?: Date | string;
  email?: string;
  phone?: string;
  // Relationships
  addresses?: AddressFormData[];
  contacts?: ContactPersonFormData[];
}

export interface CustomerFilters {
  search?: string;
  type?: CustomerType;
  customerType?: CustomerType;
  vstnBranchId?: number;
  partnerId?: number;
  currencyCode?: string;
  hasProposals?: boolean;
  hasEngagements?: boolean;
  statusId?: number;
}

export interface CustomerStats {
  totalCustomers: number;
  directCustomers: number;
  partnerReferredCustomers: number;
  partnerManagedCustomers: number;
  activeProposals: number;
  activeEngagements: number;
  totalRevenue: {
    inr: number;
    usd: number;
    aed: number;
  };
}

// Address interface for customer/partner addresses
export interface Address extends BaseEntity {
  entityType: 'customer' | 'partner';
  entityId: number;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
  isBilling?: boolean;
  isShipping?: boolean;
}

// Temporary minimal type to avoid circular dependency
export interface Partner {
  id: number;
  partnerName: string;
  partnerCode: string;
  partnerType?: 'individual' | 'firm';
  pan?: string;
  gstin?: string;
  currencyCode?: string;
  commissionType?: 'percentage' | 'fixed';
  commissionRate?: number;
  commissionCurrencyCode?: string;
}

export interface Proposal {
  id: number;
  customerId: number;
  statusId: number;
}

export interface EngagementLetter {
  id: number;
  customerId: number;
  proposalId: number;
  statusId: number;
}