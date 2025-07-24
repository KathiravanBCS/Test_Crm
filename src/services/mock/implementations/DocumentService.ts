import { DocumentMetadata, DocumentUploadRequest, DocumentActivity, DocumentPermission } from '@/features/documents/types';
import { SharePointDocumentService } from '@/features/documents/services/sharepoint-service';
import { SHAREPOINT_CONFIG } from '@/features/documents/config/sharepoint-config';
import { mockEmployees } from '../data/employees';
import { OutlookServiceFactory } from '@/services/graph/services/service-factory';

// In-memory storage for document metadata
const documentMetadataStore = new Map<number, DocumentMetadata>();
let nextDocumentId = 1;

export class MockDocumentService {
  private sharePointService: SharePointDocumentService | null = null;

  /**
   * Get SharePoint service instance
   */
  private async getSharePointService(): Promise<SharePointDocumentService> {
    if (!this.sharePointService) {
      // Get Graph client from the factory
      const factory = OutlookServiceFactory as any;
      if (!factory.graphClient) {
        throw new Error('Graph client not initialized. Please ensure user is authenticated and OutlookInitializer is mounted.');
      }
      this.sharePointService = new SharePointDocumentService(factory.graphClient);
    }
    return this.sharePointService;
  }

  // Get the folder path for an entity
  private getFolderPath(entityType: string, entityId: number): string {
    switch (entityType) {
      case 'customer':
        return `${SHAREPOINT_CONFIG.basePaths.customers}/${entityId}`;
      case 'partner':
        return `${SHAREPOINT_CONFIG.basePaths.partners}/${entityId}`;
      case 'proposal':
      case 'engagement_letter':
      case 'engagement':
      case 'engagement_service_item':
        return `${SHAREPOINT_CONFIG.basePaths.internal}/${entityType}/${entityId}`;
      default:
        return `${SHAREPOINT_CONFIG.basePaths.internal}/others/${entityType}/${entityId}`;
    }
  }

  async getByEntity(entityType: string, entityId: number, filters?: any): Promise<DocumentMetadata[]> {
    try {
      // Get documents from SharePoint
      const folderPath = this.getFolderPath(entityType, entityId);
      console.log('Fetching documents from SharePoint:', { entityType, entityId, folderPath });
      
      const factory = OutlookServiceFactory as any;
      
      if (!factory.graphClient) {
        // If Graph client is not initialized, return cached documents
        console.warn('Graph client not initialized, returning cached documents only');
        return this.getCachedDocuments(entityType, entityId, filters);
      }

      try {
        // Fetch documents from SharePoint folder
        const apiPath = `/sites/${SHAREPOINT_CONFIG.siteId}/drives/${SHAREPOINT_CONFIG.driveId}/root:${folderPath}:/children`;
        console.log('SharePoint API path:', apiPath);
        
        const response = await factory.graphClient
          .api(apiPath)
          .select('id,name,size,file,webUrl,createdDateTime,lastModifiedDateTime,createdBy,@microsoft.graph.downloadUrl')
          .get();
        
        console.log('SharePoint response:', response);

        const sharePointDocs: DocumentMetadata[] = [];
        
        if (response && response.value) {
          for (const item of response.value) {
            // Only process files, not folders
            if (item.file) {
              // Check if we have this document in cache
              let existingDoc = Array.from(documentMetadataStore.values()).find(
                doc => doc.sharepointItemId === item.id
              );

              if (!existingDoc) {
                // Create new document metadata
                const newDoc: DocumentMetadata = {
                  id: nextDocumentId++,
                  entityType: entityType as any,
                  entityId: entityId,
                  sharepointItemId: item.id,
                  sharepointDriveId: SHAREPOINT_CONFIG.driveId,
                  fileName: item.name,
                  filePath: `${folderPath}/${item.name}`,
                  fileType: item.file.mimeType || 'application/octet-stream',
                  fileSizeKb: Math.round(item.size / 1024),
                  version: 1,
                  status: 'approved', // Default status for existing files
                  uploadedBy: mockEmployees[0], // Default user
                  uploadedAt: item.createdDateTime,
                  webUrl: item.webUrl,
                  downloadUrl: item['@microsoft.graph.downloadUrl'] || ''
                };
                
                // Add to cache
                documentMetadataStore.set(newDoc.id, newDoc);
                sharePointDocs.push(newDoc);
              } else {
                // Update existing document with latest info
                existingDoc.fileName = item.name;
                existingDoc.fileSizeKb = Math.round(item.size / 1024);
                existingDoc.webUrl = item.webUrl;
                existingDoc.downloadUrl = item['@microsoft.graph.downloadUrl'] || '';
                sharePointDocs.push(existingDoc);
              }
            }
          }
        }

        // Apply filters if provided
        if (filters?.status) {
          return sharePointDocs.filter(doc => doc.status === filters.status);
        }
        
        return sharePointDocs;
      } catch (error) {
        console.error('Error fetching documents from SharePoint:', error);
        // Fall back to cached documents
        return this.getCachedDocuments(entityType, entityId, filters);
      }
    } catch (error) {
      console.error('Error in getByEntity:', error);
      return this.getCachedDocuments(entityType, entityId, filters);
    }
  }

