import { useState, useMemo, useCallback } from 'react';
import {
  Card,
  Group,
  Text,
  Badge,
  Progress,
  Select,
  ActionIcon,
  Collapse,
  Box,
  Stack,
  Tooltip,
  rem,
  Loader,
  Center
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronRight,
  IconClock,
  IconCalendarDue,
  IconUser
} from '@tabler/icons-react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import dayjs from 'dayjs';
import { Task, TaskGroup, TaskGroupBy } from '../types';
import { EmployeeProfile } from '@/types/common';
import {
  calculateTaskProgress,
  calculateScheduleVariance,
  getTaskHealthStatus,
  formatScheduleVariance,
  groupTasks
} from '../utils';
import { useUserRole } from '@/lib/hooks/useUserRole';

interface TaskListTableProps {
  tasks: Task[];
  loading?: boolean;
  statuses: Array<{ id: number; status_name: string; status_code: string }>;
  employees: EmployeeProfile[];
  onTaskClick?: (task: Task) => void;
  onStatusChange?: (taskId: number, statusId: number) => void;
  onAssigneeChange?: (taskId: number, assigneeId: number) => void;
  groupBy?: TaskGroupBy;
  onGroupByChange?: (groupBy: TaskGroupBy) => void;
}

export function TaskListTable({
  tasks,
  loading = false,
  statuses,
  employees,
  onTaskClick,
  onStatusChange,
  onAssigneeChange,
  groupBy = 'status',
  onGroupByChange
}: TaskListTableProps) {
  const { role } = useUserRole();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [editingTask, setEditingTask] = useState<{ id: number; field: string } | null>(null);
  const [updatingTasks, setUpdatingTasks] = useState<Set<number>>(new Set());

  // Enrich tasks with computed fields
  const enrichedTasks = useMemo(() => {
    return tasks.map(task => ({
      ...task,
      progress_percentage: calculateTaskProgress(task),
      schedule_variance: calculateScheduleVariance(task),
      health_status: getTaskHealthStatus(task),
      is_overdue: task.due_date ? dayjs(task.due_date).isBefore(dayjs(), 'day') && !task.status?.is_final : false
    }));
  }, [tasks]);

  // Group tasks
  const groups = useMemo(() => {
    return groupTasks(enrichedTasks, groupBy);
  }, [enrichedTasks, groupBy]);

  // Toggle group expansion
  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  }, []);

  // Check if user can edit task
  const canEditTask = useCallback((task: Task) => {
    // For now, allow edit based on role only
    return role === 'Admin' || role === 'Manager';
  }, [role]);

  // Handle inline edit start
  const startEdit = useCallback((taskId: number, field: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingTask({ id: taskId, field });
  }, []);

  // Handle status change
  const handleStatusChange = useCallback(async (taskId: number, statusId: string) => {
    if (!onStatusChange) return;
    
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    try {
      await onStatusChange(taskId, parseInt(statusId));
      setEditingTask(null);
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  }, [onStatusChange]);

  // Handle assignee change
  const handleAssigneeChange = useCallback(async (taskId: number, assigneeId: string) => {
    if (!onAssigneeChange) return;
    
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    try {
      await onAssigneeChange(taskId, parseInt(assigneeId));
      setEditingTask(null);
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  }, [onAssigneeChange]);

  // Define columns
  const columns: DataTableColumn<Task>[] = [
    {
      accessor: 'title',
      title: 'Title',
      width: 350,
      resizable: true,
      render: (task) => (
        <Stack gap={4}>
          <Text size="sm" fw={500} lineClamp={1}>
            {task.title}
          </Text>
          {task.description && (
            <Text size="xs" c="dimmed" lineClamp={1}>
              {task.description}
            </Text>
          )}
        </Stack>
      )
    },
    {
      accessor: 'status',
      title: 'Status',
      width: 150,
      resizable: true,
      render: (task) => {
        const isEditing = editingTask?.id === task.id && editingTask?.field === 'status';
        const isUpdating = updatingTasks.has(task.id);
        const canEdit = canEditTask(task);

        if (isEditing && canEdit) {
          return (
            <Select
              size="xs"
              value={task.status_id?.toString()}
              data={statuses.map(s => ({ value: s.id.toString(), label: s.status_name }))}
              onChange={(value) => value && handleStatusChange(task.id, value)}
              onBlur={() => setEditingTask(null)}
              onClick={(e) => e.stopPropagation()}
              disabled={isUpdating}
              rightSection={isUpdating ? <Loader size="xs" /> : undefined}
              styles={{ input: { minHeight: rem(28) } }}
              autoFocus
            />
          );
        }

        return (
          <Badge
            variant="light"
            color={task.status?.is_final ? 'green' : 'blue'}
            onClick={canEdit ? (e) => startEdit(task.id, 'status', e) : undefined}
            style={{ cursor: canEdit ? 'pointer' : 'default' }}
          >
            {task.status?.status_name || 'No Status'}
          </Badge>
        );
      }
    },
    {
      accessor: 'assignee',
      title: 'Assignee',
      width: 180,
      resizable: true,
      render: (task) => {
        const isEditing = editingTask?.id === task.id && editingTask?.field === 'assignee';
        const isUpdating = updatingTasks.has(task.id);
        const canEdit = canEditTask(task);

        if (isEditing && canEdit) {
          return (
            <Select
              size="xs"
              value={task.assigned_to?.toString()}
              data={employees.map(e => ({ 
                value: e.id.toString(), 
                label: e.name
              }))}
              onChange={(value) => value && handleAssigneeChange(task.id, value)}
              onBlur={() => setEditingTask(null)}
              onClick={(e) => e.stopPropagation()}
              disabled={isUpdating}
              rightSection={isUpdating ? <Loader size="xs" /> : undefined}
              styles={{ input: { minHeight: rem(28) } }}
              searchable
              autoFocus
            />
          );
        }

        return (
          <Group gap="xs" onClick={canEdit ? (e) => startEdit(task.id, 'assignee', e) : undefined}>
            <IconUser size={14} stroke={1.5} />
            <Text size="sm" c={canEdit ? undefined : 'dimmed'} style={{ cursor: canEdit ? 'pointer' : 'default' }}>
              {task.assigned_to_employee 
                ? task.assigned_to_employee.name
                : 'Unassigned'}
            </Text>
          </Group>
        );
      }
    },
    {
      accessor: 'priority',
      title: 'Priority',
      width: 100,
      resizable: true,
      render: (task) => {
        const colors: Record<string, string> = {
          low: 'gray',
          normal: 'blue',
          high: 'orange',
          urgent: 'red'
        };
        return (
          <Badge color={colors[task.priority]} variant="dot">
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        );
      }
    },
    {
      accessor: 'due_date',
      title: 'Due Date',
      width: 120,
      resizable: true,
      render: (task) => {
        if (!task.due_date) return <Text size="sm" c="dimmed">No date</Text>;
        
        const dueDate = dayjs(task.due_date);
        const isOverdue = task.is_overdue;
        
        return (
          <Group gap="xs">
            <IconCalendarDue size={14} stroke={1.5} color={isOverdue ? 'var(--mantine-color-red-6)' : undefined} />
            <Text size="sm" c={isOverdue ? 'red' : undefined}>
              {dueDate.format('DD MMM YYYY')}
            </Text>
          </Group>
        );
      }
    },
    {
      accessor: 'progress',
      title: 'Progress',
      width: 120,
      resizable: true,
      render: (task) => {
        const progress = task.progress_percentage || 0;
        return (
          <Stack gap={4}>
            <Progress 
              value={progress} 
              size="sm" 
              color={progress >= 80 ? 'green' : progress >= 50 ? 'blue' : 'orange'}
            />
            <Text size="xs" ta="center" c="dimmed">
              {progress}%
            </Text>
          </Stack>
        );
      }
    },
    {
      accessor: 'schedule_variance',
      title: 'Schedule Variance',
      width: 150,
      resizable: true,
      render: (task) => {
        const variance = task.schedule_variance || 0;
        const health = task.health_status || 'green';
        const colors = { red: 'red', amber: 'orange', green: 'green' };
        
        return (
          <Group gap="xs">
            <Box w={8} h={8} style={{ borderRadius: '50%', backgroundColor: `var(--mantine-color-${colors[health]}-6)` }} />
            <Text size="sm" c={variance < 0 ? 'red' : undefined}>
              {formatScheduleVariance(variance)}
            </Text>
          </Group>
        );
      }
    },
    {
      accessor: 'hours',
      title: 'Hours',
      width: 120,
      resizable: true,
      render: (task) => (
        <Group gap="xs">
          <IconClock size={14} stroke={1.5} />
          <Text size="sm">
            {task.logged_hours}/{task.estimated_hours || '?'}h
          </Text>
        </Group>
      )
    }
  ];

  if (loading) {
    return (
      <Card>
        <Center h={400}>
          <Loader size="lg" />
        </Center>
      </Card>
    );
  }

  return (
    <Stack gap={0}>
      {/* Group By Selector */}
      <Card withBorder mb="md">
        <Group justify="space-between">
          <Group>
            <Text size="sm" fw={500}>Group by:</Text>
            <Select
              size="sm"
              value={groupBy}
              onChange={(value) => onGroupByChange?.(value as TaskGroupBy)}
              data={[
                { value: 'none', label: 'No Grouping' },
                { value: 'status', label: 'Status' },
                { value: 'priority', label: 'Priority' },
                { value: 'assignee', label: 'Assignee' },
                { value: 'due_date', label: 'Due Date' },
                { value: 'engagement', label: 'Engagement' },
                { value: 'phase', label: 'Phase' }
              ]}
              styles={{ input: { width: rem(150) } }}
            />
          </Group>
          <Text size="sm" c="dimmed">
            {tasks.length} tasks
          </Text>
        </Group>
      </Card>

      {/* Task Groups */}
      {groups.map((group) => {
        const isExpanded = groupBy === 'none' || expandedGroups.has(group.key);
        
        return (
          <Card key={group.key} withBorder mb="sm">
            {groupBy !== 'none' && (
              <Group
                justify="space-between"
                mb={isExpanded ? 'md' : 0}
                onClick={() => toggleGroup(group.key)}
                style={{ cursor: 'pointer' }}
              >
                <Group>
                  <ActionIcon variant="subtle" size="sm">
                    {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                  </ActionIcon>
                  <Text fw={500}>{group.label}</Text>
                  <Badge variant="light" size="sm">
                    {group.totalTasks} tasks
                  </Badge>
                </Group>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    {group.completedTasks}/{group.totalTasks} completed
                  </Text>
                  <Progress
                    value={group.progressPercentage}
                    size="sm"
                    w={100}
                    color={group.progressPercentage >= 80 ? 'green' : group.progressPercentage >= 50 ? 'blue' : 'orange'}
                  />
                </Group>
              </Group>
            )}
            
            <Collapse in={isExpanded}>
              <DataTable
                records={group.tasks}
                columns={columns}
                idAccessor="id"
                highlightOnHover
                onRowClick={({ record, event }) => {
                  if (event.target instanceof HTMLElement) {
                    const isInteractive = event.target.closest('select') || event.target.closest('button');
                    if (!isInteractive && onTaskClick) {
                      onTaskClick(record);
                    }
                  }
                }}
                styles={{
                  root: { border: 'none' },
                  header: { 
                    backgroundColor: 'var(--mantine-color-gray-0)',
                    fontWeight: 600
                  }
                }}
                rowStyle={(record) => ({
                  cursor: 'pointer',
                  opacity: record.status?.is_final ? 0.7 : 1
                })}
              />
            </Collapse>
          </Card>
        );
      })}
    </Stack>
  );
}