import { useAuth } from '@/lib/auth/useAuth';

export function useUserRole() {
  const { user } = useAuth();
  
  return {
    role: user?.role?.toLowerCase() || 'guest',
    isAdmin: user?.role === 'Admin',
    isManager: user?.role === 'Manager',
    isConsultant: user?.role === 'Consultant',
    canViewFinancial: user?.role === 'Admin' || user?.role === 'Manager',
    canEditTasks: user?.role === 'Admin' || user?.role === 'Manager'
  };
}