import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';

export function useApproveEngagementLetter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.engagementLetters.approve(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['engagement-letters'] });
      queryClient.invalidateQueries({ queryKey: ['engagement-letters', id] });
      notifications.show({
        title: 'Success',
        message: 'Engagement letter approved successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to approve engagement letter';
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    },
  });
}