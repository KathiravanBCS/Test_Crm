import type { Meta, StoryObj } from '@storybook/react';
import { MoneyDisplay } from './MoneyDisplay';

const meta: Meta<typeof MoneyDisplay> = {
  title: 'UI/MoneyDisplay',
  component: MoneyDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    amount: {
      control: 'number',
      description: 'The amount to display',
    },
    currency: {
      control: 'select',
      options: ['INR', 'USD', 'AED'],
      description: 'Currency type',
    },
    showCurrency: {
      control: 'boolean',
      description: 'Whether to show currency symbol',
    },
    colored: {
      control: 'boolean',
      description: 'Color based on positive/negative value',
    },
    decimals: {
      control: 'number',
      description: 'Number of decimal places',
    },
    compact: {
      control: 'boolean',
      description: 'Show in compact format (1.5M, 100K)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    amount: 125000,
    currency: 'INR',
    showCurrency: true,
  },
};

export const USD: Story = {
  args: {
    amount: 5000,
    currency: 'USD',
    showCurrency: true,
  },
};

export const AED: Story = {
  args: {
    amount: 10000,
    currency: 'AED',
    showCurrency: true,
  },
};

export const Negative: Story = {
  args: {
    amount: -2500,
    currency: 'INR',
    showCurrency: true,
    colored: true,
  },
};

export const Positive: Story = {
  args: {
    amount: 7500,
    currency: 'INR',
    showCurrency: true,
    colored: true,
  },
};

export const Compact: Story = {
  args: {
    amount: 1500000,
    currency: 'INR',
    showCurrency: true,
    compact: true,
  },
};

export const NoDecimals: Story = {
  args: {
    amount: 1234.56,
    currency: 'INR',
    showCurrency: true,
    decimals: 0,
  },
};

export const FourDecimals: Story = {
  args: {
    amount: 1234.5678,
    currency: 'INR',
    showCurrency: true,
    decimals: 4,
  },
};

export const WithoutCurrency: Story = {
  args: {
    amount: 50000,
    showCurrency: false,
  },
};

export const LargeAmount: Story = {
  args: {
    amount: 123456789,
    currency: 'INR',
    showCurrency: true,
  },
};

export const CompactLarge: Story = {
  args: {
    amount: 123456789,
    currency: 'INR',
    showCurrency: true,
    compact: true,
  },
};