import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Proposal } from '../types';

export function useGetProposals() {
  return useQuery({
    queryKey: ['proposals'],
    queryFn: async () => {
      return api.proposals.getAll();
    },
  });
}