export interface Task {
  id: number;
  title: string;
  description?: string;
  assigned_to: number;
  assigned_to_employee?: EmployeeProfile;
  created_by: number;
  created_by_employee?: EmployeeProfile;
  status_id: number;
  status?: TaskStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  due_date?: string;
  context_type?: string;
  context_id?: number;
  estimated_hours?: number;
  logged_hours: number;
  requires_approval: boolean;
  approved_by?: number;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  
  // Computed fields
  progress_percentage?: number;
  health_status?: 'red' | 'amber' | 'green';
  schedule_variance?: number;
  is_overdue?: boolean;
  
  // Related entities
  engagement?: Engagement;
  engagement_phase?: EngagementPhase;
  engagement_service_item?: EngagementServiceItem;
}

export interface TaskStatus {
  id: number;
  context: string;
  status_code: string;
  status_name: string;
  sequence: number;
  is_final: boolean;
  is_active: boolean;
}

// Use EmployeeProfile from common types
import { EmployeeProfile } from '@/types/common';
// Import engagement types from the engagement feature
import { Engagement, EngagementPhase, EngagementServiceItem as BaseEngagementServiceItem } from '@/features/engagements/types';

export interface EngagementServiceItem extends BaseEngagementServiceItem {
  // Additional properties specific to tasks if needed
}

export type TaskViewType = 'list' | 'board' | 'calendar' | 'gantt';

export type TaskGroupBy = 'status' | 'priority' | 'assignee' | 'due_date' | 'engagement' | 'phase' | 'service_item' | 'none';

export interface TaskGroup {
  key: string;
  label: string;
  tasks: Task[];
  isExpanded: boolean;
  // Group summary
  totalTasks: number;
  completedTasks: number;
  totalEstimatedHours: number;
  totalLoggedHours: number;
  progressPercentage: number;
}

export interface TaskListState {
  tasks: Task[];
  groupBy: TaskGroupBy;
  expandedGroups: Set<string>;
  selectedTasks: Task[];
  editingTaskId: number | null;
}

export interface TaskBoardColumn {
  id: string;
  title: string;
  statusId?: number;
  color?: string;
  tasks: Task[];
  maxItems?: number;
  isDragOver?: boolean;
}

export interface TaskViewPreferences {
  viewType: TaskViewType;
  groupBy: TaskGroupBy;
  sortBy?: 'priority' | 'due_date' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  showCompleted: boolean;
  boardColumns?: string[];
}

export interface TaskCalendarEvent {
  id: number;
  task: Task;
  start: Date;
  end: Date;
  resourceId?: number; // Employee ID for resource view
}

export interface TaskCalendarViewSettings {
  defaultView?: 'month' | 'week' | 'work_week' | 'day' | 'agenda';
  selectedEmployees?: string[];
  showMyTasksOnly?: boolean;
  showWeekends?: boolean;
  showCompletedTasks?: boolean;
  colorBy?: 'priority' | 'status' | 'engagement' | 'assignee';
}