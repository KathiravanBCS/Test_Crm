import { Event, Attendee, ResponseStatus, Location } from '@microsoft/microsoft-graph-types';
import { 
  CRMCalendarEvent, 
  CRMCalendarEventDetails, 
  CRMAttendee, 
  CRMLocation,
  CRMOnlineMeeting,
  CRMCalendarFilter 
} from '../types/calendar.types';
import { CRMEmailContact, CRMEmailAttachment } from '../types/email.types';
import { EntityContext } from '../types';

export class CalendarMapper {
  /**
   * Maps Microsoft Graph Event to CRM Calendar Event
   */
  static toCRMCalendarEvent(event: Event, context?: EntityContext): CRMCalendarEvent {
    const relatedCodes = this.extractEntityCodes(event);
    const entityMatches = this.matchEntities(relatedCodes);
    const startDate = new Date(event.start?.dateTime || '');
    const endDate = new Date(event.end?.dateTime || '');
    const now = new Date();
    
    return {
      // Core properties
      id: event.id || '',
      subject: event.subject || '',
      bodyPreview: event.bodyPreview || '',
      startDateTime: startDate,
      endDateTime: endDate,
      isAllDay: event.isAllDay || false,
      location: this.mapLocation(event.location),
      attendees: this.mapAttendees(event.attendees),
      organizer: this.mapOrganizer(event.organizer),
      webLink: event.webLink || '',
      isOnlineMeeting: event.isOnlineMeeting || false,
      onlineMeeting: this.mapOnlineMeeting(event),
      
      // Status
      isCancelled: event.isCancelled || false,
      responseStatus: this.mapResponseStatus(event.responseStatus),
      
      // CRM-specific
      relatedEntityCodes: relatedCodes,
      entityMatches: entityMatches,
      
      // Computed fields
      duration: this.calculateDuration(startDate, endDate),
      isUpcoming: startDate > now,
      isPast: endDate < now,
      isToday: this.isToday(startDate)
    };
  }
  
  /**
   * Maps to detailed CRM Calendar Event with body
   */
  static toCRMCalendarEventDetails(event: Event, context?: EntityContext): CRMCalendarEventDetails {
    const baseEvent = this.toCRMCalendarEvent(event, context);
    
    return {
      ...baseEvent,
      body: {
        contentType: (event.body?.contentType || 'text') as 'html' | 'text',
        content: event.body?.content || ''
      },
      attachments: this.mapAttachments(event.attachments),
      categories: event.categories || [],
      recurrence: event.recurrence ? {
        pattern: JSON.stringify(event.recurrence.pattern),
        range: JSON.stringify(event.recurrence.range)
      } : undefined
    };
  }
  
