import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { themeClass } from './styles/theme.css';
import { mantineTheme as baseTheme } from './styles/mantine-theme';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './lib/auth/AuthProvider';
import { AbilityProvider } from './lib/casl';
import { AppDatesProvider } from './app/providers/dates';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { resolvedColorScheme, primaryColor, primaryShade } = useTheme();
  
  // Create theme with user preferences by extending base theme
  const theme = {
    ...baseTheme,
    primaryColor,
    primaryShade: { light: primaryShade as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, dark: primaryShade as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 },
  };
  
  return (
    <MantineProvider 
      theme={theme} 
      defaultColorScheme={resolvedColorScheme}
    >
      <AppDatesProvider>
        <ModalsProvider>
          <Notifications />
          <RouterProvider router={router} />
        </ModalsProvider>
      </AppDatesProvider>
    </MantineProvider>
  );
}

function App() {
  return (
    <div className={themeClass}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AbilityProvider>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </AbilityProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;