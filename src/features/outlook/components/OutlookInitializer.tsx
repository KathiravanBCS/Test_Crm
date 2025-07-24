import { useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { outlookServices } from '@/services/graph';
import { createGraphClient } from '@/lib/auth/graphClient';

/**
 * Component that initializes Outlook services when user is authenticated
 * Add this to your app layout or main app component
 */
export function OutlookInitializer() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  
  useEffect(() => {
    const initializeServices = async () => {
      if (isAuthenticated && accounts.length > 0) {
        try {
          console.log('Initializing Outlook services...');
          
          // Create Graph client with current MSAL instance
          const graphClient = createGraphClient(instance as any, accounts[0]);
          
          // Set the client in outlook services
          outlookServices.setGraphClient(graphClient);
          
          // Make sure we're using Graph API, not backend
          outlookServices.useGraphAPI();
          
          console.log('Outlook services initialized. Using backend:', outlookServices.isUsingBackend());
        } catch (error) {
          console.error('Failed to initialize Outlook services:', error);
        }
      }
    };
    
    initializeServices();
  }, [isAuthenticated, accounts, instance]);
  
  // This component doesn't render anything
  return null;
}