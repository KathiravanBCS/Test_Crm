import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { DocumentUploadRequest, DocumentMetadata } from '../types';

// Function to upload file to SharePoint using the upload session URL
async function uploadToSharePoint(uploadUrl: string, file: File): Promise<void> {
  const fileSize = file.size;
  const chunkSize = 320 * 1024; // 320 KB chunks as recommended by Microsoft
  let start = 0;

  while (start < fileSize) {
    const end = Math.min(start + chunkSize, fileSize);
    const chunk = file.slice(start, end);
    
    const headers: Record<string, string> = {
      'Content-Length': String(end - start),
      'Content-Range': `bytes ${start}-${end - 1}/${fileSize}`,
    };

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers,
      body: chunk,
    });

    if (!response.ok && response.status !== 202 && response.status !== 200 && response.status !== 201) {
      const errorText = await response.text();
      console.error('SharePoint upload error:', errorText);
      throw new Error(`Failed to upload chunk: ${response.status} ${response.statusText}`);
    }

    start = end;
  }
}

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<DocumentMetadata, Error, DocumentUploadRequest>({
    mutationFn: async (data) => {
      try {
        // First, get the upload URL from our backend
        const uploadSession = await api.documents.createUploadSession({
          entityType: data.entityType,
          entityId: data.entityId,
          fileName: data.file.name,
          fileSize: data.file.size,
          tags: data.tags,
          description: data.description,
        });

        // Check if this is a SharePoint upload session URL
        const isSharePointUrl = uploadSession.uploadUrl.includes('sharepoint.com');
        const isGraphUrl = uploadSession.uploadUrl.includes('graph.microsoft.com');
        
        if (isSharePointUrl && !isGraphUrl) {
          // This is a SharePoint upload session URL from Graph API
          // Use the special upload session protocol
          await uploadToSharePoint(uploadSession.uploadUrl, data.file);
        } else if (isGraphUrl) {
          // This is a direct Graph API URL
          const { OutlookServiceFactory } = await import('@/services/graph/services/service-factory');
          const factory = OutlookServiceFactory as any;
          
          if (!factory.graphClient) {
            throw new Error('Graph client not initialized. Please ensure you are signed in.');
          }
          
          // Extract the API path from the full URL
          const apiPath = uploadSession.uploadUrl.replace('https://graph.microsoft.com/v1.0', '');
          
          // For small files, use direct upload
          if (data.file.size <= 4 * 1024 * 1024) {
            await factory.graphClient
              .api(apiPath)
              .putStream(data.file);
          } else {
            // For large files, the URL should already be an upload session
            await uploadToSharePoint(uploadSession.uploadUrl, data.file);
          }
        } else {
          // Regular upload for other endpoints
          const response = await fetch(uploadSession.uploadUrl, {
            method: 'PUT',
            body: data.file,
            headers: {
              'Content-Type': data.file.type,
            },
          });
          
          if (!response.ok) {
            throw new Error('Failed to upload file');
          }
        }

        // Finalize the upload in our backend
        return api.documents.finalizeUpload(uploadSession.sessionId);
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['documents', data.entityType, data.entityId] 
      });
      notifications.show({
        title: 'Success',
        message: 'Document uploaded successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Upload Failed',
        message: error.message || 'Failed to upload document',
        color: 'red',
      });
    },
  });
};