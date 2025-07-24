/**
 * Utility functions for creating stable query keys
 * Ensures that filters with the same values produce the same query key
 */

import { CRMEmailFilter, CRMCalendarFilter } from '@/services/graph/types';

/**
 * Create a stable query key for email filters
 * Sorts and stringifies the filter to ensure consistency
 */
export function createEmailQueryKey(filter: CRMEmailFilter): any[] {
  // Create a normalized version of the filter
  const normalizedFilter = {
    // Sort properties alphabetically to ensure consistent order
    entityType: filter.entityType || undefined,
    entityId: filter.entityId || undefined,
    entityCode: filter.entityCode || undefined,
    relatedCodes: filter.relatedCodes ? [...filter.relatedCodes].sort() : undefined,
    folder: filter.folder || undefined,
    search: filter.search || undefined,
    hasAttachments: filter.hasAttachments,
    importance: filter.importance || undefined,
    isRead: filter.isRead,
    dateFrom: filter.dateFrom?.toISOString() || undefined,
    dateTo: filter.dateTo?.toISOString() || undefined,
    maxItems: filter.maxItems || 50,
    skip: filter.skip || 0,
    orderBy: filter.orderBy || 'receivedDateTime',
    orderDirection: filter.orderDirection || 'desc'
  };

  // Remove undefined values
  const cleanFilter = Object.fromEntries(
    Object.entries(normalizedFilter).filter(([_, value]) => value !== undefined)
  );

  return ['emails', 'recent', JSON.stringify(cleanFilter)];
}

/**
 * Create a stable query key for calendar filters
 */
export function createCalendarQueryKey(filter: CRMCalendarFilter): any[] {
  // Create a normalized version of the filter
  const normalizedFilter = {
    entityType: filter.entityType || undefined,
    entityId: filter.entityId || undefined,
    entityCode: filter.entityCode || undefined,
    relatedCodes: filter.relatedCodes ? [...filter.relatedCodes].sort() : undefined,
    search: filter.search || undefined,
    dateFrom: filter.dateFrom?.toISOString() || undefined,
    dateTo: filter.dateTo?.toISOString() || undefined,
    isOnlineMeeting: filter.isOnlineMeeting,
    includeRecurring: filter.includeRecurring,
    includeCancelled: filter.includeCancelled,
    maxItems: filter.maxItems || 50,
    skip: filter.skip || 0,
    orderBy: filter.orderBy || 'start',
    orderDirection: filter.orderDirection || 'asc'
  };

  // Remove undefined values
  const cleanFilter = Object.fromEntries(
    Object.entries(normalizedFilter).filter(([_, value]) => value !== undefined)
  );

  return ['calendar', 'recent', JSON.stringify(cleanFilter)];
}