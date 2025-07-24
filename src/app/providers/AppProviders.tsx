import React from 'react';
import { AbilityProvider } from '@/lib/casl';

interface AppProvidersProps {
  children: React.ReactNode;
}

// This is a wrapper for CASL ability provider
// The main providers are already set up in App.tsx
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AbilityProvider>
      {children}
    </AbilityProvider>
  );
}