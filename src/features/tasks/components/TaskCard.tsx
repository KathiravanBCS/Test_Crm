import { Card, Group, Text, Badge, Avatar, Stack, Progress, Tooltip, ActionIcon, Menu } from '@mantine/core';
import { IconDots, IconEdit, IconClock, IconAlertCircle, IconUser, IconCalendar, IconBriefcase, IconCheckbox } from '@tabler/icons-react';
import { formatDate } from '@/lib/utils/date';
import type { Task } from '../types';
import { Draggable } from '@hello-pangea/dnd';
import { useTaskViewStore } from '@/app/store/taskView.store';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit?: (task: Task) => void;
  onStatusChange?: (task: Task, statusId: number) => void;
  onAssigneeChange?: (task: Task, assigneeId: number) => void;
}

const priorityColors = {
  low: 'gray',
  normal: 'blue',
  high: 'orange',
  urgent: 'red',
} as const;

const healthColors = {
  green: 'green',
  amber: 'yellow',
  red: 'red',
} as const;

export function TaskCard({ task, index, onEdit, onStatusChange, onAssigneeChange }: TaskCardProps) {
  const { boardDisplaySettings } = useTaskViewStore();
  const { cardSize, cardSpacing, showFields } = boardDisplaySettings;

  const isOverdue = task.is_overdue && task.status?.status_code !== 'done';
  const hasProgress = task.estimated_hours && task.estimated_hours > 0;

  // Card padding based on size
  const getPadding = () => {
    switch (cardSize) {
      case 'minimal': return 'xs';
      case 'compact': return 8;
      default: return 'sm';
    }
  };

  // Stack gap based on size
  const getStackGap = () => {
    switch (cardSize) {
      case 'minimal': return 4;
      case 'compact': return 6;
      default: return 8;
    }
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          shadow="xs"
          padding={getPadding()}
          radius="md"
          withBorder
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.9 : 1,
          }}
          styles={{
            root: {
              cursor: 'grab',
              '&:active': {
                cursor: 'grabbing',
              },
              transition: snapshot.isDragging ? 'none' : 'border-color 0.2s ease, box-shadow 0.2s ease',
              '&:hover': snapshot.isDragging ? {} : {
                borderColor: 'var(--mantine-color-primary-4)',
                boxShadow: 'var(--mantine-shadow-sm)',
              },
            },
          }}
        >
      <Stack gap={getStackGap()}>
        {/* Header - Always show for normal/compact, hide menu for minimal */}
        {cardSize !== 'minimal' && (
          <Group justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap" style={{ flex: 1 }}>
              {showFields.priority && (
                <Badge size="xs" color={priorityColors[task.priority]} variant="light">
                  {task.priority}
                </Badge>
              )}
              {showFields.healthStatus && task.health_status && (
                <Badge size="xs" color={healthColors[task.health_status]} variant="dot">
                  {task.health_status}
                </Badge>
              )}
            </Group>
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <ActionIcon 
                  size="sm" 
                  variant="subtle" 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => onEdit?.(task)}>
                  Edit Task
                </Menu.Item>
                <Menu.Item leftSection={<IconCheckbox size={14} />}>
                  Mark Complete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        )}

        {/* Title */}
        <Text size={cardSize === 'minimal' ? 'xs' : 'sm'} fw={500} lineClamp={cardSize === 'minimal' ? 1 : 2}>
          {task.title}
        </Text>

        {/* Context Info */}
        {showFields.engagementContext && cardSize !== 'minimal' && (task.engagement || task.engagement_phase || task.engagement_service_item) && (
          <Stack gap={4}>
            {task.engagement && (
              <Group gap={4} wrap="nowrap">
                <IconBriefcase size={12} color="var(--mantine-color-dimmed)" />
                <Text size="xs" c="dimmed" lineClamp={1}>
                  {task.engagement.engagementName}
                </Text>
              </Group>
            )}
            {task.engagement_service_item && (
              <Text size="xs" c="dimmed" lineClamp={1} ml="md">
                {task.engagement_service_item.serviceName}
              </Text>
            )}
          </Stack>
        )}

        {/* Progress */}
        {showFields.progress && hasProgress && cardSize !== 'minimal' && (
          <div>
            <Group justify="space-between" mb={4}>
              <Text size="xs" c="dimmed">Progress</Text>
              <Text size="xs" c="dimmed">
                {task.progress_percentage || 0}%
              </Text>
            </Group>
            <Progress
              value={task.progress_percentage || 0}
              size="xs"
              color={task.progress_percentage === 100 ? 'green' : 'blue'}
            />
          </div>
        )}

        {/* Footer - For minimal view, only show priority badge inline with title */}
        {cardSize === 'minimal' ? (
          <Group justify="space-between" wrap="nowrap">
            {showFields.priority && (
              <Badge size="xs" color={priorityColors[task.priority]} variant="light">
                {task.priority}
              </Badge>
            )}
            {showFields.dueDate && task.due_date && (
              <Text size="xs" c={isOverdue ? 'red' : 'dimmed'}>
                {formatDate(task.due_date)}
              </Text>
            )}
          </Group>
        ) : (
          <Group justify="space-between" wrap="nowrap">
            {/* Assignee */}
            {showFields.assignee && (
              <Group gap={4} wrap="nowrap">
                {task.assigned_to_employee ? (
                  <Tooltip label={task.assigned_to_employee.name}>
                    <Avatar size="xs" radius="xl">
                      {task.assigned_to_employee.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                  </Tooltip>
                ) : (
                  <Avatar size="xs" radius="xl" color="gray">
                    <IconUser size={12} />
                  </Avatar>
                )}
              </Group>
            )}

            {/* Due Date */}
            {showFields.dueDate && task.due_date && (
              <Group gap={4} wrap="nowrap">
                <IconCalendar size={12} color={isOverdue ? 'var(--mantine-color-red-6)' : 'var(--mantine-color-dimmed)'} />
                <Text size="xs" c={isOverdue ? 'red' : 'dimmed'}>
                  {formatDate(task.due_date)}
                </Text>
              </Group>
            )}

            {/* Time Tracking */}
            {showFields.timeTracking && cardSize === 'normal' && task.estimated_hours && (
              <Tooltip label={`${task.logged_hours || 0}h / ${task.estimated_hours}h`}>
                <Group gap={4} wrap="nowrap">
                  <IconClock size={12} color="var(--mantine-color-dimmed)" />
                  <Text size="xs" c="dimmed">
                    {task.logged_hours || 0}/{task.estimated_hours}h
                  </Text>
                </Group>
              </Tooltip>
            )}
          </Group>
        )}

        {/* Overdue Alert - Only for normal size */}
        {isOverdue && cardSize === 'normal' && (
          <Group gap={4} wrap="nowrap">
            <IconAlertCircle size={12} color="var(--mantine-color-red-6)" />
            <Text size="xs" c="red">
              Overdue by {Math.abs(task.schedule_variance || 0)} days
            </Text>
          </Group>
        )}
      </Stack>
        </Card>
      )}
    </Draggable>
  );
}