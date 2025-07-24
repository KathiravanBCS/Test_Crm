import { Client } from '@microsoft/microsoft-graph-client';
import { Message } from '@microsoft/microsoft-graph-types';
import { IEmailService } from './interfaces';
import { 
  CRMEmail, 
  CRMEmailDetails, 
  CRMEmailFilter, 
  EmailSearchResponse 
} from '../types';
import { EmailMapper } from '../mappers/email.mapper';
import { GraphQueryBuilder, GraphQueries } from '../utils/graph-query-builder';
import { graphRequestQueue, retryWithBackoff } from '../utils/throttle';

/**
 * Graph Email Service with proper MS Graph API usage
 * Uses $search for text queries and $filter for structured queries
 * Falls back to client-side filtering when Graph API limitations are encountered
 */
export class GraphEmailService implements IEmailService {
  constructor(private graphClient: Client) {}
  
  async getRecentEmails(filter: CRMEmailFilter): Promise<EmailSearchResponse> {
    try {
      // For entity code filtering, skip $search and go directly to client-side filtering
      // because $search is not precise enough for entity codes
      if (filter.entityCode || (filter.relatedCodes && filter.relatedCodes.length > 0)) {
        console.log('Entity code filtering detected, using client-side filtering approach');
        const response = await this.fetchEmailsBasic(filter);
        return this.processEmailResponseWithClientFilter(response, filter);
      }
      
      // For other searches, try $search first
      if (filter.search) {
        try {
          const response = await this.fetchEmailsWithSearch(filter);
          return this.processEmailResponse(response, filter);
        } catch (searchError: any) {
          console.warn('Search failed, falling back to basic fetch:', searchError);
          const response = await this.fetchEmailsBasic(filter);
          return this.processEmailResponseWithClientFilter(response, filter);
        }
      }
      
      // For simple filters, use filter-based approach
      const response = await this.fetchEmailsWithFilter(filter);
      return this.processEmailResponse(response, filter);
    } catch (error: any) {
      console.error('Error fetching emails:', error);
      
      // Last resort: Basic fetch with client-side filtering
      try {
        const response = await this.fetchEmailsBasic(filter);
        return this.processEmailResponseWithClientFilter(response, filter);
      } catch (finalError: any) {
        console.error('Final fetch attempt failed:', finalError);
        throw new Error('Failed to fetch emails');
      }
    }
  }
  
  /**
   * Fetch emails using $search (for general text search only)
   */
  private async fetchEmailsWithSearch(filter: CRMEmailFilter): Promise<any> {
    const queryBuilder = GraphQueryBuilder.create();
    
    // Use $search only for general text search
    if (filter.search) {
      queryBuilder.search(filter.search);
    }
    
    // Add structured filters
    this.addStructuredFilters(queryBuilder, filter);
    
    // Select fields and set pagination
    queryBuilder
      .select([
        'id', 'conversationId', 'subject', 'bodyPreview',
        'from', 'toRecipients', 'ccRecipients',
        'sentDateTime', 'receivedDateTime',
        'hasAttachments', 'importance', 'isRead', 'isDraft', 'webLink'
      ])
      .orderBy('receivedDateTime', 'desc')
      .top(filter.maxItems || 50);
    
    // Apply query to request
    // Use folder-specific endpoints when folder is specified
    let endpoint = '/me/messages';
    if (filter.folder === 'inbox') {
      endpoint = '/me/mailFolders/inbox/messages';
    } else if (filter.folder === 'sent') {
      endpoint = '/me/mailFolders/sentitems/messages';
    }
    
    let request = this.graphClient.api(endpoint);
    request = queryBuilder.applyToRequest(request);
    
    // Use request queue and retry logic
    return await graphRequestQueue.add(() => 
      retryWithBackoff(() => request.get())
    );
  }
  
