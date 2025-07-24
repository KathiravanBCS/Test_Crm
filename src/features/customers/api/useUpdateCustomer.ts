import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Customer, CustomerFormData } from '../types';
import { api } from '@/lib/api';
import { notifications } from '@mantine/notifications';

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CustomerFormData }) => 
      api.customers.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['customers'] });
      await queryClient.cancelQueries({ queryKey: ['customers', id] });

      // Snapshot the previous values
      const previousCustomers = queryClient.getQueryData<Customer[]>(['customers']);
      const previousCustomer = queryClient.getQueryData<Customer>(['customers', id]);

      // Optimistically update
      if (previousCustomers) {
        queryClient.setQueryData<Customer[]>(
          ['customers'],
          previousCustomers.map(c => 
            c.id === id ? { 
              ...c, 
              ...data,
              // Preserve existing contacts and addresses structure
              contacts: c.contacts,
              addresses: c.addresses,
              updatedAt: new Date() 
            } : c
          )
        );
      }

      if (previousCustomer) {
        queryClient.setQueryData<Customer>(['customers', id], {
          ...previousCustomer,
          ...data,
          // Preserve existing contacts and addresses structure
          contacts: previousCustomer.contacts,
          addresses: previousCustomer.addresses,
          updatedAt: new Date(),
        });
      }

      return { previousCustomers, previousCustomer };
    },
    onError: (err, { id }, context) => {
      // Roll back on error
      if (context?.previousCustomers) {
        queryClient.setQueryData(['customers'], context.previousCustomers);
      }
      if (context?.previousCustomer) {
        queryClient.setQueryData(['customers', id], context.previousCustomer);
      }
      
      notifications.show({
        title: 'Error',
        message: 'Failed to update customer. Please try again.',
        color: 'red',
      });
    },
    onSuccess: (data, { id }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', id] });
      
      notifications.show({
        title: 'Success',
        message: 'Customer updated successfully!',
        color: 'green',
      });
    },
  });
};