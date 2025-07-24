import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';

export function useDeleteEngagementLetter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.engagementLetters.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engagement-letters'] });
      notifications.show({
        title: 'Success',
        message: 'Engagement letter deleted successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to delete engagement letter';
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    },
  });
}