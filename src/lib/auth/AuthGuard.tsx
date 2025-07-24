import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Center, Loader, Stack, Text, Title } from '@mantine/core';
import { loginRequest } from '@/config/authConfig';
import { LoginButton } from './LoginButton';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      instance.loginRedirect(loginRequest).catch((e) => {
        console.error('Auto login failed:', e);
      });
    }
  }, [instance, isAuthenticated, inProgress]);

  if (inProgress === InteractionStatus.Login) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader size="lg" />
          <Text>Signing you in...</Text>
        </Stack>
      </Center>
    );
  }

  if (!isAuthenticated) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Title order={2}>Welcome to VSTN CRM</Title>
          <Text c="dimmed">Please sign in to continue</Text>
          <LoginButton />
        </Stack>
      </Center>
    );
  }

  return <>{children}</>;
}