// TypeScript types for MS Graph Drive API and Document Management

export interface GraphDriveItem {
  id: string;
  name: string;
  eTag: string;
  cTag: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  size: number;
  webUrl: string;
  downloadUrl?: string;
  file?: {
    mimeType: string;
    hashes: {
      quickXorHash?: string;
      sha1Hash?: string;
      sha256Hash?: string;
    };
  };
  folder?: {
    childCount: number;
    view: {
      viewType: string;
      sortBy: string;
      sortOrder: string;
    };
  };
  image?: {
    height: number;
    width: number;
  };
  parentReference: {
    driveId: string;
    driveType: string;
    id: string;
    name?: string;
    path: string;
  };
  createdBy: {
    user: {
      displayName: string;
      email: string;
      id: string;
    };
  };
  lastModifiedBy: {
    user: {
      displayName: string;
      email: string;
      id: string;
    };
  };
  shared?: {
    effectiveRoles: string[];
    owner: {
      user: {
        displayName: string;
        email: string;
        id: string;
      };
    };
    scope: string;
    sharedDateTime: string;
  };
}

export interface GraphDriveResponse {
  '@odata.context': string;
  '@odata.count'?: number;
  '@odata.nextLink'?: string;
  value: GraphDriveItem[];
}

// CRM Document types (stored in database)
export interface LinkedDocument {
  id: number;
  entityType: string;
  entityId: number;
  fileName: string;
  filePath: string;
  fileType: string;
  locationUrl: string;
  fileSizeKb: number;
  uploadedBy: number;
  uploadedAt: string;
  isLinked: true;
  driveItemId?: string;
}

// Combined type for UI display
export interface DocumentListItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  mimeType?: string;
  webUrl: string;
  downloadUrl?: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  createdBy: {
    displayName: string;
    email: string;
  };
  lastModifiedBy: {
    displayName: string;
    email: string;
  };
  isLinked: boolean;
  linkedDocumentId?: number;
  parentPath?: string;
  hasChildren?: boolean;
  isShared?: boolean;
  permissions?: string[];
}

export interface DocumentsQueryParams {
  entityType: string;
  entityId: number;
  driveId?: string;
  folderId?: string;
  search?: string;
  filter?: 'all' | 'linked' | 'unlinked' | 'folders' | 'files';
  sortBy?: 'name' | 'modified' | 'created' | 'size';
  sortOrder?: 'asc' | 'desc';
}

export interface DocumentsApiResponse {
  data: DocumentListItem[];
  totalCount: number;
  hasMore: boolean;
  nextLink?: string;
  currentPath: string;
  breadcrumbs: Array<{
    id: string;
    name: string;
    path: string;
  }>;
}

export interface DriveInfo {
  id: string;
  name: string;
  driveType: 'personal' | 'business' | 'documentLibrary';
  owner: {
    user: {
      displayName: string;
      email: string;
    };
  };
  quota: {
    total: number;
    used: number;
    remaining: number;
    deleted: number;
  };
}

export interface SharePointSite {
  id: string;
  displayName: string;
  name: string;
  webUrl: string;
  drives: DriveInfo[];
}



export interface FilePreview {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  previewUrl?: string;
  thumbnailUrl?: string;
  canPreview: boolean;
  isImage: boolean;
  isDocument: boolean;
  isVideo: boolean;
}

// Action types for document operations
export interface DocumentAction {
  type: 'link' | 'unlink' | 'download' | 'share' | 'preview' | 'open';
  itemId: string;
  itemName: string;
}

// Error types
export interface DocumentError {
  code: string;
  message: string;
  details?: string;
}