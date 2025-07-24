import { createTheme, rem, type MantineColorsTuple } from '@mantine/core';

// Convert the vanilla-extract theme colors to Mantine color tuples
const darkColorTuple: MantineColorsTuple = [
  '#fafafa', // 50
  '#f4f4f5', // 100
  '#e4e4e7', // 200
  '#d4d4d8', // 300
  '#a1a1aa', // 400
  '#71717a', // 500
  '#52525b', // 600
  '#3f3f46', // 700
  '#27272a', // 800
  '#000000', // 900
];

const grayColorTuple: MantineColorsTuple = [
  '#fafbfc', // 0 - lightest
  '#f8fafc', // 1
  '#f1f5f9', // 2
  '#e2e8f0', // 3
  '#cbd5e1', // 4
  '#94a3b8', // 5
  '#64748b', // 6
  '#475569', // 7
  '#334155', // 8
  '#1e293b', // 9 - darkest
];

const redColorTuple: MantineColorsTuple = [
  '#fef2f2',
  '#fee2e2',
  '#fecaca',
  '#fca5a5',
  '#f87171',
  '#ef4444', // destructive default
  '#dc2626',
  '#b91c1c',
  '#991b1b',
  '#7f1d1d',
];

const greenColorTuple: MantineColorsTuple = [
  '#f0fdf4',
  '#dcfce7',
  '#bbf7d0',
  '#86efac',
  '#4ade80',
  '#22c55e',
  '#16a34a',
  '#15803d',
  '#166534',
  '#10b981', // success default
];

const yellowColorTuple: MantineColorsTuple = [
  '#fffbeb',
  '#fef3c7',
  '#fde68a',
  '#fcd34d',
  '#fbbf24',
  '#f59e0b', // warning default
  '#d97706',
  '#b45309',
  '#92400e',
  '#78350f',
];

const blueColorTuple: MantineColorsTuple = [
  '#eff6ff',
  '#dbeafe',
  '#bfdbfe',
  '#93c5fd',
  '#60a5fa',
  '#3b82f6', // info default
  '#2563eb',
  '#1d4ed8',
  '#1e40af',
  '#1e3a8a',
];

const tealColorTuple: MantineColorsTuple = [
  '#f0fdfa',
  '#ccfbf1',
  '#99f6e4',
  '#5eead4',
  '#2dd4bf',
  '#14b8a6',
  '#0d9488',
  '#0f766e',
  '#115e59',
  '#134e4a',
];

