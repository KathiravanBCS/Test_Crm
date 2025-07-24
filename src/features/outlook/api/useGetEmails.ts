import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CRMEmailFilter, EmailSearchResponse } from '@/services/graph/types';
import { createEmailQueryKey } from '../utils/query-key-utils';

/**
 * Hook to fetch recent emails
 */
export function useRecentEmails(filter: CRMEmailFilter, enabled = true) {
  const queryKey = createEmailQueryKey(filter);
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log('[useRecentEmails] Fetching emails with filter:', filter);
      console.log('[useRecentEmails] Query key:', queryKey);
      const emailService = api.outlook.email();
      const result = await emailService.getRecentEmails(filter);
      console.log('[useRecentEmails] Result:', {
        emailCount: result.emails?.length || 0,
        totalCount: result.totalCount,
        hasMore: result.hasMore
      });
      return result;
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled
  });
}

/**
 * Hook to fetch email details
 */
export function useEmailDetails(messageId: string, enabled = true) {
  return useQuery({
    queryKey: ['emails', 'details', messageId],
    queryFn: async () => {
      const emailService = api.outlook.email();
      return await emailService.getEmailDetails(messageId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!messageId && enabled
  });
}

/**
 * Hook to search emails
 */
export function useSearchEmails(query: string, filter?: CRMEmailFilter, enabled = true) {
  return useQuery({
    queryKey: ['emails', 'search', query, filter],
    queryFn: async () => {
      const emailService = api.outlook.email();
      return await emailService.searchEmails(query, filter);
    },
    staleTime: 30 * 1000,
    enabled: !!query && enabled
  });
}

/**
 * Hook to get emails related to entity codes
 */
export function useRelatedEmails(entityCodes: string[], filter?: CRMEmailFilter, enabled = true) {
  return useQuery({
    queryKey: ['emails', 'related', entityCodes, filter],
    queryFn: async () => {
      const emailService = api.outlook.email();
      return await emailService.getRelatedEmails(entityCodes, filter);
    },
    staleTime: 30 * 1000,
    enabled: entityCodes.length > 0 && enabled
  });
}

/**
 * Hook to refresh email cache
 */
export function useRefreshEmails() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (filter?: CRMEmailFilter) => {
      const emailService = api.outlook.email();
      return await emailService.getRecentEmails(filter || {});
    },
    onSuccess: () => {
      // Invalidate all email queries to force refresh
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    }
  });
}