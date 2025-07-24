import { OutlookServiceFactory } from '@/services/graph/services/service-factory';

/**
 * Graph Client Manager that follows the established pattern
 * This is a facade over the OutlookServiceFactory to provide a consistent interface
 */
class GraphClientManager {
  /**
   * Get the Graph client instance from the factory
   * The client should be initialized through OutlookInitializer component
   */
  async getClient() {
    // Get the client from the factory's private property
    // This is a workaround since the factory doesn't expose a getter
    const factory = OutlookServiceFactory as any;
    if (!factory.graphClient) {
      throw new Error('Graph client not initialized. Ensure OutlookInitializer is mounted and user is authenticated.');
    }
    return factory.graphClient;
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    const factory = OutlookServiceFactory as any;
    return factory.graphClient !== null;
  }
}

// Export singleton instance
export const graphClient = new GraphClientManager();