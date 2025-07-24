import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Task } from '../types';

interface GetTasksParams {
  engagement_id?: number;
  phase_id?: number;
  service_item_id?: number;
  assignee_id?: number;
  status_id?: number;
  priority?: string;
  search?: string;
}

export const useGetTasks = (params?: GetTasksParams) => {
  return useQuery<Task[]>({
    queryKey: ['tasks', params],
    queryFn: () => api.tasks.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};