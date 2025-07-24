import { Stack, Group, Text, Badge, Button, Divider, Progress, Box } from '@mantine/core';
import { 
  IconEdit, 
  IconClock, 
  IconCalendarDue, 
  IconUser,
  IconBriefcase,
  IconListDetails
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { Task } from '../types';
import { InfoField } from '@/components/display/InfoField';
import { 
  calculateTaskProgress, 
  calculateScheduleVariance, 
  formatScheduleVariance,
  getTaskHealthStatus 
} from '../utils';

interface TaskDetailViewProps {
  task: Task;
  onEdit?: () => void;
}

export function TaskDetailView({ task, onEdit }: TaskDetailViewProps) {
  const progress = calculateTaskProgress(task);
  const variance = calculateScheduleVariance(task);
  const health = getTaskHealthStatus(task);
  const healthColors = { red: 'red', amber: 'orange', green: 'green' };

  return (
    <Stack gap="lg">
      {onEdit && (
        <Group justify="flex-end">
          <Button leftSection={<IconEdit size={16} />} onClick={onEdit}>
            Edit Task
          </Button>
        </Group>
      )}

      {/* Task Info */}
      <Stack gap="md">
        <InfoField label="Title" value={task.title} />
        
        {task.description && (
          <InfoField label="Description" value={task.description} />
        )}

        <Group grow>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">Status</Text>
            <Badge variant="light" color={task.status?.is_final ? 'green' : 'blue'}>
              {task.status?.status_name || 'No Status'}
            </Badge>
          </Stack>
          <Stack gap={4}>
            <Text size="xs" c="dimmed">Priority</Text>
            <Badge 
              color={
                task.priority === 'urgent' ? 'red' : 
                task.priority === 'high' ? 'orange' : 
                task.priority === 'normal' ? 'blue' : 'gray'
              } 
              variant="dot"
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </Stack>
        </Group>

        <Group grow>
          <InfoField 
            label="Assignee" 
            icon={<IconUser size={16} />}
            value={
              task.assigned_to_employee 
                ? task.assigned_to_employee.name
                : 'Unassigned'
            } 
          />
          <InfoField 
            label="Created By" 
            value={
              task.created_by_employee 
                ? task.created_by_employee.name
                : 'Unknown'
            } 
          />
        </Group>
      </Stack>

      <Divider />

      {/* Schedule & Progress */}
      <Stack gap="md">
        <Text fw={600}>Schedule & Progress</Text>
        
        <Group grow>
          <InfoField 
            label="Due Date" 
            icon={<IconCalendarDue size={16} />}
            value={
              task.due_date 
                ? dayjs(task.due_date).format('DD MMM YYYY')
                : 'No due date'
            }
          />
          <Stack gap={4}>
            <Text size="xs" c="dimmed">Schedule Variance</Text>
            <Group gap="xs">
              <Box 
                w={8} 
                h={8} 
                style={{ 
                  borderRadius: '50%', 
                  backgroundColor: `var(--mantine-color-${healthColors[health]}-6)` 
                }} 
              />
              <Text size="sm" fw={500} c={variance < 0 ? 'red' : undefined}>
                {formatScheduleVariance(variance)}
              </Text>
            </Group>
          </Stack>
        </Group>

        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" fw={500}>Progress</Text>
            <Text size="sm" c="dimmed">{progress}%</Text>
          </Group>
          <Progress 
            value={progress} 
            size="md" 
            color={progress >= 80 ? 'green' : progress >= 50 ? 'blue' : 'orange'}
          />
        </Stack>

        <Group grow>
          <InfoField 
            label="Estimated Hours" 
            icon={<IconClock size={16} />}
            value={task.estimated_hours ? `${task.estimated_hours}h` : 'Not estimated'} 
          />
          <InfoField 
            label="Logged Hours" 
            icon={<IconClock size={16} />}
            value={`${task.logged_hours}h`} 
          />
        </Group>
      </Stack>

      {/* Context */}
      {(task.engagement || task.engagement_phase || task.engagement_service_item) && (
        <>
          <Divider />
          <Stack gap="md">
            <Text fw={600}>Context</Text>
            
            {task.engagement && (
              <InfoField 
                label="Engagement" 
                icon={<IconBriefcase size={16} />}
                value={task.engagement.engagementName} 
              />
            )}
            
            {task.engagement_phase && (
              <InfoField 
                label="Phase" 
                icon={<IconListDetails size={16} />}
                value={task.engagement_phase.phaseName} 
              />
            )}
            
            {task.engagement_service_item && (
              <InfoField 
                label="Service Item" 
                value={task.engagement_service_item.serviceName} 
              />
            )}
          </Stack>
        </>
      )}

      {/* Approval */}
      {task.requires_approval && (
        <>
          <Divider />
          <Stack gap="md">
            <Text fw={600}>Approval</Text>
            
            <Stack gap={4}>
              <Text size="xs" c="dimmed">Requires Approval</Text>
              <Badge color="orange" variant="light">
                Yes
              </Badge>
            </Stack>
            
            {task.approved_by && task.approved_at && (
              <>
                <InfoField 
                  label="Approved By" 
                  value={`Employee #${task.approved_by}`} 
                />
                <InfoField 
                  label="Approved At" 
                  value={dayjs(task.approved_at).format('DD MMM YYYY HH:mm')} 
                />
              </>
            )}
          </Stack>
        </>
      )}

      {/* Timestamps */}
      <Divider />
      <Stack gap="sm">
        <InfoField 
          label="Created" 
          value={dayjs(task.created_at).format('DD MMM YYYY HH:mm')} 
        />
        <InfoField 
          label="Last Updated" 
          value={dayjs(task.updated_at).format('DD MMM YYYY HH:mm')} 
        />
      </Stack>
    </Stack>
  );
}