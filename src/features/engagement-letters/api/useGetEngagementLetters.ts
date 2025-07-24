import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { EngagementLetterListResponse, EngagementLetterFilters } from '../types';

interface GetEngagementLettersParams {
  page?: number;
  pageSize?: number;
  filters?: EngagementLetterFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // Direct filter props for convenience
  proposalId?: number;
  customerId?: number;
  partnerId?: number;
}

async function getEngagementLetters(params: GetEngagementLettersParams): Promise<EngagementLetterListResponse> {
  // Using mock API for now
  const data = await api.engagementLetters.getAll();
  return {
    data,
    total: data.length,
    page: params.page || 1,
    pageSize: params.pageSize || 20
  };
}

export function useGetEngagementLetters(params: GetEngagementLettersParams = {}) {
  return useQuery({
    queryKey: ['engagement-letters', 'list', params],
    queryFn: () => getEngagementLetters(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}