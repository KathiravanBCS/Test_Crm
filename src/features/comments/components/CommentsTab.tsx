import { useState, useMemo } from 'react';
import {
  Stack,
  Title,
  Badge,
  Select,
  Loader,
  Center,
  Text,
  Alert,
  Group,
} from '@mantine/core';
import { IconMessageCircle, IconAlertCircle } from '@tabler/icons-react';
import type { EntityType, UserComment } from '../types';
import { useGetComments } from '../api/useGetComments';
import { useCreateComment } from '../api/useCreateComment';
import { CommentThread } from './CommentThread';
import { CommentEditor } from './CommentEditor';

interface CommentsTabProps {
  entityType: EntityType;
  entityId: number;
  currentUserId: number;
}

type SortOption = 'newest' | 'oldest';

export function CommentsTab({ entityType, entityId, currentUserId }: CommentsTabProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [replyToId, setReplyToId] = useState<number | undefined>();

  const { data: comments = [], isLoading, error } = useGetComments(entityType, entityId);
  const createMutation = useCreateComment();

  // Build comment tree structure
  const commentTree = useMemo(() => {
    const commentMap = new Map(comments.map(c => [c.id, { ...c, replies: [] as UserComment[] }]));
    const rootComments: UserComment[] = [];

    comments.forEach(comment => {
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentMap.get(comment.id)!);
        }
      } else {
        rootComments.push(commentMap.get(comment.id)!);
      }
    });

    // Sort root comments based on selected option
    return rootComments.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [comments, sortBy]);

  const handleSubmit = (content: string) => {
    createMutation.mutate({
      entityType,
      entityId,
      parentCommentId: replyToId,
      content,
    }, {
      onSuccess: () => {
        setReplyToId(undefined);
      },
    });
  };

  const handleReply = (parentId: number) => {
    setReplyToId(parentId);
  };

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader size="md" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error loading comments"
        color="red"
      >
        Failed to load comments. Please try again later.
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      <CommentEditor
        onSubmit={handleSubmit}
        placeholder="Add comment..."
      />

      <Group justify="space-between" align="center">
        <Group gap="sm">
          <Title order={4}>Comments</Title>
          <Badge color="gray" variant="filled" size="lg">
            {comments.length}
          </Badge>
        </Group>

        <Select
          value={sortBy}
          onChange={(value) => setSortBy(value as SortOption)}
          data={[
            { value: 'newest', label: 'Most recent' },
            { value: 'oldest', label: 'Oldest first' },
          ]}
          size="sm"
          w={150}
        />
      </Group>

      {commentTree.length === 0 ? (
        <Center h={100}>
          <Stack align="center" gap="xs">
            <IconMessageCircle size={48} color="var(--mantine-color-gray-5)" />
            <Text c="dimmed" size="sm">No comments yet</Text>
            <Text c="dimmed" size="xs">Be the first to start the conversation</Text>
          </Stack>
        </Center>
      ) : (
        <Stack gap={0}>
          {commentTree.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              currentUserId={currentUserId}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}