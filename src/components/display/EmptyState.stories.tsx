import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { IconInbox, IconSearch, IconPlus } from '@tabler/icons-react';

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No data found',
    description: 'There are no items to display at the moment.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'No customers yet',
    description: 'Start by adding your first customer to the system.',
    action: {
      label: 'Add Customer',
      onClick: () => console.log('Add customer clicked'),
    },
  },
};

export const CustomIcon: Story = {
  args: {
    icon: <IconInbox size={48} />,
    title: 'Your inbox is empty',
    description: 'When you receive new messages, they will appear here.',
  },
};

export const SearchEmpty: Story = {
  args: {
    icon: <IconSearch size={48} />,
    title: 'No results found',
    description: 'Try adjusting your search criteria or filters.',
    action: {
      label: 'Clear Filters',
      onClick: () => console.log('Clear filters'),
      variant: 'outline',
    },
  },
};

export const CreateFirstItem: Story = {
  args: {
    icon: <IconPlus size={48} />,
    title: 'Create your first project',
    description: 'Projects help you organize your work and collaborate with your team.',
    action: {
      label: 'Create Project',
      onClick: () => console.log('Create project'),
      variant: 'filled',
    },
  },
};

export const NoIcon: Story = {
  args: {
    icon: null,
    title: 'Nothing here',
    description: 'This is an empty state without an icon.',
  },
};

export const MinimalHeight: Story = {
  args: {
    title: 'No data',
    height: 200,
  },
  decorators: [
    (Story) => (
      <div style={{ border: '1px dashed #ccc' }}>
        <Story />
      </div>
    ),
  ],
};