import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLocalStorage, useColorScheme } from '@mantine/hooks';
import type { MantineColorScheme, DefaultMantineColor } from '@mantine/core';

interface ThemeContextValue {
  // Color scheme
  colorScheme: MantineColorScheme | 'system';
  setColorScheme: (scheme: MantineColorScheme | 'system') => void;
  resolvedColorScheme: MantineColorScheme;
  
  // Primary color
  primaryColor: DefaultMantineColor;
  setPrimaryColor: (color: DefaultMantineColor) => void;
  
  // Additional theme settings
  primaryShade: number;
  setPrimaryShade: (shade: number) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const MANTINE_COLORS: DefaultMantineColor[] = [
  'dark',
  'gray',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'green',
  'lime',
  'yellow',
  'orange',
  'teal',
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Use localStorage to persist preferences
  const [storedColorScheme, setStoredColorScheme] = useLocalStorage<MantineColorScheme | 'system'>({
    key: 'vstn-color-scheme',
    defaultValue: 'system',
  });
  
  const [storedPrimaryColor, setStoredPrimaryColor] = useLocalStorage<DefaultMantineColor>({
    key: 'vstn-primary-color',
    defaultValue: 'blue',
  });
  
  const [storedPrimaryShade, setStoredPrimaryShade] = useLocalStorage<number>({
    key: 'vstn-primary-shade',
    defaultValue: 6,
  });
  
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // Resolve the actual color scheme
  const resolvedColorScheme: MantineColorScheme = 
    storedColorScheme === 'system' ? systemColorScheme : storedColorScheme;
  
  // State for immediate updates
  const [colorScheme, setColorSchemeState] = useState<MantineColorScheme | 'system'>(storedColorScheme);
  const [primaryColor, setPrimaryColorState] = useState<DefaultMantineColor>(storedPrimaryColor);
  const [primaryShade, setPrimaryShadeState] = useState<number>(storedPrimaryShade);
  
  // Update color scheme
  const setColorScheme = (scheme: MantineColorScheme | 'system') => {
    setColorSchemeState(scheme);
    setStoredColorScheme(scheme);
  };
  
  // Update primary color
  const setPrimaryColor = (color: DefaultMantineColor) => {
    if (MANTINE_COLORS.includes(color)) {
      setPrimaryColorState(color);
      setStoredPrimaryColor(color);
    }
  };
  
  // Update primary shade
  const setPrimaryShade = (shade: number) => {
    if (shade >= 0 && shade <= 9) {
      setPrimaryShadeState(shade);
      setStoredPrimaryShade(shade);
    }
  };
  
  // Sync state with storage
  useEffect(() => {
    setColorSchemeState(storedColorScheme);
  }, [storedColorScheme]);
  
  useEffect(() => {
    setPrimaryColorState(storedPrimaryColor);
  }, [storedPrimaryColor]);
  
  useEffect(() => {
    setPrimaryShadeState(storedPrimaryShade);
  }, [storedPrimaryShade]);
  
  const value: ThemeContextValue = {
    colorScheme,
    setColorScheme,
    resolvedColorScheme,
    primaryColor,
    setPrimaryColor,
    primaryShade,
    setPrimaryShade,
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { MANTINE_COLORS };