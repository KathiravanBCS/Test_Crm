import type { Meta, StoryObj } from '@storybook/react';
import { BranchSelector } from './BranchSelector';

const meta: Meta<typeof BranchSelector> = {
  title: 'Forms/Pickers/BranchSelector',
  component: BranchSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the select field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    description: {
      control: 'text',
      description: 'Helper text to display below the field',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Branch',
    placeholder: 'Select branch',
  },
};

export const Required: Story = {
  args: {
    label: 'Branch',
    placeholder: 'Select branch',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Branch',
    placeholder: 'Select branch',
    error: 'Branch is required',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Branch',
    placeholder: 'Select branch',
    description: 'Select the branch for this record',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Branch',
    placeholder: 'Select branch',
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    label: 'Branch',
    placeholder: 'Select branch',
    value: '1',
  },
};

export const CustomLabel: Story = {
  args: {
    label: 'Company Branch',
    placeholder: 'Choose a branch',
  },
};