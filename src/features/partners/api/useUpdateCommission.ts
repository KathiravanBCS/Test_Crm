import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import type { PartnerCommissionFormData } from '../types';

export function useUpdateCommission(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PartnerCommissionFormData) => api.partners.updateCommission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      notifications.show({
        title: 'Success',
        message: 'Commission record updated successfully',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update commission record',
        color: 'red',
      });
    },
  });
}