import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MantineProvider } from '@mantine/core';
import { Group, Card, Stack, Text } from '@mantine/core';

const meta: Meta<typeof ThemeToggle> = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <MantineProvider>
          <Story />
        </MantineProvider>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InHeader: Story = {
  render: () => (
    <Card withBorder p="md" style={{ width: 600 }}>
      <Group justify="space-between">
        <Text fw={500}>Application Header</Text>
        <Group>
          <Text size="sm" c="dimmed">User Menu</Text>
          <ThemeToggle />
        </Group>
      </Group>
    </Card>
  ),
};

export const InToolbar: Story = {
  render: () => (
    <Card withBorder p="xs">
      <Group>
        <Text size="sm">Toolbar:</Text>
        <ThemeToggle />
        <Text size="sm" c="dimmed">|</Text>
        <Text size="sm">Other Actions</Text>
      </Group>
    </Card>
  ),
};

export const MultipleSizes: Story = {
  render: () => (
    <Stack>
      <Text fw={500}>Different Sizes:</Text>
      <Group>
        <div>
          <Text size="xs" c="dimmed" mb={4}>Small</Text>
          <ThemeToggle />
        </div>
        <div>
          <Text size="xs" c="dimmed" mb={4}>Medium</Text>
          <ThemeToggle />
        </div>
        <div>
          <Text size="xs" c="dimmed" mb={4}>Large</Text>
          <ThemeToggle />
        </div>
      </Group>
    </Stack>
  ),
};

export const InDarkMode: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <MantineProvider forceColorScheme="dark">
          <div style={{ 
            background: '#1a1b1e', 
            padding: 40,
            borderRadius: 8
          }}>
            <Story />
          </div>
        </MantineProvider>
      </ThemeProvider>
    ),
  ],
};

export const InNavigationBar: Story = {
  render: () => (
    <div style={{ background: '#f8f9fa', padding: 20 }}>
      <Card withBorder>
        <Group justify="space-between" h={50} px="md">
          <Group>
            <Text fw={600} size="lg">Logo</Text>
            <Group ml="xl">
              <Text>Dashboard</Text>
              <Text>Reports</Text>
              <Text>Settings</Text>
            </Group>
          </Group>
          <Group>
            <ThemeToggle />
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              background: '#228be6' 
            }} />
          </Group>
        </Group>
      </Card>
    </div>
  ),
};

export const InSidebar: Story = {
  render: () => (
    <Card withBorder p="md" style={{ width: 250, height: 400 }}>
      <Stack justify="space-between" h="100%">
        <div>
          <Text fw={600} mb="md">Menu</Text>
          <Stack gap="xs">
            <Text size="sm">Dashboard</Text>
            <Text size="sm">Customers</Text>
            <Text size="sm">Reports</Text>
          </Stack>
        </div>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Theme</Text>
          <ThemeToggle />
        </Group>
      </Stack>
    </Card>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Card withBorder p="md">
      <Group>
        <Text size="sm">Appearance:</Text>
        <ThemeToggle />
      </Group>
    </Card>
  ),
};

export const InSettingsPanel: Story = {
  render: () => (
    <Card withBorder style={{ width: 400 }}>
      <Stack p="md">
        <Text fw={600} size="lg">Settings</Text>
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm">Dark Mode</Text>
            <ThemeToggle />
          </Group>
          <Group justify="space-between">
            <Text size="sm">Notifications</Text>
            <Text size="sm" c="dimmed">On</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Language</Text>
            <Text size="sm" c="dimmed">English</Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  ),
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div style={{ padding: 16 }}>
      <Card withBorder>
        <Group justify="space-between" p="xs">
          <Text size="sm" fw={500}>Mobile App</Text>
          <ThemeToggle />
        </Group>
      </Card>
    </div>
  ),
};

export const FloatingActionButton: Story = {
  render: () => (
    <div style={{ 
      position: 'relative', 
      height: 300, 
      background: '#f8f9fa',
      borderRadius: 8 
    }}>
      <div style={{ 
        position: 'absolute', 
        bottom: 20, 
        right: 20,
        background: 'white',
        borderRadius: '50%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: 8
      }}>
        <ThemeToggle />
      </div>
    </div>
  ),
};

export const InGrid: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    }}>
      {[1, 2, 3].map((i) => (
        <Card key={i} withBorder p="md">
          <Group justify="space-between" mb="md">
            <Text fw={500}>Card {i}</Text>
            <ThemeToggle />
          </Group>
          <Text size="sm" c="dimmed">
            Sample content in card {i}
          </Text>
        </Card>
      ))}
    </div>
  ),
};