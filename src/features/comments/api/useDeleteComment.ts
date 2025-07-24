import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';

async function deleteComment(id: number): Promise<void> {
  await api.comments.delete(id);
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      notifications.show({
        title: 'Success',
        message: 'Comment deleted successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to delete comment';
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    },
  });
}