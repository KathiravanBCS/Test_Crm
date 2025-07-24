import { faker } from '@faker-js/faker';
import type { Partner, PartnerCommission, PartnerBankAccount } from '@/features/partners/types';
import type { MasterStatus } from '@/types/common';
import { generatePAN, generateGSTIN, generateBankAccount, generateIFSC, generatePastDate } from '../utils';

// Generate mock partners
export const mockPartners: Partner[] = [
  {
    id: 101,
    partnerCode: 'PRTN-2024-001',
    partnerName: 'ABC Consultancy Services LLP',
    partnerType: 'firm',
    vstnBranchId: 1, // India branch
    pan: generatePAN(),
    gstin: generateGSTIN(),
    webUrl: 'https://abc-consultancy.com',
    currencyCode: 'INR',
    paymentTerm: 'Net 30',
    commissionType: 'percentage',
    commissionRate: 10,
    commissionCurrencyCode: 'INR',
    partnerDescription: 'Leading consultancy firm specializing in tax and compliance services',
    onboardedDate: generatePastDate(730).toISOString(),
    bankAccounts: [{
      accountHolderName: 'ABC Consultancy Services LLP',
      accountNumber: generateBankAccount().toString(),
      ifscCode: generateIFSC(),
      bankName: 'HDFC Bank',
      accountType: 'current',
      currencyCode: 'INR',
    }],
    referredCustomersCount: 8,
    totalCommissionAmount: 245000,
    activeStatus: true,
    createdAt: generatePastDate(730),
    updatedAt: new Date(),
  },
  {
    id: 102,
    partnerCode: 'PRTN-2024-002',
    partnerName: 'Global Tax Advisors Pvt Ltd',
    partnerType: 'firm',
    vstnBranchId: 1, // India branch
    pan: generatePAN(),
    gstin: generateGSTIN(),
    webUrl: 'https://globaltaxadvisors.in',
    currencyCode: 'INR',
    paymentTerm: 'Net 45',
    commissionType: 'percentage',
    commissionRate: 12,
    commissionCurrencyCode: 'INR',
    partnerDescription: 'International tax advisory and cross-border compliance specialists',
    onboardedDate: generatePastDate(600).toISOString(),
    bankAccounts: [{
      accountHolderName: 'Global Tax Advisors Pvt Ltd',
      accountNumber: generateBankAccount().toString(),
      ifscCode: generateIFSC(),
      bankName: 'ICICI Bank',
      accountType: 'current',
      currencyCode: 'INR',
    }],
    referredCustomersCount: 12,
    totalCommissionAmount: 389000,
    activeStatus: true,
    createdAt: generatePastDate(600),
    updatedAt: new Date(),
  },
  {
    id: 103,
    partnerCode: 'PRTN-2024-003',
    partnerName: 'Elite Financial Services',
    partnerType: 'individual',
    vstnBranchId: 1, // India branch
    pan: generatePAN(),
    gstin: generateGSTIN(),
    webUrl: 'https://elitefinancial.co.in',
    currencyCode: 'INR',
    paymentTerm: 'Net 15',
    commissionType: 'fixed',
    commissionRate: 25000,
    commissionCurrencyCode: 'INR',
    partnerDescription: 'Boutique financial advisory specializing in wealth management',
    onboardedDate: generatePastDate(500).toISOString(),
    bankAccounts: [{
      accountHolderName: 'Elite Financial Services',
      accountNumber: generateBankAccount().toString(),
      ifscCode: generateIFSC(),
      bankName: 'SBI',
      accountType: 'savings',
      currencyCode: 'INR',
    }],
    referredCustomersCount: 5,
    totalCommissionAmount: 156000,
    activeStatus: true,
    createdAt: generatePastDate(500),
    updatedAt: new Date(),
  },
  {
    id: 104,
    partnerCode: 'PRTN-2024-004',
    partnerName: 'Premier Business Solutions LLP',
    partnerType: 'firm',
    vstnBranchId: 1, // India branch
    pan: generatePAN(),
    gstin: generateGSTIN(),
    currencyCode: 'INR',
    paymentTerm: 'Net 60',
    commissionType: 'percentage',
    commissionRate: 8,
    commissionCurrencyCode: 'INR',
    partnerDescription: 'Business process outsourcing and management consulting',
    onboardedDate: generatePastDate(400).toISOString(),
    bankAccounts: [{
      accountHolderName: 'Premier Business Solutions LLP',
      accountNumber: generateBankAccount().toString(),
      ifscCode: generateIFSC(),
      bankName: 'Axis Bank',
      accountType: 'current',
      currencyCode: 'INR',
    }],
    referredCustomersCount: 3,
    totalCommissionAmount: 87000,
    activeStatus: false,
    createdAt: generatePastDate(400),
    updatedAt: new Date(),
  },
  {
    id: 105,
    partnerCode: 'PRTN-2024-005',
    partnerName: 'Strategic Advisory Partners',
    partnerType: 'firm',
    vstnBranchId: 3, // Singapore branch
    pan: generatePAN(),
    gstin: generateGSTIN(),
    webUrl: 'https://sap-advisors.com',
    currencyCode: 'USD',
    paymentTerm: 'Net 30',
    commissionType: 'percentage',
    commissionRate: 15,
    commissionCurrencyCode: 'USD',
    partnerDescription: 'Strategic business advisory with focus on international expansion',
    onboardedDate: generatePastDate(300).toISOString(),
    bankAccounts: [{
      accountHolderName: 'Strategic Advisory Partners',
      accountNumber: generateBankAccount().toString(),
      ifscCode: generateIFSC(),
      bankName: 'Standard Chartered',
      accountType: 'current',
      currencyCode: 'USD',
      swiftCode: 'SCBLINBB',
    }],
    referredCustomersCount: 15,
    totalCommissionAmount: 512000,
    activeStatus: true,
    createdAt: generatePastDate(300),
    updatedAt: new Date(),
  },
  {
    id: 106,
    partnerCode: 'PRTN-2024-006',
    partnerName: 'Innovative Tax Consultants',
    partnerType: 'individual',
    vstnBranchId: 1, // India branch
    pan: generatePAN(),
    gstin: generateGSTIN(),
    currencyCode: 'INR',
    paymentTerm: 'Net 30',
    commissionType: 'percentage',
    commissionRate: 10,
    commissionCurrencyCode: 'INR',
    partnerDescription: 'Specialized in startup tax planning and innovative business structures',
    onboardedDate: generatePastDate(250).toISOString(),
    bankAccounts: [{
      accountHolderName: 'Innovative Tax Consultants',
      accountNumber: generateBankAccount().toString(),
      ifscCode: generateIFSC(),
      bankName: 'Kotak Bank',
      accountType: 'current',
      currencyCode: 'INR',
    }],
    referredCustomersCount: 7,
    totalCommissionAmount: 198000,
    activeStatus: true,
    createdAt: generatePastDate(250),
    updatedAt: new Date(),
  },
  {
    id: 107,
    partnerCode: 'PRTN-2024-007',
    partnerName: 'Dynamic Audit Services',
    partnerType: 'firm',
    vstnBranchId: 1, // India branch
    pan: generatePAN(),
    gstin: generateGSTIN(),
    webUrl: 'https://dynamicaudit.in',
    currencyCode: 'INR',
    paymentTerm: 'Net 45',
    commissionType: 'percentage',
    commissionRate: 12,
    commissionCurrencyCode: 'INR',
    partnerDescription: 'Full-service audit firm with expertise in statutory and internal audits',
    onboardedDate: generatePastDate(200).toISOString(),
    bankAccounts: [{
      accountHolderName: 'Dynamic Audit Services',
      accountNumber: generateBankAccount().toString(),
      ifscCode: generateIFSC(),
      bankName: 'Yes Bank',
      accountType: 'current',
      currencyCode: 'INR',
    }],
    referredCustomersCount: 9,
    totalCommissionAmount: 267000,
    activeStatus: true,
    createdAt: generatePastDate(200),
    updatedAt: new Date(),
  },
  {
    id: 108,
    partnerCode: 'PRTN-2024-008',
    partnerName: 'United Compliance Advisors',
    partnerType: 'firm',
    vstnBranchId: 1, // India branch
    pan: generatePAN(),
    gstin: generateGSTIN(),
    currencyCode: 'INR',
    paymentTerm: 'Net 30',
    commissionType: 'fixed',
    commissionRate: 30000,
    commissionCurrencyCode: 'INR',
    partnerDescription: 'Regulatory compliance and corporate governance specialists',
    onboardedDate: generatePastDate(150).toISOString(),
    bankAccounts: [{
      accountHolderName: 'United Compliance Advisors',
      accountNumber: generateBankAccount().toString(),
      ifscCode: generateIFSC(),
      bankName: 'Bank of Baroda',
      accountType: 'current',
      currencyCode: 'INR',
    }],
    referredCustomersCount: 4,
    totalCommissionAmount: 125000,
    activeStatus: false,
    createdAt: generatePastDate(150),
    updatedAt: new Date(),
  },
  {
    id: 109,
    partnerCode: 'PRTN-2024-009',
    partnerName: 'Royal Tax and Legal LLP',
    partnerType: 'firm',
    vstnBranchId: 1, // India branch
    pan: generatePAN(),
    currencyCode: 'INR',
    paymentTerm: 'Net 60',
    commissionType: 'percentage',
    commissionRate: 11,
    commissionCurrencyCode: 'INR',
    partnerDescription: 'Integrated tax and legal advisory services',
    onboardedDate: generatePastDate(100).toISOString(),
    referredCustomersCount: 11,
    totalCommissionAmount: 334000,
    activeStatus: true,
    createdAt: generatePastDate(100),
    updatedAt: new Date(),
  },
  {
    id: 110,
    partnerCode: 'PRTN-2024-010',
    partnerName: 'Apex Advisory Group',
    partnerType: 'firm',
    vstnBranchId: 2, // UAE branch
    pan: generatePAN(),
    gstin: generateGSTIN(),
    webUrl: 'https://apexadvisory.com',
    currencyCode: 'AED',
    paymentTerm: 'Net 30',
    commissionType: 'percentage',
    commissionRate: 13,
    commissionCurrencyCode: 'AED',
    partnerDescription: 'Middle East focused business advisory and tax services',
    onboardedDate: generatePastDate(50).toISOString(),
    bankAccounts: [{
      accountHolderName: 'Apex Advisory Group',
      accountNumber: generateBankAccount().toString(),
      bankName: 'Emirates NBD',
      accountType: 'current',
      currencyCode: 'AED',
      swiftCode: 'EBILAEAD',
    }],
    referredCustomersCount: 6,
    totalCommissionAmount: 178000,
    activeStatus: true,
    createdAt: generatePastDate(50),
    updatedAt: new Date(),
  }
];

