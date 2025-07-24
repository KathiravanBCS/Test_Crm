import { mockCustomerService } from './implementations/CustomerService';
import { mockMasterDataService } from './implementations/MasterDataService';
import { mockPartnerService } from './implementations/PartnerService';
import { proposalService as mockProposalService } from './implementations/ProposalService';
import { mockServiceItemService } from './implementations/ServiceItemService';
import { CommentService } from './implementations/CommentService';
import { EngagementLetterService } from './implementations/EngagementLetterService';
import { engagementService } from './implementations/EngagementService';
import { mockEmployeeService } from './implementations/EmployeeService';
import { mockTaskService } from './implementations/TaskService';
import { mockDocumentService } from './implementations/DocumentService';
import { mockEmployees } from './data/employees';
import { outlookServices } from '@/services/graph';

// Create comment service instance
const commentServiceInstance = new CommentService();

// Wrap comment service to match API interface
const mockCommentService = {
  list: (entityType: string, entityId: number) => commentServiceInstance.getComments(entityType, entityId),
  create: (data: any) => commentServiceInstance.createComment(data),
  update: (id: number, data: any) => commentServiceInstance.updateComment(id, data),
  delete: (id: number) => commentServiceInstance.deleteComment(id),
};

// Create engagement letter service instance
const mockEngagementLetterService = new EngagementLetterService();

// Export all mock services
export const MockServices = {
  customers: mockCustomerService,
  masterData: mockMasterDataService,
  partners: mockPartnerService,
  proposals: mockProposalService,
  serviceItems: mockServiceItemService,
  comments: mockCommentService,
  engagementLetters: mockEngagementLetterService,
  engagements: engagementService,
  employees: mockEmployeeService, // Using mock employee service
  tasks: mockTaskService,
  
  // Master service (for statuses)
  master: {
    getStatuses: (context: string) => mockMasterDataService.getStatusesByContext(context)
  },
  
  // Auth service (placeholder)
  auth: {
    getPermissions: async () => {
      // Return empty rules to use default role-based permissions
      return { rules: [] };
    }
  },
  
  // Documents service with SharePoint integration
  documents: {
    getByEntity: (entityType: string, entityId: number, filters?: any) => 
      mockDocumentService.getByEntity(entityType, entityId, filters),
    get: (id: number) => mockDocumentService.get(id),
    createUploadSession: (data: any) => mockDocumentService.createUploadSession(data),
    finalizeUpload: (sessionId: string) => mockDocumentService.finalizeUpload(sessionId),
    download: (id: number) => mockDocumentService.download(id),
    delete: (id: number) => mockDocumentService.delete(id),
    review: (id: number, data: any) => mockDocumentService.review(id, data),
    share: (data: any) => mockDocumentService.share(data),
    getActivities: (id: number) => mockDocumentService.getActivities(id),
    getPermissions: (id: number) => mockDocumentService.getPermissions(id),
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