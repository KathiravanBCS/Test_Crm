import { BaseMockService } from './BaseService';
import type { Engagement, EngagementFormData } from '@/features/engagements/types';
import { engagements } from '../data/engagements';

class EngagementService extends BaseMockService<Engagement, EngagementFormData, Partial<EngagementFormData>> {
  constructor() {
    super(engagements);
  }

  // Legacy method names for backward compatibility
  async getEngagements(): Promise<Engagement[]> {
    return super.getAll();
  }

  async getEngagement(id: number): Promise<Engagement> {
    return super.getById(id);
  }

  // Override create to add engagement-specific logic
  async create(data: EngagementFormData): Promise<Engagement> {
    // Generate engagement code
    const year = new Date().getFullYear();
    const existingCodes = this.data
      .map(eng => eng.engagementCode)
      .filter(code => code?.startsWith(`ENG-${year}-`));
    
    const nextNumber = existingCodes.length + 1;
    const engagementCode = `ENG-${year}-${String(nextNumber).padStart(3, '0')}`;
    
    // Convert dates to strings
    const newEngagement = {
      ...data,
      engagementCode,
      statusId: 16, // Not Started
      progressPercentage: 0,
      scheduleVariance: 0,
      isDelayed: false,
      startDate: data.startDate ? data.startDate.toISOString() : '',
      endDate: data.endDate ? data.endDate.toISOString() : '',
      phases: data.phases.map(phase => ({
        ...phase,
        phaseStartDate: phase.phaseStartDate ? phase.phaseStartDate.toISOString() : undefined,
        phaseEndDate: phase.phaseEndDate ? phase.phaseEndDate.toISOString() : undefined,
        serviceItems: phase.serviceItems.map(item => ({
          ...item,
          plannedStartDate: item.plannedStartDate ? item.plannedStartDate.toISOString() : undefined,
          plannedEndDate: item.plannedEndDate ? item.plannedEndDate.toISOString() : undefined,
        }))
      }))
    };
    
    return super.create(newEngagement as any);
  }

  // Override update to add engagement-specific logic
  async update(id: number, data: Partial<EngagementFormData>): Promise<Engagement> {
    // Convert dates to strings
    const updateData: any = {
      ...data,
      startDate: data.startDate ? data.startDate.toISOString() : undefined,
      endDate: data.endDate ? data.endDate.toISOString() : undefined,
    };
    
    if (data.phases) {
      updateData.phases = data.phases.map(phase => ({
        ...phase,
        phaseStartDate: phase.phaseStartDate ? phase.phaseStartDate.toISOString() : undefined,
        phaseEndDate: phase.phaseEndDate ? phase.phaseEndDate.toISOString() : undefined,
        serviceItems: phase.serviceItems.map(item => ({
          ...item,
          plannedStartDate: item.plannedStartDate ? item.plannedStartDate.toISOString() : undefined,
          plannedEndDate: item.plannedEndDate ? item.plannedEndDate.toISOString() : undefined,
        }))
      }));
    }
    
    return super.update(id, updateData);
  }
  
  // Legacy method names for backward compatibility
  async createEngagement(data: Partial<Engagement>): Promise<Engagement> {
    // Convert string dates to Date objects for the form data
    const formData: EngagementFormData = {
      engagementName: data.engagementName || '',
      engagementLetterId: data.engagementLetterId || 0,
      managerId: data.managerId,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      phases: []
    };
    return this.create(formData);
  }

  async updateEngagement(id: number, data: Partial<Engagement>): Promise<Engagement> {
    // Convert string dates to Date objects for the form data
    const formData: Partial<EngagementFormData> = {
      engagementName: data.engagementName,
      engagementLetterId: data.engagementLetterId,
      managerId: data.managerId,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    };
    return this.update(id, formData);
  }

  async deleteEngagement(id: number): Promise<void> {
    return super.delete(id);
  }
}

export const engagementService = new EngagementService();