import dayjs from 'dayjs';
import { Task, TaskGroup, TaskGroupBy } from './types';

export function calculateTaskProgress(task: Task): number {
  if (!task.estimated_hours || task.estimated_hours === 0) {
    return 0;
  }
  const progress = (task.logged_hours / task.estimated_hours) * 100;
  return Math.min(Math.round(progress), 100);
}

export function calculateScheduleVariance(task: Task): number {
  if (!task.due_date) return 0;
  
  const today = dayjs();
  const dueDate = dayjs(task.due_date);
  const daysUntilDue = dueDate.diff(today, 'day');
  
  // If task is complete, variance is 0
  if (task.status?.is_final) return 0;
  
  // Negative means overdue
  return daysUntilDue;
}

export function getTaskHealthStatus(task: Task): 'red' | 'amber' | 'green' {
  const variance = calculateScheduleVariance(task);
  const progress = calculateTaskProgress(task);
  
  // If task is complete
  if (task.status?.is_final) return 'green';
  
  // If overdue
  if (variance < 0) return 'red';
  
  // If due soon (within 3 days) but low progress
  if (variance <= 3 && progress < 50) return 'amber';
  
  // If progress is significantly behind schedule
  if (task.estimated_hours && task.logged_hours) {
    const expectedProgress = variance > 0 ? ((dayjs().diff(dayjs(task.created_at), 'day') / (dayjs(task.due_date).diff(dayjs(task.created_at), 'day'))) * 100) : 100;
    if (progress < expectedProgress * 0.7) return 'amber';
  }
  
  return 'green';
}

export function formatScheduleVariance(variance: number): string {
  if (variance === 0) return 'On time';
  if (variance < 0) return `${Math.abs(variance)} days overdue`;
  if (variance === 1) return '1 day left';
  return `${variance} days left`;
}

export function getTaskPriorityColor(priority: Task['priority']): string {
  switch (priority) {
    case 'urgent':
      return 'var(--mantine-color-red-6)';
    case 'high':
      return 'var(--mantine-color-orange-6)';
    case 'normal':
      return 'var(--mantine-color-blue-6)';
    case 'low':
      return 'var(--mantine-color-gray-6)';
    default:
      return 'var(--mantine-color-gray-6)';
  }
}

export function getTaskHealthColor(status: 'red' | 'amber' | 'green'): string {
  switch (status) {
    case 'red':
      return 'var(--mantine-color-red-6)';
    case 'amber':
      return 'var(--mantine-color-yellow-6)';
    case 'green':
      return 'var(--mantine-color-green-6)';
    default:
      return 'var(--mantine-color-gray-6)';
  }
}

export function groupTasks(tasks: Task[], groupBy: TaskGroupBy): TaskGroup[] {
  if (groupBy === 'none') {
    return [{
      key: 'all',
      label: 'All Tasks',
      tasks,
      isExpanded: true,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status?.is_final).length,
      totalEstimatedHours: tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0),
      totalLoggedHours: tasks.reduce((sum, t) => sum + t.logged_hours, 0),
      progressPercentage: calculateGroupProgress(tasks)
    }];
  }

  const groups = new Map<string, Task[]>();

  tasks.forEach(task => {
    let groupKey: string;
    let groupLabel: string;

    switch (groupBy) {
      case 'status':
        groupKey = task.status?.status_code || 'no-status';
        groupLabel = task.status?.status_name || 'No Status';
        break;
      
      case 'priority':
        groupKey = task.priority;
        groupLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1) + ' Priority';
        break;
      
      case 'assignee':
        groupKey = task.assigned_to?.toString() || 'unassigned';
        groupLabel = task.assigned_to_employee 
          ? task.assigned_to_employee.name
          : 'Unassigned';
        break;
      
      case 'due_date':
        groupKey = getDateGroup(task.due_date);
        groupLabel = getDateGroupLabel(groupKey);
        break;
      
      case 'engagement':
        groupKey = task.engagement?.id?.toString() || 'no-engagement';
        groupLabel = task.engagement?.engagementName || 'No Engagement';
        break;
      
      case 'phase':
        groupKey = task.engagement_phase?.id?.toString() || 'no-phase';
        groupLabel = task.engagement_phase?.phaseName || 'No Phase';
        break;
      
      default:
        groupKey = 'other';
        groupLabel = 'Other';
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(task);
  });

  // Convert to array and sort
  const groupArray: TaskGroup[] = Array.from(groups.entries()).map(([key, tasks]) => {
    const label = getGroupLabel(key, groupBy, tasks[0]);
    return {
      key,
      label,
      tasks,
      isExpanded: true,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status?.is_final).length,
      totalEstimatedHours: tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0),
      totalLoggedHours: tasks.reduce((sum, t) => sum + t.logged_hours, 0),
      progressPercentage: calculateGroupProgress(tasks)
    };
  });

  // Sort groups
  return sortGroups(groupArray, groupBy);
}

