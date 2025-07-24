import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import type { Proposal } from '../types';

export function useUpdateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Proposal> }) => {
      return api.proposals.update(id, data as any);
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['proposals', id] });
      const previousProposal = queryClient.getQueryData(['proposals', id]);
      queryClient.setQueryData(['proposals', id], (old: any) => ({ ...old, ...data }));
      return { previousProposal };
    },
    onError: (err, { id }, context) => {
      if (context?.previousProposal) {
        queryClient.setQueryData(['proposals', id], context.previousProposal);
      }
      notifications.show({
        title: 'Error',
        message: 'Failed to update proposal',
        color: 'red',
      });
    },
    onSuccess: (updatedProposal) => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposals', (updatedProposal as any).id] });
      notifications.show({
        title: 'Success',
        message: 'Proposal updated successfully',
        color: 'green',
      });
    },
  });
}