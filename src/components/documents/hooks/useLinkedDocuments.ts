import { useQuery } from '@tanstack/react-query';
import type { LinkedDocument } from '../types';

interface LinkedDocumentsParams {
  entityType: string;
  entityId: number;
}

interface LinkedDocumentsResponse {
  data: LinkedDocument[];
  totalCount: number;
}

// Mock data for linked documents stored in CRM database
const generateMockLinkedDocuments = (params: LinkedDocumentsParams): LinkedDocument[] => {
  const baseDocuments: Omit<LinkedDocument, 'id'>[] = [
    {
      entityType: params.entityType,
      entityId: params.entityId,
      fileName: 'Transfer Pricing Analysis Report.pdf',
      filePath: '/sites/vstn/Shared Documents/Transfer Pricing/Analysis_Report_2024.pdf',
      fileType: 'application/pdf',
      locationUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/TPAnalysis.pdf',
      fileSizeKb: 2048,
      uploadedBy: 1,
      uploadedAt: '2024-07-01T16:45:00Z',
      isLinked: true,
      driveItemId: 'file-1'
    },
    {
      entityType: params.entityType,
      entityId: params.entityId,
      fileName: 'Compliance Checklist.docx',
      filePath: '/sites/vstn/Shared Documents/Compliance/Checklist_Q2_2024.docx',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      locationUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/Compliance.docx',
      fileSizeKb: 512,
      uploadedBy: 2,
      uploadedAt: '2024-07-10T15:10:00Z',
      isLinked: true,
      driveItemId: 'file-3'
    },
    {
      entityType: params.entityType,
      entityId: params.entityId,
      fileName: 'Financial Reports',
      filePath: '/sites/vstn/Shared Documents/Reports',
      fileType: 'folder',
      locationUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/Reports',
      fileSizeKb: 0,
      uploadedBy: 3,
      uploadedAt: '2024-07-14T10:30:00Z',
      isLinked: true,
      driveItemId: 'folder-3'
    }
  ];

  return baseDocuments.map((doc, index) => ({
    ...doc,
    id: 100 + index + 1
  }));
};

const fetchLinkedDocuments = async (params: LinkedDocumentsParams): Promise<LinkedDocumentsResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // For demo purposes, simulate occasional errors
  if (Math.random() < 0.05) {
    throw new Error('Failed to fetch linked documents from database');
  }

  const documents = generateMockLinkedDocuments(params);
  
  return {
    data: documents,
    totalCount: documents.length
  };
};

export function useLinkedDocuments(params: LinkedDocumentsParams) {
  return useQuery({
    queryKey: ['linked-documents', params.entityType, params.entityId],
    queryFn: () => fetchLinkedDocuments(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on data errors
      if (error.message.includes('not found') || error.message.includes('Invalid')) {
        return false;
      }
      return failureCount < 2;
    }
  });
}