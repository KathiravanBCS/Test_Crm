import { Client } from '@microsoft/microsoft-graph-client';
import { IEmailService, ICalendarService } from './interfaces';
import { GraphEmailService } from './graph-email.service';
import { GraphCalendarService } from './graph-calendar.service';
import { BackendEmailService } from './backend-email.service';
import { BackendCalendarService } from './backend-calendar.service';
import { GraphServiceConfig } from '../types';

/**
 * Factory class for creating email and calendar services
 * Supports switching between direct Graph API calls and backend API calls
 */
export class OutlookServiceFactory {
  private static config: GraphServiceConfig = {
    useBackend: import.meta.env.VITE_USE_GRAPH_BACKEND === 'true',
    graphApiEndpoint: 'https://graph.microsoft.com/v1.0',
    backendApiEndpoint: '/api',
    maxRetries: 3,
    cacheTime: 5 * 60 * 1000 // 5 minutes
  };
  
  private static graphClient: Client | null = null;
  
  /**
   * Configure the service factory
   */
  static configure(config: Partial<GraphServiceConfig>) {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Set the Graph client instance (should be done after MSAL authentication)
   */
  static setGraphClient(client: Client) {
    this.graphClient = client;
  }
  
  /**
   * Create an email service instance
   */
  static createEmailService(): IEmailService {
    if (this.config.useBackend) {
      return new BackendEmailService();
    }
    
    if (!this.graphClient) {
      throw new Error('Graph client not initialized. Call setGraphClient() first.');
    }
    
    return new GraphEmailService(this.graphClient);
  }
  
  /**
   * Create a calendar service instance
   */
  static createCalendarService(): ICalendarService {
    if (this.config.useBackend) {
      return new BackendCalendarService();
    }
    
    if (!this.graphClient) {
      throw new Error('Graph client not initialized. Call setGraphClient() first.');
    }
    
    return new GraphCalendarService(this.graphClient);
  }
  
  /**
   * Check if services are configured to use backend
   */
  static isUsingBackend(): boolean {
    return this.config.useBackend;
  }
  
  /**
   * Switch to backend services
   */
  static useBackend() {
    this.config.useBackend = true;
  }
  
  /**
   * Switch to direct Graph API services
   */
  static useGraphAPI() {
    this.config.useBackend = false;
  }
}

// Export a singleton instance for convenience
export const outlookServices = {
  email: () => OutlookServiceFactory.createEmailService(),
  calendar: () => OutlookServiceFactory.createCalendarService(),
  configure: (config: Partial<GraphServiceConfig>) => OutlookServiceFactory.configure(config),
  setGraphClient: (client: Client) => OutlookServiceFactory.setGraphClient(client),
  isUsingBackend: () => OutlookServiceFactory.isUsingBackend(),
  useBackend: () => OutlookServiceFactory.useBackend(),
  useGraphAPI: () => OutlookServiceFactory.useGraphAPI()
};