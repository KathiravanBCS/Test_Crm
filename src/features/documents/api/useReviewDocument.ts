import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { DocumentMetadata } from '../types';

interface ReviewDocumentRequest {
  documentId: number;
  action: 'approve' | 'reject';
  notes?: string;
}

export const useReviewDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<DocumentMetadata, Error, ReviewDocumentRequest>({
    mutationFn: (data) => api.documents.review(data.documentId, {
      action: data.action,
      notes: data.notes,
    }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      notifications.show({
        title: 'Success',
        message: `Document ${variables.action === 'approve' ? 'approved' : 'rejected'} successfully`,
        color: 'green',
      });
    },
  });
};