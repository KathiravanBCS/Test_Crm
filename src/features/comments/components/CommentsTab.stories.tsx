import type { Meta, StoryObj } from '@storybook/react';
import { CommentsTab } from './CommentsTab';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const meta: Meta<typeof CommentsTab> = {
  title: 'Features/Comments/CommentsTab',
  component: CommentsTab,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });
      
      return (
        <QueryClientProvider client={queryClient}>
          <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
  argTypes: {
    entityType: {
      control: 'select',
      options: ['customer', 'partner', 'proposal', 'engagement', 'engagement_letter', 'invoice', 'task'],
      description: 'Type of entity the comments are for',
    },
    entityId: {
      control: 'number',
      description: 'ID of the entity',
    },
    currentUserId: {
      control: 'number',
      description: 'ID of the current user',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomerComments: Story = {
  args: {
    entityType: 'customer',
    entityId: 1,
    currentUserId: 2,
  },
};

export const PartnerComments: Story = {
  args: {
    entityType: 'partner',
    entityId: 1,
    currentUserId: 2,
  },
};

export const ProposalComments: Story = {
  args: {
    entityType: 'proposal',
    entityId: 1,
    currentUserId: 2,
  },
};

export const EmptyComments: Story = {
  args: {
    entityType: 'customer',
    entityId: 999, // Non-existent entity
    currentUserId: 2,
  },
};

export const AsAdmin: Story = {
  args: {
    entityType: 'customer',
    entityId: 1,
    currentUserId: 1, // Admin user
  },
};

export const Loading: Story = {
  parameters: {
    mockData: {
      delay: 5000, // 5 second delay to show loading state
    },
  },
  args: {
    entityType: 'customer',
    entityId: 1,
    currentUserId: 2,
  },
};

export const Error: Story = {
  parameters: {
    mockData: {
      error: true,
    },
  },
  args: {
    entityType: 'customer',
    entityId: 1,
    currentUserId: 2,
  },
};