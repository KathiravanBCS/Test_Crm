import type { MasterStatus, MasterService, MasterCurrency, VstnBranch } from '@/types/common';
import { masterStatuses, masterServices, masterCurrencies, vstnBranches } from '../data/master';
import { delay } from '../utils';

export class MockMasterDataService {
  private statuses: MasterStatus[] = [...masterStatuses];
  private services: MasterService[] = [...masterServices];
  private currencies: MasterCurrency[] = [...masterCurrencies];
  private branches: VstnBranch[] = [...vstnBranches];
  private delayMs: number = 200;

  constructor() {
    // Bind methods to preserve 'this' context
    this.getStatuses = this.getStatuses.bind(this);
    this.getStatusesByContext = this.getStatusesByContext.bind(this);
    this.getServices = this.getServices.bind(this);
    this.getServicesByCategory = this.getServicesByCategory.bind(this);
    this.getCurrencies = this.getCurrencies.bind(this);
    this.getBaseCurrency = this.getBaseCurrency.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.updateService = this.updateService.bind(this);
    this.getExchangeRate = this.getExchangeRate.bind(this);
    this.getBranches = this.getBranches.bind(this);
    this.getBranchById = this.getBranchById.bind(this);
  }

  async getStatuses(): Promise<MasterStatus[]> {
    await delay(this.delayMs);
    return [...this.statuses];
  }

  async getStatusesByContext(context: string): Promise<MasterStatus[]> {
    await delay(this.delayMs);
    return this.statuses.filter(status => status.context === context);
  }

  async getServices(): Promise<MasterService[]> {
    await delay(this.delayMs);
    return [...this.services];
  }

  async getServicesByCategory(category: string): Promise<MasterService[]> {
    await delay(this.delayMs);
    return this.services.filter(service => service.category === category);
  }

  async getCurrencies(): Promise<MasterCurrency[]> {
    await delay(this.delayMs);
    return [...this.currencies];
  }

  async getBaseCurrency(): Promise<MasterCurrency> {
    await delay(this.delayMs);
    const baseCurrency = this.currencies.find(c => c.isBaseCurrency);
    if (!baseCurrency) {
      throw new Error('No base currency found');
    }
    return baseCurrency;
  }

  async updateStatus(id: number, data: Partial<MasterStatus>): Promise<MasterStatus> {
    await delay(this.delayMs);
    const index = this.statuses.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Status with id ${id} not found`);
    }

    const updated = {
      ...this.statuses[index],
      ...data
    };

    this.statuses[index] = updated;
    return updated;
  }

  async updateService(id: number, data: Partial<MasterService>): Promise<MasterService> {
    await delay(this.delayMs);
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Service with id ${id} not found`);
    }

    const updated = {
      ...this.services[index],
      ...data
    };

    this.services[index] = updated;
    return updated;
  }

  // Helper to get exchange rates (mock implementation)
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    await delay(this.delayMs);
    
    // Mock exchange rates to INR
    const rateToINR: Record<string, number> = {
      'INR': 1,
      'USD': 83.25,
      'AED': 22.67,
      'EUR': 90.45,
      'GBP': 105.32,
      'SGD': 61.89
    };

    if (fromCurrency === toCurrency) return 1;
    
    if (toCurrency === 'INR') {
      return rateToINR[fromCurrency] || 1;
    }
    
    if (fromCurrency === 'INR') {
      return 1 / (rateToINR[toCurrency] || 1);
    }

    // Cross currency calculation through INR
    const fromToINR = rateToINR[fromCurrency] || 1;
    const toToINR = rateToINR[toCurrency] || 1;
    
    return fromToINR / toToINR;
  }

  async getBranches(): Promise<VstnBranch[]> {
    await delay(this.delayMs);
    return [...this.branches];
  }

  async getBranchById(id: number): Promise<VstnBranch | null> {
    await delay(this.delayMs);
    const branch = this.branches.find(b => b.id === id);
    return branch || null;
  }
}

// Create singleton instance
export const mockMasterDataService = new MockMasterDataService();