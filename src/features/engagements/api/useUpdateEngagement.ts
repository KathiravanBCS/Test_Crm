import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { notifications } from '@mantine/notifications';
import type { Engagement, EngagementFormData } from '../types';

interface UpdateEngagementData extends Partial<EngagementFormData> {
  id: number;
}

export function useUpdateEngagement() {
  const queryClient = useQueryClient();

  return useMutation<Engagement, Error, UpdateEngagementData>({
    mutationFn: ({ id, ...data }) => api.engagements.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['engagements'] });
      queryClient.invalidateQueries({ queryKey: ['engagements', data.id] });
      notifications.show({
        title: 'Success',
        message: 'Engagement updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update engagement',
        color: 'red',
      });
    },
  });
}