import { apiClient } from '@/lib/api-client';
import { ICalendarService } from './interfaces';
import { 
  CRMCalendarEvent, 
  CRMCalendarEventDetails, 
  CRMCalendarFilter, 
  CalendarSearchResponse 
} from '../types';

export class BackendCalendarService implements ICalendarService {
  private readonly baseUrl = '/api/graph/calendar';
  
  async getRecentMeetings(filter: CRMCalendarFilter): Promise<CalendarSearchResponse> {
    try {
      const response = await apiClient.post<CalendarSearchResponse>(
        `${this.baseUrl}/search`,
        filter
      );
      return response;
    } catch (error) {
      console.error('Error fetching calendar events from backend:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }
  
  async getMeetingDetails(eventId: string): Promise<CRMCalendarEventDetails> {
    try {
      const response = await apiClient.get<CRMCalendarEventDetails>(
        `${this.baseUrl}/events/${eventId}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching event details from backend:', error);
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
    try {
      const response = await apiClient.post<CalendarSearchResponse>(
        `${this.baseUrl}/related`,
        {
          entityCodes,
          ...filter
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching related calendar events from backend:', error);
      throw new Error('Failed to fetch related calendar events');
    }
  }
}