  /**
   * Converts CRM filter to Graph OData filter string
   */
  static toGraphFilter(filter: CRMCalendarFilter): string {
    const conditions: string[] = [];
    
    // Search filter
    if (filter.search) {
      const searchTerm = filter.search.replace(/'/g, "''");
      conditions.push(`contains(subject,'${searchTerm}') or contains(body/content,'${searchTerm}')`);
    }
    
    // Entity code search - combine entityCode and relatedCodes to avoid duplication
    const allCodes: string[] = [];
    
    if (filter.entityCode) {
      allCodes.push(filter.entityCode);
    }
    
    if (filter.relatedCodes && filter.relatedCodes.length > 0) {
      // Add related codes, but avoid duplicates
      filter.relatedCodes.forEach(code => {
        if (!allCodes.includes(code)) {
          allCodes.push(code);
        }
      });
    }
    
    // Create a single condition for all codes
    if (allCodes.length > 0) {
      if (allCodes.length === 1) {
        // Single code - simple filter
        const code = allCodes[0].replace(/'/g, "''");
        conditions.push(`(contains(subject,'${code}') or contains(body/content,'${code}'))`);
      } else {
        // Multiple codes - create OR conditions
        const codeConditions = allCodes.map(code => {
          const escapedCode = code.replace(/'/g, "''");
          return `(contains(subject,'${escapedCode}') or contains(body/content,'${escapedCode}'))`;
        });
        conditions.push(`(${codeConditions.join(' or ')})`);
      }
    }
    
    // Online meeting filter
    if (filter.isOnlineMeeting !== undefined) {
      conditions.push(`isOnlineMeeting eq ${filter.isOnlineMeeting}`);
    }
    
    // Date filters
    if (filter.dateFrom) {
      conditions.push(`start/dateTime ge '${filter.dateFrom.toISOString()}'`);
    }
    
    if (filter.dateTo) {
      conditions.push(`end/dateTime le '${filter.dateTo.toISOString()}'`);
    }
    
    // Exclude cancelled events by default
    if (!filter.includeCancelled) {
      conditions.push('isCancelled eq false');
    }
    
    return conditions.join(' and ');
  }
  
  /**
   * Builds Graph API query parameters
   */
  static toGraphQueryParams(filter: CRMCalendarFilter): Record<string, string> {
    const params: Record<string, string> = {};
    
    // Add filter
    const filterStr = this.toGraphFilter(filter);
    if (filterStr) {
      params['$filter'] = filterStr;
    }
    
    // Add ordering
    const orderBy = filter.orderBy || 'start';
    const orderDirection = filter.orderDirection || 'asc';
    params['$orderby'] = `${orderBy}/dateTime ${orderDirection}`;
    
    // Add pagination
    if (filter.maxItems) {
      params['$top'] = filter.maxItems.toString();
    }
    
    if (filter.skip) {
      params['$skip'] = filter.skip.toString();
    }
    
    // Select specific fields for performance
    params['$select'] = 'id,subject,bodyPreview,start,end,isAllDay,location,attendees,organizer,webLink,isOnlineMeeting,onlineMeetingUrl,isCancelled,responseStatus,categories,recurrence';
    
    return params;
  }
  
  // Private helper methods
  private static mapLocation(location?: Location | null): CRMLocation | undefined {
    if (!location) return undefined;
    
    return {
      displayName: location.displayName || '',
      address: location.address ? 
        `${location.address.street || ''} ${location.address.city || ''} ${location.address.state || ''}`.trim() : 
        undefined,
      coordinates: location.coordinates ? {
        latitude: location.coordinates.latitude || 0,
        longitude: location.coordinates.longitude || 0
      } : undefined
    };
  }
  
  private static mapAttendees(attendees?: Attendee[] | null): CRMAttendee[] {
    if (!attendees) return [];
    
    return attendees.map(att => ({
      name: att.emailAddress?.name || '',
      email: att.emailAddress?.address || '',
      responseStatus: this.mapAttendeeResponseStatus(att.status),
      type: (att.type || 'optional') as CRMAttendee['type']
    }));
  }
  
  private static mapOrganizer(organizer?: Recipient | null): CRMEmailContact {
    return {
      name: organizer?.emailAddress?.name || '',
      email: organizer?.emailAddress?.address || ''
    };
  }
  
  private static mapOnlineMeeting(event: Event): CRMOnlineMeeting | undefined {
    if (!event.isOnlineMeeting) return undefined;
    
    return {
      joinUrl: event.onlineMeetingUrl || '',
      conferenceId: event.onlineMeeting?.conferenceId || undefined,
      tollNumber: event.onlineMeeting?.tollNumber || undefined
    };
  }
  
  private static mapResponseStatus(status?: ResponseStatus | null): CRMCalendarEvent['responseStatus'] {
    if (!status?.response) return 'none';
    
    const responseMap: Record<string, CRMCalendarEvent['responseStatus']> = {
      'none': 'none',
      'organizer': 'accepted',
      'accepted': 'accepted',
      'declined': 'declined',
      'tentativelyAccepted': 'tentative',
      'notResponded': 'none'
    };
    
    return responseMap[status.response] || 'none';
  }
  
  private static mapAttendeeResponseStatus(status?: ResponseStatus | null): CRMAttendee['responseStatus'] {
    return this.mapResponseStatus(status);
  }
  
  private static mapAttachments(attachments?: Attachment[] | null): CRMEmailAttachment[] {
    if (!attachments) return [];
    return attachments.map(att => ({
      id: att.id || '',
      name: att.name || '',
      size: att.size || 0,
      contentType: att.contentType || ''
    }));
  }
  
  private static calculateDuration(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutes
  }
  
  private static isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
  
  private static extractEntityCodes(event: Event): string[] {
    const content = `${event.subject || ''} ${event.bodyPreview || ''}`;
    const codes: string[] = [];
    
    // Extract proposal numbers (PROP-YYYY-NNN)
    const propMatches = content.match(/PROP-\d{4}-\d{3}/g);
    if (propMatches) codes.push(...propMatches);
    
    // Extract engagement letter codes (EL-YYYY-NNN)
    const elMatches = content.match(/EL-\d{4}-\d{3}/g);
    if (elMatches) codes.push(...elMatches);
    
    // Extract engagement codes (ENG-YYYY-NNN)
    const engMatches = content.match(/ENG-\d{4}-\d{3}/g);
    if (engMatches) codes.push(...engMatches);
    
    // Extract service item codes (SI-YYYY-NNN)
    const siMatches = content.match(/SI-\d{4}-\d{3}/g);
    if (siMatches) codes.push(...siMatches);
    
    return [...new Set(codes)]; // Remove duplicates
  }
  
  private static matchEntities(codes: string[]): CRMCalendarEvent['entityMatches'] {
    const matches: CRMCalendarEvent['entityMatches'] = {
      proposals: [],
      engagementLetters: [],
      engagements: [],
      serviceItems: []
    };
    
    codes.forEach(code => {
      if (code.startsWith('PROP-')) {
        matches.proposals.push({ id: 0, code }); // ID to be resolved by service
      } else if (code.startsWith('EL-')) {
        matches.engagementLetters.push({ id: 0, code });
      } else if (code.startsWith('ENG-')) {
        matches.engagements.push({ id: 0, code });
      } else if (code.startsWith('SI-')) {
        matches.serviceItems.push({ id: 0, code });
      }
    });
    
    return matches;
  }
}

import { Recipient, Attachment } from '@microsoft/microsoft-graph-types';