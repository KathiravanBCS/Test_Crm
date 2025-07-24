import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { EmployeeProfile } from '@/types';

export function useGetEmployees() {
  return useQuery<EmployeeProfile[], Error>({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}