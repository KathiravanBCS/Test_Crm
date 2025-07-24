import { Container, Title, Tabs, Text, Stack, Paper } from '@mantine/core';
import { 
  IconPalette, 
  IconUser, 
  IconBell, 
  IconShieldCheck,
  IconSettings as IconSettingsGear 
} from '@tabler/icons-react';
import { ThemeSettings } from '@/components/theme/ThemeSettings';

export function SettingsPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={2} mb="xs">Settings</Title>
          <Text c="dimmed">Manage your account settings and preferences</Text>
        </div>
        
        <Tabs defaultValue="appearance">
          <Tabs.List>
            <Tabs.Tab value="appearance" leftSection={<IconPalette size={16} />}>
              Appearance
            </Tabs.Tab>
            <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
              Profile
            </Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
              Notifications
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<IconShieldCheck size={16} />}>
              Security
            </Tabs.Tab>
            <Tabs.Tab value="preferences" leftSection={<IconSettingsGear size={16} />}>
              Preferences
            </Tabs.Tab>
          </Tabs.List>
          
          <Tabs.Panel value="appearance" pt="xl">
            <Stack gap="lg">
              <div>
                <Title order={4} mb="xs">Appearance Settings</Title>
                <Text size="sm" c="dimmed">
                  Customize how the application looks and feels
                </Text>
              </div>
              <ThemeSettings />
            </Stack>
          </Tabs.Panel>
          
          <Tabs.Panel value="profile" pt="xl">
            <Paper withBorder p="xl" radius="md">
              <Text c="dimmed">Profile settings coming soon...</Text>
            </Paper>
          </Tabs.Panel>
          
          <Tabs.Panel value="notifications" pt="xl">
            <Paper withBorder p="xl" radius="md">
              <Text c="dimmed">Notification settings coming soon...</Text>
            </Paper>
          </Tabs.Panel>
          
          <Tabs.Panel value="security" pt="xl">
            <Paper withBorder p="xl" radius="md">
              <Text c="dimmed">Security settings coming soon...</Text>
            </Paper>
          </Tabs.Panel>
          
          <Tabs.Panel value="preferences" pt="xl">
            <Paper withBorder p="xl" radius="md">
              <Text c="dimmed">General preferences coming soon...</Text>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}