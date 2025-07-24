import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Group, Button, Box, Stack, Switch, Select, ActionIcon } from '@mantine/core';
import { IconPlus, IconSettings } from '@tabler/icons-react';
import { 
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
import { useTaskViewStore } from '@/app/store/taskView.store';
import { TaskListTable } from '../components/TaskListTable';
import { TaskBoardView } from '../components/TaskBoardView';
import { TaskCalendarView } from '../components/TaskCalendarView';
import { TaskViewToggle } from '../components/TaskViewToggle';
import { BoardSettingsDrawer } from '../components/BoardSettingsDrawer';
import { Task, TaskGroupBy } from '../types';
import { TaskFilters } from '../components/TaskFilters';
import { TaskDetailView } from '../components/TaskDetailView';

export interface TaskViewProps {
  // Context filtering
  engagementId?: number;
  phaseId?: number;
  serviceItemId?: number;
  
  // UI customization
  title?: string;
  showHeader?: boolean;
  showFilters?: boolean;
  showViewToggle?: boolean;
  defaultView?: 'list' | 'board' | 'calendar';
  defaultGroupBy?: TaskGroupBy;
  
  // Actions
  onTaskCreate?: (context?: { engagementId?: number; phaseId?: number; serviceItemId?: number }) => void;
  onTaskEdit?: (task: Task) => void;
  
  // Layout
  compact?: boolean;
}

export function TaskView({
  engagementId,
  phaseId,
  serviceItemId,
  title = 'Tasks',
  showHeader = true,
  showFilters = true,
  showViewToggle = true,
  defaultView = 'list',
  defaultGroupBy = 'status',
  onTaskCreate,
  onTaskEdit,
  compact = false,
}: TaskViewProps) {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [settingsDrawerOpened, setSettingsDrawerOpened] = useState(false);
  
  // View preferences from store
  const { 
    viewType, 
    groupBy, 
    showCompleted,
    setViewType, 
    setGroupBy, 
    toggleShowCompleted 
  } = useTaskViewStore();
  
  // Use defaultView and defaultGroupBy if this is the first render
  const [isInitialized, setIsInitialized] = useState(false);
  useMemo(() => {
    if (!isInitialized) {
      setViewType(defaultView);
      setGroupBy(defaultGroupBy);
      setIsInitialized(true);
    }
  }, [defaultView, defaultGroupBy, isInitialized, setViewType, setGroupBy]);
  
  // Fetch data with context filtering
  const { data: tasks = [], isLoading, error } = useGetTasks({
    engagement_id: engagementId,
    phase_id: phaseId,
    service_item_id: serviceItemId,
  });
  
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

  const handleTaskCreate = () => {
    if (onTaskCreate) {
      onTaskCreate({
        engagementId,
        phaseId,
        serviceItemId,
      });
    } else {
      // Default navigation behavior
      const params = new URLSearchParams();
      if (engagementId) params.append('engagement_id', engagementId.toString());
      if (phaseId) params.append('phase_id', phaseId.toString());
      if (serviceItemId) params.append('service_item_id', serviceItemId.toString());
      
      navigate(`tasks/new${params.toString() ? `?${params.toString()}` : ''}`);
    }
  };

  const handleTaskEdit = (task: Task) => {
    if (onTaskEdit) {
      onTaskEdit(task);
    } else {
      navigate(`tasks/${task.id}/edit`);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleAddTaskFromBoard = (statusId?: number, contextData?: any) => {
    const params = new URLSearchParams();
    if (engagementId) params.append('engagement_id', engagementId.toString());
    if (phaseId) params.append('phase_id', phaseId.toString());
    if (serviceItemId) params.append('service_item_id', serviceItemId.toString());
    if (statusId) params.append('status_id', statusId.toString());
    
    if (onTaskCreate) {
      onTaskCreate({
        engagementId,
        phaseId,
        serviceItemId,
      });
    } else {
      navigate(`tasks/new${params.toString() ? `?${params.toString()}` : ''}`);
    }
  };

  return (
    <Stack gap="md">
      {/* Header Section */}
      {showHeader && (
        <Group justify="space-between" wrap="nowrap">
          <Group gap="md">
            {showViewToggle && (
              <TaskViewToggle
                value={viewType}
                onChange={setViewType}
                availableViews={['list', 'board', 'calendar']}
              />
            )}
            <Select
              size="sm"
              value={groupBy}
              onChange={(value) => setGroupBy(value as TaskGroupBy)}
              data={[
                { value: 'none', label: 'No grouping' },
                { value: 'status', label: 'Group by Status' },
                { value: 'priority', label: 'Group by Priority' },
                { value: 'assignee', label: 'Group by Assignee' },
                { value: 'due_date', label: 'Group by Due Date' },
                { value: 'engagement', label: 'Group by Engagement' },
                { value: 'phase', label: 'Group by Phase' },
                { value: 'service_item', label: 'Group by Service Item' },
              ]}
              style={{ width: 200 }}
            />
            <Switch
              label="Show completed"
              checked={showCompleted}
              onChange={toggleShowCompleted}
              size="sm"
            />
            {viewType === 'board' && (
              <ActionIcon
                variant="subtle"
                onClick={() => setSettingsDrawerOpened(true)}
                title="Board settings"
              >
                <IconSettings size={18} />
              </ActionIcon>
            )}
          </Group>
          <Button 
            leftSection={<IconPlus size={16} />} 
            onClick={handleTaskCreate}
            size={compact ? 'xs' : 'sm'}
          >
            New Task
          </Button>
        </Group>
      )}

      {/* Filters Section */}
      {showFilters && (
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
      )}

      {/* Content Section */}
      {viewType === 'list' ? (
          <TaskListTable
            tasks={filteredTasks}
            loading={isLoading}
            statuses={statuses}
            employees={employees}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
            onTaskClick={handleTaskClick}
            onStatusChange={handleStatusChange}
            onAssigneeChange={handleAssigneeChange}
          />
        ) : viewType === 'board' ? (
          <TaskBoardView
            tasks={filteredTasks}
            statuses={statuses}
            isLoading={isLoading}
            onTaskEdit={handleTaskClick}
            onTaskStatusChange={handleStatusChange}
            onTaskAssigneeChange={handleAssigneeChange}
            onAddTask={handleAddTaskFromBoard}
            groupBy={groupBy}
          />
        ) : (
          <TaskCalendarView
            tasks={filteredTasks}
            isLoading={isLoading}
            contextType={serviceItemId ? 'service_item' : phaseId ? 'phase' : engagementId ? 'engagement' : undefined}
            contextId={serviceItemId || phaseId || engagementId}
            onTaskUpdate={(task) => {
              // Handle task updates from calendar
              updateTask.mutate({ id: task.id, data: task });
            }}
            onTaskCreate={handleTaskCreate}
          />
        )}

      {/* Filter Drawer */}
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

      {/* Detail Drawer */}
      <DetailDrawer
        opened={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || 'Task Details'}
      >
        {selectedTask && (
          <TaskDetailView
            task={selectedTask}
            onEdit={() => handleTaskEdit(selectedTask)}
          />
        )}
      </DetailDrawer>

      {/* Board Settings Drawer */}
      <BoardSettingsDrawer
        opened={settingsDrawerOpened}
        onClose={() => setSettingsDrawerOpened(false)}
      />
    </Stack>
  );
}