import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';

export function useApproveProposal(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.proposals.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposals', id] });
      notifications.show({
        title: 'Success',
        message: 'Proposal approved successfully',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to approve proposal',
        color: 'red',
      });
    },
  });
}