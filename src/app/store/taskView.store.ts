import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TaskViewType, TaskGroupBy, TaskViewPreferences, TaskCalendarViewSettings } from '@/features/tasks/types';

export type CardSize = 'normal' | 'compact' | 'minimal';
export type CardSpacing = 'normal' | 'tight';

export interface BoardDisplaySettings {
  cardSize: CardSize;
  columnWidth: number;
  cardSpacing: CardSpacing;
  showFields: {
    priority: boolean;
    progress: boolean;
    dueDate: boolean;
    assignee: boolean;
    timeTracking: boolean;
    engagementContext: boolean;
    healthStatus: boolean;
  };
}

interface TaskViewState {
  viewType: TaskViewType;
  groupBy: TaskGroupBy;
  sortBy: 'priority' | 'due_date' | 'created_at';
  sortOrder: 'asc' | 'desc';
  showCompleted: boolean;
  boardColumns: string[];
  boardDisplaySettings: BoardDisplaySettings;
  calendarSettings: TaskCalendarViewSettings;
  
  // Actions
  setViewType: (viewType: TaskViewType) => void;
  setGroupBy: (groupBy: TaskGroupBy) => void;
  setSortBy: (sortBy: 'priority' | 'due_date' | 'created_at') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  toggleShowCompleted: () => void;
  setBoardColumns: (columns: string[]) => void;
  setBoardDisplaySettings: (settings: Partial<BoardDisplaySettings>) => void;
  toggleBoardField: (field: keyof BoardDisplaySettings['showFields']) => void;
  updateCalendarSettings: (settings: TaskCalendarViewSettings) => void;
  getPreferences: () => TaskViewPreferences;
}

const defaultBoardColumns = ['to_do', 'in_progress', 'review', 'done'];

const defaultBoardDisplaySettings: BoardDisplaySettings = {
  cardSize: 'normal',
  columnWidth: 300,
  cardSpacing: 'normal',
  showFields: {
    priority: true,
    progress: true,
    dueDate: true,
    assignee: true,
    timeTracking: true,
    engagementContext: true,
    healthStatus: true,
  },
};

const defaultCalendarSettings: TaskCalendarViewSettings = {
  defaultView: 'month',
  selectedEmployees: [],
  showMyTasksOnly: false,
  showWeekends: true,
  showCompletedTasks: false,
  colorBy: 'priority',
};

export const useTaskViewStore = create<TaskViewState>()(
  persist(
    (set, get) => ({
      viewType: 'list',
      groupBy: 'none',
      sortBy: 'priority',
      sortOrder: 'desc',
      showCompleted: true,
      boardColumns: defaultBoardColumns,
      boardDisplaySettings: defaultBoardDisplaySettings,
      calendarSettings: defaultCalendarSettings,
      
      setViewType: (viewType) => set({ viewType }),
      setGroupBy: (groupBy) => set({ groupBy }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
      toggleShowCompleted: () => set((state) => ({ showCompleted: !state.showCompleted })),
      setBoardColumns: (boardColumns) => set({ boardColumns }),
      
      setBoardDisplaySettings: (settings) => 
        set((state) => ({
          boardDisplaySettings: {
            ...state.boardDisplaySettings,
            ...settings,
            showFields: settings.showFields 
              ? { ...state.boardDisplaySettings.showFields, ...settings.showFields }
              : state.boardDisplaySettings.showFields,
          },
        })),
      
      toggleBoardField: (field) =>
        set((state) => ({
          boardDisplaySettings: {
            ...state.boardDisplaySettings,
            showFields: {
              ...state.boardDisplaySettings.showFields,
              [field]: !state.boardDisplaySettings.showFields[field],
            },
          },
        })),
      
      updateCalendarSettings: (settings) =>
        set((state) => ({
          calendarSettings: {
            ...state.calendarSettings,
            ...settings,
          },
        })),
      
      getPreferences: () => {
        const state = get();
        return {
          viewType: state.viewType,
          groupBy: state.groupBy,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          showCompleted: state.showCompleted,
          boardColumns: state.boardColumns,
        };
      },
    }),
    {
      name: 'task-view-preferences',
    }
  )
);