import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DocumentMetadata, DocumentFilter } from '../types';

export const useGetDocuments = (
  entityType: string,
  entityId: number,
  filters?: DocumentFilter
) => {
  return useQuery<DocumentMetadata[]>({
    queryKey: ['documents', entityType, entityId, filters],
    queryFn: () => api.documents.getByEntity(entityType, entityId, filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};