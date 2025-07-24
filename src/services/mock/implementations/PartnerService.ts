import { BaseMockService } from './BaseService';
import type { Partner, PartnerFormData, PartnerFilters, PartnerCommission, PartnerCommissionFormData, PartnerCommissionFilters } from '@/features/partners/types';
import { mockPartners, generatePartner, generatePartnerCommission } from '../data/partners';

class PartnerService extends BaseMockService<Partner, PartnerFormData, PartnerFormData> {
  private commissions: PartnerCommission[] = [];
  
  constructor() {
    // Use existing mock partners
    super([...mockPartners], 111, 300);
    
    // Generate some mock commissions
    this.commissions = Array.from({ length: 30 }, (_, i) => 
      generatePartnerCommission(i + 1, mockPartners[i % mockPartners.length].id)
    );
    
    // Bind methods to preserve 'this' context
    this.getCommissions = this.getCommissions.bind(this);
    this.createCommission = this.createCommission.bind(this);
    this.updateCommission = this.updateCommission.bind(this);
  }

  async getAll(_filters?: PartnerFilters): Promise<Partner[]> {
    // Return all partners - filtering is done on client side
    return this.data;
  }

  async getById(id: number): Promise<Partner> {
    const partner = this.data.find(item => item.id === id);
    if (!partner) throw new Error('Partner not found');
    
    // Add relations
    return {
      ...partner,
      contacts: [],
      addresses: [],
      referredCustomersCount: partner.referredCustomersCount || 0,
      totalCommissionAmount: this.commissions
        .filter(c => c.partnerId === id)
        .reduce((sum, c) => sum + c.commissionAmount, 0),
    };
  }

  async create(data: PartnerFormData): Promise<Partner> {
    const { contacts, addresses, ...partnerData } = data;
    const newPartner: Partner = {
      id: this.nextId++,
      partnerCode: partnerData.partnerCode || `PRTN-${new Date().getFullYear()}-${String(this.nextId).padStart(3, '0')}`,
      partnerName: partnerData.partnerName,
      partnerType: partnerData.partnerType,
      pan: partnerData.pan,
      gstin: partnerData.gstin,
      webUrl: partnerData.webUrl,
      currencyCode: partnerData.currencyCode || 'INR',
      paymentTerm: partnerData.paymentTerm,
      commissionType: partnerData.commissionType,
      commissionRate: partnerData.commissionRate,
      commissionCurrencyCode: partnerData.commissionCurrencyCode || partnerData.currencyCode || 'INR',
      partnerDescription: partnerData.partnerDescription,
      onboardedDate: partnerData.onboardedDate || new Date().toISOString(),
      bankAccounts: partnerData.bankAccounts || [],
      referredCustomersCount: 0,
      totalCommissionAmount: 0,
      activeStatus: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.data.push(newPartner);
    return newPartner;
  }

  async update(id: number, data: PartnerFormData): Promise<Partner> {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Partner not found');
    
    const { contacts, addresses, ...partnerData } = data;
    const updated: Partner = {
      ...this.data[index],
      ...partnerData,
      id,
      updatedAt: new Date(),
    };
    
    this.data[index] = updated;
    return updated;
  }

  async delete(id: number): Promise<void> {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Partner not found');
    
    // Remove from array
    this.data.splice(index, 1);
  }

  // Commission methods
  async getCommissions(_filters?: PartnerCommissionFilters): Promise<PartnerCommission[]> {
    // Return all commissions - filtering can be done on client side
    return this.commissions.map(c => ({
      ...c,
      partner: this.data.find(p => p.id === c.partnerId),
    }));
  }

  async createCommission(data: PartnerCommissionFormData): Promise<PartnerCommission> {
    const newCommission: PartnerCommission = {
      ...data,
      id: this.commissions.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.commissions.push(newCommission);
    
    // Update partner's total commission
    const partner = this.data.find(p => p.id === data.partnerId);
    if (partner) {
      partner.totalCommissionAmount = (partner.totalCommissionAmount || 0) + data.commissionAmount;
    }
    
    return newCommission;
  }

  async updateCommission(id: number, data: PartnerCommissionFormData): Promise<PartnerCommission> {
    const index = this.commissions.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Commission not found');
    
    const oldCommission = this.commissions[index];
    const updated: PartnerCommission = {
      ...oldCommission,
      ...data,
      id,
      updatedAt: new Date(),
    };
    
    this.commissions[index] = updated;
    
    // Update partner's total commission if amount changed
    if (oldCommission.commissionAmount !== data.commissionAmount) {
      const partner = this.data.find(p => p.id === data.partnerId);
      if (partner) {
        partner.totalCommissionAmount = (partner.totalCommissionAmount || 0) 
          - oldCommission.commissionAmount 
          + data.commissionAmount;
      }
    }
    
    return updated;
  }
}

export const mockPartnerService = new PartnerService();