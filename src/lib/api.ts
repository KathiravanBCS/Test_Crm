import { apiClient } from './api-client';
import { API_ENDPOINTS } from './api-endpoints';
import { MockServices } from '@/services/mock';
import type { Customer, CustomerFormData } from '@/features/customers/types';
import type { ContactPerson, ContactPersonFormData } from '@/types/common';
import type { Partner, PartnerFormData, PartnerCommission, PartnerCommissionFormData } from '@/features/partners/types';
import type { ServiceItem, ServiceItemWithSubItems, ServiceItemFilters } from '@/types/service-item';
import type { EngagementLetter, EngagementLetterFormData } from '@/features/engagement-letters/types';
import type { Engagement, EngagementFormData } from '@/features/engagements/types';
import type { EmployeeProfile } from '@/types';
import type { UserComment } from '@/features/comments/types';
import type { Task } from '@/features/tasks/types';
import type { DocumentMetadata, DocumentActivity, DocumentPermission } from '@/features/documents/types';
import { outlookServices } from '@/services/graph';

// Check if we should use mock services
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'; // Default to true

// Real service implementations
const RealServices = {
  // Customer services
  customers: {
    getAll: async () => {
      const response = await apiClient.get<{ count: number; data: Customer[] }>(API_ENDPOINTS.customers.list);
      return response.data;
    },
    getById: (id: number) => apiClient.get<Customer>(API_ENDPOINTS.customers.get(id)),
    create: (data: CustomerFormData) => apiClient.post<Customer>(API_ENDPOINTS.customers.create, data),
    update: (id: number, data: CustomerFormData) => apiClient.put<Customer>(API_ENDPOINTS.customers.update(id), data),
    delete: (id: number) => apiClient.delete(API_ENDPOINTS.customers.delete(id)),
    
    getContacts: (customerId: number) => apiClient.get<ContactPerson[]>(API_ENDPOINTS.customers.contacts.list(customerId)),
    addContact: (customerId: number, contact: ContactPersonFormData) => apiClient.post<ContactPerson>(API_ENDPOINTS.customers.contacts.create(customerId), contact),
    updateContact: (contactId: number, contact: ContactPersonFormData) => apiClient.put<ContactPerson>(API_ENDPOINTS.customers.contacts.update(contactId), contact),
    deleteContact: (contactId: number) => apiClient.delete(API_ENDPOINTS.customers.contacts.delete(contactId))
  },

  // Master data services
  masterData: {
    getStatuses: () => apiClient.get(API_ENDPOINTS.masters.statuses),
    getStatusesByContext: (context: string) => apiClient.get(API_ENDPOINTS.masters.statusesByContext(context)),
    getServices: () => apiClient.get(API_ENDPOINTS.masters.services),
    getServicesByCategory: (category: string) => apiClient.get(API_ENDPOINTS.masters.servicesByCategory(category)),
    getCurrencies: () => apiClient.get(API_ENDPOINTS.masters.currencies),
    getBaseCurrency: () => apiClient.get(API_ENDPOINTS.masters.baseCurrency),
    getBranches: () => apiClient.get(API_ENDPOINTS.masters.branches),
    updateStatus: (id: number, data: any) => apiClient.patch(API_ENDPOINTS.masters.updateStatus(id), data),
    updateService: (id: number, data: any) => apiClient.patch(API_ENDPOINTS.masters.updateService(id), data),
    getExchangeRate: (from: string, to: string, date?: Date) => 
      apiClient.get(API_ENDPOINTS.masters.exchangeRate, {
        from,
        to,
        date: date?.toISOString()
      })
  },

  // Partner services
  partners: {
    getAll: () => apiClient.get<Partner[]>(API_ENDPOINTS.partners.list),
    getById: (id: number) => apiClient.get<Partner>(API_ENDPOINTS.partners.get(id)),
    create: (data: PartnerFormData) => apiClient.post<Partner>(API_ENDPOINTS.partners.create, data),
    update: (id: number, data: PartnerFormData) => apiClient.put<Partner>(API_ENDPOINTS.partners.update(id), data),
    delete: (id: number) => apiClient.delete(API_ENDPOINTS.partners.delete(id)),
    
    getCommissions: () => apiClient.get<PartnerCommission[]>(API_ENDPOINTS.commissions.list),
    createCommission: (data: PartnerCommissionFormData) => apiClient.post<PartnerCommission>(API_ENDPOINTS.commissions.create, data),
    updateCommission: (id: number, data: PartnerCommissionFormData) => apiClient.put<PartnerCommission>(API_ENDPOINTS.commissions.update(id), data)
  },

  // Proposal services
  proposals: {
    getAll: () => apiClient.get(API_ENDPOINTS.proposals.list),
    getById: (id: number) => apiClient.get(API_ENDPOINTS.proposals.get(id)),
    create: (data: any) => apiClient.post(API_ENDPOINTS.proposals.create, data),
    update: (id: number, data: any) => apiClient.put(API_ENDPOINTS.proposals.update(id), data),
    delete: (id: number) => apiClient.delete(API_ENDPOINTS.proposals.delete(id)),
    approve: (id: number) => apiClient.post(API_ENDPOINTS.proposals.approve(id)),
    reject: (id: number, reason?: string) => apiClient.post(API_ENDPOINTS.proposals.reject(id), { reason })
  },

  // Auth services
  auth: {
    getPermissions: () => apiClient.get(API_ENDPOINTS.auth.permissions)
  },

  // Service item services
  serviceItems: {
    getAll: () => apiClient.get<ServiceItemWithSubItems[]>(API_ENDPOINTS.serviceItems.list),
    getById: (id: number) => apiClient.get<ServiceItemWithSubItems>(API_ENDPOINTS.serviceItems.get(id)),
    getWithFilters: (filters: ServiceItemFilters) => apiClient.get<ServiceItemWithSubItems[]>(API_ENDPOINTS.serviceItems.list, filters as any),
    getByCategory: (category: string) => apiClient.get<ServiceItemWithSubItems[]>(API_ENDPOINTS.serviceItems.byCategory(category)),
    getActiveItems: () => apiClient.get<ServiceItemWithSubItems[]>(API_ENDPOINTS.serviceItems.active),
    create: (data: Partial<ServiceItem>) => apiClient.post<ServiceItemWithSubItems>(API_ENDPOINTS.serviceItems.create, data),
    update: (id: number, data: Partial<ServiceItem>) => apiClient.put<ServiceItemWithSubItems>(API_ENDPOINTS.serviceItems.update(id), data),
    delete: (id: number) => apiClient.delete(API_ENDPOINTS.serviceItems.delete(id))
  },

  // Engagement letter services
  engagementLetters: {
    getAll: () => apiClient.get<EngagementLetter[]>(API_ENDPOINTS.engagementLetters.list),
    getById: (id: number) => apiClient.get<EngagementLetter>(API_ENDPOINTS.engagementLetters.get(id)),
    create: (data: EngagementLetterFormData) => apiClient.post<EngagementLetter>(API_ENDPOINTS.engagementLetters.create, data),
    createFromProposal: (proposalId: number) => apiClient.post<EngagementLetter>(API_ENDPOINTS.proposals.createEngagementLetter(proposalId)),
    update: (id: number, data: Partial<EngagementLetterFormData>) => apiClient.put<EngagementLetter>(API_ENDPOINTS.engagementLetters.update(id), data),
    delete: (id: number) => apiClient.delete(API_ENDPOINTS.engagementLetters.delete(id)),
    approve: (id: number) => apiClient.post(API_ENDPOINTS.engagementLetters.approve(id)),
    reject: (id: number, reason?: string) => apiClient.post(API_ENDPOINTS.engagementLetters.reject(id), { reason }),
    sendForApproval: (id: number) => apiClient.post(API_ENDPOINTS.engagementLetters.sendForApproval(id))
  },

  // Employee services
  employees: {
    getAll: () => apiClient.get<EmployeeProfile[]>(API_ENDPOINTS.employees.list),
    getById: (id: number) => apiClient.get<EmployeeProfile>(API_ENDPOINTS.employees.get(id)),
    create: (data: any) => apiClient.post<EmployeeProfile>(API_ENDPOINTS.employees.create, data),
    update: (id: number, data: any) => apiClient.put<EmployeeProfile>(API_ENDPOINTS.employees.update(id), data),
    delete: (id: number) => apiClient.delete(API_ENDPOINTS.employees.delete(id)),
    search: (searchTerm: string) => apiClient.get<EmployeeProfile[]>(API_ENDPOINTS.employees.list, { search: searchTerm })
  },

  // Engagement services
  engagements: {
    getAll: () => apiClient.get<Engagement[]>(API_ENDPOINTS.engagements.list),
    getById: (id: number) => apiClient.get<Engagement>(API_ENDPOINTS.engagements.get(id)),
    create: (data: EngagementFormData) => apiClient.post<Engagement>(API_ENDPOINTS.engagements.create, data),
    update: (id: number, data: Partial<EngagementFormData>) => apiClient.put<Engagement>(API_ENDPOINTS.engagements.update(id), data),
    delete: (id: number) => apiClient.delete(API_ENDPOINTS.engagements.delete(id)),
    updateStatus: (id: number, statusId: number) => apiClient.patch(API_ENDPOINTS.engagements.updateStatus(id), { statusId }),
    updateProgress: (id: number, progress: number) => apiClient.patch(API_ENDPOINTS.engagements.updateProgress(id), { progress })
  },

  // Comment services
  comments: {
    list: (entityType: string, entityId: number) => apiClient.get<UserComment[]>(API_ENDPOINTS.comments.list(entityType, entityId)),
    create: (data: any) => apiClient.post<UserComment>(API_ENDPOINTS.comments.create, data),
    update: (id: number, data: any) => apiClient.put<UserComment>(API_ENDPOINTS.comments.update(id), data),
    delete: (id: number) => apiClient.delete(API_ENDPOINTS.comments.delete(id))
  },

  // Task services
  tasks: {
    getAll: (params?: any) => apiClient.get<Task[]>(API_ENDPOINTS.tasks.list, params),
    getById: (id: number) => apiClient.get<Task>(API_ENDPOINTS.tasks.get(id)),
    create: (data: any) => apiClient.post<Task>(API_ENDPOINTS.tasks.create, data),
    update: (id: number, data: any) => apiClient.put<Task>(API_ENDPOINTS.tasks.update(id), data),
    delete: (id: number) => apiClient.delete(API_ENDPOINTS.tasks.delete(id)),
    approve: (id: number) => apiClient.post(API_ENDPOINTS.tasks.approve(id))
  },

  // Master services (for statuses)
  master: {
    getStatuses: (context: string) => apiClient.get(API_ENDPOINTS.masters.statusesByContext(context))
  },

  // Document services
  documents: {
    getByEntity: (entityType: string, entityId: number, filters?: any) => 
      apiClient.get<DocumentMetadata[]>(API_ENDPOINTS.documents.list(entityType, entityId), filters),
    get: (id: number) => apiClient.get<DocumentMetadata>(API_ENDPOINTS.documents.get(id)),
    createUploadSession: (data: any) => apiClient.post<{ sessionId: string; uploadUrl: string }>(API_ENDPOINTS.documents.createUploadSession, data),
    finalizeUpload: (sessionId: string) => apiClient.post<DocumentMetadata>(API_ENDPOINTS.documents.finalizeUpload(sessionId)),
    download: (id: number) => `${apiClient['baseURL']}${API_ENDPOINTS.documents.download(id)}`,
    delete: (id: number) => apiClient.delete(API_ENDPOINTS.documents.delete(id)),
    review: (id: number, data: any) => apiClient.post<DocumentMetadata>(API_ENDPOINTS.documents.review(id), data),
    share: (data: any) => apiClient.post<void>(API_ENDPOINTS.documents.share(data.documentId), data),
    getActivities: (id: number) => apiClient.get<DocumentActivity[]>(API_ENDPOINTS.documents.activities(id)),
    getPermissions: (id: number) => apiClient.get<DocumentPermission>(API_ENDPOINTS.documents.permissions(id)),
  },

  // Outlook services (Graph API or Backend)
  outlook: {
    email: outlookServices.email,
    calendar: outlookServices.calendar,
    isUsingBackend: outlookServices.isUsingBackend,
    useBackend: outlookServices.useBackend,
    useGraphAPI: outlookServices.useGraphAPI
  }
};

// Export the appropriate service based on environment
export const api = USE_MOCK ? MockServices : RealServices;

// Export hook to check if using mock
export const useIsMockApi = () => USE_MOCK;

// Re-export for backward compatibility
export { apiClient };