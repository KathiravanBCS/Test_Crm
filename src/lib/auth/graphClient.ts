import { Client } from '@microsoft/microsoft-graph-client';
import { AccountInfo, InteractionRequiredAuthError, PublicClientApplication } from '@azure/msal-browser';
import { graphScopes } from '@/config/graphConfig';

/**
 * Creates a Microsoft Graph client with MSAL authentication
 */
export function createGraphClient(msalInstance: PublicClientApplication, account: AccountInfo): Client {
  return Client.init({
    authProvider: async (done) => {
      try {
        const request = {
          scopes: [...graphScopes.graph.email, ...graphScopes.graph.calendar],
          account: account,
        };

        let response;
        try {
          // Try to acquire token silently first
          response = await msalInstance.acquireTokenSilent(request);
        } catch (error) {
          if (error instanceof InteractionRequiredAuthError) {
            // If silent acquisition fails, try with popup
            response = await msalInstance.acquireTokenPopup(request);
          } else {
            throw error;
          }
        }

        done(null, response.accessToken);
      } catch (error) {
        console.error('Failed to acquire Graph API token:', error);
        done(error as Error, null);
      }
    },
    defaultVersion: 'v1.0',
  });
}

/**
 * Hook to get Graph client using existing MSAL instance
 */
import { useMsal } from '@azure/msal-react';
import { useMemo } from 'react';

export function useGraphClient() {
  const { instance, accounts } = useMsal();
  
  const graphClient = useMemo(() => {
    if (accounts.length > 0) {
      return createGraphClient(instance as any, accounts[0]);
    }
    return null;
  }, [instance, accounts]);

  return graphClient;
}

/**
 * Helper to get access token for Graph API
 */
export async function getGraphAccessToken(
  msalInstance: PublicClientApplication,
  account: AccountInfo
): Promise<string> {
  const request = {
    scopes: [...graphScopes.graph.email, ...graphScopes.graph.calendar],
    account: account,
  };

  try {
    const response = await msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      const response = await msalInstance.acquireTokenPopup(request);
      return response.accessToken;
    }
    throw error;
  }
}