import { 
  CRMEmail, 
  CRMEmailDetails, 
  CRMEmailFilter, 
  EmailSearchResponse,
  CRMCalendarEvent,
  CRMCalendarEventDetails,
  CRMCalendarFilter,
  CalendarSearchResponse
} from '../types';

/**
 * Email service interface for both Graph API and Backend implementations
 */
export interface IEmailService {
  /**
   * Get recent emails based on filters
   */
  getRecentEmails(filter: CRMEmailFilter): Promise<EmailSearchResponse>;
  
  /**
   * Get detailed email information
   */
  getEmailDetails(messageId: string): Promise<CRMEmailDetails>;
  
  /**
   * Search emails by query and filters
   */
  searchEmails(query: string, filter?: CRMEmailFilter): Promise<EmailSearchResponse>;
  
  /**
   * Get emails related to specific entity codes
   */
  getRelatedEmails(entityCodes: string[], filter?: CRMEmailFilter): Promise<EmailSearchResponse>;
}

/**
 * Calendar service interface for both Graph API and Backend implementations
 */
export interface ICalendarService {
  /**
   * Get recent calendar events based on filters
   */
  getRecentMeetings(filter: CRMCalendarFilter): Promise<CalendarSearchResponse>;
  
  /**
   * Get detailed calendar event information
   */
  getMeetingDetails(eventId: string): Promise<CRMCalendarEventDetails>;
  
  /**
   * Search calendar events by query and filters
   */
  searchMeetings(query: string, filter?: CRMCalendarFilter): Promise<CalendarSearchResponse>;
  
  /**
   * Get calendar events related to specific entity codes
   */
  getRelatedMeetings(entityCodes: string[], filter?: CRMCalendarFilter): Promise<CalendarSearchResponse>;
}