import { Stack, Paper, Group, Text, Badge, Box, Loader, Center, ActionIcon, Menu } from '@mantine/core';
import { IconDots, IconPlus } from '@tabler/icons-react';
import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';
import type { Task, TaskBoardColumn } from '../types';
import { useTaskViewStore } from '@/app/store/taskView.store';

interface KanbanColumnProps {
  column: TaskBoardColumn;
  index: number;
  onTaskEdit?: (task: Task) => void;
  onTaskStatusChange?: (task: Task, statusId: number) => void;
  onTaskAssigneeChange?: (task: Task, assigneeId: number) => void;
  onAddTask?: (columnId: string) => void;
  onColumnSettings?: (columnId: string) => void;
  isLoading?: boolean;
  maxHeight?: number;
  isCompact?: boolean;
}

export function KanbanColumn({
  column,
  index,
  onTaskEdit,
  onTaskStatusChange,
  onTaskAssigneeChange,
  onAddTask,
  onColumnSettings,
  isLoading,
  maxHeight = 600,
  isCompact,
}: KanbanColumnProps) {
  const { boardDisplaySettings } = useTaskViewStore();
  const { cardSpacing } = boardDisplaySettings;
  
  const hasMaxItems = column.maxItems && column.tasks.length >= column.maxItems;

  return (
    <Droppable droppableId={column.id}>
      {(provided, snapshot) => (
        <Paper
          shadow="xs"
          radius="md"
          p="md"
          style={{
            backgroundColor: snapshot.isDraggingOver ? 'var(--mantine-color-gray-0)' : undefined,
            border: snapshot.isDraggingOver ? '2px dashed var(--mantine-color-primary-4)' : '1px solid var(--mantine-color-gray-3)',
            transition: 'all 0.2s ease',
            height: maxHeight || 600,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
      {/* Column Header */}
      <Group justify="space-between" mb="md" wrap="nowrap">
        <Group gap="xs" wrap="nowrap" style={{ flex: 1 }}>
          <Text fw={600} size="sm" lineClamp={1}>
            {column.title}
          </Text>
          <Badge
            size="sm"
            variant="filled"
            color={column.color || 'gray'}
            styles={{ root: { minWidth: 24 } }}
          >
            {column.tasks.length}
          </Badge>
          {hasMaxItems && (
            <Badge size="xs" color="red" variant="light">
              MAX
            </Badge>
          )}
        </Group>
        <Group gap={4}>
          {onAddTask && !hasMaxItems && (
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={() => onAddTask(column.id)}
              title="Add task"
            >
              <IconPlus size={16} />
            </ActionIcon>
          )}
          {onColumnSettings && (
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <ActionIcon size="sm" variant="subtle">
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => onColumnSettings(column.id)}>
                  Column Settings
                </Menu.Item>
                <Menu.Item>Set WIP Limit</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Group>

      {/* Column Content */}
      <Box 
        ref={provided.innerRef}
        {...provided.droppableProps}
        style={{ 
          flex: 1, 
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: 4
        }}
      >
        {isLoading ? (
          <Center h={200}>
            <Loader size="sm" />
          </Center>
        ) : column.tasks.length === 0 ? (
          <Center h={100}>
            <Stack align="center" gap="xs">
              <Text size="sm" c="dimmed">
                No tasks
              </Text>
              {onAddTask && !hasMaxItems && (
                <ActionIcon
                  variant="subtle"
                  onClick={() => onAddTask(column.id)}
                  title="Add first task"
                >
                  <IconPlus size={16} />
                </ActionIcon>
              )}
            </Stack>
          </Center>
        ) : (
          <Stack
            gap={cardSpacing === 'tight' ? 4 : 'xs'}
            style={{ minHeight: 100 }}
          >
            {column.tasks.map((task, taskIndex) => (
              <TaskCard
                key={task.id}
                task={task}
                index={taskIndex}
                onEdit={onTaskEdit}
                onStatusChange={onTaskStatusChange}
                onAssigneeChange={onTaskAssigneeChange}
              />
            ))}
          </Stack>
        )}
        {provided.placeholder}
      </Box>
        </Paper>
      )}
    </Droppable>
  );
}