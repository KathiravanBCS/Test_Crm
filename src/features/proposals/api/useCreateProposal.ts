import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import type { Proposal } from '../types';

export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Proposal>) => {
      return api.proposals.create(data as any);
    },
    onSuccess: (newProposal) => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      notifications.show({
        title: 'Success',
        message: 'Proposal created successfully',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create proposal',
        color: 'red',
      });
    },
  });
}