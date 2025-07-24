import { Event, Attendee, Location, OnlineMeetingInfo } from '@microsoft/microsoft-graph-types';

// CRM-specific calendar types
export interface CRMAttendee {
  name: string;
  email: string;
  responseStatus: 'none' | 'accepted' | 'declined' | 'tentative';
  type: 'required' | 'optional' | 'resource';
}

export interface CRMLocation {
  displayName: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface CRMOnlineMeeting {
  joinUrl: string;
  conferenceId?: string;
  tollNumber?: string;
}

export interface CRMCalendarEvent {
  // Core event properties
  id: string;
  subject: string;
  bodyPreview: string;
  startDateTime: Date;
  endDateTime: Date;
  isAllDay: boolean;
  location?: CRMLocation;
  attendees: CRMAttendee[];
  organizer: CRMEmailContact;
  webLink: string;
  isOnlineMeeting: boolean;
  onlineMeeting?: CRMOnlineMeeting;
  
  // Status
  isCancelled: boolean;
  responseStatus: 'none' | 'accepted' | 'declined' | 'tentative';
  
  // CRM-specific fields
  relatedEntityCodes: string[];
  entityMatches: {
    proposals: Array<{ id: number; code: string }>;
    engagementLetters: Array<{ id: number; code: string }>;
    engagements: Array<{ id: number; code: string }>;
    serviceItems: Array<{ id: number; code: string }>;
  };
  
  // Computed fields
  duration: number; // in minutes
  isUpcoming: boolean;
  isPast: boolean;
  isToday: boolean;
}

export interface CRMCalendarEventDetails extends CRMCalendarEvent {
  body: {
    contentType: 'html' | 'text';
    content: string;
  };
  attachments: CRMEmailAttachment[];
  categories: string[];
  recurrence?: {
    pattern: string;
    range: string;
  };
}

import { CRMEmailContact, CRMEmailAttachment } from './email.types';

// Filter types
export interface CRMCalendarFilter {
  // Entity filters
  entityType?: 'proposal' | 'engagement_letter' | 'engagement' | 'customer' | 'partner';
  entityId?: number;
  entityCode?: string;
  relatedCodes?: string[];
  
  // Calendar filters
  search?: string;
  isOnlineMeeting?: boolean;
  
  // Date filters
  dateFrom?: Date;
  dateTo?: Date;
  
  // View options
  includeRecurring?: boolean;
  includeCancelled?: boolean;
  
  // Pagination
  maxItems?: number;
  skip?: number;
  orderBy?: 'start' | 'end' | 'subject';
  orderDirection?: 'asc' | 'desc';
}

// Service response types
export interface CalendarSearchResponse {
  events: CRMCalendarEvent[];
  totalCount: number;
  hasMore: boolean;
  nextPageToken?: string;
}