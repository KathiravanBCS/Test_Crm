import { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { outlookServices } from '@/services/graph';
import { useGraphClient } from '@/lib/auth/graphClient';

/**
 * Hook to initialize Outlook services with the current MSAL authentication
 * This should be called once at the app level after authentication
 */
export function useOutlookServices() {
  const isAuthenticated = useIsAuthenticated();
  const graphClient = useGraphClient();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated && graphClient && !isInitialized) {
      // Set the Graph client for Outlook services
      outlookServices.setGraphClient(graphClient);
      outlookServices.useGraphAPI(); // Use direct Graph API
      setIsInitialized(true);
      
      console.log('Outlook services initialized with Graph client');
    }
  }, [isAuthenticated, graphClient, isInitialized]);
  
  return {
    outlookServices,
    isInitialized,
    isAuthenticated
  };
}

/**
 * Hook to check if Outlook integration is ready
 */
export function useOutlookReady() {
  const { isInitialized, isAuthenticated } = useOutlookServices();
  const { accounts } = useMsal();
  
  // Check if we have the necessary Graph scopes
  const hasGraphScopes = accounts.length > 0 && (accounts[0].idTokenClaims as any)?.scp?.includes('Mail.Read');
  
  return {
    isReady: isAuthenticated && isInitialized && hasGraphScopes,
    isAuthenticated,
    isInitialized,
    hasGraphScopes,
    needsConsent: isAuthenticated && !hasGraphScopes
  };
}