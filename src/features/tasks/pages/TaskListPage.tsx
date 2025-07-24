import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Group, Button, Text, Box } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { 
  ListPageLayout, 
  SearchInput, 
  FilterDrawer, 
  FilterTrigger,
  DetailDrawer
} from '@/components/list-page';
import { useListPageState } from '@/lib/hooks/useListPageState';
import { useGetTasks } from '../api/useGetTasks';
import { useGetTaskStatuses, transformTaskStatus } from '../api/useGetTaskStatuses';
import { useUpdateTask } from '../api/useUpdateTask';
import { useGetEmployees } from '@/features/employees/api/useGetEmployees';
import { TaskListTable } from '../components/TaskListTable';
import { Task, TaskGroupBy } from '../types';
import { TaskFilters } from '../components/TaskFilters';
import { TaskDetailView } from '../components/TaskDetailView';

export function TaskListPage() {
  const navigate = useNavigate();
  const [groupBy, setGroupBy] = useState<TaskGroupBy>('status');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Fetch data
  const { data: tasks = [], isLoading, error } = useGetTasks();
  const { data: statusesRaw = [] } = useGetTaskStatuses();
  const { data: employees = [] } = useGetEmployees();
  const updateTask = useUpdateTask();
  
  // Transform statuses to the expected format
  const statuses = statusesRaw.map(transformTaskStatus);

  // List page state management
  const listState = useListPageState({
    data: tasks,
    searchFields: ['title', 'description'],
    pageSize: 50 // Larger page size for task lists
  });

  // Filter configuration
  const filterConfig = {
    status_id: {
      label: 'Status',
      type: 'select' as const,
      options: statuses.map(s => ({ value: s.id.toString(), label: s.status_name }))
    },
    priority: {
      label: 'Priority',
      type: 'select' as const,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]
    },
    assigned_to: {
      label: 'Assignee',
      type: 'select' as const,
      options: employees.map(e => ({ 
        value: e.id.toString(), 
        label: e.name
      }))
    },
    due_date_range: {
      label: 'Due Date',
      type: 'dateRange' as const
    },
    has_overdue: {
      label: 'Overdue Tasks',
      type: 'checkbox' as const
    }
  };

  // Apply additional filters
  const filteredTasks = useMemo(() => {
    let filtered = listState.filteredData;

    // Apply due date range filter
    if (listState.filters.due_date_range) {
      const [start, end] = listState.filters.due_date_range;
      filtered = filtered.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate >= start && dueDate <= end;
      });
    }

    // Apply overdue filter
    if (listState.filters.has_overdue) {
      filtered = filtered.filter(task => {
        if (!task.due_date) return false;
        return new Date(task.due_date) < new Date() && !task.status?.is_final;
      });
    }

    return filtered;
  }, [listState.filteredData, listState.filters]);

  // Handle task updates
  const handleStatusChange = async (taskId: number, statusId: number) => {
    await updateTask.mutateAsync({ id: taskId, data: { status_id: statusId } });
  };

  const handleAssigneeChange = async (taskId: number, assigneeId: number) => {
    await updateTask.mutateAsync({ id: taskId, data: { assigned_to: assigneeId } });
  };

  return (
    <ListPageLayout
      title="Tasks"
      actions={
        <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/tasks/new')}>
          New Task
        </Button>
      }
      filters={
        <Card>
          <Group>
            <Box style={{ flex: 1 }}>
              <SearchInput
                value={listState.search}
                onChange={listState.setSearch}
                placeholder="Search tasks..."
              />
            </Box>
            <FilterTrigger
              count={Object.keys(listState.filters).length}
              onClick={listState.openFilterDrawer}
            />
          </Group>
        </Card>
      }
    >
      <TaskListTable
        tasks={filteredTasks}
        loading={isLoading}
        statuses={statuses}
        employees={employees}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        onTaskClick={setSelectedTask}
        onStatusChange={handleStatusChange}
        onAssigneeChange={handleAssigneeChange}
      />

      <FilterDrawer
        opened={listState.filterDrawerOpened}
        onClose={listState.closeFilterDrawer}
        onReset={listState.resetFilters}
        filterCount={listState.activeFilterCount}
      >
        <TaskFilters
          filters={listState.filters}
          onFiltersChange={listState.setFilters}
          onReset={listState.resetFilters}
          statuses={statuses}
          employees={employees}
        />
      </FilterDrawer>

      <DetailDrawer
        opened={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || 'Task Details'}
      >
        {selectedTask && (
          <TaskDetailView
            task={selectedTask}
            onEdit={() => navigate(`/tasks/${selectedTask.id}/edit`)}
          />
        )}
      </DetailDrawer>
    </ListPageLayout>
  );
}