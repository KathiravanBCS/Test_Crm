import type { Meta, StoryObj } from '@storybook/react';
import { MeetingList } from './MeetingList';
import { MeetingListItem } from './types';

const mockMeetings: MeetingListItem[] = [
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
      displayName: 'Conference Room A'
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
    isLinked: false
  }
];

const meta: Meta<typeof MeetingList> = {
  title: 'Communication/MeetingList',
  component: MeetingList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A list component that displays calendar events/meetings with details like time, location, attendees, and response status.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    events: {
      description: 'Array of calendar events to display',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the component is in loading state',
    },
    error: {
      description: 'Error object if loading failed',
    },
    entityType: {
      control: 'select',
      options: ['customer', 'partner', 'proposal', 'engagement'],
      description: 'Type of entity the meetings are associated with',
    },
    entityId: {
      control: 'number',
      description: 'ID of the entity the meetings are associated with',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    events: mockMeetings,
    loading: false,
    error: null,
    entityType: 'customer',
    entityId: 123,
  },
};

export const Loading: Story = {
  args: {
    events: [],
    loading: true,
    error: null,
    entityType: 'customer',
    entityId: 123,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with spinner and loading message.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    events: [],
    loading: false,
    error: 'Failed to load calendar events',
    entityType: 'customer',
    entityId: 123,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state when calendar loading fails.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    events: [],
    loading: false,
    error: null,
    entityType: 'customer',
    entityId: 123,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no meetings are found.',
      },
    },
  },
};

export const SingleMeeting: Story = {
  args: {
    events: [mockMeetings[0]],
    loading: false,
    error: null,
    entityType: 'proposal',
    entityId: 456,
  },
  parameters: {
    docs: {
      description: {
        story: 'List with a single upcoming meeting that is linked to CRM.',
      },
    },
  },
};

export const MixedMeetingTypes: Story = {
  args: {
    events: [
      mockMeetings[0], // Online Teams meeting
      {
        ...mockMeetings[1],
        isOnlineMeeting: false,
        location: {
          displayName: 'Client Office - Conference Room B',
          address: {
            street: '123 Business Center',
            city: 'Mumbai',
            state: 'Maharashtra',
            countryOrRegion: 'India',
            postalCode: '400001'
          }
        }
      }
    ],
    loading: false,
    error: null,
    entityType: 'engagement',
    entityId: 789,
  },
  parameters: {
    docs: {
      description: {
        story: 'List showing both online and in-person meetings.',
      },
    },
  },
};

export const CancelledMeeting: Story = {
  args: {
    events: [
      {
        ...mockMeetings[0],
        isCancelled: true,
        subject: 'CANCELLED: Transfer Pricing Review Meeting'
      }
    ],
    loading: false,
    error: null,
    entityType: 'customer',
    entityId: 123,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how cancelled meetings are displayed with special styling.',
      },
    },
  },
};