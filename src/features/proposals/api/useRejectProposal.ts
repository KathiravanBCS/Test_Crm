import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';

export function useRejectProposal(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason: string) => api.proposals.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposals', id] });
      notifications.show({
        title: 'Success',
        message: 'Proposal rejected',
        color: 'yellow',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to reject proposal',
        color: 'red',
      });
    },
  });
}