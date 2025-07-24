import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import type { UserComment, CreateUserCommentPayload } from '../types';

async function createComment(payload: CreateUserCommentPayload): Promise<UserComment> {
  return api.comments.create(payload);
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['comments', variables.entityType, variables.entityId] 
      });
      notifications.show({
        title: 'Success',
        message: 'Comment added successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to add comment';
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    },
  });
}