import type { Engagement } from '@/features/engagements/types';
import { mockCustomers } from './customers';
import { mockPartners } from './partners';
import { mockEngagementLetters } from './engagementLetters';
import { mockEmployees } from './employees';
import { masterStatuses } from './master';

// Calculate schedule variance in days
function calculateScheduleVariance(baselineEnd: string | undefined, currentEnd: string): number {
  if (!baselineEnd) return 0;
  const baseline = new Date(baselineEnd);
  const current = new Date(currentEnd);
  const diffTime = current.getTime() - baseline.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export const engagements: Engagement[] = [
  {
    id: 1,
    engagementName: 'Q1 2025 Tax Advisory Services',
    engagementCode: 'ENG-2025-001',
    engagementLetterId: 1,
    statusId: 10, // in_progress
    managerId: 2, // John Manager
    progressPercentage: 65,
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    baselineStartDate: '2025-01-01',
    baselineEndDate: '2025-03-31',
    actualStartDate: '2025-01-05',
    actualEndDate: undefined,
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2025-01-15'),
    scheduleVariance: 0,
    isDelayed: false
  },
  {
    id: 2,
    engagementName: 'Annual Audit FY 2024-25',
    engagementCode: 'ENG-2025-002',
    engagementLetterId: 2,
    statusId: 10, // in_progress
    managerId: 2,
    progressPercentage: 45,
    startDate: '2025-01-15',
    endDate: '2025-04-15',
    baselineStartDate: '2025-01-15',
    baselineEndDate: '2025-03-31',
    actualStartDate: '2025-01-20',
    actualEndDate: undefined,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-18'),
    scheduleVariance: 15, // Delayed by 15 days
    isDelayed: true
  },
  {
    id: 3,
    engagementName: 'GST Compliance Services Q1',
    engagementCode: 'ENG-2025-003',
    engagementLetterId: 3,
    statusId: 9, // not_started
    managerId: 2,
    progressPercentage: 0,
    startDate: '2025-02-01',
    endDate: '2025-03-31',
    baselineStartDate: '2025-02-01',
    baselineEndDate: '2025-03-31',
    actualStartDate: undefined,
    actualEndDate: undefined,
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
    scheduleVariance: 0,
    isDelayed: false
  },
  {
    id: 4,
    engagementName: 'Business Process Optimization',
    engagementCode: 'ENG-2025-004',
    engagementLetterId: 4,
    statusId: 11, // completed
    managerId: 2,
    progressPercentage: 100,
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    baselineStartDate: '2024-10-01',
    baselineEndDate: '2024-12-15',
    actualStartDate: '2024-10-05',
    actualEndDate: '2024-12-31',
    createdAt: new Date('2024-09-25'),
    updatedAt: new Date('2024-12-31'),
    scheduleVariance: 16, // Completed 16 days late
    isDelayed: true
  },
  {
    id: 5,
    engagementName: 'Partner Tax Advisory 2025',
    engagementCode: 'ENG-2025-005',
    engagementLetterId: 5,
    statusId: 10, // in_progress
    managerId: 3,
    progressPercentage: 30,
    startDate: '2025-01-10',
    endDate: '2025-06-30',
    baselineStartDate: '2025-01-10',
    baselineEndDate: '2025-06-30',
    actualStartDate: '2025-01-12',
    actualEndDate: undefined,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-18'),
    scheduleVariance: 0,
    isDelayed: false
  },
  {
    id: 6,
    engagementName: 'International Tax Planning',
    engagementCode: 'ENG-2025-006',
    engagementLetterId: 6,
    statusId: 10, // in_progress
    managerId: 2,
    progressPercentage: 55,
    startDate: '2024-12-01',
    endDate: '2025-02-28',
    baselineStartDate: '2024-12-01',
    baselineEndDate: '2025-02-15',
    actualStartDate: '2024-12-05',
    actualEndDate: undefined,
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2025-01-18'),
    scheduleVariance: 13, // Running 13 days late
    isDelayed: true
  }
];

// Enhance with related data
engagements.forEach(engagement => {
  // Add status
  engagement.status = masterStatuses.find((s) => s.id === engagement.statusId);
  
  // Add engagement letter
  engagement.engagementLetter = mockEngagementLetters.find((el) => el.id === engagement.engagementLetterId);
  
  // Add manager
  engagement.manager = mockEmployees.find((e) => e.id === engagement.managerId);
  
  // Add customer/partner from engagement letter
  if (engagement.engagementLetter) {
    const engagementLetter = engagement.engagementLetter;
    if (engagementLetter.customerId) {
      engagement.customer = mockCustomers.find((c) => c.id === engagementLetter.customerId);
    }
    if (engagementLetter.partnerId) {
      engagement.partner = mockPartners.find((p) => p.id === engagementLetter.partnerId);
    }
  }
  
  // Calculate schedule variance if not set
  if (engagement.scheduleVariance === undefined) {
    engagement.scheduleVariance = calculateScheduleVariance(engagement.baselineEndDate, engagement.endDate);
  }
  
  // Update isDelayed flag
  engagement.isDelayed = engagement.scheduleVariance > 0;
});