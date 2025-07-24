import type { Meta, StoryObj } from '@storybook/react';
import { ShowForRoles, FinancialData } from './RoleVisibility';
import { Button, Text, Card, Stack, Group } from '@mantine/core';

const meta: Meta = {
  title: 'UI/RoleVisibility',
  component: ShowForRoles,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const ShowForRolesExample: StoryObj = {
  render: () => (
    <Card w={400}>
      <Stack>
        <Text fw={500}>Current Role: Manager (mocked)</Text>
        
        <ShowForRoles roles={['admin', 'manager']}>
          <Button color="red">Delete All Data (Admin/Manager only)</Button>
        </ShowForRoles>
        
        <ShowForRoles roles={['admin']}>
          <Button color="violet">System Settings (Admin only)</Button>
        </ShowForRoles>
        
        <ShowForRoles roles={['consultant']}>
          <Text c="dimmed">This is only visible to consultants</Text>
        </ShowForRoles>
      </Stack>
    </Card>
  ),
};

export const FinancialDataExample: StoryObj = {
  render: () => (
    <Card w={400}>
      <Stack>
        <Text fw={500}>Financial Information</Text>
        
        <Group justify="space-between">
          <Text>Revenue:</Text>
          <FinancialData>
            <Text fw={500}>$125,000</Text>
          </FinancialData>
        </Group>
        
        <Group justify="space-between">
          <Text>Profit Margin:</Text>
          <FinancialData fallback="Hidden">
            <Text fw={500} c="green">22.5%</Text>
          </FinancialData>
        </Group>
        
        <Group justify="space-between">
          <Text>Outstanding:</Text>
          <FinancialData fallback={<Text c="dimmed" fs="italic">No access</Text>}>
            <Text fw={500} c="red">$45,000</Text>
          </FinancialData>
        </Group>
      </Stack>
    </Card>
  ),
};