export const mantineTheme = createTheme({
  // Use default Mantine blue as primary color
  primaryColor: 'blue',
  primaryShade: { light: 6, dark: 8 },
  
  // Font configuration
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  
  // Typography
  fontSizes: {
    xs: rem(12),   // 0.75rem
    sm: rem(14),   // 0.875rem
    md: rem(14),   // 0.875rem (base)
    lg: rem(16),   // 1rem
    xl: rem(18),   // 1.125rem
  },
  
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: rem(30) }, // 1.875rem
      h2: { fontSize: rem(24) }, // 1.5rem
      h3: { fontSize: rem(20) }, // 1.25rem
      h4: { fontSize: rem(18) }, // 1.125rem
      h5: { fontSize: rem(16) }, // 1rem
      h6: { fontSize: rem(14) }, // 0.875rem
    },
  },
  
  // Spacing scale matching vanilla-extract theme
  spacing: {
    xs: rem(4),    // 0.25rem
    sm: rem(8),    // 0.5rem
    md: rem(12),   // 0.75rem
    lg: rem(16),   // 1rem
    xl: rem(20),   // 1.25rem
  },
  
  // Radius configuration
  radius: {
    xs: rem(2),    // 0.125rem
    sm: rem(6),    // 0.375rem
    md: rem(6),    // 0.375rem
    lg: rem(8),    // 0.5rem
    xl: rem(12),   // 0.75rem
  },
  defaultRadius: 'md',
  
  // Colors
  colors: {
    dark: darkColorTuple,
    gray: grayColorTuple,
    red: redColorTuple,
    green: greenColorTuple,
    yellow: yellowColorTuple,
    blue: blueColorTuple,
    teal: tealColorTuple,
  },
  
  // Other theme tokens
  other: {
    // Layout sizes
    sidebarCollapsed: rem(64),  // 4rem
    sidebarExpanded: rem(256),  // 16rem
    headerHeight: rem(56),      // 3.5rem
    
    // Transitions
    transitionFast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transitionNormal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transitionSlow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Component default props and styles
  components: {
    // Layout components
    AppShell: {
      defaultProps: {
        padding: 0,
      },
      styles: {
        root: {
          backgroundColor: '#fafbfc',
        },
        main: {
          backgroundColor: '#fafbfc',
          minHeight: '100vh',
        },
      },
    },
    
    // Button configuration
    Button: {
      defaultProps: {
        size: 'sm',
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 500,
          transition: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    
    // Badge configuration for status indicators
    Badge: {
      defaultProps: {
        size: 'sm',
        radius: 'sm',
      },
      styles: {
        root: {
          textTransform: 'capitalize',
          fontWeight: 500,
        },
      },
    },
    
    // Card styling
    Card: {
      defaultProps: {
        radius: 'lg',
        withBorder: true,
        padding: 'xl',
      },
      styles: {
        root: {
          backgroundColor: '#ffffff',
          borderColor: 'var(--mantine-color-gray-3)',
          transition: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: 'var(--mantine-shadow-md)',
          },
        },
      },
    },
    
    // Paper component (for cards without hover effects)
    Paper: {
      defaultProps: {
        radius: 'lg',
        withBorder: true,
        p: 'xl',
      },
      styles: {
        root: {
          backgroundColor: '#ffffff',
          borderColor: 'var(--mantine-color-gray-3)',
        },
      },
    },
    
    // Input components
    Input: {
      defaultProps: {
        size: 'sm',
        radius: 'md',
      },
      styles: {
        input: {
          backgroundColor: '#f8fafc',
          borderColor: 'var(--mantine-color-gray-3)',
          fontSize: rem(14),
          '&:focus': {
            borderColor: 'var(--mantine-color-blue-6)',
          },
        },
      },
    },
    
    TextInput: {
      defaultProps: {
        size: 'sm',
        radius: 'md',
      },
    },
    
    Select: {
      defaultProps: {
        size: 'sm',
        radius: 'md',
      },
    },
    
    Textarea: {
      defaultProps: {
        size: 'sm',
        radius: 'md',
      },
    },
    
    DatePickerInput: {
      defaultProps: {
        size: 'sm',
        radius: 'md',
      },
    },
    
    // Table configuration
    Table: {
      defaultProps: {
        striped: false,
        highlightOnHover: true,
        withTableBorder: true,
        withColumnBorders: false,
      },
      styles: {
        root: {
          fontSize: rem(14),
        },
        th: {
          backgroundColor: 'var(--mantine-color-gray-0)',
          fontWeight: 600,
          color: 'var(--mantine-color-gray-7)',
          padding: `${rem(8)} ${rem(12)}`,
        },
        td: {
          padding: `${rem(8)} ${rem(12)}`,
        },
      },
    },
    
    // Drawer (replacing Modal as per CLAUDE.md)
    Drawer: {
      defaultProps: {
        size: 'lg',
        position: 'right',
        overlayProps: {
          backgroundOpacity: 0.5,
        },
      },
      styles: {
        header: {
          padding: rem(20),
          borderBottom: '1px solid #e2e8f0',
        },
        body: {
          padding: rem(20),
        },
      },
    },
    
    // Tabs component
    Tabs: {
      defaultProps: {
        radius: 'md',
      },
    },
    

    
    // Text component
    Text: {
      defaultProps: {
        size: 'sm',
      },
    },
    
    // Title component
    Title: {
      styles: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});