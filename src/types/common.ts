export type CustomerType = 'direct' | 'partner_referred' | 'partner_managed';
export type EmployeeRole = 'Admin' | 'Manager' | 'Consultant';
export type LeaveType = 'Casual' | 'Sick' | 'Optional';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface MasterStatus {
  id: number;
  context: string;
  statusCode: string;
  statusName: string;
  sequence: number;
  isFinal: boolean;
  isActive: boolean;
}

export interface MasterService {
  id: number;
  name: string;
  description?: string;
  defaultRate?: number;
  category?: string;
  isActive: boolean;
}

export interface MasterCurrency {
  code: string;
  name: string;
  symbol: string;
  isBaseCurrency: boolean;
}

export interface VstnBranch {
  id: number;
  branchName: string;
  branchCode: string;
  country: string;
  baseCurrencyCode?: string;
  isActive: boolean;
}

export interface MoneyAmount {
  amount: number;
  currencyCode: string;
  exchangeRateToInr?: number;
  exchangeRateDate?: Date;
  amountInr?: number;
}

export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactPerson extends BaseEntity {
  entityType: 'customer' | 'partner';
  entityId: number;
  name: string;
  email?: string;
  phone?: string;
  designation?: string;
  isPrimary?: boolean;
  isDeleted?: boolean;
}

export interface Comment extends BaseEntity {
  entityType: string;
  entityId: number;
  parentCommentId?: number;
  content: string;
  createdBy: number;
  createdByUser?: EmployeeProfile;
}

export interface Document {
  id: number;
  entityType: string;
  entityId: number;
  fileName: string;
  filePath: string;
  fileType?: string;
  locationUrl: string;
  fileSizeKb?: number;
  uploadedBy: number;
  uploadedAt: Date;
  uploadedByUser?: EmployeeProfile;
}

export interface EmployeeProfile extends BaseEntity {
  employeeCode?: string;
  microsoftId?: string; // Azure AD/Graph ID
  name: string; // Full name for display
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string; // Work email
  phoneNumber?: string;
  personalEmail?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  pan?: string;
  aadhaar?: string;
  ifsc?: string;
  bankAccount?: string;
  dateOfJoining?: Date;
  dateOfResignation?: Date;
  position?: string; // Job title from Graph
  department?: string; // Department from Graph
  officeLocation?: string; // Office location from Graph
  isActive?: boolean;
  isInternal?: boolean;
  canLogin?: boolean;
  role: EmployeeRole | 'admin' | 'manager' | 'consultant' | 'employee';
  statusId?: number;
  status?: MasterStatus;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: ValidationError[];
}

export type CurrencyCode = 'INR' | 'USD' | 'AED' | 'EUR' | 'GBP' | 'SGD';

export const CURRENCY_CODES = {
  INR: 'INR' as CurrencyCode,
  USD: 'USD' as CurrencyCode,
  AED: 'AED' as CurrencyCode,
  EUR: 'EUR' as CurrencyCode,
  GBP: 'GBP' as CurrencyCode,
  SGD: 'SGD' as CurrencyCode,
} as const;

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  AED: 'د.إ',
  EUR: '€',
  GBP: '£',
  SGD: 'S$',
};

export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  INR: 'Indian Rupee',
  USD: 'US Dollar',
  AED: 'UAE Dirham',
  EUR: 'Euro',
  GBP: 'British Pound',
  SGD: 'Singapore Dollar',
};

// Form data interfaces for reuse across features
export interface ContactPersonFormData {
  name: string;
  email?: string;
  phone?: string;
  designation?: string;
  isPrimary?: boolean;
}

export interface AddressFormData {
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

// Utility function to safely convert string to CurrencyCode
export function toCurrencyCode(currency: string | undefined | null): CurrencyCode {
  if (!currency) return 'INR';
  return Object.values(CURRENCY_CODES).includes(currency as CurrencyCode) 
    ? currency as CurrencyCode 
    : 'INR';
}