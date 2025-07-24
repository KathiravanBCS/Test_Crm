import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useGetPartner(id: number) {
  return useQuery({
    queryKey: ['partners', id],
    queryFn: () => api.partners.getById(id),
    enabled: !!id,
  });
}