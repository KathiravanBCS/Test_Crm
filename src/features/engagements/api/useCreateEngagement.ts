import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { notifications } from '@mantine/notifications';
import type { Engagement, EngagementFormData } from '../types';

interface CreateEngagementData extends EngagementFormData {
  statusId: number; // Will be set based on whether it's started or not
}

export function useCreateEngagement() {
  const queryClient = useQueryClient();

  return useMutation<Engagement, Error, CreateEngagementData>({
    mutationFn: (data) => api.engagements.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['engagements'] });
      notifications.show({
        title: 'Success',
        message: 'Engagement created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create engagement',
        color: 'red',
      });
    },
  });
}