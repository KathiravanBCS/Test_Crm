import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { EmployeeProfile } from '@/types';

export const useGetEmployees = () => {
  return useQuery<EmployeeProfile[]>({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};