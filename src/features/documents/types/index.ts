import { EmployeeProfile } from '@/types';

export interface SharePointDocument {
  id: string;
  name: string;
  webUrl: string;
  downloadUrl: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  size: number;
  createdBy: {
    user: {
      displayName: string;
      email: string;
    };
  };
  lastModifiedBy: {
    user: {
      displayName: string;
      email: string;
    };
  };
  parentReference: {
    path: string;
    driveId: string;
    id: string;
  };
  file?: {
    mimeType: string;
    hashes: {
      quickXsrHash: string;
    };
  };
}

export interface DocumentMetadata {
  id: number;
  entityType: 'proposal' | 'engagement_letter' | 'engagement' | 'engagement_service_item' | 'customer' | 'partner';
  entityId: number;
  sharepointItemId: string;
  sharepointDriveId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSizeKb: number;
  version: number;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived';
  reviewStatus?: 'pending' | 'in_review' | 'approved' | 'rejected';
  reviewedBy?: EmployeeProfile;
  reviewedAt?: string;
  approvalNotes?: string;
  tags?: string[];
  description?: string;
  uploadedBy: EmployeeProfile;
  uploadedAt: string;
  webUrl: string;
  downloadUrl: string;
}

export interface DocumentUploadRequest {
  entityType: DocumentMetadata['entityType'];
  entityId: number;
  file: File;
  tags?: string[];
  description?: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  path: string;
  webUrl: string;
  childCount: number;
  createdDateTime: string;
  lastModifiedDateTime: string;
}

export interface DocumentPermission {
  id?: string;
  roles?: string[];
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  grantedTo?: {
    user: {
      displayName: string;
      email: string;
    };
  };
  invitation?: {
    email: string;
  };
}

export interface DocumentShareRequest {
  documentId: string;
  recipients: string[];
  message?: string;
  requireSignIn?: boolean;
  sendInvitation?: boolean;
  roles: ('read' | 'write')[];
  expirationDateTime?: string;
}

export interface ReviewDocumentRequest {
  documentId: number;
  reviewStatus: 'approved' | 'rejected';
  notes?: string;
}

export interface DocumentActivity {
  id: number;
  documentId: number;
  action: 'uploaded' | 'viewed' | 'downloaded' | 'reviewed' | 'approved' | 'rejected' | 'shared' | 'updated' | 'deleted';
  activityType: 'uploaded' | 'viewed' | 'downloaded' | 'reviewed' | 'approved' | 'rejected' | 'shared' | 'updated' | 'deleted';
  activityDescription: string;
  performedBy: EmployeeProfile;
  performedAt: string;
  details?: Record<string, any>;
}

export interface DocumentFilter {
  entityType?: DocumentMetadata['entityType'];
  status?: DocumentMetadata['status'];
  uploadedBy?: number;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  search?: string;
}