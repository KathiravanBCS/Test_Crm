import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Consultant';
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

// Mock auth hook - will be replaced with MSAL integration
export function useAuth(): AuthState {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      // Mock authenticated user
      setUser({
        id: 2,
        name: 'Priya Sharma',
        email: 'priya.sharma@vstn.in',
        role: 'Manager',
      });
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}