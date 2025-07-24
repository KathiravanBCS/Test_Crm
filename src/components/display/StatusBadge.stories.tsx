import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'UI/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: {
      statusCode: 'active',
      statusName: 'Active',
    },
  },
};

export const TaskStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <StatusBadge status={{ statusCode: 'todo', statusName: 'To Do' }} context="TASK" />
      <StatusBadge status={{ statusCode: 'in_progress', statusName: 'In Progress' }} context="TASK" />
      <StatusBadge status={{ statusCode: 'review', statusName: 'Review' }} context="TASK" />
      <StatusBadge status={{ statusCode: 'completed', statusName: 'Completed' }} context="TASK" />
      <StatusBadge status={{ statusCode: 'cancelled', statusName: 'Cancelled' }} context="TASK" />
    </div>
  ),
};

export const ProposalStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <StatusBadge status={{ statusCode: 'draft', statusName: 'Draft' }} context="PROPOSAL" />
      <StatusBadge status={{ statusCode: 'sent', statusName: 'Sent' }} context="PROPOSAL" />
      <StatusBadge status={{ statusCode: 'under_review', statusName: 'Under Review' }} context="PROPOSAL" />
      <StatusBadge status={{ statusCode: 'approved', statusName: 'Approved' }} context="PROPOSAL" />
      <StatusBadge status={{ statusCode: 'rejected', statusName: 'Rejected' }} context="PROPOSAL" />
    </div>
  ),
};

export const WithFinalIndicator: Story = {
  args: {
    status: {
      statusCode: 'completed',
      statusName: 'Completed',
      isFinal: true,
    },
    context: 'TASK',
    showFinalIndicator: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <StatusBadge status={{ statusCode: 'active', statusName: 'Active' }} size="xs" />
      <StatusBadge status={{ statusCode: 'active', statusName: 'Active' }} size="sm" />
      <StatusBadge status={{ statusCode: 'active', statusName: 'Active' }} size="md" />
      <StatusBadge status={{ statusCode: 'active', statusName: 'Active' }} size="lg" />
      <StatusBadge status={{ statusCode: 'active', statusName: 'Active' }} size="xl" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <StatusBadge status={{ statusCode: 'active', statusName: 'Active' }} variant="filled" />
      <StatusBadge status={{ statusCode: 'active', statusName: 'Active' }} variant="light" />
      <StatusBadge status={{ statusCode: 'active', statusName: 'Active' }} variant="outline" />
      <StatusBadge status={{ statusCode: 'active', statusName: 'Active' }} variant="dot" />
    </div>
  ),
};