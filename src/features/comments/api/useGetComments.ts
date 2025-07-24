import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { UserComment, EntityType } from '../types';

interface GetCommentsParams {
  entityType: EntityType;
  entityId: number;
}

async function getComments({ entityType, entityId }: GetCommentsParams): Promise<UserComment[]> {
  return api.comments.list(entityType, entityId);
}

export function useGetComments(entityType: EntityType, entityId: number) {
  return useQuery({
    queryKey: ['comments', entityType, entityId],
    queryFn: () => getComments({ entityType, entityId }),
    enabled: !!entityType && !!entityId,
  });
}