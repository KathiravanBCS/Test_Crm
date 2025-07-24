import { Client } from '@microsoft/microsoft-graph-client';
import { Event } from '@microsoft/microsoft-graph-types';
import { ICalendarService } from './interfaces';
import { 
  CRMCalendarEvent, 
  CRMCalendarEventDetails, 
  CRMCalendarFilter, 
  CalendarSearchResponse
} from '../types';
import { CalendarMapper } from '../mappers/calendar.mapper';
import { GraphQueryBuilder, GraphQueries } from '../utils/graph-query-builder';
import { graphRequestQueue, retryWithBackoff } from '../utils/throttle';

/**
 * Graph Calendar Service with proper MS Graph API usage
 * Uses $search for text queries and $filter for date ranges
 * Falls back to client-side filtering when Graph API limitations are encountered
 */
export class GraphCalendarService implements ICalendarService {
  constructor(private graphClient: Client) {}
  
  async getRecentMeetings(filter: CRMCalendarFilter): Promise<CalendarSearchResponse> {
    try {
      // Note: /me/events endpoint doesn't support $search parameter
      // Start with filter-based approach
      const response = await this.fetchEventsWithFilter(filter);
      return this.processEventResponse(response, filter);
    } catch (error: any) {
      console.error('Error with filter query:', error);
      
      // If filter fails, fetch with basic date filter and filter client-side
      if (error.statusCode === 400) {
        console.warn('Falling back to client-side filtering...');
        try {
          const response = await this.fetchEventsBasic(filter);
          return this.processEventResponseWithClientFilter(response, filter);
        } catch (basicError: any) {
          console.error('Basic fetch also failed:', basicError);
          throw basicError;
        }
      }
      
      throw error;
    }
  }
  
  /**
   * Fetch events using $filter (primary method for calendar events)
   * Note: /me/events doesn't support $search, so we use contains filter for text search
   */
  private async fetchEventsWithFilter(filter: CRMCalendarFilter): Promise<any> {
    const queryBuilder = GraphQueryBuilder.create();
    
    // Use contains filter for entity codes (less efficient than $search)
    if (filter.entityCode) {
      queryBuilder.contains('subject', filter.entityCode);
    }
    
    // Add date range filter
    const startDate = filter.dateFrom || new Date();
    const endDate = filter.dateTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    queryBuilder.dateRange('start/dateTime', startDate, endDate);
    
    // Select fields and set ordering
    queryBuilder
      .select([
        'id', 'subject', 'body', 'bodyPreview',
        'start', 'end', 'location', 'attendees',
        'organizer', 'isAllDay', 'showAs',
        'importance', 'sensitivity', 'webLink', 'onlineMeeting'
      ])
      .orderBy('start/dateTime', 'asc')
      .top(100); // Fetch more for client-side filtering
    
    let request = this.graphClient.api('/me/events');
    request = queryBuilder.applyToRequest(request);
    
    // Use request queue and retry logic
    return await graphRequestQueue.add(() => 
      retryWithBackoff(() => request.get())
    );
  }
  
  /**
   * Fetch events with basic date filter only (last resort)
   */
  private async fetchEventsBasic(filter: CRMCalendarFilter): Promise<any> {
    const startDate = filter.dateFrom || new Date();
    const endDate = filter.dateTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    const queryBuilder = GraphQueryBuilder.create()
      .dateRange('start/dateTime', startDate, endDate)
      .select([
        'id', 'subject', 'body', 'bodyPreview',
        'start', 'end', 'location', 'attendees',
        'organizer', 'isAllDay', 'showAs',
        'importance', 'sensitivity', 'webLink', 'onlineMeeting'
      ])
      .orderBy('start/dateTime', 'asc')
      .top(100); // Fetch more for client-side filtering
    
    let request = this.graphClient.api('/me/events');
    request = queryBuilder.applyToRequest(request);
    
    // Use request queue and retry logic
    return await graphRequestQueue.add(() => 
      retryWithBackoff(() => request.get())
    );
  }
  
