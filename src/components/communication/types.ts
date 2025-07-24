// Microsoft Graph API types for emails and calendar events

export interface GraphEmail {
  id: string;
  messageId: string;
  conversationId: string;
  subject: string;
  bodyPreview: string;
  body: {
    contentType: 'text' | 'html';
    content: string;
  };
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  toRecipients: Array<{
    emailAddress: {
      name: string;
      address: string;
    };
  }>;
  ccRecipients: Array<{
    emailAddress: {
      name: string;
      address: string;
    };
  }>;
  receivedDateTime: string;
  sentDateTime: string;
  hasAttachments: boolean;
  importance: 'low' | 'normal' | 'high';
  isRead: boolean;
  isDraft: boolean;
  webLink: string;
  attachments?: GraphEmailAttachment[];
}

export interface GraphEmailAttachment {
  id: string;
  name: string;
  contentType: string;
  size: number;
  isInline: boolean;
  downloadUrl?: string;
}

export interface GraphCalendarEvent {
  id: string;
  subject: string;
  body: {
    contentType: 'text' | 'html';
    content: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location: {
    displayName: string;
    address?: {
      street: string;
      city: string;
      state: string;
      countryOrRegion: string;
      postalCode: string;
    };
  };
  attendees: Array<{
    emailAddress: {
      name: string;
      address: string;
    };
    status: {
      response: 'none' | 'organizer' | 'tentativelyAccepted' | 'accepted' | 'declined' | 'notResponded';
      time: string;
    };
    type: 'required' | 'optional' | 'resource';
  }>;
  organizer: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  isAllDay: boolean;
  isCancelled: boolean;
  isOrganizer: boolean;
  recurrence?: {
    pattern: {
      type: 'daily' | 'weekly' | 'monthly' | 'yearly';
      interval: number;
    };
    range: {
      type: 'endDate' | 'noEnd' | 'numbered';
      startDate: string;
      endDate?: string;
      numberOfOccurrences?: number;
    };
  };
  responseStatus: {
    response: 'none' | 'organizer' | 'tentativelyAccepted' | 'accepted' | 'declined' | 'notResponded';
    time: string;
  };
  sensitivity: 'normal' | 'personal' | 'private' | 'confidential';
  showAs: 'free' | 'tentative' | 'busy' | 'oof' | 'workingElsewhere' | 'unknown';
  type: 'singleInstance' | 'occurrence' | 'exception' | 'seriesMaster';
  webLink: string;
  onlineMeetingUrl?: string;
  isOnlineMeeting: boolean;
  onlineMeetingProvider?: 'teamsForBusiness' | 'skypeForBusiness' | 'skypeForConsumer';
}

// Local database types (from the schema)
export interface LinkedEmail {
  id: number;
  entityType: string;
  entityId: number;
  messageId: string;
  conversationId?: string;
  subject?: string;
  senderEmail?: string;
  recipients?: string[];
  ccRecipients?: string[];
  sentTimestamp?: Date;
  direction: 'inbound' | 'outbound';
  hasAttachments: boolean;
  importance: 'low' | 'normal' | 'high';
  graphApiUrl?: string;
  syncedAt: Date;
  syncStatus: string;
  createdAt: Date;
}

export interface CalendarSync {
  id: number;
  entityType: string;
  entityId: number;
  eventId: string;
  calendarId?: string;
  subject?: string;
  startDatetime?: Date;
  endDatetime?: Date;
  isAllDay: boolean;
  location?: string;
  attendees?: string[];
  organizerEmail?: string;
  webLink?: string;
  syncDirection: 'to_outlook' | 'from_outlook' | 'bidirectional';
  lastSyncedAt: Date;
  syncStatus: string;
  createdAt: Date;
}

// API request/response types
export interface EmailsQueryParams {
  entityType: string;
  entityId: number;
  search?: string;
  days?: number;
  page?: number;
  limit?: number;
}

export interface CalendarEventsQueryParams {
  entityType: string;
  entityId: number;
  search?: string;
  days?: number;
  page?: number;
  limit?: number;
}

export interface CommunicationApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// UI State types
export interface EmailListItem extends GraphEmail {
  isLinked?: boolean;
  linkId?: number;
}

export interface MeetingListItem extends GraphCalendarEvent {
  isLinked?: boolean;
  linkId?: number;
}

export interface CommunicationFilters {
  search: string;
  dateRange: string;
  type: 'all' | 'linked' | 'unlinked';
  importance?: 'low' | 'normal' | 'high';
}