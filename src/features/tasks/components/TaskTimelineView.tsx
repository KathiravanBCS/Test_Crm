import { Center, Text, Paper, Stack } from '@mantine/core';
import { IconTimeline } from '@tabler/icons-react';
import { Task } from '../types';

interface TaskTimelineViewProps {
  tasks: Task[];
  isLoading?: boolean;
  contextType?: string;
  contextId?: number;
}

export function TaskTimelineView({ tasks, isLoading, contextType, contextId }: TaskTimelineViewProps) {
  return (
    <Paper p="xl" radius="md" withBorder>
      <Center h={400}>
        <Stack align="center" gap="md">
          <IconTimeline size={64} color="var(--mantine-color-gray-6)" />
          <Text size="lg" c="dimmed" fw={500}>
            Timeline View Coming Soon
          </Text>
          <Text size="sm" c="dimmed" ta="center" maw={400}>
            The Timeline view will provide a Gantt chart visualization of tasks, 
            showing dependencies, progress, and critical path analysis.
          </Text>
        </Stack>
      </Center>
    </Paper>
  );
}