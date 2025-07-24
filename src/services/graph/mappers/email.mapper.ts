import { Message, Recipient, EmailAddress, Attachment } from '@microsoft/microsoft-graph-types';
import { CRMEmail, CRMEmailDetails, CRMEmailContact, CRMEmailAttachment, CRMEmailFilter } from '../types/email.types';
import { EntityContext } from '../types';

export class EmailMapper {
  /**
   * Maps Microsoft Graph Message to CRM Email
   */
  static toCRMEmail(message: Message, context?: EntityContext): CRMEmail {
    const relatedCodes = this.extractEntityCodes(message);
    const entityMatches = this.matchEntities(relatedCodes);
    
    // Debug logging
  /*   console.debug('[EmailMapper] Mapping message:', {
      id: message.id,
      subject: message.subject,
      from: message.from,
      sentDateTime: message.sentDateTime,
      receivedDateTime: message.receivedDateTime
    }); */
    
    return {
      // Core properties
      id: message.id || '',
      messageId: message.id || '',
      conversationId: message.conversationId || '',
      subject: message.subject || '',
      snippet: message.bodyPreview || '',
      sender: this.mapEmailAddress(message.from),
      recipients: this.mapRecipients(message.toRecipients),
      ccRecipients: this.mapRecipients(message.ccRecipients),
      sentDateTime: message.sentDateTime ? new Date(message.sentDateTime) : new Date(),
      receivedDateTime: message.receivedDateTime ? new Date(message.receivedDateTime) : new Date(),
      hasAttachments: message.hasAttachments || false,
      importance: (message.importance || 'normal') as CRMEmail['importance'],
      isRead: message.isRead || false,
      isDraft: message.isDraft || false,
      webLink: message.webLink || '',
      
      // CRM-specific
      relatedEntityCodes: relatedCodes,
      entityMatches: entityMatches,
      
      // UI state
      isHighlighted: context ? relatedCodes.includes(context.code) : false,
      matchScore: this.calculateMatchScore(message, context)
    };
  }
  
  /**
   * Maps to detailed CRM Email with body and attachments
   */
  static toCRMEmailDetails(message: Message, context?: EntityContext): CRMEmailDetails {
    const baseEmail = this.toCRMEmail(message, context);
    
    return {
      ...baseEmail,
      body: {
        contentType: (message.body?.contentType || 'text') as 'html' | 'text',
        content: message.body?.content || ''
      },
      attachments: this.mapAttachments(message.attachments)
    };
  }
  
  /**
   * Converts CRM filter to Graph OData filter string
   * Simplified version to avoid "InefficientFilter" errors
   */
  static toGraphFilter(filter: CRMEmailFilter): string {
    const conditions: string[] = [];
    
    // Search filter - simplified without body/content search to avoid complexity
    if (filter.search) {
      const searchTerm = filter.search.replace(/'/g, "''");
      conditions.push(`contains(subject,'${searchTerm}')`);
    }
    
    // Entity code search - simplified to only search in subject
    const allCodes: string[] = [];
    
    if (filter.entityCode) {
      allCodes.push(filter.entityCode);
    }
    
    if (filter.relatedCodes && filter.relatedCodes.length > 0) {
      filter.relatedCodes.forEach(code => {
        if (!allCodes.includes(code)) {
          allCodes.push(code);
        }
      });
    }
    
    // Create a single condition for all codes - search only in subject for now
    if (allCodes.length > 0) {
      if (allCodes.length === 1) {
        // Single code
        const code = allCodes[0].replace(/'/g, "''");
        conditions.push(`contains(subject,'${code}')`);
      } else {
        // Multiple codes - limit to first 3 to avoid complexity
        const limitedCodes = allCodes.slice(0, 3);
        const codeConditions = limitedCodes.map(code => {
          const escapedCode = code.replace(/'/g, "''");
          return `contains(subject,'${escapedCode}')`;
        });
        conditions.push(`(${codeConditions.join(' or ')})`);
      }
    }
    
    // Other filters
    if (filter.hasAttachments !== undefined) {
      conditions.push(`hasAttachments eq ${filter.hasAttachments}`);
    }
    
    if (filter.importance) {
      conditions.push(`importance eq '${filter.importance}'`);
    }
    
    if (filter.isRead !== undefined) {
      conditions.push(`isRead eq ${filter.isRead}`);
    }
    
    // Date filters
    if (filter.dateFrom) {
      conditions.push(`receivedDateTime ge ${filter.dateFrom.toISOString()}`);
    }
    
    if (filter.dateTo) {
      conditions.push(`receivedDateTime le ${filter.dateTo.toISOString()}`);
    }
    
    // Folder filter removed for simplicity
    
    return conditions.join(' and ');
  }
  
  /**
   * Builds Graph API query parameters
   */
  static toGraphQueryParams(filter: CRMEmailFilter): Record<string, string> {
    const params: Record<string, string> = {};
    
    // Add filter
    const filterStr = this.toGraphFilter(filter);
    if (filterStr) {
      params['$filter'] = filterStr;
    }
    
    // Add ordering
    const orderBy = filter.orderBy || 'receivedDateTime';
    const orderDirection = filter.orderDirection || 'desc';
    params['$orderby'] = `${orderBy} ${orderDirection}`;
    
    // Add pagination
    if (filter.maxItems) {
      params['$top'] = filter.maxItems.toString();
    }
    
    if (filter.skip) {
      params['$skip'] = filter.skip.toString();
    }
    
    // Select specific fields for performance
    params['$select'] = 'id,conversationId,subject,bodyPreview,from,toRecipients,ccRecipients,sentDateTime,receivedDateTime,hasAttachments,importance,isRead,isDraft,webLink';
    
    return params;
  }
  
  // Private helper methods
  private static mapEmailAddress(recipient?: Recipient | null): CRMEmailContact {
    return {
      name: recipient?.emailAddress?.name || '',
      email: recipient?.emailAddress?.address || ''
    };
  }
  
  private static mapRecipients(recipients?: Recipient[] | null): CRMEmailContact[] {
    if (!recipients) return [];
    return recipients.map(r => this.mapEmailAddress(r));
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
  
  private static extractEntityCodes(message: Message): string[] {
    const content = `${message.subject || ''} ${message.bodyPreview || ''}`;
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
    
    // Extract partner codes (PRTN-YYYY-NNN or PART-YYYY-NNN)
    const partnerMatches = content.match(/PR?TN?-\d{4}-\d{3}/g);
    if (partnerMatches) codes.push(...partnerMatches);
    
    return [...new Set(codes)]; // Remove duplicates
  }
  
  private static matchEntities(codes: string[]): CRMEmail['entityMatches'] {
    const matches: CRMEmail['entityMatches'] = {
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
  
  private static calculateMatchScore(message: Message, context?: EntityContext): number {
    if (!context) return 0;
    
    const content = `${message.subject || ''} ${message.bodyPreview || ''}`.toLowerCase();
    const searchCode = context.code.toLowerCase();
    
    let score = 0;
    
    // Higher score for subject match
    if (message.subject?.toLowerCase().includes(searchCode)) {
      score += 10;
    }
    
    // Lower score for body match
    if (message.bodyPreview?.toLowerCase().includes(searchCode)) {
      score += 5;
    }
    
    // Additional score for related codes
    if (context.relatedCodes) {
      context.relatedCodes.forEach(code => {
        if (content.includes(code.toLowerCase())) {
          score += 3;
        }
      });
    }
    
    return score;
  }
}