  /**
   * Process event response (when server-side filtering worked)
   */
  private processEventResponse(response: any, filter: CRMCalendarFilter): CalendarSearchResponse {
    const events: Event[] = response.value || [];
    const crmEvents = events.map(event => CalendarMapper.toCRMCalendarEvent(event));
    
    // Apply pagination if needed
    const startIndex = filter.skip || 0;
    const endIndex = startIndex + (filter.maxItems || 50);
    const paginatedEvents = crmEvents.slice(startIndex, endIndex);
    
    return {
      events: paginatedEvents,
      totalCount: response['@odata.count'] || crmEvents.length,
      hasMore: endIndex < crmEvents.length || !!response['@odata.nextLink'],
      nextPageToken: response['@odata.nextLink']
    };
  }
  
  /**
   * Process event response with client-side filtering (fallback)
   */
  private processEventResponseWithClientFilter(response: any, filter: CRMCalendarFilter): CalendarSearchResponse {
    const events: Event[] = response.value || [];
    let crmEvents = events.map(event => CalendarMapper.toCRMCalendarEvent(event));
    
    // Apply client-side filters
    // Entity code filtering
    if (filter.entityCode || (filter.relatedCodes && filter.relatedCodes.length > 0)) {
      const searchCodes = this.getSearchCodes(filter);
      crmEvents = crmEvents.filter(event => 
        this.eventMatchesCodes(event, searchCodes)
      );
    }
    
    // Text search
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      crmEvents = crmEvents.filter(event =>
        event.subject.toLowerCase().includes(searchTerm) ||
        (event.bodyPreview || '').toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply pagination after filtering
    const startIndex = filter.skip || 0;
    const endIndex = startIndex + (filter.maxItems || 50);
    const paginatedEvents = crmEvents.slice(startIndex, endIndex);
    
    return {
      events: paginatedEvents,
      totalCount: crmEvents.length,
      hasMore: endIndex < crmEvents.length,
      nextPageToken: response['@odata.nextLink']
    };
  }
  
  async getMeetingDetails(eventId: string): Promise<CRMCalendarEventDetails> {
    try {
      const queryBuilder = GraphQueryBuilder.create()
        .select([
          'id', 'subject', 'body', 'bodyPreview',
          'start', 'end', 'location', 'attendees',
          'organizer', 'isAllDay', 'showAs',
          'importance', 'sensitivity', 'webLink',
          'onlineMeeting', 'attachments'
        ])
        .expand('attachments');
      
      let request = this.graphClient.api(`/me/events/${eventId}`);
      request = queryBuilder.applyToRequest(request);
      
      // Use request queue and retry logic
      const event = await graphRequestQueue.add(() => 
        retryWithBackoff(() => request.get())
      );
      return CalendarMapper.toCRMCalendarEventDetails(event);
    } catch (error) {
      console.error('Error fetching event details from Graph API:', error);
      throw new Error('Failed to fetch event details');
    }
  }
  
  async searchMeetings(query: string, filter?: CRMCalendarFilter): Promise<CalendarSearchResponse> {
    const searchFilter: CRMCalendarFilter = {
      ...filter,
      search: query
    };
    
    return this.getRecentMeetings(searchFilter);
  }
  
  async getRelatedMeetings(entityCodes: string[], filter?: CRMCalendarFilter): Promise<CalendarSearchResponse> {
    const relatedFilter: CRMCalendarFilter = {
      ...filter,
      relatedCodes: entityCodes
    };
    
    return this.getRecentMeetings(relatedFilter);
  }
  
  private getSearchCodes(filter: CRMCalendarFilter): string[] {
    const codes: string[] = [];
    
    if (filter.entityCode) {
      codes.push(filter.entityCode);
    }
    
    if (filter.relatedCodes) {
      codes.push(...filter.relatedCodes);
    }
    
    return [...new Set(codes)]; // Remove duplicates
  }
  
  private eventMatchesCodes(event: CRMCalendarEvent, codes: string[]): boolean {
    if (codes.length === 0) return true;
    
    const eventContent = `${event.subject} ${event.bodyPreview || ''}`.toLowerCase();
    
    return codes.some(code => 
      eventContent.includes(code.toLowerCase())
    );
  }
}