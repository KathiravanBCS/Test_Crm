import { useQuery } from '@tanstack/react-query';
import { EmailsQueryParams, CommunicationApiResponse, EmailListItem } from '../types';

// Mock function - replace with actual MS Graph API call
async function fetchGraphEmails(params: EmailsQueryParams): Promise<CommunicationApiResponse<EmailListItem>> {
  // This would be replaced with actual Microsoft Graph API calls
  // For now, returning mock data that matches the expected structure
  
  const mockEmails: EmailListItem[] = [
    {
      id: '1',
      messageId: 'msg-001',
      conversationId: 'conv-001',
      subject: 'Transfer Pricing Documentation Review',
      bodyPreview: 'Please find attached the transfer pricing documentation for review. We need to ensure compliance with the latest regulations...',
      body: {
        contentType: 'html',
        content: '<p>Please find attached the transfer pricing documentation for review. We need to ensure compliance with the latest regulations...</p>'
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
        content: '<p>Thank you for the productive meeting yesterday. As discussed, I am sending the additional information you requested...</p>'
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
    },
    {
      id: '3',
      messageId: 'msg-003',
      conversationId: 'conv-003',
      subject: 'Urgent: Compliance Deadline Approaching',
      bodyPreview: 'This is a reminder that the compliance deadline is approaching next week. Please ensure all documentation is ready...',
      body: {
        contentType: 'html',
        content: '<p>This is a reminder that the compliance deadline is approaching next week. Please ensure all documentation is ready...</p>'
      },
      from: {
        emailAddress: {
          name: 'Compliance Team',
          address: 'compliance@client.com'
        }
      },
      toRecipients: [
        {
          emailAddress: {
            name: 'VSTN Team',
            address: 'team@vstn.in'
          }
        }
      ],
      ccRecipients: [],
      receivedDateTime: '2025-07-12T09:15:00Z',
      sentDateTime: '2025-07-12T09:10:00Z',
      hasAttachments: true,
      importance: 'high',
      isRead: true,
      isDraft: false,
      webLink: 'https://outlook.office365.com/mail/id/msg-003',
      isLinked: true,
      linkId: 2
    }
  ];

  // Filter based on search query
  let filteredEmails = mockEmails;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredEmails = mockEmails.filter(email => 
      email.subject.toLowerCase().includes(searchLower) ||
      email.bodyPreview.toLowerCase().includes(searchLower) ||
      email.from.emailAddress.name.toLowerCase().includes(searchLower) ||
      email.from.emailAddress.address.toLowerCase().includes(searchLower)
    );
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    data: filteredEmails,
    total: filteredEmails.length,
    page: params.page || 1,
    limit: params.limit || 20,
    hasMore: false
  };
}

export function useGraphEmails(params: EmailsQueryParams) {
  return useQuery({
    queryKey: ['graph-emails', params],
    queryFn: () => fetchGraphEmails(params),
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