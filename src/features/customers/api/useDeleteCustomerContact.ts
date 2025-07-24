import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';

export const useDeleteCustomerContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, contactId }: { customerId: number; contactId: number }) =>
      api.customers.deleteContact(contactId),
    onSuccess: (_, { customerId }) => {
      notifications.show({
        title: 'Success',
        message: 'Contact person deleted successfully',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['customers', customerId, 'contacts'] });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete contact person',
        color: 'red',
      });
    },
  });
};