import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import type { EngagementLetterFormData, EngagementLetter } from '../types';

interface UpdateEngagementLetterParams {
  id: number;
  data: Partial<EngagementLetterFormData>;
}

async function updateEngagementLetter({ id, data }: UpdateEngagementLetterParams): Promise<EngagementLetter> {
  return api.engagementLetters.update(id, data);
}

export function useUpdateEngagementLetter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEngagementLetter,
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['engagement-letters'] });
      queryClient.invalidateQueries({ queryKey: ['engagement-letters', id] });
      notifications.show({
        title: 'Success',
        message: 'Engagement letter updated successfully',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update engagement letter',
        color: 'red',
      });
    },
  });
}