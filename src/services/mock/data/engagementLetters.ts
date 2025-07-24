import type { EngagementLetter } from '@/features/engagement-letters/types';

export const mockEngagementLetters: EngagementLetter[] = [
  {
    id: 1,
    proposalId: 1,
    customerId: 201,
    statusId: 14,
    approvalDate: '2024-03-15',
    engagementLetterCode: 'EL-2024-001',
    engagementLetterDate: new Date('2024-03-10'),
    engagementLetterTitle: 'Transfer Pricing Study FY 2024-25',
    engagementLetterDescription: 'Engagement letter for transfer pricing study',
    currencyCode: 'INR',
    signOffNotes: 'Approved by client with minor modifications',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-15'),
    customer: undefined,
    proposal: {
      id: 1,
      proposal_target: 'customer',
      customer_id: 1,
      status_id: 4,
      proposal_number: 'PROP-2024-001',
      proposal_date: new Date('2024-03-01'),
      valid_until: new Date('2024-04-01'),
      total_amount: 500000,
      currency_code: 'INR',
      created_at: new Date('2024-03-01'),
      updated_at: new Date('2024-03-05')
    },
    status: {
      id: 3,
      context: 'ENGAGEMENT_LETTER',
      statusCode: 'approved',
      statusName: 'Approved',
      sequence: 30,
      isFinal: false,
      isActive: true
    },
    serviceItems: [
      {
        id: 1,
        engagementLetterId: 1,
        proposalServiceItemId: 1,
        serviceName: 'Transfer Pricing Documentation',
        serviceDescription: 'Complete TP documentation including benchmarking study',
        serviceRate: 200000
      },
      {
        id: 2,
        engagementLetterId: 1,
        proposalServiceItemId: 2,
        serviceName: 'TP Risk Assessment',
        serviceDescription: 'Comprehensive transfer pricing risk assessment and mitigation strategies',
        serviceRate: 300000
      }
    ]
  },
  {
    id: 2,
    proposalId: 2,
    customerId: 206,
    statusId: 13,
    approvalDate: null,
    engagementLetterCode: 'EL-2024-002',
    engagementLetterDate: new Date('2024-03-20'),
    engagementLetterTitle: 'Compliance Review Services',
    engagementLetterDescription: 'Engagement letter for compliance review',
    currencyCode: 'INR',
    signOffNotes: 'Awaiting client approval',
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18'),
    customer: undefined,
    proposal: {
      id: 2,
      proposal_target: 'customer',
      customer_id: 2,
      status_id: 4,
      proposal_number: 'PROP-2024-002',
      proposal_date: new Date('2024-03-10'),
      valid_until: new Date('2024-04-10'),
      total_amount: 10000,
      currency_code: 'USD',
      created_at: new Date('2024-03-10'),
      updated_at: new Date('2024-03-15')
    },
    status: {
      id: 2,
      context: 'ENGAGEMENT_LETTER',
      statusCode: 'sent_for_approval',
      statusName: 'Sent for Approval',
      sequence: 20,
      isFinal: false,
      isActive: true
    },
    serviceItems: [
      {
        id: 3,
        engagementLetterId: 2,
        proposalServiceItemId: 3,
        serviceName: 'Compliance Review',
        serviceDescription: 'Comprehensive compliance review and recommendations',
        serviceRate: 835000
      }
    ]
  },
  {
    id: 3,
    proposalId: 3,
    customerId: 203,
    statusId: 12,
    approvalDate: null,
    engagementLetterCode: 'EL-2024-003',
    engagementLetterDate: new Date('2024-04-01'),
    engagementLetterTitle: 'Documentation Update Project',
    engagementLetterDescription: 'Draft engagement letter for documentation update',
    currencyCode: 'INR',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
    customer: undefined,
    proposal: {
      id: 3,
      proposal_target: 'customer',
      customer_id: 3,
      status_id: 4,
      proposal_number: 'PROP-2024-003',
      proposal_date: new Date('2024-03-15'),
      valid_until: new Date('2024-04-15'),
      total_amount: 50000,
      currency_code: 'AED',
      created_at: new Date('2024-03-15'),
      updated_at: new Date('2024-03-18')
    },
    status: {
      id: 1,
      context: 'ENGAGEMENT_LETTER',
      statusCode: 'draft',
      statusName: 'Draft',
      sequence: 10,
      isFinal: false,
      isActive: true
    },
    serviceItems: [
      {
        id: 4,
        engagementLetterId: 3,
        proposalServiceItemId: 4,
        serviceName: 'Documentation Update',
        serviceDescription: 'Update and maintain TP documentation',
        serviceRate: 1135000
      }
    ]
  },
  {
    id: 4,
    proposalId: 4,
    customerId: 204,
    statusId: 15,
    approvalDate: '2024-02-20',
    engagementLetterCode: 'EL-2024-004',
    engagementLetterDate: new Date('2024-04-05'),
    engagementLetterTitle: 'Annual TP Documentation',
    engagementLetterDescription: 'Active engagement for annual TP documentation',
    currencyCode: 'INR',
    signOffNotes: 'Client approved with standard terms',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-20'),
    customer: undefined,
    proposal: {
      id: 4,
      proposal_target: 'customer',
      customer_id: 4,
      status_id: 4,
      proposal_number: 'PROP-2024-004',
      proposal_date: new Date('2024-02-10'),
      valid_until: new Date('2024-03-10'),
      total_amount: 750000,
      currency_code: 'INR',
      created_at: new Date('2024-02-10'),
      updated_at: new Date('2024-02-15')
    },
    status: {
      id: 4,
      context: 'ENGAGEMENT_LETTER',
      statusCode: 'active',
      statusName: 'Active',
      sequence: 40,
      isFinal: false,
      isActive: true
    },
    serviceItems: [
      {
        id: 5,
        engagementLetterId: 4,
        proposalServiceItemId: 5,
        serviceName: 'Annual TP Documentation - Q1',
        serviceDescription: 'Q1 Transfer pricing documentation services',
        serviceRate: 187500
      },
      {
        id: 6,
        engagementLetterId: 4,
        proposalServiceItemId: 6,
        serviceName: 'Annual TP Documentation - Q2',
        serviceDescription: 'Q2 Transfer pricing documentation services',
        serviceRate: 187500
      },
      {
        id: 7,
        engagementLetterId: 4,
        proposalServiceItemId: 7,
        serviceName: 'Annual TP Documentation - Q3',
        serviceDescription: 'Q3 Transfer pricing documentation services',
        serviceRate: 187500
      },
      {
        id: 8,
        engagementLetterId: 4,
        proposalServiceItemId: 8,
        serviceName: 'Annual TP Documentation - Q4',
        serviceDescription: 'Q4 Transfer pricing documentation services',
        serviceRate: 187500
      }
    ]
  },
  {
    id: 5,
    proposalId: 5,
    customerId: 202,
    statusId: 16,
    approvalDate: '2023-12-15',
    engagementLetterCode: 'EL-2024-005',
    engagementLetterDate: new Date('2024-02-01'),
    engagementLetterTitle: 'Benchmarking Study Services',
    engagementLetterDescription: 'Completed engagement for benchmarking study',
    currencyCode: 'INR',
    signOffNotes: 'Successfully completed and delivered',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-31'),
    customer: undefined,
    proposal: {
      id: 5,
      proposal_target: 'customer',
      customer_id: 5,
      status_id: 4,
      proposal_number: 'PROP-2023-050',
      proposal_date: new Date('2023-11-25'),
      valid_until: new Date('2023-12-25'),
      total_amount: 300000,
      currency_code: 'INR',
      created_at: new Date('2023-11-25'),
      updated_at: new Date('2023-12-01')
    },
    status: {
      id: 5,
      context: 'ENGAGEMENT_LETTER',
      statusCode: 'completed',
      statusName: 'Completed',
      sequence: 50,
      isFinal: true,
      isActive: true
    },
    serviceItems: [
      {
        id: 9,
        engagementLetterId: 5,
        proposalServiceItemId: 9,
        serviceName: 'Benchmarking Study',
        serviceDescription: 'Comprehensive benchmarking analysis and report',
        serviceRate: 300000
      }
    ]
  }
];