// Helper to get partner by id
export const getPartnerById = (id: number) => 
  mockPartners.find(partner => partner.id === id);

// Generate function for dynamic partner creation
export function generatePartner(id: number): Partner {
  const hasPan = faker.datatype.boolean({ probability: 0.8 });
  const hasGstin = faker.datatype.boolean({ probability: 0.6 });
  const hasBankDetails = faker.datatype.boolean({ probability: 0.7 });
  const partnerType = faker.helpers.arrayElement(['individual', 'firm'] as const);
  const commissionType = faker.helpers.arrayElement(['percentage', 'fixed'] as const);
  const currencyCode = faker.helpers.arrayElement(['INR', 'USD', 'AED']);
  
  const bankAccounts: PartnerBankAccount[] = hasBankDetails ? [{
    accountHolderName: faker.company.name(),
    accountNumber: generateBankAccount().toString(),
    ifscCode: currencyCode === 'INR' ? generateIFSC() : undefined,
    bankName: faker.helpers.arrayElement(['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank']),
    accountType: faker.helpers.arrayElement(['savings', 'current', 'fixed_deposit'] as const),
    swiftCode: currencyCode !== 'INR' ? faker.string.alphanumeric(8).toUpperCase() : undefined,
    currencyCode,
  }] : [];
  
  return {
    id,
    partnerCode: `PRTN-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`,
    partnerName: faker.company.name(),
    partnerType,
    pan: hasPan ? generatePAN() : undefined,
    gstin: hasGstin ? generateGSTIN() : undefined,
    webUrl: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.5 }),
    currencyCode,
    paymentTerm: faker.helpers.arrayElement(['Net 15', 'Net 30', 'Net 45', 'Net 60']),
    commissionType,
    commissionRate: commissionType === 'percentage' 
      ? faker.number.float({ min: 5, max: 20, fractionDigits: 2 })
      : faker.number.float({ min: 10000, max: 50000, fractionDigits: 0 }),
    commissionCurrencyCode: currencyCode,
    partnerDescription: faker.lorem.sentence(),
    onboardedDate: faker.date.past({ years: 3 }).toISOString(),
    vstnBranchId: faker.helpers.arrayElement([1, 2, 3]), // Random branch
    bankAccounts,
    referredCustomersCount: faker.number.int({ min: 0, max: 20 }),
    totalCommissionAmount: faker.number.float({ min: 0, max: 500000, fractionDigits: 2 }),
    activeStatus: faker.datatype.boolean({ probability: 0.8 }),
    createdAt: faker.date.past({ years: 3 }),
    updatedAt: faker.date.recent({ days: 30 }),
  };
}

