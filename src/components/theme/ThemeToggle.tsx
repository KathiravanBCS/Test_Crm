import { ActionIcon, Tooltip, useMantineTheme } from '@mantine/core';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const mantineTheme = useMantineTheme();
  const { colorScheme, setColorScheme, resolvedColorScheme } = useTheme();
  
  const toggleColorScheme = () => {
    if (colorScheme === 'light') {
      setColorScheme('dark');
    } else if (colorScheme === 'dark') {
      setColorScheme('system');
    } else {
      setColorScheme('light');
    }
  };
  
  const getIcon = () => {
    if (colorScheme === 'system') {
      return <IconDeviceDesktop size={18} />;
    }
    return resolvedColorScheme === 'dark' ? <IconMoon size={18} /> : <IconSun size={18} />;
  };
  
  const getTooltip = () => {
    if (colorScheme === 'system') {
      return `System theme (currently ${resolvedColorScheme})`;
    }
    return `${colorScheme === 'light' ? 'Light' : 'Dark'} theme`;
  };
  
  return (
    <Tooltip label={getTooltip()}>
      <ActionIcon
        variant="subtle"
        size="lg"
        onClick={toggleColorScheme}
        color={mantineTheme.primaryColor}
      >
        {getIcon()}
      </ActionIcon>
    </Tooltip>
  );
}