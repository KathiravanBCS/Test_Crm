import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ContactPerson } from '@/types/common';

export const useGetCustomerContacts = (customerId?: number) => {
  return useQuery<ContactPerson[]>({
    queryKey: ['customers', customerId, 'contacts'],
    queryFn: () => api.customers.getContacts(customerId!),
    enabled: !!customerId,
    staleTime: 2 * 60 * 1000,
  });
};