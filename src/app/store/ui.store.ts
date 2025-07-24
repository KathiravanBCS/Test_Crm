import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Theme state
  colorScheme: 'light' | 'dark';
  primaryColor: string;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: 'light' | 'dark') => void;
  setPrimaryColor: (color: string) => void;
  
  // Modal states
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  
  // Global loading state
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Sidebar state
      sidebarOpen: true,
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      // Theme state
      colorScheme: 'light',
      primaryColor: 'blue',
      toggleColorScheme: () => set((state) => ({ 
        colorScheme: state.colorScheme === 'light' ? 'dark' : 'light' 
      })),
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      setPrimaryColor: (color) => set({ primaryColor: color }),
      
      // Modal states
      createModalOpen: false,
      setCreateModalOpen: (open) => set({ createModalOpen: open }),
      
      // Global loading state
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
    }),
    {
      name: 'ui-store',
    }
  )
);