  /**
   * Fetch emails using $filter only (fallback for when $search fails)
   */
  private async fetchEmailsWithFilter(filter: CRMEmailFilter): Promise<any> {
    const queryBuilder = GraphQueryBuilder.create();
    
    // Use contains filter for entity codes (less efficient than $search)
    if (filter.entityCode) {
      queryBuilder.contains('subject', filter.entityCode);
    }
    
    // Add structured filters
    this.addStructuredFilters(queryBuilder, filter);
    
    // Select fields and set pagination
    queryBuilder
      .select([
        'id', 'conversationId', 'subject', 'bodyPreview',
        'from', 'toRecipients', 'ccRecipients',
        'sentDateTime', 'receivedDateTime',
        'hasAttachments', 'importance', 'isRead', 'isDraft', 'webLink'
      ])
      .orderBy('receivedDateTime', 'desc')
      .top(100); // Fetch more for client-side filtering
    
    // Use folder-specific endpoints when folder is specified
    let endpoint = '/me/messages';
    if (filter.folder === 'inbox') {
      endpoint = '/me/mailFolders/inbox/messages';
    } else if (filter.folder === 'sent') {
      endpoint = '/me/mailFolders/sentitems/messages';
    }
    
    let request = this.graphClient.api(endpoint);
    request = queryBuilder.applyToRequest(request);
    
    // Use request queue and retry logic
    return await graphRequestQueue.add(() => 
      retryWithBackoff(() => request.get())
    );
  }
  
  /**
   * Fetch emails without any filters (last resort)
   */
  private async fetchEmailsBasic(filter: CRMEmailFilter): Promise<any> {
    const queryBuilder = GraphQueryBuilder.create()
      .select([
        'id', 'conversationId', 'subject', 'bodyPreview',
        'from', 'toRecipients', 'ccRecipients',
        'sentDateTime', 'receivedDateTime',
        'hasAttachments', 'importance', 'isRead', 'isDraft', 'webLink'
      ])
      .orderBy('receivedDateTime', 'desc')
      .top(100); // Fetch more for client-side filtering
    
    // Use folder-specific endpoints when folder is specified
    let endpoint = '/me/messages';
    if (filter.folder === 'inbox') {
      endpoint = '/me/mailFolders/inbox/messages';
    } else if (filter.folder === 'sent') {
      endpoint = '/me/mailFolders/sentitems/messages';
    }
    
    let request = this.graphClient.api(endpoint);
    request = queryBuilder.applyToRequest(request);
    
    // Use request queue and retry logic
    return await graphRequestQueue.add(() => 
      retryWithBackoff(() => request.get())
    );
  }
  
  /**
   * Add structured filters that Graph API handles well
   */
  private addStructuredFilters(queryBuilder: GraphQueryBuilder, filter: CRMEmailFilter): void {
    // Date range filter
    if (filter.dateFrom || filter.dateTo) {
      queryBuilder.dateRange('receivedDateTime', filter.dateFrom, filter.dateTo);
    }
    
    // Boolean filters (sometimes problematic, but we'll try)
    if (filter.hasAttachments !== undefined) {
      queryBuilder.hasAttachments(filter.hasAttachments);
    }
    
    if (filter.importance) {
      queryBuilder.importance(filter.importance);
    }
    
    if (filter.isRead !== undefined) {
      queryBuilder.isRead(filter.isRead);
    }
    
    // Note: Folder filtering is complex in Graph API
    // We'll handle this differently in the fetch methods
  }
  
  /**
   * Process email response (when server-side filtering worked)
   * Note: We still apply client-side filtering for entity codes because
   * $search might not be precise enough
   */
  private processEmailResponse(response: any, filter: CRMEmailFilter): EmailSearchResponse {
    const messages: Message[] = response.value || [];
    let crmEmails = messages.map(msg => EmailMapper.toCRMEmail(msg));
    
    // Always apply client-side filtering for entity codes
    // because $search is not precise enough
    if (filter.entityCode || (filter.relatedCodes && filter.relatedCodes.length > 0)) {
      const searchCodes = this.getSearchCodes(filter);
      crmEmails = crmEmails.filter(email => 
        this.emailMatchesCodes(email, searchCodes)
      );
    }
    
    // Apply pagination after filtering
    const startIndex = filter.skip || 0;
    const endIndex = startIndex + (filter.maxItems || 50);
    const paginatedEmails = crmEmails.slice(startIndex, endIndex);
    
    return {
      emails: paginatedEmails,
      totalCount: crmEmails.length,
      hasMore: endIndex < crmEmails.length,
      nextPageToken: response['@odata.nextLink']
    };
  }
  
