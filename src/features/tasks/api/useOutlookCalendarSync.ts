import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Task } from '../types';

interface OutlookSyncOptions {
  createEvent: boolean;
  updateExisting: boolean;
  sendInvites: boolean;
  includeDescription: boolean;
  includeEngagementInfo: boolean;
}

interface OutlookSyncPayload {
  tasks: Task[];
  calendarId: string;
  options: OutlookSyncOptions;
}

interface OutlookSyncResult {
  successCount: number;
  failedCount: number;
  syncedEvents: Array<{
    taskId: number;
    eventId: string;
    eventUrl: string;
  }>;
}

export const useOutlookCalendarSync = () => {
  const queryClient = useQueryClient();

  return useMutation<OutlookSyncResult, Error, OutlookSyncPayload>({
    mutationFn: async (payload) => {
      // In a real implementation, this would call the Microsoft Graph API
      // For now, we'll simulate a successful sync
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            successCount: payload.tasks.length,
            failedCount: 0,
            syncedEvents: payload.tasks.map(task => ({
              taskId: task.id,
              eventId: `outlook-event-${task.id}`,
              eventUrl: `https://outlook.live.com/calendar/event/${task.id}`,
            })),
          });
        }, 1500);
      });
    },
    onSuccess: () => {
      // Invalidate calendar sync data
      queryClient.invalidateQueries({ queryKey: ['calendar-sync'] });
    },
  });
};