import type { ServiceItem, ServiceItemWithSubItems } from '@/types/service-item';

// Mock service items organized by category
export const mockServiceItems: ServiceItemWithSubItems[] = [
  // Tax Services
  {
    id: 301,
    code: 'TAX-001',
    name: 'Income Tax Compliance',
    description: 'Annual income tax return filing and compliance',
    default_price: 50000,
    currency_code: 'INR',
    category: 'tax',
    is_active: true,
    has_sub_items: true,
    master_service_id: 1,
    sub_items: [
      {
        id: 3011,
        code: 'TAX-001-A',
        name: 'Individual Tax Return',
        description: 'ITR filing for individuals',
        default_price: 15000,
        currency_code: 'INR',
        category: 'tax',
        is_active: true,
        has_sub_items: false,
        parent_id: 301,
        master_service_id: 1
      },
      {
        id: 3012,
        code: 'TAX-001-B',
        name: 'Corporate Tax Return',
        description: 'Corporate income tax return filing',
        default_price: 35000,
        currency_code: 'INR',
        category: 'tax',
        is_active: true,
        has_sub_items: false,
        parent_id: 301,
        master_service_id: 1
      }
    ]
  },
  {
    id: 302,
    code: 'TAX-002',
    name: 'GST Compliance',
    description: 'Monthly/Quarterly GST return filing and compliance',
    default_price: 25000,
    currency_code: 'INR',
    category: 'tax',
    is_active: true,
    has_sub_items: true,
    master_service_id: 2,
    sub_items: [
      {
        id: 3021,
        code: 'TAX-002-A',
        name: 'Monthly GST Returns',
        description: 'GSTR-1, GSTR-3B monthly filing',
        default_price: 15000,
        currency_code: 'INR',
        category: 'tax',
        is_active: true,
        has_sub_items: false,
        parent_id: 302,
        master_service_id: 2
      },
      {
        id: 3022,
        code: 'TAX-002-B',
        name: 'Annual GST Return',
        description: 'GSTR-9 annual return filing',
        default_price: 10000,
        currency_code: 'INR',
        category: 'tax',
        is_active: true,
        has_sub_items: false,
        parent_id: 302,
        master_service_id: 2
      }
    ]
  },
  {
    id: 303,
    code: 'TAX-003',
    name: 'Tax Advisory',
    description: 'Tax planning and advisory services',
    default_price: 75000,
    currency_code: 'INR',
    category: 'tax',
    is_active: true,
    has_sub_items: false,
    master_service_id: 3
  },

  // Transfer Pricing Services
  {
    id: 304,
    code: 'TP-001',
    name: 'Transfer Pricing Documentation',
    description: 'Preparation of TP documentation as per regulations',
    default_price: 150000,
    currency_code: 'INR',
    category: 'transfer_pricing',
    is_active: true,
    has_sub_items: true,
    master_service_id: 4,
    sub_items: [
      {
        id: 3041,
        code: 'TP-001-A',
        name: 'Local File Preparation',
        description: 'Preparation of local file documentation',
        default_price: 75000,
        currency_code: 'INR',
        category: 'transfer_pricing',
        is_active: true,
        has_sub_items: false,
        parent_id: 304,
        master_service_id: 4
      },
      {
        id: 3042,
        code: 'TP-001-B',
        name: 'Master File Preparation',
        description: 'Preparation of master file documentation',
        default_price: 75000,
        currency_code: 'INR',
        category: 'transfer_pricing',
        is_active: true,
        has_sub_items: false,
        parent_id: 304,
        master_service_id: 4
      },
      {
        id: 3043,
        code: 'TP-001-C',
        name: 'Benchmarking Study',
        description: 'Economic analysis and benchmarking',
        default_price: 100000,
        currency_code: 'INR',
        category: 'transfer_pricing',
        is_active: true,
        has_sub_items: false,
        parent_id: 304,
        master_service_id: 4
      }
    ]
  },
  {
    id: 305,
    code: 'TP-002',
    name: 'Transfer Pricing Audit Support',
    description: 'Assistance during TP audit proceedings',
    default_price: 200000,
    currency_code: 'INR',
    category: 'transfer_pricing',
    is_active: true,
    has_sub_items: false,
    master_service_id: 5
  },
  {
    id: 306,
    code: 'TP-003',
    name: 'Advance Pricing Agreement',
    description: 'APA application and negotiation support',
    default_price: 500000,
    currency_code: 'INR',
    category: 'transfer_pricing',
    is_active: true,
    has_sub_items: false,
    master_service_id: 6
  },

  // Audit Services
  {
    id: 307,
    code: 'AUD-001',
    name: 'Statutory Audit',
    description: 'Annual statutory audit as per Companies Act',
    default_price: 100000,
    currency_code: 'INR',
    category: 'audit',
    is_active: true,
    has_sub_items: true,
    master_service_id: 7,
    sub_items: [
      {
        id: 3071,
        code: 'AUD-001-A',
        name: 'Limited Review',
        description: 'Quarterly limited review',
        default_price: 25000,
        currency_code: 'INR',
        category: 'audit',
        is_active: true,
        has_sub_items: false,
        parent_id: 307,
        master_service_id: 7
      },
      {
        id: 3072,
        code: 'AUD-001-B',
        name: 'Year-end Audit',
        description: 'Annual financial statement audit',
        default_price: 75000,
        currency_code: 'INR',
        category: 'audit',
        is_active: true,
        has_sub_items: false,
        parent_id: 307,
        master_service_id: 7
      }
    ]
  },
  {
    id: 308,
    code: 'AUD-002',
    name: 'Internal Audit',
    description: 'Risk-based internal audit services',
    default_price: 80000,
    currency_code: 'INR',
    category: 'audit',
    is_active: true,
    has_sub_items: false,
    master_service_id: 8
  },
  {
    id: 309,
    code: 'AUD-003',
    name: 'Tax Audit',
    description: 'Tax audit under Section 44AB',
    default_price: 50000,
    currency_code: 'INR',
    category: 'audit',
    is_active: true,
    has_sub_items: false,
    master_service_id: 9
  },

  // Compliance Services
  {
    id: 310,
    code: 'COMP-001',
    name: 'Company Secretarial Services',
    description: 'Annual compliance and secretarial services',
    default_price: 60000,
    currency_code: 'INR',
    category: 'compliance',
    is_active: true,
    has_sub_items: true,
    master_service_id: 10,
    sub_items: [
      {
        id: 3101,
        code: 'COMP-001-A',
        name: 'Board Meeting Support',
        description: 'Quarterly board meeting compliance',
        default_price: 15000,
        currency_code: 'INR',
        category: 'compliance',
        is_active: true,
        has_sub_items: false,
        parent_id: 310,
        master_service_id: 10
      },
      {
        id: 3102,
        code: 'COMP-001-B',
        name: 'Annual Filing',
        description: 'Annual ROC filings and compliance',
        default_price: 25000,
        currency_code: 'INR',
        category: 'compliance',
        is_active: true,
        has_sub_items: false,
        parent_id: 310,
        master_service_id: 10
      },
      {
        id: 3103,
        code: 'COMP-001-C',
        name: 'Minutes & Resolutions',
        description: 'Drafting minutes and resolutions',
        default_price: 20000,
        currency_code: 'INR',
        category: 'compliance',
        is_active: true,
        has_sub_items: false,
        parent_id: 310,
        master_service_id: 10
      }
    ]
  },
  {
    id: 311,
    code: 'COMP-002',
    name: 'FEMA Compliance',
    description: 'Foreign exchange compliance and reporting',
    default_price: 40000,
    currency_code: 'INR',
    category: 'compliance',
    is_active: true,
    has_sub_items: false,
    master_service_id: 11
  },
  {
    id: 312,
    code: 'COMP-003',
    name: 'Labour Law Compliance',
    description: 'PF, ESI, and other labour law compliance',
    default_price: 30000,
    currency_code: 'INR',
    category: 'compliance',
    is_active: true,
    has_sub_items: false,
    master_service_id: 12
  },

  // Advisory Services
  {
    id: 313,
    code: 'ADV-001',
    name: 'Business Advisory',
    description: 'Strategic business consulting and advisory',
    default_price: 5000,
    currency_code: 'USD',
    category: 'advisory',
    is_active: true,
    has_sub_items: false,
    master_service_id: 13
  },
  {
    id: 314,
    code: 'ADV-002',
    name: 'M&A Advisory',
    description: 'Merger and acquisition advisory services',
    default_price: 10000,
    currency_code: 'USD',
    category: 'advisory',
    is_active: true,
    has_sub_items: true,
    master_service_id: 14,
    sub_items: [
      {
        id: 3141,
        code: 'ADV-002-A',
        name: 'Due Diligence',
        description: 'Financial and tax due diligence',
        default_price: 5000,
        currency_code: 'USD',
        category: 'advisory',
        is_active: true,
        has_sub_items: false,
        parent_id: 314,
        master_service_id: 14
      },
      {
        id: 3142,
        code: 'ADV-002-B',
        name: 'Valuation Services',
        description: 'Business valuation for M&A',
        default_price: 3000,
        currency_code: 'USD',
        category: 'advisory',
        is_active: true,
        has_sub_items: false,
        parent_id: 314,
        master_service_id: 14
      },
      {
        id: 3143,
        code: 'ADV-002-C',
        name: 'Deal Structuring',
        description: 'Transaction structuring advisory',
        default_price: 2000,
        currency_code: 'USD',
        category: 'advisory',
        is_active: true,
        has_sub_items: false,
        parent_id: 314,
        master_service_id: 14
      }
    ]
  },
  {
    id: 315,
    code: 'ADV-003',
    name: 'Risk Advisory',
    description: 'Enterprise risk management services',
    default_price: 3000,
    currency_code: 'USD',
    category: 'advisory',
    is_active: true,
    has_sub_items: false,
    master_service_id: 15
  },
  {
    id: 316,
    code: 'ADV-004',
    name: 'Digital Transformation',
    description: 'Technology and process transformation advisory',
    default_price: 15000,
    currency_code: 'AED',
    category: 'advisory',
    is_active: true,
    has_sub_items: false,
    master_service_id: 16
  },

  // Other Services
  {
    id: 317,
    code: 'OTH-001',
    name: 'Accounting Services',
    description: 'Bookkeeping and accounting support',
    default_price: 25000,
    currency_code: 'INR',
    category: 'other',
    is_active: true,
    has_sub_items: false,
    master_service_id: 17
  },
  {
    id: 318,
    code: 'OTH-002',
    name: 'Payroll Processing',
    description: 'Monthly payroll processing services',
    default_price: 20000,
    currency_code: 'INR',
    category: 'other',
    is_active: true,
    has_sub_items: false,
    master_service_id: 18
  },
  {
    id: 319,
    code: 'OTH-003',
    name: 'Training & Development',
    description: 'Professional training programs',
    default_price: 50000,
    currency_code: 'INR',
    category: 'other',
    is_active: true,
    has_sub_items: false,
    master_service_id: 19
  },
  {
    id: 320,
    code: 'OTH-004',
    name: 'Certification Services',
    description: 'Various certification and attestation services',
    default_price: 10000,
    currency_code: 'INR',
    category: 'other',
    is_active: false, // Example of inactive service
    has_sub_items: false,
    master_service_id: 20
  }
];

// Helper functions
export const getServiceItemsByCategory = (category: string) => 
  mockServiceItems.filter(item => item.category === category && item.is_active);

export const getServiceItemById = (id: number): ServiceItemWithSubItems | undefined => 
  mockServiceItems.find(item => item.id === id);

export const getActiveServiceItems = () => 
  mockServiceItems.filter(item => item.is_active);

export const getParentServiceItems = () => 
  mockServiceItems.filter(item => !item.parent_id && item.is_active);

// Get all service items including sub-items in a flat array
export const getAllServiceItemsFlat = (): ServiceItem[] => {
  const flatItems: ServiceItem[] = [];
  
  mockServiceItems.forEach(item => {
    flatItems.push(item);
    if (item.sub_items) {
      flatItems.push(...item.sub_items);
    }
  });
  
  return flatItems;
};