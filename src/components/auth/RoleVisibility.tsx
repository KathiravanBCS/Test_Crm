import { useUserRole } from '@/lib/hooks/useUserRole';

interface ShowForRolesProps {
  roles: string[];
  children: React.ReactNode;
}

export function ShowForRoles({ roles, children }: ShowForRolesProps) {
  const { role } = useUserRole();
  
  if (!roles.includes(role)) {
    return null;
  }
  
  return <>{children}</>;
}

interface FinancialDataProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FinancialData({ children, fallback = '—' }: FinancialDataProps) {
  const { canViewFinancial } = useUserRole();
  
  if (!canViewFinancial) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}