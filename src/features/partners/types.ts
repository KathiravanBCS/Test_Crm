import type { BaseEntity, ContactPerson, Comment, Document, MasterStatus, ContactPersonFormData, AddressFormData } from '@/types/common';

export interface Partner extends BaseEntity {
  partnerCode: string;
  partnerName: string;
  partnerType?: 'individual' | 'firm';
  vstnBranchId?: number;
  pan?: string;
  gstin?: string;
  webUrl?: string;
  currencyCode: string;
  paymentTerm?: string;
  commissionType?: 'percentage' | 'fixed';
  commissionRate?: number;
  commissionCurrencyCode?: string;
  partnerDescription?: string;
  onboardedDate?: string;
  // Bank accounts
  bankAccounts?: PartnerBankAccount[];
  // Computed/joined fields
  contacts?: ContactPerson[];
  addresses?: Address[];
  referredCustomersCount?: number;
  totalCommissionAmount?: number;
  activeStatus?: boolean;
  comments?: Comment[];
  documents?: Document[];
}

export interface PartnerBankAccount {
  accountHolderName: string;
  accountNumber: string;
  ifscCode?: string;
  bankName?: string;
  accountType?: 'savings' | 'current' | 'fixed_deposit';
  swiftCode?: string;
  currencyCode: string;
  effectiveDate?: string;
  termDate?: string;
}

export interface Address extends BaseEntity {
  entityType: 'customer' | 'partner';
  entityId: number;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isPrimary: boolean;
  isBilling: boolean;
  isShipping: boolean;
}

export interface PartnerFormData {
  partnerCode?: string;
  partnerName: string;
  partnerType?: 'individual' | 'firm';
  vstnBranchId?: number;
  pan?: string;
  gstin?: string;
  webUrl?: string;
  currencyCode?: string;
  paymentTerm?: string;
  commissionType?: 'percentage' | 'fixed';
  commissionRate?: number;
  commissionCurrencyCode?: string;
  partnerDescription?: string;
  onboardedDate?: string;
  // Relationships
  addresses?: AddressFormData[];
  contacts?: ContactPersonFormData[];
  bankAccounts?: PartnerBankAccount[];
}

export interface PartnerFilters {
  search?: string;
  hasGstin?: boolean;
  hasPan?: boolean;
  vstnBranchId?: number;
  partnerType?: 'individual' | 'firm';
  commissionType?: 'percentage' | 'fixed';
}

// Partner Commission types based on schema
export interface PartnerCommission extends BaseEntity {
  partnerId: number;
  invoiceId: number;
  engagementLetterId: number;
  commissionPercentage: number;
  commissionAmount: number;
  currencyCode: string;
  commissionAmountInr?: number;
  statusId: number;
  status?: MasterStatus;
  paymentDate?: string;
  paymentReference?: string;
  notes?: string;
  // Relations
  partner?: Partner;
  invoice?: {
    id: number;
    invoiceNumber: string;
    invoiceDate: string;
    totalAmount: number;
  };
  engagementLetter?: {
    id: number;
    customer?: {
      id: number;
      name: string;
    };
  };
}

export interface PartnerCommissionFormData {
  partnerId: number;
  invoiceId: number;
  engagementLetterId: number;
  commissionPercentage: number;
  commissionAmount: number;
  currencyCode: string;
  commissionAmountInr?: number;
  statusId: number;
  paymentDate?: string;
  paymentReference?: string;
  notes?: string;
}

export interface PartnerCommissionFilters {
  partnerId?: number;
  statusId?: number;
  fromDate?: string;
  toDate?: string;
}