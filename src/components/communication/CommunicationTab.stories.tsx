import type { Meta, StoryObj } from '@storybook/react';
import { CommunicationTab } from './CommunicationTab';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

const meta: Meta<typeof CommunicationTab> = {
  title: 'Communication/CommunicationTab',
  component: CommunicationTab,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive communication tab that displays emails and meetings from Outlook 365 via MS Graph API. Provides an Outlook-like interface for viewing and managing communications associated with any CRM entity.',
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div style={{ height: '100vh', padding: '20px' }}>
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    entityType: {
      control: 'select',
      options: ['customer', 'partner', 'proposal', 'engagement', 'task'],
      description: 'The type of entity this communication tab is associated with',
    },
    entityId: {
      control: 'number',
      description: 'The ID of the entity this communication tab is associated with',
    },
    entityName: {
      control: 'text',
      description: 'Optional display name for the entity (shown in header)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    entityType: 'customer',
    entityId: 123,
    entityName: 'ACME Corporation',
  },
};

export const Customer: Story = {
  args: {
    entityType: 'customer',
    entityId: 456,
    entityName: 'Global Tech Solutions Ltd.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Communication tab for a customer entity showing emails and meetings related to the customer.',
      },
    },
  },
};

export const Partner: Story = {
  args: {
    entityType: 'partner',
    entityId: 789,
    entityName: 'Strategic Partners Inc.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Communication tab for a partner entity showing collaborative emails and partnership meetings.',
      },
    },
  },
};

export const Proposal: Story = {
  args: {
    entityType: 'proposal',
    entityId: 101,
    entityName: 'Transfer Pricing Analysis - Q4 2025',
  },
  parameters: {
    docs: {
      description: {
        story: 'Communication tab for a proposal showing discussions and meetings related to the proposal.',
      },
    },
  },
};

export const Engagement: Story = {
  args: {
    entityType: 'engagement',
    entityId: 202,
    entityName: 'OTP Implementation Phase 1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Communication tab for an engagement showing project-related communications.',
      },
    },
  },
};

export const WithoutEntityName: Story = {
  args: {
    entityType: 'customer',
    entityId: 333,
  },
  parameters: {
    docs: {
      description: {
        story: 'Communication tab without an entity name - shows generic header.',
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    entityType: 'customer',
    entityId: 999, // This ID won't have any mock data
    entityName: 'New Customer',
  },
  parameters: {
    docs: {
      description: {
        story: 'Communication tab showing empty state when no communications are found.',
      },
    },
  },
};