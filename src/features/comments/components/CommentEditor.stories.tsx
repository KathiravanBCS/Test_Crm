import type { Meta, StoryObj } from '@storybook/react';
import { CommentEditor } from './CommentEditor';
import { fn } from '@storybook/test';

const meta: Meta<typeof CommentEditor> = {
  title: 'Features/Comments/CommentEditor',
  component: CommentEditor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the editor',
    },
    submitLabel: {
      control: 'text',
      description: 'Label for the submit button',
    },
    initialValue: {
      control: 'text',
      description: 'Initial HTML content',
    },
    isCompact: {
      control: 'boolean',
      description: 'Use compact styling (no card wrapper)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: fn(),
    placeholder: 'Add comment...',
    submitLabel: 'Submit',
  },
};

export const WithInitialContent: Story = {
  args: {
    onSubmit: fn(),
    onCancel: fn(),
    initialValue: '<p>This is some <strong>initial content</strong> with <em>formatting</em>.</p>',
    placeholder: 'Add comment...',
    submitLabel: 'Update',
  },
};

export const CompactMode: Story = {
  args: {
    onSubmit: fn(),
    onCancel: fn(),
    placeholder: 'Write a reply...',
    submitLabel: 'Reply',
    isCompact: true,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    onSubmit: fn(),
    placeholder: 'Share your thoughts...',
    submitLabel: 'Post Comment',
  },
};

export const WithCancelButton: Story = {
  args: {
    onSubmit: fn(),
    onCancel: fn(),
    placeholder: 'Add comment...',
    submitLabel: 'Submit',
  },
};