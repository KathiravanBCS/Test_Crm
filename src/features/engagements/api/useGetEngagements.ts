import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Engagement } from '../types';

export function useGetEngagements() {
  return useQuery<Engagement[], Error>({
    queryKey: ['engagements'],
    queryFn: api.engagements.getAll,
  });
}