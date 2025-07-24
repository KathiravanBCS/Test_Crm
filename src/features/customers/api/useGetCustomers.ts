import { useQuery } from '@tanstack/react-query';
import type { Customer } from '../types';
import { api } from '@/lib/api';

export const useGetCustomers = () => {
  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: api.customers.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};