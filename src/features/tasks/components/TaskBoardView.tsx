import { useMemo, useState } from 'react';
import { Box, Group, Center, Loader } from '@mantine/core';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { EmptyState } from '@/components/display/EmptyState';
import type { Task, TaskBoardColumn, TaskGroupBy } from '../types';
import { groupTasks } from '../utils';
import { useTaskViewStore } from '@/app/store/taskView.store';
import './TaskBoard.css';

interface TaskBoardViewProps {
  tasks: Task[];
  statuses?: Array<{ id: number; status_code: string; status_name: string; sequence: number }>;
  isLoading?: boolean;
  onTaskEdit?: (task: Task) => void;
  onTaskStatusChange?: (taskId: number, statusId: number) => Promise<void>;
  onTaskAssigneeChange?: (taskId: number, assigneeId: number) => Promise<void>;
  onAddTask?: (statusId?: number, contextData?: any) => void;
  groupBy?: TaskGroupBy;
}

const STATUS_COLORS: Record<string, string> = {
  to_do: 'gray',
  in_progress: 'blue',
  review: 'orange',
  done: 'green',
  blocked: 'red',
  cancelled: 'dark',
};

export function TaskBoardView({
  tasks,
  statuses = [],
  isLoading,
  onTaskEdit,
  onTaskStatusChange,
  onTaskAssigneeChange,
  onAddTask,
  groupBy = 'status',
}: TaskBoardViewProps) {
  const { showCompleted, boardDisplaySettings } = useTaskViewStore();
  const { columnWidth } = boardDisplaySettings;

  // Filter tasks based on showCompleted
  const filteredTasks = useMemo(() => {
    if (showCompleted) return tasks;
    return tasks.filter(task => task.status?.status_code !== 'done' && task.status?.status_code !== 'cancelled');
  }, [tasks, showCompleted]);

  // Create columns based on grouping
  const columns = useMemo((): TaskBoardColumn[] => {
    if (groupBy === 'status') {
      // Group by status - use the provided statuses or extract from tasks
      const statusMap = new Map<number, TaskBoardColumn>();
      
      // Initialize columns from statuses
      statuses.forEach(status => {
        statusMap.set(status.id, {
          id: status.id.toString(),
          title: status.status_name,
          statusId: status.id,
          color: STATUS_COLORS[status.status_code] || 'gray',
          tasks: [],
        });
      });

      // If no statuses provided, create from tasks
      if (statuses.length === 0) {
        filteredTasks.forEach(task => {
          if (task.status && !statusMap.has(task.status.id)) {
            statusMap.set(task.status.id, {
              id: task.status.id.toString(),
              title: task.status.status_name,
              statusId: task.status.id,
              color: STATUS_COLORS[task.status.status_code] || 'gray',
              tasks: [],
            });
          }
        });
      }

      // Assign tasks to columns
      filteredTasks.forEach(task => {
        if (task.status && statusMap.has(task.status.id)) {
          statusMap.get(task.status.id)!.tasks.push(task);
        }
      });

      // Sort columns by sequence
      return Array.from(statusMap.values()).sort((a, b) => {
        const statusA = statuses.find(s => s.id === a.statusId);
        const statusB = statuses.find(s => s.id === b.statusId);
        return (statusA?.sequence || 0) - (statusB?.sequence || 0);
      });
    } else if (groupBy === 'service_item') {
      // Group by service item, then create sub-columns for each status
      const serviceItemGroups = groupTasks(filteredTasks, 'service_item');
      const allColumns: TaskBoardColumn[] = [];

      serviceItemGroups.forEach(group => {
        // Create a section for each service item
        const serviceItemTasks = group.tasks;
        const statusColumns = new Map<number, Task[]>();

        // Group tasks by status within this service item
        serviceItemTasks.forEach(task => {
          if (task.status) {
            if (!statusColumns.has(task.status.id)) {
              statusColumns.set(task.status.id, []);
            }
            statusColumns.get(task.status.id)!.push(task);
          }
        });

        // Create columns for each status within this service item
        statuses.forEach(status => {
          const columnId = `${group.key}_${status.id}`;
          allColumns.push({
            id: columnId,
            title: `${group.label} - ${status.status_name}`,
            statusId: status.id,
            color: STATUS_COLORS[status.status_code] || 'gray',
            tasks: statusColumns.get(status.id) || [],
          });
        });
      });

      return allColumns;
    } else {
      // For other groupings, create simple columns
      const groups = groupTasks(filteredTasks, groupBy);
      return groups.map(group => ({
        id: group.key,
        title: group.label,
        tasks: group.tasks,
        color: 'gray',
      }));
    }
  }, [filteredTasks, groupBy, statuses, showCompleted]);

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination } = result;

    if (!destination) return;

    const taskId = parseInt(draggableId);
    const destinationColumnId = destination.droppableId;
    const destinationColumn = columns.find(col => col.id === destinationColumnId);

    if (!destinationColumn) return;

    // If grouping by status and the column has a statusId, update the task status
    if (groupBy === 'status' && destinationColumn.statusId) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status_id !== destinationColumn.statusId) {
        await onTaskStatusChange?.(taskId, destinationColumn.statusId);
      }
    } else if (groupBy === 'service_item' && destinationColumn.statusId) {
      // For service item grouping, we still update status based on the column's statusId
      await onTaskStatusChange?.(taskId, destinationColumn.statusId);
    }
    // For other groupings, we might need different logic
  };

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader />
      </Center>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Create your first task to get started"
        action={{
          label: "Create Task",
          onClick: () => onAddTask?.()
        }}
      />
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box 
        className="task-board-container"
        style={{ 
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: '1rem'
        }}
      >
        <Group 
          align="stretch" 
          wrap="nowrap" 
          gap="md"
          style={{ minWidth: columns.length * (columnWidth + 16) }}
        >
          {columns.map((column, index) => (
            <Box key={column.id} style={{ width: columnWidth, minWidth: columnWidth }}>
              <KanbanColumn
                column={column}
                index={index}
                onTaskEdit={onTaskEdit}
                onTaskStatusChange={async (task, statusId) => {
                  await onTaskStatusChange?.(task.id, statusId);
                }}
                onTaskAssigneeChange={async (task, assigneeId) => {
                  await onTaskAssigneeChange?.(task.id, assigneeId);
                }}
                onAddTask={(columnId) => {
                  if (groupBy === 'status') {
                    const statusId = parseInt(columnId);
                    onAddTask?.(statusId);
                  } else if (groupBy === 'service_item' && column.statusId) {
                    // Extract service item context from column ID
                    const [serviceItemKey] = columnId.split('_');
                    onAddTask?.(column.statusId, { serviceItemKey });
                  } else {
                    onAddTask?.();
                  }
                }}
                isLoading={isLoading}
              />
            </Box>
          ))}
        </Group>
      </Box>
    </DragDropContext>
  );
}