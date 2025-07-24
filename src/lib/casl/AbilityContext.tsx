import React, { createContext, useContext, useEffect, useState } from 'react';
import { createContextualCan } from '@casl/react';
import { AppAbility, CaslRule, UserPermissions } from './types';
import { createAbility, getDefaultRulesByRole, updateAbility } from './ability';
import { useAuth } from '@/lib/auth/useAuth';
import { api } from '@/lib/api';

interface AbilityContextType {
  ability: AppAbility;
  isLoading: boolean;
  refreshPermissions: () => Promise<void>;
}

const AbilityContext = createContext<AbilityContextType | undefined>(undefined);
export const Can = createContextualCan(AbilityContext as any);

interface AbilityProviderProps {
  children: React.ReactNode;
}

export function AbilityProvider({ children }: AbilityProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [ability, setAbility] = useState<AppAbility>(() => createAbility());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch permissions from backend or use defaults
  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      
      if (!isAuthenticated || !user) {
        // No permissions for unauthenticated users
        updateAbility(ability, []);
        return;
      }

      try {
        // Try to fetch custom permissions from backend
        const permissions = await api.auth.getPermissions() as { rules: CaslRule[] };
        updateAbility(ability, permissions.rules);
      } catch (error) {
        // Fallback to default role-based permissions
        console.warn('Failed to fetch permissions from backend, using defaults', error);
        const defaultRules = getDefaultRulesByRole(user.role, user.id);
        updateAbility(ability, defaultRules);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [user, isAuthenticated]);

  const refreshPermissions = async () => {
    await fetchPermissions();
  };

  const value: AbilityContextType = {
    ability,
    isLoading,
    refreshPermissions
  };

  return (
    <AbilityContext.Provider value={value}>
      {children}
    </AbilityContext.Provider>
  );
}

// Hook to use ability in components
export function useAbility() {
  const context = useContext(AbilityContext);
  if (context === undefined) {
    throw new Error('useAbility must be used within an AbilityProvider');
  }
  return context;
}

// Type-safe permission check hook
export function usePermission<T extends string>(
  action: string,
  subject: T | (new (...args: any[]) => any),
  field?: string
) {
  const { ability } = useAbility();
  if (field) {
    return ability.can(action as any, subject as any, field);
  }
  return ability.can(action as any, subject as any);
}