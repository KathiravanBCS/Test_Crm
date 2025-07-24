import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DocumentActivity } from '../types';

export const useGetDocumentActivities = (documentId: number) => {
  return useQuery<DocumentActivity[]>({
    queryKey: ['document-activities', documentId],
    queryFn: () => api.documents.getActivities(documentId),
    staleTime: 60 * 1000, // 1 minute
  });
};