import { useQuery } from '@tanstack/react-query';
import type { Partner } from '../types';
import { api } from '@/lib/api';

export const useGetPartners = () => {
  return useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: () => api.partners.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};