// Generate partner commission for testing
export function generatePartnerCommission(id: number, partnerId: number): PartnerCommission {
  const statusId = faker.helpers.weightedArrayElement([
    { value: 1, weight: 5 }, // Due/Pending
    { value: 2, weight: 3 }, // Approved
    { value: 3, weight: 2 }, // Paid
  ]);
  
  const status: MasterStatus = {
    id: statusId,
    context: 'COMMISSION',
    statusCode: statusId === 1 ? 'due' : statusId === 2 ? 'approved' : 'paid',
    statusName: statusId === 1 ? 'Due' : statusId === 2 ? 'Approved' : 'Paid',
    sequence: statusId * 10,
    isFinal: statusId === 3,
    isActive: true,
  };
  
  const commissionPercentage = faker.number.float({ min: 5, max: 20, fractionDigits: 2 });
  const invoiceAmount = faker.number.float({ min: 50000, max: 1000000, fractionDigits: 2 });
  const commissionAmount = (invoiceAmount * commissionPercentage) / 100;
  
  return {
    id,
    partnerId,
    invoiceId: faker.number.int({ min: 1, max: 100 }),
    engagementLetterId: faker.number.int({ min: 1, max: 50 }),
    commissionPercentage,
    commissionAmount,
    currencyCode: 'INR',
    commissionAmountInr: commissionAmount,
    statusId,
    status,
    paymentDate: statusId === 3 ? faker.date.recent({ days: 30 }).toISOString() : undefined,
    paymentReference: statusId === 3 ? `PAY-${faker.string.numeric(6)}` : undefined,
    notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
    createdAt: faker.date.past({ years: 1 }),
    updatedAt: faker.date.recent({ days: 7 }),
  };
}