import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { EngagementLetter } from '../types';

async function getEngagementLetter(id: number): Promise<EngagementLetter> {
  return api.engagementLetters.getById(id);
}

export function useGetEngagementLetter(id: number | undefined) {
  return useQuery({
    queryKey: ['engagement-letters', id],
    queryFn: () => getEngagementLetter(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}