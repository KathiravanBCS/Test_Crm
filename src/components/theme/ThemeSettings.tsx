import { 
  SegmentedControl, 
  ColorSwatch, 
  Group, 
  Stack, 
  Text, 
  Paper, 
  ActionIcon,
  Tooltip,
  Box,
  useMantineTheme,
  Slider
} from '@mantine/core';
import { 
  IconSun, 
  IconMoon, 
  IconDeviceDesktop,
  IconPalette,
  IconCheck
} from '@tabler/icons-react';
import { useTheme, MANTINE_COLORS } from '@/contexts/ThemeContext';

export function ThemeSettings() {
  const mantineTheme = useMantineTheme();
  const { 
    colorScheme, 
    setColorScheme, 
    primaryColor, 
    setPrimaryColor,
    primaryShade,
    setPrimaryShade
  } = useTheme();
  
  const colorSchemeData = [
    { label: <IconSun size={16} />, value: 'light' },
    { label: <IconMoon size={16} />, value: 'dark' },
    { label: <IconDeviceDesktop size={16} />, value: 'system' },
  ];
  
  return (
    <Stack gap="lg">
      {/* Color Scheme Selector */}
      <Paper withBorder p="md" radius="md">
        <Stack gap="sm">
          <Group justify="space-between">
            <Text size="sm" fw={500}>Color Scheme</Text>
            <IconPalette size={18} color={mantineTheme.colors.gray[6]} />
          </Group>
          <SegmentedControl
            value={colorScheme}
            onChange={(value) => setColorScheme(value as any)}
            data={colorSchemeData}
            fullWidth
          />
          <Text size="xs" c="dimmed">
            {colorScheme === 'system' 
              ? 'Automatically switch between light and dark themes based on system preferences'
              : `Always use ${colorScheme} theme`
            }
          </Text>
        </Stack>
      </Paper>
      
      {/* Primary Color Selector */}
      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Text size="sm" fw={500}>Primary Color</Text>
          <Group gap="xs">
            {MANTINE_COLORS.map((color) => (
              <Tooltip key={color} label={color} position="bottom">
                <ActionIcon
                  variant={primaryColor === color ? 'filled' : 'default'}
                  size="lg"
                  radius="md"
                  onClick={() => setPrimaryColor(color)}
                  style={{ 
                    backgroundColor: primaryColor === color 
                      ? mantineTheme.colors[color][primaryShade] 
                      : undefined,
                    border: primaryColor === color 
                      ? `2px solid ${mantineTheme.colors[color][primaryShade]}`
                      : undefined,
                  }}
                >
                  {primaryColor === color ? (
                    <IconCheck size={16} color="white" />
                  ) : (
                    <ColorSwatch 
                      color={mantineTheme.colors[color][6]} 
                      size={24}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </ActionIcon>
              </Tooltip>
            ))}
          </Group>
        </Stack>
      </Paper>
      
      {/* Primary Shade Selector */}
      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" fw={500}>Primary Color Shade</Text>
            <Text size="sm" c="dimmed">{primaryShade}</Text>
          </Group>
          <Box px="xs">
            <Slider
              value={primaryShade}
              onChange={setPrimaryShade}
              min={0}
              max={9}
              step={1}
              marks={[
                { value: 0, label: 'Light' },
                { value: 5, label: 'Medium' },
                { value: 9, label: 'Dark' },
              ]}
              styles={{
                markLabel: { fontSize: '11px' },
              }}
            />
          </Box>
          <Group gap="xs" justify="center">
            {Array.from({ length: 10 }, (_, i) => (
              <Box
                key={i}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: mantineTheme.colors[primaryColor][i],
                  borderRadius: mantineTheme.radius.sm,
                  border: i === primaryShade 
                    ? `2px solid ${mantineTheme.colors.gray[7]}`
                    : `1px solid ${mantineTheme.colors.gray[3]}`,
                  cursor: 'pointer',
                }}
                onClick={() => setPrimaryShade(i)}
              />
            ))}
          </Group>
        </Stack>
      </Paper>
      
      {/* Preview */}
      <Paper withBorder p="md" radius="md" bg={mantineTheme.colors.gray[0]}>
        <Stack gap="sm">
          <Text size="sm" fw={500}>Preview</Text>
          <Group gap="sm">
            <ActionIcon color={primaryColor} variant="filled" size="lg">
              <IconCheck size={16} />
            </ActionIcon>
            <ActionIcon color={primaryColor} variant="light" size="lg">
              <IconPalette size={16} />
            </ActionIcon>
            <ActionIcon color={primaryColor} variant="outline" size="lg">
              <IconSun size={16} />
            </ActionIcon>
            <ActionIcon color={primaryColor} variant="subtle" size="lg">
              <IconMoon size={16} />
            </ActionIcon>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}