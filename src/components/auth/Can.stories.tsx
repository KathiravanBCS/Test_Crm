import type { Meta, StoryObj } from '@storybook/react';
import { Can } from './Can';
import { AbilityProvider } from '@/lib/casl/AbilityContext';
import { createAbility, updateAbility } from '@/lib/casl/ability';
import { Button, Stack, Text, Card } from '@mantine/core';

const meta: Meta<typeof Can> = {
  title: 'UI/Can',
  component: Can,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const ability = createAbility();
      const rules = (context.args as any).rules || [];
      updateAbility(ability, rules);
      
      return (
        <AbilityProvider>
          <div style={{ minWidth: 400 }}>
            <Story />
          </div>
        </AbilityProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    I: 'read',
    a: 'Customer',
    children: (
      <Card withBorder p="md">
        <Text>You can read customers!</Text>
      </Card>
    ),
    rules: [
      { action: 'read', subject: 'Customer' }
    ]
  },
};

export const NotAllowed: Story = {
  args: {
    I: 'delete',
    a: 'Customer',
    children: (
      <Card withBorder p="md">
        <Text c="red">You can delete customers!</Text>
      </Card>
    ),
    rules: [
      { action: 'read', subject: 'Customer' },
      { action: 'update', subject: 'Customer' }
    ]
  },
  render: (args) => (
    <Stack>
      <Text size="sm" c="dimmed">
        User has read and update permissions but not delete
      </Text>
      <Can I={args.I} a={args.a}>
        {args.children}
      </Can>
    </Stack>
  ),
};

export const WithButton: Story = {
  args: {
    I: 'create',
    a: 'Task',
    children: <Button>Create New Task</Button>,
    rules: [
      { action: 'create', subject: 'Task' }
    ]
  },
};

export const ConditionalRendering: Story = {
  render: () => (
    <Stack>
      <Can I="read" a="Customer">
        <Card withBorder p="sm">
          <Text>✅ Can read customers</Text>
        </Card>
      </Can>
      
      <Can I="update" a="Customer">
        <Card withBorder p="sm">
          <Text>✅ Can update customers</Text>
        </Card>
      </Can>
      
      <Can I="delete" a="Customer">
        <Card withBorder p="sm">
          <Text>✅ Can delete customers</Text>
        </Card>
      </Can>
      
      <Can I="manage" a="all">
        <Card withBorder p="sm">
          <Text fw={500}>🔑 Admin: Can manage everything</Text>
        </Card>
      </Can>
    </Stack>
  ),
  args: {
    rules: [
      { action: 'read', subject: 'Customer' },
      { action: 'update', subject: 'Customer' }
    ]
  },
};

export const FieldLevelPermissions: Story = {
  args: {
    I: 'update',
    a: 'Customer',
    field: 'name',
    children: <Button>Edit Customer Name</Button>,
    rules: [
      { action: 'update', subject: 'Customer', fields: ['name', 'email'] }
    ]
  },
};

export const NotOperator: Story = {
  args: {
    I: 'delete',
    a: 'Customer',
    not: true,
    children: (
      <Card withBorder p="md" bg="red.0">
        <Text c="red">Delete operation is disabled</Text>
      </Card>
    ),
    rules: [
      { action: 'read', subject: 'Customer' }
    ]
  },
};

export const PassThroughMode: Story = {
  args: {
    I: 'read',
    a: 'Customer',
    passThrough: true,
    children: (isAllowed: boolean) => (
      <Card withBorder p="md" bg={isAllowed ? 'green.0' : 'red.0'}>
        <Text fw={500}>
          {isAllowed ? '✅ You have permission' : '❌ Permission denied'}
        </Text>
      </Card>
    ),
    rules: [
      { action: 'read', subject: 'Customer' }
    ]
  },
};

export const RoleBasedExample: Story = {
  render: () => (
    <Stack>
      <Text fw={500} size="lg">Role: Manager</Text>
      
      <Can I="create" a="Task">
        <Button color="green">Create Task</Button>
      </Can>
      
      <Can I="approve" a="Proposal">
        <Button color="blue">Approve Proposal</Button>
      </Can>
      
      <Can I="manage" a="User">
        <Button color="red">Manage Users</Button>
      </Can>
    </Stack>
  ),
  args: {
    rules: [
      { action: 'create', subject: 'Task' },
      { action: 'read', subject: 'Proposal' },
      { action: 'update', subject: 'Proposal' }
    ]
  },
};