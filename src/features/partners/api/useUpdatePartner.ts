import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import type { PartnerFormData } from '../types';

export function useUpdatePartner(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PartnerFormData) => api.partners.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['partners', id] });
      notifications.show({
        title: 'Success',
        message: 'Partner updated successfully',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update partner',
        color: 'red',
      });
    },
  });
}