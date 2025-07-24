import { apiClient } from '@/lib/api-client';
import { IEmailService } from './interfaces';
import { 
  CRMEmail, 
  CRMEmailDetails, 
  CRMEmailFilter, 
  EmailSearchResponse 
} from '../types';

export class BackendEmailService implements IEmailService {
  private readonly baseUrl = '/api/graph/emails';
  
  async getRecentEmails(filter: CRMEmailFilter): Promise<EmailSearchResponse> {
    try {
      const response = await apiClient.post<EmailSearchResponse>(
        `${this.baseUrl}/search`,
        filter
      );
      return response;
    } catch (error) {
      console.error('Error fetching emails from backend:', error);
      throw new Error('Failed to fetch emails');
    }
  }
  
  async getEmailDetails(messageId: string): Promise<CRMEmailDetails> {
    try {
      const response = await apiClient.get<CRMEmailDetails>(
        `${this.baseUrl}/${messageId}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching email details from backend:', error);
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
    try {
      const response = await apiClient.post<EmailSearchResponse>(
        `${this.baseUrl}/related`,
        {
          entityCodes,
          ...filter
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching related emails from backend:', error);
      throw new Error('Failed to fetch related emails');
    }
  }
}