import { useQuery } from '@tanstack/react-query';
import type { DocumentsQueryParams, DocumentsApiResponse, DocumentListItem } from '../types';

// Mock data generator for development
const generateMockDocuments = (params: DocumentsQueryParams): DocumentListItem[] => {
  const mockFolders: DocumentListItem[] = [
    {
      id: 'folder-1',
      name: 'Proposals',
      type: 'folder',
      size: 0,
      webUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/Proposals',
      createdDateTime: '2024-01-15T10:30:00Z',
      lastModifiedDateTime: '2024-07-10T14:45:00Z',
      createdBy: {
        displayName: 'Rajesh Kumar',
        email: 'rajesh@vstn.com'
      },
      lastModifiedBy: {
        displayName: 'Priya Sharma',
        email: 'priya@vstn.com'
      },
      isLinked: false,
      hasChildren: true,
      isShared: true,
      permissions: ['read', 'write']
    },
    {
      id: 'folder-2',
      name: 'Engagement Letters',
      type: 'folder',
      size: 0,
      webUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/EngagementLetters',
      createdDateTime: '2024-02-01T09:15:00Z',
      lastModifiedDateTime: '2024-07-12T16:20:00Z',
      createdBy: {
        displayName: 'Amit Patel',
        email: 'amit@vstn.com'
      },
      lastModifiedBy: {
        displayName: 'Sneha Gupta',
        email: 'sneha@vstn.com'
      },
      isLinked: false,
      hasChildren: true,
      isShared: false
    },
    {
      id: 'folder-3',
      name: 'Financial Reports',
      type: 'folder',
      size: 0,
      webUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/Reports',
      createdDateTime: '2024-03-10T11:00:00Z',
      lastModifiedDateTime: '2024-07-14T10:30:00Z',
      createdBy: {
        displayName: 'Arjun Singh',
        email: 'arjun@vstn.com'
      },
      lastModifiedBy: {
        displayName: 'Kavya Nair',
        email: 'kavya@vstn.com'
      },
      isLinked: true,
      linkedDocumentId: 101,
      hasChildren: true,
      isShared: true,
      permissions: ['read']
    }
  ];

  const mockFiles: DocumentListItem[] = [
    {
      id: 'file-1',
      name: 'Transfer Pricing Analysis Report.pdf',
      type: 'file',
      size: 2048576,
      mimeType: 'application/pdf',
      webUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/TPAnalysis.pdf',
      downloadUrl: 'https://example.sharepoint.com/sites/vstn/_layouts/download.aspx?share=file1',
      createdDateTime: '2024-06-15T14:30:00Z',
      lastModifiedDateTime: '2024-07-01T16:45:00Z',
      createdBy: {
        displayName: 'Rajesh Kumar',
        email: 'rajesh@vstn.com'
      },
      lastModifiedBy: {
        displayName: 'Priya Sharma',
        email: 'priya@vstn.com'
      },
      isLinked: true,
      linkedDocumentId: 102,
      isShared: false
    },
    {
      id: 'file-2',
      name: 'Client Data Analysis.xlsx',
      type: 'file',
      size: 1536000,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      webUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/ClientData.xlsx',
      downloadUrl: 'https://example.sharepoint.com/sites/vstn/_layouts/download.aspx?share=file2',
      createdDateTime: '2024-06-20T09:15:00Z',
      lastModifiedDateTime: '2024-07-05T11:30:00Z',
      createdBy: {
        displayName: 'Amit Patel',
        email: 'amit@vstn.com'
      },
      lastModifiedBy: {
        displayName: 'Sneha Gupta',
        email: 'sneha@vstn.com'
      },
      isLinked: false,
      isShared: true,
      permissions: ['read', 'write']
    },
    {
      id: 'file-3',
      name: 'Compliance Checklist.docx',
      type: 'file',
      size: 512000,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      webUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/Compliance.docx',
      downloadUrl: 'https://example.sharepoint.com/sites/vstn/_layouts/download.aspx?share=file3',
      createdDateTime: '2024-07-01T13:20:00Z',
      lastModifiedDateTime: '2024-07-10T15:10:00Z',
      createdBy: {
        displayName: 'Arjun Singh',
        email: 'arjun@vstn.com'
      },
      lastModifiedBy: {
        displayName: 'Kavya Nair',
        email: 'kavya@vstn.com'
      },
      isLinked: true,
      linkedDocumentId: 103,
      isShared: false
    },
    {
      id: 'file-4',
      name: 'Meeting Notes June 2024.pdf',
      type: 'file',
      size: 256000,
      mimeType: 'application/pdf',
      webUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/MeetingNotes.pdf',
      downloadUrl: 'https://example.sharepoint.com/sites/vstn/_layouts/download.aspx?share=file4',
      createdDateTime: '2024-06-30T17:45:00Z',
      lastModifiedDateTime: '2024-06-30T17:45:00Z',
      createdBy: {
        displayName: 'Priya Sharma',
        email: 'priya@vstn.com'
      },
      lastModifiedBy: {
        displayName: 'Priya Sharma',
        email: 'priya@vstn.com'
      },
      isLinked: false,
      isShared: false
    },
    {
      id: 'file-5',
      name: 'Client Photo.jpg',
      type: 'file',
      size: 1024000,
      mimeType: 'image/jpeg',
      webUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/ClientPhoto.jpg',
      downloadUrl: 'https://example.sharepoint.com/sites/vstn/_layouts/download.aspx?share=file5',
      createdDateTime: '2024-07-12T12:00:00Z',
      lastModifiedDateTime: '2024-07-12T12:00:00Z',
      createdBy: {
        displayName: 'Sneha Gupta',
        email: 'sneha@vstn.com'
      },
      lastModifiedBy: {
        displayName: 'Sneha Gupta',
        email: 'sneha@vstn.com'
      },
      isLinked: false,
      isShared: true,
      permissions: ['read']
    }
  ];

  let documents = [...mockFolders, ...mockFiles];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    documents = documents.filter(doc => 
      doc.name.toLowerCase().includes(searchLower)
    );
  }

  // Apply type filter
  switch (params.filter) {
    case 'linked':
      documents = documents.filter(doc => doc.isLinked);
      break;
    case 'unlinked':
      documents = documents.filter(doc => !doc.isLinked);
      break;
    case 'folders':
      documents = documents.filter(doc => doc.type === 'folder');
      break;
    case 'files':
      documents = documents.filter(doc => doc.type === 'file');
      break;
    // 'all' - no filtering
  }

  // Apply sorting
  const sortBy = params.sortBy || 'modified';
  const sortOrder = params.sortOrder || 'desc';
  
  documents.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'created':
        comparison = new Date(a.createdDateTime).getTime() - new Date(b.createdDateTime).getTime();
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'modified':
      default:
        comparison = new Date(a.lastModifiedDateTime).getTime() - new Date(b.lastModifiedDateTime).getTime();
        break;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return documents;
};

const fetchGraphDocuments = async (params: DocumentsQueryParams): Promise<DocumentsApiResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // For demo purposes, simulate occasional errors
  if (Math.random() < 0.1) {
    throw new Error('Failed to connect to Microsoft Graph API');
  }

  const documents = generateMockDocuments(params);
  
  return {
    data: documents,
    totalCount: documents.length,
    hasMore: false,
    currentPath: params.folderId ? `/Folder/${params.folderId}` : '/',
    breadcrumbs: [
      { id: 'root', name: 'OneDrive', path: '/' },
      ...(params.folderId ? [{ id: params.folderId, name: 'Current Folder', path: `/Folder/${params.folderId}` }] : [])
    ]
  };
};

export function useGraphDocuments(params: DocumentsQueryParams) {
  return useQuery({
    queryKey: ['graph-documents', params],
    queryFn: () => fetchGraphDocuments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        return false;
      }
      return failureCount < 2;
    }
  });
}