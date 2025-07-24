import { useQuery } from '@tanstack/react-query';
import { mockMasterDataService } from '@/services/mock/implementations/MasterDataService';
import type { VstnBranch } from '@/types/common';

export function useGetBranches() {
  return useQuery<VstnBranch[]>({
    queryKey: ['branches'],
    queryFn: () => mockMasterDataService.getBranches(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}