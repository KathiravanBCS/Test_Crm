import { useState, useEffect } from 'react';
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import { outlookServices } from '@/services/graph';

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID || 'common'}`,
    redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage' as const,
    storeAuthStateInCookie: false,
  }
};

// Graph API scopes
const graphScopes = {
  default: ['User.Read'],
  email: ['Mail.Read', 'Mail.ReadBasic'],
  calendar: ['Calendars.Read', 'Calendars.ReadBasic'],
  all: ['User.Read', 'Mail.Read', 'Mail.ReadBasic', 'Calendars.Read', 'Calendars.ReadBasic']
};

// MSAL instance (singleton)
let msalInstance: PublicClientApplication | null = null;

const getMsalInstance = async () => {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
    await msalInstance.initialize();
  }
  return msalInstance;
};

// Custom authentication provider for Graph client
class MSALAuthenticationProvider {
  constructor(private msalInstance: PublicClientApplication) {}

  async getAccessToken(): Promise<string> {
    const accounts = this.msalInstance.getAllAccounts();
    
    if (accounts.length === 0) {
      throw new Error('No authenticated user');
    }

    const request = {
      scopes: graphScopes.all,
      account: accounts[0],
    };

    try {
      const response = await this.msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      // If silent token acquisition fails, acquire token interactive
      const response = await this.msalInstance.acquireTokenPopup(request);
      return response.accessToken;
    }
  }
}

interface UseGraphAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AccountInfo | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  error: Error | null;
}

export function useGraphAuth(): UseGraphAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const msal = await getMsalInstance();
        const accounts = msal.getAllAccounts();
        
        if (accounts.length > 0) {
          setUser(accounts[0]);
          setIsAuthenticated(true);
          
          // Initialize Graph client
          const authProvider = new MSALAuthenticationProvider(msal);
          const graphClient = Client.initWithMiddleware({
            authProvider: {
              getAccessToken: () => authProvider.getAccessToken()
            },
            defaultVersion: 'v1.0',
          });
          
          outlookServices.setGraphClient(graphClient);
          outlookServices.useGraphAPI();
        }
      } catch (err) {
        setError(err as Error);
        console.error('Auth initialization failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    setError(null);
    
    try {
      const msal = await getMsalInstance();
      const loginResponse = await msal.loginPopup({
        scopes: graphScopes.all,
        prompt: 'select_account'
      });
      
      if (loginResponse && loginResponse.account) {
        setUser(loginResponse.account);
        setIsAuthenticated(true);
        
        // Initialize Graph client after login
        const authProvider = new MSALAuthenticationProvider(msal);
        const graphClient = Client.initWithMiddleware({
          authProvider: {
            getAccessToken: () => authProvider.getAccessToken()
          },
          defaultVersion: 'v1.0',
        });
        
        outlookServices.setGraphClient(graphClient);
        outlookServices.useGraphAPI();
      }
    } catch (err) {
      setError(err as Error);
      console.error('Login failed:', err);
    }
  };

  const logout = async () => {
    try {
      const msal = await getMsalInstance();
      await msal.logoutPopup();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err as Error);
      console.error('Logout failed:', err);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    error
  };
}

// Helper hook to check if Graph API is properly configured
export function useGraphConfig() {
  const hasClientId = !!import.meta.env.VITE_MSAL_CLIENT_ID;
  const hasTenantId = !!import.meta.env.VITE_MSAL_TENANT_ID;
  const isConfigured = hasClientId && hasTenantId;
  
  return {
    isConfigured,
    config: {
      clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
      tenantId: import.meta.env.VITE_MSAL_TENANT_ID,
      redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI || window.location.origin,
      useBackend: import.meta.env.VITE_USE_GRAPH_BACKEND === 'true'
    }
  };
}