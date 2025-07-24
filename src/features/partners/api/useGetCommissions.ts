import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { PartnerCommission, PartnerCommissionFilters } from '../types';

export function useGetCommissions(filters?: PartnerCommissionFilters) {
  return useQuery({
    queryKey: ['commissions', filters],
    queryFn: async () => {
      const commissions = await api.partners.getCommissions();
      
      // Client-side filtering
      let filtered = [...commissions];
      
      if (filters?.partnerId) {
        filtered = filtered.filter(c => c.partnerId === filters.partnerId);
      }
      
      if (filters?.statusId) {
        filtered = filtered.filter(c => c.statusId === filters.statusId);
      }
      
      if (filters?.fromDate) {
        const fromDate = new Date(filters.fromDate);
        filtered = filtered.filter(c => c.createdAt && new Date(c.createdAt) >= fromDate);
      }
      
      if (filters?.toDate) {
        const toDate = new Date(filters.toDate);
        filtered = filtered.filter(c => c.createdAt && new Date(c.createdAt) <= toDate);
      }
      
      return filtered;
    },
  });
}