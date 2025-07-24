import { BaseMockService } from './BaseService';
import type { EngagementLetter, EngagementLetterFormData } from '@/features/engagement-letters/types';
import type { MasterStatus } from '@/types/common';
import { mockEngagementLetters } from '../data/engagementLetters';
import { mockProposals } from '../data/proposals';
import { mockCustomers } from '../data/customers';
import { masterStatuses as mockMasterStatuses } from '../data/master';

export class EngagementLetterService extends BaseMockService<EngagementLetter, EngagementLetterFormData, Partial<EngagementLetter>> {
  constructor() {
    super(mockEngagementLetters, 1000, 300);
  }

  async getAll() {
    const engagementLetters = await super.getAll();
    
    // Populate relations
    return engagementLetters.map(el => ({
      ...el,
      customer: mockCustomers.find(c => c.id === el.customerId),
      proposal: mockProposals.find(p => p.id === el.proposalId),
      status: mockMasterStatuses.find((s: MasterStatus) => s.id === el.statusId),
    }));
  }

  async getById(id: number) {
    const engagementLetter = await super.getById(id);
    
    if (!engagementLetter) {
      throw new Error('Engagement letter not found');
    }

    // Populate relations
    return {
      ...engagementLetter,
      customer: mockCustomers.find(c => c.id === engagementLetter.customerId),
      proposal: mockProposals.find(p => p.id === engagementLetter.proposalId),
      status: mockMasterStatuses.find((s: MasterStatus) => s.id === engagementLetter.statusId),
    };
  }

  async create(data: EngagementLetterFormData): Promise<EngagementLetter> {
    const id = this.nextId++;
    const newEngagementLetter: EngagementLetter = {
      id,
      proposalId: data.proposalId,
      customerId: data.customerId,
      statusId: 12, // Draft status (ENGAGEMENT context)
      approvalDate: undefined,
      engagementLetterCode: `EL-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`,
      engagementLetterDate: new Date(),
      engagementLetterTitle: data.engagementLetterTitle || 'New Engagement Letter',
      engagementLetterDescription: data.engagementLetterDescription,
      currencyCode: data.currencyCode || 'INR',
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceItems: data.selectedServiceItems?.map((item, index) => ({
        id: this.nextId + index * 1000,
        engagementLetterId: id,
        proposalServiceItemId: item.proposalServiceItemId,
        masterServiceItemId: undefined,
        serviceName: item.serviceName,
        serviceDescription: item.serviceDescription,
        serviceRate: item.serviceRate
      })) || []
    };

    this.data.push(newEngagementLetter);
    return this.getById(newEngagementLetter.id);
  }

  async createFromProposal(proposalId: number) {
    const proposal = mockProposals.find(p => p.id === proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.status?.status_code !== 'approved') {
      throw new Error('Only approved proposals can be converted to engagement letters');
    }

    const formData: EngagementLetterFormData = {
      engagementTarget: proposal.proposal_target || 'customer',
      proposalId: proposal.id,
      customerId: proposal.customer_id || 0,
      partnerId: proposal.partner_id,
      engagementLetterTitle: `Engagement Letter for ${proposal.proposal_number}`,
      engagementLetterDescription: `Engagement letter created from ${proposal.proposal_number}`,
      currencyCode: proposal.currency_code || 'INR',
      selectedServiceItems: proposal.service_items?.map(item => ({
        proposalServiceItemId: typeof item.id === 'number' ? item.id : parseInt(String(item.id || 0)),
        serviceName: item.service_item_name,
        serviceDescription: item.description || '',
        serviceRate: item.negotiated_price
      })) || []
    };

    return this.create(formData);
  }

  async approve(id: number) {
    const engagementLetter = await this.getById(id);
    
    if (engagementLetter.status?.statusCode !== 'sent_for_approval') {
      throw new Error('Only engagement letters sent for approval can be approved');
    }

    const approvedStatusId = mockMasterStatuses.find(
      (s: MasterStatus) => s.context === 'ENGAGEMENT' && s.statusCode === 'approved'
    )?.id || 14;

    await this.update(id, {
      ...engagementLetter,
      statusId: approvedStatusId,
      approvalDate: new Date(),
      updatedAt: new Date()
    });

    return this.getById(id);
  }

  async reject(id: number, reason?: string) {
    const engagementLetter = await this.getById(id);
    
    if (engagementLetter.status?.statusCode !== 'sent_for_approval') {
      throw new Error('Only engagement letters sent for approval can be rejected');
    }

    const rejectedStatusId = mockMasterStatuses.find(
      (s: MasterStatus) => s.context === 'ENGAGEMENT' && s.statusCode === 'rejected'
    )?.id || 33;

    await this.update(id, {
      ...engagementLetter,
      statusId: rejectedStatusId,
      signOffNotes: reason ? `${engagementLetter.signOffNotes || ''}\n\nRejection reason: ${reason}` : engagementLetter.signOffNotes,
      updatedAt: new Date()
    });

    return this.getById(id);
  }

  async sendForApproval(id: number) {
    const engagementLetter = await this.getById(id);
    
    if (engagementLetter.status?.statusCode !== 'draft') {
      throw new Error('Only draft engagement letters can be sent for approval');
    }

    const sentForApprovalStatusId = mockMasterStatuses.find(
      (s: MasterStatus) => s.context === 'ENGAGEMENT' && s.statusCode === 'sent_for_approval'
    )?.id || 13;

    await this.update(id, {
      ...engagementLetter,
      statusId: sentForApprovalStatusId,
      updatedAt: new Date()
    });

    return this.getById(id);
  }
}