import { Message, Recipient, EmailAddress, Attachment as GraphAttachment } from '@microsoft/microsoft-graph-types';

// CRM-specific email types
export interface CRMEmailContact {
  name: string;
  email: string;
}

export interface CRMEmailAttachment {
  id: string;
  name: string;
  size: number;
  contentType: string;
}

export interface CRMEmail {
  // Core email properties
  id: string;
  messageId: string;
  conversationId: string;
  subject: string;
  snippet: string;
  sender: CRMEmailContact;
  recipients: CRMEmailContact[];
  ccRecipients: CRMEmailContact[];
  sentDateTime: Date;
  receivedDateTime: Date;
  hasAttachments: boolean;
  importance: 'low' | 'normal' | 'high';
  isRead: boolean;
  isDraft: boolean;
  webLink: string;
  
  // CRM-specific fields
  relatedEntityCodes: string[];
  entityMatches: {
    proposals: Array<{ id: number; code: string }>;
    engagementLetters: Array<{ id: number; code: string }>;
    engagements: Array<{ id: number; code: string }>;
    serviceItems: Array<{ id: number; code: string }>;
  };
  
  // UI state
  isHighlighted?: boolean;
  matchScore?: number;
}

export interface CRMEmailDetails extends CRMEmail {
  body: {
    contentType: 'html' | 'text';
    content: string;
  };
  attachments: CRMEmailAttachment[];
}

// Filter types
export interface CRMEmailFilter {
  // Entity filters
  entityType?: 'proposal' | 'engagement_letter' | 'engagement' | 'customer' | 'partner';
  entityId?: number;
  entityCode?: string;
  relatedCodes?: string[];
  
  // Email filters
  folder?: 'inbox' | 'sent' | 'drafts' | 'all';
  search?: string;
  hasAttachments?: boolean;
  importance?: 'low' | 'normal' | 'high';
  isRead?: boolean;
  
  // Date filters
  dateFrom?: Date;
  dateTo?: Date;
  
  // Pagination
  maxItems?: number;
  skip?: number;
  orderBy?: 'receivedDateTime' | 'subject' | 'from';
  orderDirection?: 'asc' | 'desc';
}

// Service response types
export interface EmailSearchResponse {
  emails: CRMEmail[];
  totalCount: number;
  hasMore: boolean;
  nextPageToken?: string;
}