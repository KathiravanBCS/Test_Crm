import { useState } from 'react';
import {
  Avatar,
  Text,
  Group,
  Stack,
  ActionIcon,
  Menu,
  Box,
  Collapse,
  Button,
  Divider,
} from '@mantine/core';
import {
  IconDots,
  IconEdit,
  IconTrash,
  IconMessageReply,
  IconThumbUp,
  IconThumbDown,
} from '@tabler/icons-react';
import { formatRelativeTime } from '@/lib/utils/date';
import type { UserComment } from '../types';
import { useUpdateComment } from '../api/useUpdateComment';
import { useDeleteComment } from '../api/useDeleteComment';
import { CommentEditor } from './CommentEditor';

interface CommentThreadProps {
  comment: UserComment;
  onReply: (parentId: number) => void;
  currentUserId: number;
  level?: number;
}

export function CommentThread({ 
  comment, 
  onReply, 
  currentUserId,
  level = 0 
}: CommentThreadProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const updateMutation = useUpdateComment();
  const deleteMutation = useDeleteComment();

  const isOwner = comment.createdBy.id === currentUserId;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const timeAgo = formatRelativeTime(comment.createdAt);

  const handleUpdate = (content: string) => {
    updateMutation.mutate(
      { id: comment.id, payload: { content } },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteMutation.mutate(comment.id);
    }
  };

  const handleReply = () => {
    setShowReplyEditor(true);
    onReply(comment.id);
  };

  return (
    <Box style={{ marginLeft: level > 0 ? 48 : 0 }}>
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <Avatar 
              src={comment.createdBy.avatar} 
              radius="xl" 
              size="md"
            >
              {comment.createdBy.name.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Group gap="xs">
                <Text fw={600} size="sm">{comment.createdBy.name}</Text>
                <Text size="xs" c="dimmed">{timeAgo}</Text>
              </Group>
            </div>
          </Group>

          {isOwner && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="subtle" size="sm">
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconTrash size={14} />}
                  color="red"
                  onClick={handleDelete}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>

        {isEditing ? (
          <Box pl={48}>
            <CommentEditor
              initialValue={comment.content}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              submitLabel="Update"
              isCompact
            />
          </Box>
        ) : (
          <Box pl={48}>
            <div dangerouslySetInnerHTML={{ __html: comment.content }} />
          </Box>
        )}

        <Group gap="xs" pl={48}>
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconMessageReply size={14} />}
            onClick={handleReply}
          >
            Reply
          </Button>
          
          <ActionIcon variant="subtle" size="sm" color="gray">
            <IconThumbUp size={14} />
          </ActionIcon>
          <Text size="xs" c="dimmed">
            {comment.reactions?.filter(r => r.emoji === '👍').length || 0}
          </Text>
          
          <ActionIcon variant="subtle" size="sm" color="gray">
            <IconThumbDown size={14} />
          </ActionIcon>
          <Text size="xs" c="dimmed">
            {comment.reactions?.filter(r => r.emoji === '👎').length || 0}
          </Text>

          {hasReplies && (
            <Button
              variant="subtle"
              size="xs"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? `Show ${comment.replies!.length} replies` : 'Hide replies'}
            </Button>
          )}
        </Group>

        <Collapse in={showReplyEditor}>
          <Box pl={48} mt="sm">
            <CommentEditor
              onSubmit={(content) => {
                setShowReplyEditor(false);
                // Reply submission is handled by parent component
              }}
              onCancel={() => setShowReplyEditor(false)}
              placeholder="Write a reply..."
              isCompact
            />
          </Box>
        </Collapse>

        {hasReplies && !isCollapsed && (
          <Stack gap="md" mt="sm">
            {comment.replies!.map((reply) => (
              <CommentThread
                key={reply.id}
                comment={reply}
                onReply={onReply}
                currentUserId={currentUserId}
                level={level + 1}
              />
            ))}
          </Stack>
        )}
      </Stack>

      {level === 0 && <Divider my="lg" />}
    </Box>
  );
}