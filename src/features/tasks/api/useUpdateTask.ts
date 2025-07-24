import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { Task } from '../types';

interface UpdateTaskData {
  status_id?: number;
  assigned_to?: number;
  priority?: string;
  due_date?: string;
  estimated_hours?: number;
  logged_hours?: number;
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskData }) => 
      api.tasks.update(id, data),
    onSuccess: (updatedTask: Task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', updatedTask.id] });
      
      notifications.show({
        title: 'Success',
        message: 'Task updated successfully',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update task',
        color: 'red',
      });
    },
  });
};