import type { Meta, StoryObj } from '@storybook/react';
import { EmailList } from './EmailList';
import { EmailListItem } from './types';

const mockEmails: EmailListItem[] = [
  {
    id: '1',
    messageId: 'msg-001',
    conversationId: 'conv-001',
    subject: 'Transfer Pricing Documentation Review',
    bodyPreview: 'Please find attached the transfer pricing documentation for review. We need to ensure compliance with the latest regulations...',
    body: {
      contentType: 'html',
      content: '<p>Please find attached the transfer pricing documentation for review.</p>'
    },
    from: {
      emailAddress: {
        name: 'John Smith',
        address: 'john.smith@client.com'
      }
    },
    toRecipients: [
      {
        emailAddress: {
          name: 'VSTN Consultant',
          address: 'consultant@vstn.in'
        }
      }
    ],
    ccRecipients: [],
    receivedDateTime: '2025-07-14T10:30:00Z',
    sentDateTime: '2025-07-14T10:25:00Z',
    hasAttachments: true,
    importance: 'high',
    isRead: false,
    isDraft: false,
    webLink: 'https://outlook.office365.com/mail/id/msg-001',
    isLinked: true,
    linkId: 1
  },
  {
    id: '2',
    messageId: 'msg-002',
    conversationId: 'conv-002',
    subject: 'Meeting Follow-up: OTP Analysis',
    bodyPreview: 'Thank you for the productive meeting yesterday. As discussed, I am sending the additional information you requested...',
    body: {
      contentType: 'html',
      content: '<p>Thank you for the productive meeting yesterday.</p>'
    },
    from: {
      emailAddress: {
        name: 'VSTN Consultant',
        address: 'consultant@vstn.in'
      }
    },
    toRecipients: [
      {
        emailAddress: {
          name: 'Jane Doe',
          address: 'jane.doe@client.com'
        }
      }
    ],
    ccRecipients: [
      {
        emailAddress: {
          name: 'Manager',
          address: 'manager@client.com'
        }
      }
    ],
    receivedDateTime: '2025-07-13T15:45:00Z',
    sentDateTime: '2025-07-13T15:45:00Z',
    hasAttachments: false,
    importance: 'normal',
    isRead: true,
    isDraft: false,
    webLink: 'https://outlook.office365.com/mail/id/msg-002',
    isLinked: false
  }
];

const meta: Meta<typeof EmailList> = {
  title: 'Communication/EmailList',
  component: EmailList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A list component that displays emails with an Outlook-like interface. Shows email previews with sender, subject, snippet, and metadata.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    emails: {
      description: 'Array of email items to display',
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
      description: 'Type of entity the emails are associated with',
    },
    entityId: {
      control: 'number',
      description: 'ID of the entity the emails are associated with',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    emails: mockEmails,
    loading: false,
    error: null,
    entityType: 'customer',
    entityId: 123,
  },
};

export const Loading: Story = {
  args: {
    emails: [],
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
    emails: [],
    loading: false,
    error: 'Failed to load emails',
    entityType: 'customer',
    entityId: 123,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state when email loading fails.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    emails: [],
    loading: false,
    error: null,
    entityType: 'customer',
    entityId: 123,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no emails are found.',
      },
    },
  },
};

export const SingleEmail: Story = {
  args: {
    emails: [mockEmails[0]],
    loading: false,
    error: null,
    entityType: 'proposal',
    entityId: 456,
  },
  parameters: {
    docs: {
      description: {
        story: 'List with a single high-priority email with attachments.',
      },
    },
  },
};

export const MixedReadStatus: Story = {
  args: {
    emails: mockEmails,
    loading: false,
    error: null,
    entityType: 'partner',
    entityId: 789,
  },
  parameters: {
    docs: {
      description: {
        story: 'List showing both read and unread emails with different styling.',
      },
    },
  },
};