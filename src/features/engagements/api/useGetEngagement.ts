import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Engagement } from '../types';

export function useGetEngagement(id: number | undefined) {
  return useQuery<Engagement, Error>({
    queryKey: ['engagements', id],
    queryFn: () => api.engagements.getById(id!),
    enabled: !!id,
  });
}