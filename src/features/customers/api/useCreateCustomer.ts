import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Customer, CustomerFormData } from '../types';
import { api } from '@/lib/api';
import { notifications } from '@mantine/notifications';

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomerFormData) => api.customers.create(data),
    onMutate: async (newCustomer) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['customers'] });

      // Snapshot the previous value
      const previousCustomers = queryClient.getQueryData<Customer[]>(['customers']);

      // Optimistically update to the new value
      if (previousCustomers) {
        queryClient.setQueryData<Customer[]>(['customers'], [
          ...previousCustomers,
          { ...newCustomer, id: Date.now(), createdAt: new Date(), updatedAt: new Date() } as Customer,
        ]);
      }

      // Return a context object with the snapshotted value
      return { previousCustomers };
    },
    onError: (err, newCustomer, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCustomers) {
        queryClient.setQueryData(['customers'], context.previousCustomers);
      }
      
      notifications.show({
        title: 'Error',
        message: 'Failed to create customer. Please try again.',
        color: 'red',
      });
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      notifications.show({
        title: 'Success',
        message: 'Customer created successfully!',
        color: 'green',
      });
    },
  });
};