  private getCachedDocuments(entityType: string, entityId: number, filters?: any): DocumentMetadata[] {
    const documents = Array.from(documentMetadataStore.values()).filter(
      doc => doc.entityType === entityType && doc.entityId === entityId
    );

    if (filters?.status) {
      return documents.filter(doc => doc.status === filters.status);
    }
    
    return documents;
  }

  async get(id: number): Promise<DocumentMetadata> {
    const document = documentMetadataStore.get(id);
    if (!document) {
      throw new Error('Document not found');
    }
    return document;
  }

  async createUploadSession(data: {
    entityType: string;
    entityId: number;
    fileName: string;
    fileSize: number;
    tags?: string[];
    description?: string;
  }): Promise<{ sessionId: string; uploadUrl: string }> {
    try {
      const sharePointService = await this.getSharePointService();
      const folderPath = this.getFolderPath(data.entityType, data.entityId);
      
      // Ensure folder structure exists
      await sharePointService.ensureFolderStructure(data.entityType, { 
        id: data.entityId,
        name: `Entity_${data.entityId}`
      });
      
      // For files larger than 4MB, use upload session
      if (data.fileSize > 4 * 1024 * 1024) {
        const session = await sharePointService.createUploadSession(folderPath, data.fileName);
        
        // Store metadata for later
        const sessionId = session.sessionId || `session-${Date.now()}`;
        const metadata: Partial<DocumentMetadata> = {
          entityType: data.entityType as any,
          entityId: data.entityId,
          fileName: data.fileName,
          filePath: `${folderPath}/${data.fileName}`,
          tags: data.tags,
          description: data.description,
        };
        
        // Store in session storage for finalize
        sessionStorage.setItem(sessionId, JSON.stringify(metadata));
        
        return {
          sessionId,
          uploadUrl: session.uploadUrl
        };
      } else {
        // For small files, return direct upload URL
        // We need to get the Graph client to construct the URL
        const factory = OutlookServiceFactory as any;
        if (!factory.graphClient) {
          throw new Error('Graph client not initialized');
        }

        const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_CONFIG.siteId}/drives/${SHAREPOINT_CONFIG.driveId}/root:/${folderPath}/${data.fileName}:/content`;
        const sessionId = `session-${Date.now()}`;
        
        const metadata: Partial<DocumentMetadata> = {
          entityType: data.entityType as any,
          entityId: data.entityId,
          fileName: data.fileName,
          filePath: `${folderPath}/${data.fileName}`,
          tags: data.tags,
          description: data.description,
        };
        
        sessionStorage.setItem(sessionId, JSON.stringify(metadata));
        
        return {
          sessionId,
          uploadUrl
        };
      }
    } catch (error) {
      console.error('Error creating upload session:', error);
      throw error;
    }
  }

  async finalizeUpload(sessionId: string): Promise<DocumentMetadata> {
    try {
      const sharePointService = await this.getSharePointService();
      
      // Get metadata from session storage
      const metadataStr = sessionStorage.getItem(sessionId);
      if (!metadataStr) {
        throw new Error('Session not found');
      }
      
      const metadata = JSON.parse(metadataStr) as Partial<DocumentMetadata>;
      sessionStorage.removeItem(sessionId);
      
      // Get the uploaded file details from SharePoint
      const fileDetails = await sharePointService.getFileMetadata(metadata.filePath!);
      
      // Create complete document metadata
      const document: DocumentMetadata = {
        id: nextDocumentId++,
        entityType: metadata.entityType!,
        entityId: metadata.entityId!,
        sharepointItemId: fileDetails.sharepoint_item_id,
        sharepointDriveId: fileDetails.sharepoint_drive_id,
        fileName: metadata.fileName!,
        filePath: metadata.filePath!,
        fileType: fileDetails.file_type || 'application/octet-stream',
        fileSizeKb: fileDetails.file_size_kb,
        version: 1,
        status: 'draft',
        tags: metadata.tags,
        description: metadata.description,
        uploadedBy: mockEmployees[0], // Mock user
        uploadedAt: fileDetails.created_at,
        webUrl: fileDetails.web_url,
        downloadUrl: fileDetails.download_url
      };
      
      // Store in our metadata store
      documentMetadataStore.set(document.id, document);
      
      return document;
    } catch (error) {
      console.error('Error finalizing upload:', error);
      throw error;
    }
  }

  async download(id: number): Promise<string> {
    const document = documentMetadataStore.get(id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Return the SharePoint download URL
    return document.downloadUrl;
  }

  async delete(id: number): Promise<void> {
    const document = documentMetadataStore.get(id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    try {
      const factory = OutlookServiceFactory as any;
      if (!factory.graphClient) {
        throw new Error('Graph client not initialized');
      }
      
      // Delete from SharePoint
      await factory.graphClient
        .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drives/${SHAREPOINT_CONFIG.driveId}/items/${document.sharepointItemId}`)
        .delete();
      
      // Remove from metadata store
      documentMetadataStore.delete(id);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  async review(id: number, data: { reviewStatus: 'approved' | 'rejected'; notes?: string }): Promise<DocumentMetadata> {
    const document = documentMetadataStore.get(id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Update document metadata
    document.reviewStatus = data.reviewStatus;
    document.status = data.reviewStatus === 'approved' ? 'approved' : 'rejected';
    document.reviewedBy = mockEmployees[0]; // Mock user
    document.reviewedAt = new Date().toISOString();
    document.approvalNotes = data.notes;
    
    documentMetadataStore.set(id, document);
    
    return document;
  }

  async share(data: { documentId: number; shareWith: string[]; message?: string }): Promise<void> {
    const document = documentMetadataStore.get(data.documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    try {
      const sharePointService = await this.getSharePointService();
      
      // Use SharePoint service to share the document
      await sharePointService.shareDocument(
        document.sharepointItemId,
        data.shareWith,
        'read',
        {
          message: data.message,
          sendInvitation: true,
          requireSignIn: true
        }
      );
      
      console.log('Document shared successfully');
    } catch (error) {
      console.error('Error sharing document:', error);
      throw error;
    }
  }

  async getActivities(id: number): Promise<DocumentActivity[]> {
    // Return mock activities for now
    const document = documentMetadataStore.get(id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    const activities: DocumentActivity[] = [
      {
        id: 1,
        documentId: id,
        action: 'uploaded',
        activityType: 'uploaded',
        activityDescription: `Document uploaded`,
        performedBy: document.uploadedBy,
        performedAt: document.uploadedAt,
      }
    ];
    
    if (document.reviewedAt) {
      activities.push({
        id: 2,
        documentId: id,
        action: 'reviewed',
        activityType: 'reviewed',
        activityDescription: `Document ${document.reviewStatus}`,
        performedBy: document.reviewedBy!,
        performedAt: document.reviewedAt,
      });
    }
    
    return activities;
  }

  async getPermissions(id: number): Promise<DocumentPermission> {
    // Return default permissions
    return {
      canView: true,
      canEdit: true,
      canDelete: true,
      canShare: true
    };
  }
}

export const mockDocumentService = new MockDocumentService();