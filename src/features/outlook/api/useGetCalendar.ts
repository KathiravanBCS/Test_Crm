import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CRMCalendarFilter, CalendarSearchResponse } from '@/services/graph/types';
import { createCalendarQueryKey } from '../utils/query-key-utils';

/**
 * Hook to fetch recent meetings
 */
export function useRecentMeetings(filter: CRMCalendarFilter, enabled = true) {
  const queryKey = createCalendarQueryKey(filter);
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log('[useRecentMeetings] Fetching with filter:', filter);
      console.log('[useRecentMeetings] Query key:', queryKey);
      const calendarService = api.outlook.calendar();
      return await calendarService.getRecentMeetings(filter);
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    enabled
  });
}

/**
 * Hook to fetch meeting details
 */
export function useMeetingDetails(eventId: string, enabled = true) {
  return useQuery({
    queryKey: ['calendar', 'details', eventId],
    queryFn: async () => {
      const calendarService = api.outlook.calendar();
      return await calendarService.getMeetingDetails(eventId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!eventId && enabled
  });
}

/**
 * Hook to search meetings
 */
export function useSearchMeetings(query: string, filter?: CRMCalendarFilter, enabled = true) {
  return useQuery({
    queryKey: ['calendar', 'search', query, filter],
    queryFn: async () => {
      const calendarService = api.outlook.calendar();
      return await calendarService.searchMeetings(query, filter);
    },
    staleTime: 30 * 1000,
    enabled: !!query && enabled
  });
}

/**
 * Hook to get meetings related to entity codes
 */
export function useRelatedMeetings(entityCodes: string[], filter?: CRMCalendarFilter, enabled = true) {
  return useQuery({
    queryKey: ['calendar', 'related', entityCodes, filter],
    queryFn: async () => {
      const calendarService = api.outlook.calendar();
      return await calendarService.getRelatedMeetings(entityCodes, filter);
    },
    staleTime: 30 * 1000,
    enabled: entityCodes.length > 0 && enabled
  });
}

/**
 * Hook to refresh calendar cache
 */
export function useRefreshCalendar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (filter?: CRMCalendarFilter) => {
      const calendarService = api.outlook.calendar();
      return await calendarService.getRecentMeetings(filter || {});
    },
    onSuccess: () => {
      // Invalidate all calendar queries to force refresh
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    }
  });
}