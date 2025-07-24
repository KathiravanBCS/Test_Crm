import { useQuery } from '@tanstack/react-query';
import type { Customer } from '../types';
import { api } from '@/lib/api';

export const useGetCustomer = (id: number | undefined) => {
  return useQuery<Customer>({
    queryKey: ['customers', id],
    queryFn: () => api.customers.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};