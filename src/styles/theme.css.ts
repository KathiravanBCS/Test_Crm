import { createTheme, style, globalStyle } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  colors: {
    background: '#fafbfc',
    foreground: '#1e293b',
    card: '#ffffff',
    cardForeground: '#1e293b',
    popover: '#ffffff',
    popoverForeground: '#1e293b',
    primary: {
      DEFAULT: '#000000',
      foreground: '#ffffff',
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#000000',
    },
    secondary: {
      DEFAULT: '#f1f5f9',
      foreground: '#475569',
    },
    muted: {
      DEFAULT: '#f8fafc',
      foreground: '#64748b',
    },
    accent: {
      DEFAULT: '#e2e8f0',
      foreground: '#334155',
    },
    destructive: {
      DEFAULT: '#ef4444',
      foreground: '#ffffff',
    },
    success: {
      DEFAULT: '#10b981',
      foreground: '#ffffff',
    },
    warning: {
      DEFAULT: '#f59e0b',
      foreground: '#ffffff',
    },
    info: {
      DEFAULT: '#3b82f6',
      foreground: '#ffffff',
    },
    border: '#e2e8f0',
    input: '#f8fafc',
    ring: '#000000',
    chart: {
      1: '#000000',
      2: '#3b82f6',
      3: '#10b981',
      4: '#f59e0b',
      5: '#ef4444',
    },
    sidebar: {
      background: '#ffffff',
      foreground: '#1e293b',
      primary: '#000000',
      primaryForeground: '#ffffff',
      accent: '#f8fafc',
      accentForeground: '#475569',
      border: '#e2e8f0',
      ring: '#000000',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
    '5xl': '3rem',
    '6xl': '3.5rem',
    '7xl': '4rem',
    '8xl': '4.5rem',
  },
  sizes: {
    sidebarCollapsed: '4rem',
    sidebarExpanded: '16rem',
    headerHeight: '3.5rem',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  radii: {
    none: '0px',
    sm: '0.125rem',
    DEFAULT: '0.375rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '0.875rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '1.875rem',
      '5xl': '2.25rem',
      '6xl': '3rem',
      '7xl': '3.75rem',
      '8xl': '4.5rem',
      '9xl': '6rem',
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },
});

globalStyle('*', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('html', {
  height: '100%',
  WebkitTextSizeAdjust: '100%',
});

globalStyle('body', {
  height: '100%',
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize.base,
  lineHeight: vars.typography.lineHeight.normal,
  color: vars.colors.foreground,
  backgroundColor: vars.colors.background,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('#root', {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

globalStyle('h1, h2, h3, h4, h5, h6', {
  fontWeight: vars.typography.fontWeight.semibold,
  lineHeight: vars.typography.lineHeight.tight,
});

globalStyle('h1', {
  fontSize: vars.typography.fontSize['4xl'],
});

globalStyle('h2', {
  fontSize: vars.typography.fontSize['3xl'],
});

globalStyle('h3', {
  fontSize: vars.typography.fontSize['2xl'],
});

globalStyle('h4', {
  fontSize: vars.typography.fontSize.xl,
});

globalStyle('h5', {
  fontSize: vars.typography.fontSize.lg,
});

globalStyle('h6', {
  fontSize: vars.typography.fontSize.base,
});

globalStyle('p', {
  marginBottom: vars.spacing.lg,
});

globalStyle('a', {
  color: vars.colors.primary.DEFAULT,
  textDecoration: 'none',
  transition: vars.transitions.fast,
});


globalStyle('button', {
  fontFamily: vars.typography.fontFamily.sans,
});

globalStyle('code', {
  fontFamily: vars.typography.fontFamily.mono,
  fontSize: '0.875em',
  backgroundColor: vars.colors.muted.DEFAULT,
  padding: '0.125rem 0.25rem',
  borderRadius: vars.radii.sm,
});

globalStyle('pre', {
  fontFamily: vars.typography.fontFamily.mono,
  fontSize: vars.typography.fontSize.sm,
  backgroundColor: vars.colors.muted.DEFAULT,
  padding: vars.spacing.lg,
  borderRadius: vars.radii.md,
  overflowX: 'auto',
});

globalStyle('::selection', {
  backgroundColor: vars.colors.primary.DEFAULT,
  color: vars.colors.primary.foreground,
});

// Scrollbar styles for webkit browsers (Chrome, Safari, Edge)
globalStyle('::-webkit-scrollbar', {
  width: '8px',
  height: '8px',
});

globalStyle('::-webkit-scrollbar-track', {
  background: vars.colors.muted.DEFAULT,
  borderRadius: vars.radii.sm,
});

globalStyle('::-webkit-scrollbar-thumb', {
  background: vars.colors.border,
  borderRadius: vars.radii.sm,
  border: `1px solid ${vars.colors.muted.DEFAULT}`,
});

globalStyle('::-webkit-scrollbar-thumb:hover', {
  background: vars.colors.muted.foreground,
});

globalStyle('::-webkit-scrollbar-corner', {
  background: vars.colors.muted.DEFAULT,
});

// Firefox scrollbar styles
globalStyle('*', {
  scrollbarWidth: 'thin',
  scrollbarColor: `${vars.colors.border} ${vars.colors.muted.DEFAULT}`,
});

export const densityStyles = {
  compact: style({
    padding: vars.spacing.xs,
  }),
  comfortable: style({
    padding: vars.spacing.sm,
  }),
  spacious: style({
    padding: vars.spacing.md,
  }),
};

export const cardStyle = style({
  backgroundColor: vars.colors.card,
  color: vars.colors.cardForeground,
  borderRadius: vars.radii.lg,
  border: `1px solid ${vars.colors.border}`,
  boxShadow: vars.shadows.sm,
  padding: vars.spacing['2xl'],
  transition: vars.transitions.fast,
  ':hover': {
    boxShadow: vars.shadows.md,
  },
});

export const containerStyle = style({
  width: '100%',
  maxWidth: '1440px',
  margin: '0 auto',
  padding: `0 ${vars.spacing['2xl']}`,
});

// Export theme as alias for vars for compatibility with existing code
export const theme = vars;