import { useQuery } from '@tanstack/react-query';
import { CalendarEventsQueryParams, CommunicationApiResponse, MeetingListItem } from '../types';

// Mock function - replace with actual MS Graph API call
async function fetchGraphCalendarEvents(params: CalendarEventsQueryParams): Promise<CommunicationApiResponse<MeetingListItem>> {
  // This would be replaced with actual Microsoft Graph API calls
  // For now, returning mock data that matches the expected structure
  
  const mockEvents: MeetingListItem[] = [
    {
      id: 'event-001',
      subject: 'Transfer Pricing Review Meeting',
      body: {
        contentType: 'html',
        content: '<p>Discussion on transfer pricing documentation and compliance requirements.</p>'
      },
      start: {
        dateTime: '2025-07-16T10:00:00',
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: '2025-07-16T11:30:00',
        timeZone: 'Asia/Kolkata'
      },
      location: {
        displayName: 'Conference Room A',
        address: {
          street: '123 Business Center',
          city: 'Mumbai',
          state: 'Maharashtra',
          countryOrRegion: 'India',
          postalCode: '400001'
        }
      },
      attendees: [
        {
          emailAddress: {
            name: 'John Smith',
            address: 'john.smith@client.com'
          },
          status: {
            response: 'accepted',
            time: '2025-07-15T14:30:00Z'
          },
          type: 'required'
        },
        {
          emailAddress: {
            name: 'VSTN Consultant',
            address: 'consultant@vstn.in'
          },
          status: {
            response: 'organizer',
            time: '2025-07-14T09:00:00Z'
          },
          type: 'required'
        }
      ],
      organizer: {
        emailAddress: {
          name: 'VSTN Consultant',
          address: 'consultant@vstn.in'
        }
      },
      isAllDay: false,
      isCancelled: false,
      isOrganizer: true,
      responseStatus: {
        response: 'organizer',
        time: '2025-07-14T09:00:00Z'
      },
      sensitivity: 'normal',
      showAs: 'busy',
      type: 'singleInstance',
      webLink: 'https://outlook.office365.com/calendar/item/event-001',
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness',
      onlineMeetingUrl: 'https://teams.microsoft.com/l/meetup-join/...',
      isLinked: true,
      linkId: 1
    },
    {
      id: 'event-002',
      subject: 'Client Check-in Call',
      body: {
        contentType: 'text',
        content: 'Weekly check-in call to discuss project progress and any blockers.'
      },
      start: {
        dateTime: '2025-07-15T15:00:00',
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: '2025-07-15T15:30:00',
        timeZone: 'Asia/Kolkata'
      },
      location: {
        displayName: 'Microsoft Teams Meeting'
      },
      attendees: [
        {
          emailAddress: {
            name: 'Jane Doe',
            address: 'jane.doe@client.com'
          },
          status: {
            response: 'accepted',
            time: '2025-07-14T12:00:00Z'
          },
          type: 'required'
        },
        {
          emailAddress: {
            name: 'VSTN Manager',
            address: 'manager@vstn.in'
          },
          status: {
            response: 'tentativelyAccepted',
            time: '2025-07-14T13:30:00Z'
          },
          type: 'optional'
        }
      ],
      organizer: {
        emailAddress: {
          name: 'Jane Doe',
          address: 'jane.doe@client.com'
        }
      },
      isAllDay: false,
      isCancelled: false,
      isOrganizer: false,
      responseStatus: {
        response: 'accepted',
        time: '2025-07-14T14:00:00Z'
      },
      sensitivity: 'normal',
      showAs: 'busy',
      type: 'singleInstance',
      webLink: 'https://outlook.office365.com/calendar/item/event-002',
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness',
      onlineMeetingUrl: 'https://teams.microsoft.com/l/meetup-join/...',
      isLinked: false
    },
    {
      id: 'event-003',
      subject: 'Quarterly Business Review',
      body: {
        contentType: 'html',
        content: '<p>Quarterly review of business performance and planning for next quarter.</p><p>Agenda:</p><ul><li>Q3 Results</li><li>Q4 Planning</li><li>Budget Discussion</li></ul>'
      },
      start: {
        dateTime: '2025-07-18T09:00:00',
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: '2025-07-18T12:00:00',
        timeZone: 'Asia/Kolkata'
      },
      location: {
        displayName: 'Client Office - Conference Room',
        address: {
          street: '456 Corporate Plaza',
          city: 'Delhi',
          state: 'Delhi',
          countryOrRegion: 'India',
          postalCode: '110001'
        }
      },
      attendees: [
        {
          emailAddress: {
            name: 'Client Team',
            address: 'team@client.com'
          },
          status: {
            response: 'accepted',
            time: '2025-07-15T16:00:00Z'
          },
          type: 'required'
        },
        {
          emailAddress: {
            name: 'VSTN Senior Manager',
            address: 'senior.manager@vstn.in'
          },
          status: {
            response: 'accepted',
            time: '2025-07-15T16:30:00Z'
          },
          type: 'required'
        }
      ],
      organizer: {
        emailAddress: {
          name: 'Client Team',
          address: 'team@client.com'
        }
      },
      isAllDay: false,
      isCancelled: false,
      isOrganizer: false,
      responseStatus: {
        response: 'accepted',
        time: '2025-07-15T16:30:00Z'
      },
      sensitivity: 'normal',
      showAs: 'busy',
      type: 'singleInstance',
      webLink: 'https://outlook.office365.com/calendar/item/event-003',
      isOnlineMeeting: false,
      isLinked: true,
      linkId: 2
    }
  ];

  // Filter based on search query
  let filteredEvents = mockEvents;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredEvents = mockEvents.filter(event => 
      event.subject.toLowerCase().includes(searchLower) ||
      event.body.content.toLowerCase().includes(searchLower) ||
      event.location.displayName.toLowerCase().includes(searchLower) ||
      event.organizer.emailAddress.name.toLowerCase().includes(searchLower)
    );
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    data: filteredEvents,
    total: filteredEvents.length,
    page: params.page || 1,
    limit: params.limit || 20,
    hasMore: false
  };
}

export function useGraphCalendarEvents(params: CalendarEventsQueryParams) {
  return useQuery({
    queryKey: ['graph-calendar-events', params],
    queryFn: () => fetchGraphCalendarEvents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error && typeof error === 'object' && 'status' in error) {
        const status = error.status as number;
        if (status >= 400 && status < 500) return false;
      }
      return failureCount < 3;
    }
  });
}