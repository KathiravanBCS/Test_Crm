import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import type { PartnerCommissionFormData } from '../types';

export function useCreateCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PartnerCommissionFormData) => api.partners.createCommission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      notifications.show({
        title: 'Success',
        message: 'Commission record created successfully',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create commission record',
        color: 'red',
      });
    },
  });
}