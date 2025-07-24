import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactPerson } from '@/types/common';
import { api } from '@/lib/api';
import { notifications } from '@mantine/notifications';

// Get contacts for a customer
export const useGetCustomerContacts = (customerId: number | undefined) => {
  return useQuery({
    queryKey: ['customers', customerId, 'contacts'],
    queryFn: () => api.customers.getContacts(customerId!),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
  });
};

// Add contact
export const useAddCustomerContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, contact }: { customerId: number; contact: any }) =>
      api.customers.addContact(customerId, contact),
    onSuccess: (data, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customers', customerId, 'contacts'] });
      notifications.show({
        title: 'Success',
        message: 'Contact added successfully!',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to add contact. Please try again.',
        color: 'red',
      });
    },
  });
};

// Update contact
export const useUpdateCustomerContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, contact }: { contactId: number; contact: any }) =>
      api.customers.updateContact(contactId, contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      notifications.show({
        title: 'Success',
        message: 'Contact updated successfully!',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to update contact. Please try again.',
        color: 'red',
      });
    },
  });
};

// Delete contact
export const useDeleteCustomerContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: number) => api.customers.deleteContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      notifications.show({
        title: 'Success',
        message: 'Contact removed successfully!',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to remove contact. Please try again.',
        color: 'red',
      });
    },
  });
};