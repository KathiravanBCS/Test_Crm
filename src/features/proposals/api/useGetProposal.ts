import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Proposal } from '../types';

export function useGetProposal(proposalId: number | undefined) {
  return useQuery<Proposal>({
    queryKey: ['proposals', proposalId],
    queryFn: async () => {
      return api.proposals.getById(proposalId!) as Promise<Proposal>;
    },
    enabled: !!proposalId,
  });
}