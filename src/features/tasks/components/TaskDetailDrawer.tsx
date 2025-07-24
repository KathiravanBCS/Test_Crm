import { Drawer, Stack, Group, Text, Badge, Button, Timeline, Avatar, Divider } from '@mantine/core';
import { IconClock, IconFlag, IconUser, IconCalendar, IconBriefcase, IconClipboardList, IconCheck } from '@tabler/icons-react';
import { Task } from '../types';
import { TaskDetailView } from './TaskDetailView';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { formatDate, formatDateTime } from '@/lib/utils/date';
import { getTaskPriorityColor, getTaskHealthColor } from '../utils';

interface TaskDetailDrawerProps {
  task: Task | null;
  opened: boolean;
  onClose: () => void;
  onUpdate?: (task: Task) => void;
  onEdit?: (task: Task) => void;
}

export function TaskDetailDrawer({ task, opened, onClose, onUpdate, onEdit }: TaskDetailDrawerProps) {
  const { canEditTasks } = useUserRole();

  if (!task) return null;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <Text fw={600}>Task Details</Text>
          {task.priority !== 'normal' && (
            <Badge color={getTaskPriorityColor(task.priority)} size="sm">
              {task.priority.toUpperCase()}
            </Badge>
          )}
        </Group>
      }
      position="right"
      size="lg"
      padding="lg"
    >
      <Stack gap="md">
        <TaskDetailView task={task} />
        
        {canEditTasks && onEdit && (
          <Group>
            <Button onClick={() => onEdit(task)} fullWidth>
              Edit Task
            </Button>
          </Group>
        )}
      </Stack>
    </Drawer>
  );
}