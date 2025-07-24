import type { BaseEntity, MasterStatus, EmployeeProfile } from '@/types';
import type { Customer } from '../customers/types';
import type { Partner } from '../partners/types';
import type { EngagementLetter, EngagementLetterServiceItem } from '../engagement-letters/types';

export interface Engagement extends BaseEntity {
  engagementName: string;
  engagementCode?: string;
  engagementLetterId: number;
  statusId: number;
  managerId?: number;
  progressPercentage: number;
  
  // Timeline
  startDate: string;
  endDate: string;
  baselineStartDate?: string;
  baselineEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  
  // Related entities
  status?: MasterStatus;
  engagementLetter?: EngagementLetter;
  manager?: EmployeeProfile;
  customer?: Customer;
  partner?: Partner;
  phases?: EngagementPhase[];
  
  // Computed properties
  scheduleVariance?: number; // in days
  isDelayed?: boolean;
}

export interface EngagementPhase extends BaseEntity {
  engagementId: number;
  phaseName: string;
  phaseDescription?: string;
  statusId: number;
  progressPercentage: number;
  
  // Timeline
  phaseStartDate?: string;
  phaseEndDate?: string;
  baselineStartDate?: string;
  baselineEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  
  // Related entities
  status?: MasterStatus;
  serviceItems?: EngagementServiceItem[];
  
  // UI helpers
  isExpanded?: boolean;
  displayOrder?: number;
}

export interface EngagementServiceItem extends BaseEntity {
  engagementPhaseId: number;
  engagementLetterServiceItemId: number;
  masterServiceId?: number;
  serviceName: string;
  serviceDescription: string;
  statusId: number;
  deliveryNotes?: string;
  assignedTo?: number;
  
  // Timeline
  plannedStartDate?: string;
  plannedEndDate?: string;
  baselineStartDate?: string;
  baselineEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  
  // Related entities
  status?: MasterStatus;
  engagementLetterServiceItem?: EngagementLetterServiceItem;
  assignedToEmployee?: EmployeeProfile;
  
  // Progress tracking
  estimatedHours?: number;
  loggedHours?: number;
}

export interface EngagementFilters {
  vstnBranchId?: number;
  statusId?: number;
  managerId?: number;
  customerId?: number;
  partnerId?: number;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  isDelayed?: boolean;
  progressMin?: number;
  progressMax?: number;
}

// Form Data Types
export interface EngagementFormData {
  engagementName: string;
  engagementLetterId: number;
  managerId?: number;
  startDate: Date | null;
  endDate: Date | null;
  phases: EngagementPhaseFormData[];
}

export interface EngagementPhaseFormData {
  id?: number;
  phaseName: string;
  phaseDescription?: string;
  phaseStartDate?: Date | null;
  phaseEndDate?: Date | null;
  serviceItems: EngagementServiceItemFormData[];
  isNew?: boolean;
  tempId?: string; // For tracking new phases before save
}

export interface EngagementServiceItemFormData {
  id?: number;
  engagementLetterServiceItemId: number;
  serviceName: string;
  serviceDescription: string;
  plannedStartDate?: Date | null;
  plannedEndDate?: Date | null;
  assignedTo?: number;
  estimatedHours?: number;
  deliveryNotes?: string;
  isAssigned?: boolean; // UI helper to track assignment status
}

// Engagement Status Enum
export type EngagementStatus = 'not_started' | 'active' | 'paused' | 'completed';