import { Client } from '@microsoft/microsoft-graph-client';
import { SHAREPOINT_CONFIG, buildSharePointPath } from '../config/sharepoint-config';

export class SharePointDocumentService {
  private graphClient: Client;
  
  constructor(graphClient: Client) {
    this.graphClient = graphClient;
  }
  
  /**
   * Creates folder structure in SharePoint if it doesn't exist
   */
  async ensureFolderStructure(
    entityType: string,
    entityData: any
  ): Promise<void> {
    const basePath = buildSharePointPath(entityType, entityData);
    
    // For customer/engagement entities, create subfolder structure
    if (['customer', 'engagement'].includes(entityType)) {
      for (const subfolder of SHAREPOINT_CONFIG.folderStructure.subfolders) {
        const fullPath = `${basePath}/${subfolder}`;
        await this.createFolderIfNotExists(fullPath);
      }
    } else {
      await this.createFolderIfNotExists(basePath);
    }
  }
  
  /**
   * Creates a folder in SharePoint if it doesn't exist
   */
  private async createFolderIfNotExists(folderPath: string): Promise<void> {
    try {
      // Check if folder exists
      await this.graphClient
        .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:${folderPath}`)
        .get();
    } catch (error) {
      // Folder doesn't exist, create it
      const pathParts = folderPath.split('/').filter(p => p);
      let currentPath = '';
      
      for (const part of pathParts) {
        const parentPath = currentPath || '/';
        currentPath = currentPath ? `${currentPath}/${part}` : `/${part}`;
        
        try {
          await this.graphClient
            .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:${parentPath}:/children`)
            .post({
              name: part,
              folder: {},
              '@microsoft.graph.conflictBehavior': 'rename'
            });
        } catch (err) {
          // Folder might already exist, continue
        }
      }
    }
  }
  
  /**
   * Gets an upload session for large file uploads
   */
  async createUploadSession(
    folderPath: string,
    fileName: string
  ): Promise<{ uploadUrl: string; sessionId: string }> {
    const fullPath = `${folderPath}/${fileName}`;
    
    const uploadSession = await this.graphClient
      .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:${fullPath}:/createUploadSession`)
      .post({
        item: {
          '@microsoft.graph.conflictBehavior': 'rename',
          name: fileName
        }
      });
    
    return {
      uploadUrl: uploadSession.uploadUrl,
      sessionId: uploadSession.id
    };
  }
  
  /**
   * Gets file metadata after upload
   */
  async getFileMetadata(filePath: string): Promise<any> {
    const driveItem = await this.graphClient
      .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:${filePath}`)
      .select('id,name,size,webUrl,createdDateTime,lastModifiedDateTime,@microsoft.graph.downloadUrl')
      .get();
    
    return {
      sharepoint_item_id: driveItem.id,
      sharepoint_drive_id: SHAREPOINT_CONFIG.driveId,
      file_name: driveItem.name,
      file_size_kb: Math.round(driveItem.size / 1024),
      web_url: driveItem.webUrl,
      download_url: driveItem['@microsoft.graph.downloadUrl'],
      created_at: driveItem.createdDateTime,
      modified_at: driveItem.lastModifiedDateTime
    };
  }
  
  /**
   * Shares a document with specific users
   */
  async shareDocument(
    itemId: string,
    recipients: string[],
    permission: 'read' | 'write',
    options: {
      message?: string;
      requireSignIn?: boolean;
      sendInvitation?: boolean;
      expirationDateTime?: string;
    }
  ): Promise<void> {
    await this.graphClient
      .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/items/${itemId}/invite`)
      .post({
        recipients: recipients.map(email => ({
          email: email
        })),
        message: options.message || 'Document shared via VSTN CRM',
        requireSignIn: options.requireSignIn ?? true,
        sendInvitation: options.sendInvitation ?? true,
        roles: [permission],
        expirationDateTime: options.expirationDateTime
      });
  }
  
  /**
   * Sets permissions for engagement folders based on user role
   */
  async setEngagementPermissions(
    folderPath: string,
    managerId: string,
    consultantIds: string[]
  ): Promise<void> {
    const folder = await this.graphClient
      .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:${folderPath}`)
      .get();
    
    // Grant manager full edit permissions
    if (managerId) {
      await this.graphClient
        .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/items/${folder.id}/permissions`)
        .post({
          roles: ['write'],
          grantedToIdentities: [{
            user: { id: managerId }
          }]
        });
    }
    
    // Grant consultants limited permissions
    for (const consultantId of consultantIds) {
      // Full access to working files
      const workingFilesPath = `${folderPath}/03_Working_Files`;
      const workingFiles = await this.graphClient
        .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:${workingFilesPath}`)
        .get();
        
      await this.graphClient
        .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/items/${workingFiles.id}/permissions`)
        .post({
          roles: ['write'],
          grantedToIdentities: [{
            user: { id: consultantId }
          }]
        });
      
      // Read-only access to proposal and engagement letter folders
      for (const readOnlyFolder of ['01_Proposal', '02_Engagement_Letter']) {
        const folderItemPath = `${folderPath}/${readOnlyFolder}`;
        const folderItem = await this.graphClient
          .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:${folderItemPath}`)
          .get();
          
        await this.graphClient
          .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/items/${folderItem.id}/permissions`)
          .post({
            roles: ['read'],
            grantedToIdentities: [{
              user: { id: consultantId }
            }]
          });
      }
    }
  }
}