function calculateGroupProgress(tasks: Task[]): number {
  const totalEstimated = tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
  const totalLogged = tasks.reduce((sum, t) => sum + t.logged_hours, 0);
  
  if (totalEstimated === 0) return 0;
  return Math.min(Math.round((totalLogged / totalEstimated) * 100), 100);
}

function getDateGroup(dueDate?: string): string {
  if (!dueDate) return 'no-due-date';
  
  const today = dayjs();
  const due = dayjs(dueDate);
  const diff = due.diff(today, 'day');
  
  if (diff < 0) return 'overdue';
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff <= 7) return 'this-week';
  if (diff <= 30) return 'this-month';
  return 'later';
}

function getDateGroupLabel(groupKey: string): string {
  const labels: Record<string, string> = {
    'overdue': 'Overdue',
    'today': 'Today',
    'tomorrow': 'Tomorrow',
    'this-week': 'This Week',
    'this-month': 'This Month',
    'later': 'Later',
    'no-due-date': 'No Due Date'
  };
  return labels[groupKey] || groupKey;
}

function getGroupLabel(key: string, groupBy: TaskGroupBy, sampleTask: Task): string {
  switch (groupBy) {
    case 'status':
      return sampleTask.status?.status_name || 'No Status';
    case 'priority':
      return key.charAt(0).toUpperCase() + key.slice(1) + ' Priority';
    case 'assignee':
      return sampleTask.assigned_to_employee 
        ? sampleTask.assigned_to_employee.name
        : 'Unassigned';
    case 'due_date':
      return getDateGroupLabel(key);
    case 'engagement':
      return sampleTask.engagement?.engagementName || 'No Engagement';
    case 'phase':
      return sampleTask.engagement_phase?.phaseName || 'No Phase';
    default:
      return key;
  }
}

function sortGroups(groups: TaskGroup[], groupBy: TaskGroupBy): TaskGroup[] {
  switch (groupBy) {
    case 'priority':
      const priorityOrder = ['urgent', 'high', 'normal', 'low'];
      return groups.sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a.key);
        const bIndex = priorityOrder.indexOf(b.key);
        return aIndex - bIndex;
      });
    
    case 'due_date':
      const dateOrder = ['overdue', 'today', 'tomorrow', 'this-week', 'this-month', 'later', 'no-due-date'];
      return groups.sort((a, b) => {
        const aIndex = dateOrder.indexOf(a.key);
        const bIndex = dateOrder.indexOf(b.key);
        return aIndex - bIndex;
      });
    
    case 'status':
      // Sort by status sequence if available
      return groups.sort((a, b) => {
        const aSeq = a.tasks[0]?.status?.sequence || 999;
        const bSeq = b.tasks[0]?.status?.sequence || 999;
        return aSeq - bSeq;
      });
    
    default:
      // Sort alphabetically by label
      return groups.sort((a, b) => a.label.localeCompare(b.label));
  }
}