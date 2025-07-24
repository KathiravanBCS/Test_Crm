import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { DocumentShareRequest } from '../types';

export const useShareDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DocumentShareRequest>({
    mutationFn: (data) => api.documents.share(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      notifications.show({
        title: 'Success',
        message: 'Document shared successfully',
        color: 'green',
      });
    },
  });
};