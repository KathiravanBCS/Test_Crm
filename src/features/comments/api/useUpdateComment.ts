import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import type { UserComment, UpdateUserCommentPayload } from '../types';

interface UpdateCommentParams {
  id: number;
  payload: UpdateUserCommentPayload;
}

async function updateComment({ id, payload }: UpdateCommentParams): Promise<UserComment> {
  return api.comments.update(id, payload);
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      notifications.show({
        title: 'Success',
        message: 'Comment updated successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to update comment';
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    },
  });
}