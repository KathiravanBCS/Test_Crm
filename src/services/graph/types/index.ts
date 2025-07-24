export * from './email.types';
export * from './calendar.types';

// Common types used across services
export interface EntityContext {
  type: 'proposal' | 'engagement_letter' | 'engagement' | 'customer' | 'partner';
  id: number;
  code: string;
  relatedCodes?: string[];
}

// Service configuration
export interface GraphServiceConfig {
  useBackend: boolean;
  graphApiEndpoint?: string;
  backendApiEndpoint?: string;
  maxRetries?: number;
  cacheTime?: number;
}