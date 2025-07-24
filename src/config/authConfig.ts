import { LogLevel } from '@azure/msal-browser';
import type { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '6f2017d6-8876-43fd-86bf-19ebdf11ac88',
    authority: 'https://login.microsoftonline.com/6eecebc8-a09d-43a7-9d34-8dde9af1c5a4',
    redirectUri: window.location.origin + '/',
    postLogoutRedirectUri: window.location.origin + '/',
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

// Import Graph scopes
import { graphScopes } from './graphConfig';

export const loginRequest = {
  scopes: graphScopes.loginRequest,
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};