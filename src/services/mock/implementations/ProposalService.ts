import { BaseMockService } from './BaseService';
import type { Proposal, ProposalFormData } from '@/features/proposals/types';
import { mockProposals } from '../data/proposals';
import { delay } from '../utils';

class MockProposalService extends BaseMockService<Proposal, ProposalFormData, ProposalFormData> {
  constructor() {
    super(mockProposals, 1000, 300);
    
    // Bind methods to preserve 'this' context
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }

  async create(data: ProposalFormData): Promise<Proposal> {
    const newProposal: Proposal = {
      id: this.nextId++,
      proposal_target: data.proposal_target,
      customer_id: data.customer_id,
      partner_id: data.partner_id,
      status_id: 1, // Draft status
      proposal_number: `PROP-${new Date().getFullYear()}-${String(this.nextId).padStart(3, '0')}`,
      proposal_date: data.proposal_date || new Date(),
      valid_until: data.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      total_amount: data.service_items.reduce((sum, item) => sum + item.negotiated_price, 0),
      currency_code: data.currency_code || 'INR',
      notes: data.notes,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 1, // Mock user ID
      
      // Relations
      service_items: data.service_items,
      clauses: data.clauses
    };
    
    this.data.push(newProposal);
    return newProposal;
  }

  async update(id: number, data: ProposalFormData): Promise<Proposal> {
    await delay();
    
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Proposal not found');
    }
    
    this.data[index] = {
      ...this.data[index],
      ...data,
      total_amount: data.service_items.reduce((sum, item) => sum + item.negotiated_price, 0),
      updated_at: new Date(),
    };
    
    return this.data[index];
  }

  async approve(id: number): Promise<Proposal> {
    await delay();
    
    const proposal = await this.getById(id);
    proposal.status_id = 4; // Approved status
    proposal.updated_at = new Date();
    
    return proposal;
  }

  async reject(id: number, reason?: string): Promise<Proposal> {
    await delay();
    
    const proposal = await this.getById(id);
    proposal.status_id = 5; // Rejected status
    proposal.notes = reason ? `${proposal.notes}\nRejection reason: ${reason}` : proposal.notes;
    proposal.updated_at = new Date();
    
    return proposal;
  }
}

export const proposalService = new MockProposalService();