import type { Preview } from '@storybook/react';
import React, { createContext } from 'react';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
import { withThemeByClassName } from '@storybook/addon-themes';
import 'dayjs/locale/en';
import { createAbility } from '@/lib/casl/ability';

// Create a query client for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false, // Disable retries in Storybook
    },
  },
});

// Mock auth context for Storybook
const MockAuthContext = createContext({
  user: { id: '1', name: 'Storybook User', email: 'storybook@example.com', role: 'admin' },
  isAuthenticated: true,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  getAccessToken: async () => 'mock-token',
});

// Mock ability context for Storybook
const mockAbility = createAbility([{ action: 'manage', subject: 'all' }]);
const MockAbilityContext = createContext({
  ability: mockAbility,
  isLoading: false,
  refreshPermissions: async () => {},
});

// Simple mock providers that don't require MSAL
function MockProviders({ children }: { children: React.ReactNode }) {
  return (
    <MockAuthContext.Provider value={{
      user: { id: '1', name: 'Storybook User', email: 'storybook@example.com', role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
      login: async () => {},
      logout: async () => {},
      getAccessToken: async () => 'mock-token',
    }}>
      <MockAbilityContext.Provider value={{
        ability: mockAbility,
        isLoading: false,
        refreshPermissions: async () => {},
      }}>
        {children}
      </MockAbilityContext.Provider>
    </MockAuthContext.Provider>
  );
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'mantine-light',
        dark: 'mantine-dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MockProviders>
          <MemoryRouter>
            <MantineProvider defaultColorScheme="light">
              <DatesProvider settings={{ 
                locale: 'en',
                firstDayOfWeek: 1,
                weekendDays: [0, 6],
                consistentWeeks: true
              }}>
                <ModalsProvider>
                  <Notifications />
                  <Story />
                </ModalsProvider>
              </DatesProvider>
            </MantineProvider>
          </MemoryRouter>
        </MockProviders>
      </QueryClientProvider>
    ),
  ],
};

export default preview;