import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { MasterStatus } from '@/types/common';

interface TaskStatusResponse extends MasterStatus {}

export const useGetTaskStatuses = () => {
  return useQuery<TaskStatusResponse[]>({
    queryKey: ['task-statuses'],
    queryFn: () => api.master.getStatuses('TASK') as Promise<TaskStatusResponse[]>,
    staleTime: 30 * 60 * 1000, // 30 minutes - statuses don't change often
  });
};

// Helper to transform from API format (camelCase) to TaskStatus format (snake_case)
export function transformTaskStatus(status: TaskStatusResponse) {
  return {
    id: status.id,
    context: status.context,
    status_code: status.statusCode,
    status_name: status.statusName,
    sequence: status.sequence,
    is_final: status.isFinal,
    is_active: status.isActive
  };
}