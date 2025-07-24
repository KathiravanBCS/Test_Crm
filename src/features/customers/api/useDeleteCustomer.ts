import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Customer } from '../types';
import { api } from '@/lib/api';
import { notifications } from '@mantine/notifications';

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.customers.delete(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['customers'] });

      // Snapshot the previous value
      const previousCustomers = queryClient.getQueryData<Customer[]>(['customers']);

      // Optimistically remove from the list
      if (previousCustomers) {
        queryClient.setQueryData<Customer[]>(
          ['customers'],
          previousCustomers.filter(c => c.id !== id)
        );
      }

      return { previousCustomers };
    },
    onError: (err, id, context) => {
      // Roll back on error
      if (context?.previousCustomers) {
        queryClient.setQueryData(['customers'], context.previousCustomers);
      }
      
      notifications.show({
        title: 'Error',
        message: 'Failed to delete customer. Please try again.',
        color: 'red',
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      notifications.show({
        title: 'Success',
        message: 'Customer deleted successfully!',
        color: 'green',
      });
    },
  });
};