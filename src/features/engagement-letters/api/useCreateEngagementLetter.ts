import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import type { EngagementLetterFormData, EngagementLetter } from '../types';

async function createEngagementLetter(data: EngagementLetterFormData): Promise<EngagementLetter> {
  return api.engagementLetters.create(data);
}

export function useCreateEngagementLetter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEngagementLetter,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['engagement-letters'] });
      notifications.show({
        title: 'Success',
        message: 'Engagement letter created successfully',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create engagement letter',
        color: 'red',
      });
    },
  });
}