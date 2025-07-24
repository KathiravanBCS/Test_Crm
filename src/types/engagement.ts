import type { BaseEntity } from './common';

export interface EngagementLetter extends BaseEntity {
  proposalId: number;
  customerId: number;
  statusId: number;
  approvalDate?: Date;
  notes?: string;
}