  /**
   * Process email response with client-side filtering (fallback)
   */
  private processEmailResponseWithClientFilter(response: any, filter: CRMEmailFilter): EmailSearchResponse {
    const messages: Message[] = response.value || [];
    let crmEmails = messages.map(msg => EmailMapper.toCRMEmail(msg));
    
    // Apply client-side filters
    // Entity code filtering
    if (filter.entityCode || (filter.relatedCodes && filter.relatedCodes.length > 0)) {
      const searchCodes = this.getSearchCodes(filter);
      crmEmails = crmEmails.filter(email => 
        this.emailMatchesCodes(email, searchCodes)
      );
    }
    
    // Text search
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      crmEmails = crmEmails.filter(email =>
        email.subject.toLowerCase().includes(searchTerm) ||
        email.snippet.toLowerCase().includes(searchTerm)
      );
    }
    
    // Boolean filters
    if (filter.hasAttachments !== undefined) {
      crmEmails = crmEmails.filter(email => email.hasAttachments === filter.hasAttachments);
    }
    
    if (filter.importance) {
      crmEmails = crmEmails.filter(email => email.importance === filter.importance);
    }
    
    if (filter.isRead !== undefined) {
      crmEmails = crmEmails.filter(email => email.isRead === filter.isRead);
    }
    
    // Apply pagination after filtering
    const startIndex = filter.skip || 0;
    const endIndex = startIndex + (filter.maxItems || 50);
    const paginatedEmails = crmEmails.slice(startIndex, endIndex);
    
    return {
      emails: paginatedEmails,
      totalCount: crmEmails.length,
      hasMore: endIndex < crmEmails.length,
      nextPageToken: response['@odata.nextLink']
    };
  }
  
  async getEmailDetails(messageId: string): Promise<CRMEmailDetails> {
    try {
      const queryBuilder = GraphQueryBuilder.create()
        .select([
          'id', 'conversationId', 'subject', 'body', 'bodyPreview',
          'from', 'toRecipients', 'ccRecipients',
          'sentDateTime', 'receivedDateTime',
          'hasAttachments', 'importance', 'isRead', 'isDraft', 'webLink',
          'attachments'
        ])
        .expand('attachments');
      
      let request = this.graphClient.api(`/me/messages/${messageId}`);
      request = queryBuilder.applyToRequest(request);
      
      // Use request queue and retry logic
      const message = await graphRequestQueue.add(() => 
        retryWithBackoff(() => request.get())
      );
      return EmailMapper.toCRMEmailDetails(message);
    } catch (error) {
      console.error('Error fetching email details from Graph API:', error);
      throw new Error('Failed to fetch email details');
    }
  }
  
  async searchEmails(query: string, filter?: CRMEmailFilter): Promise<EmailSearchResponse> {
    const searchFilter: CRMEmailFilter = {
      ...filter,
      search: query
    };
    
    return this.getRecentEmails(searchFilter);
  }
  
  async getRelatedEmails(entityCodes: string[], filter?: CRMEmailFilter): Promise<EmailSearchResponse> {
    const relatedFilter: CRMEmailFilter = {
      ...filter,
      relatedCodes: entityCodes
    };
    
    return this.getRecentEmails(relatedFilter);
  }
  
  private getSearchCodes(filter: CRMEmailFilter): string[] {
    const codes: string[] = [];
    
    if (filter.entityCode) {
      codes.push(filter.entityCode);
    }
    
    if (filter.relatedCodes) {
      codes.push(...filter.relatedCodes);
    }
    
    return [...new Set(codes)]; // Remove duplicates
  }
  
  private emailMatchesCodes(email: CRMEmail, codes: string[]): boolean {
    if (codes.length === 0) return true;
    
    const emailContent = `${email.subject} ${email.snippet}`.toLowerCase();
    
    return codes.some(code => 
      emailContent.includes(code.toLowerCase())
    );
  }
}