import type { Meta, StoryObj } from '@storybook/react';
import { CurrencyAmountInput } from './CurrencyAmountInput';
import { useState } from 'react';
import { Stack, Text, Code } from '@mantine/core';
import type { MoneyAmount, MasterCurrency } from '@/types/common';

const meta: Meta<typeof CurrencyAmountInput> = {
  title: 'UI/CurrencyAmountInput',
  component: CurrencyAmountInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockCurrencies: MasterCurrency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', isBaseCurrency: true },
  { code: 'USD', name: 'US Dollar', symbol: '$', isBaseCurrency: false },
  { code: 'EUR', name: 'Euro', symbol: '€', isBaseCurrency: false },
  { code: 'GBP', name: 'British Pound', symbol: '£', isBaseCurrency: false },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', isBaseCurrency: false },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', isBaseCurrency: false },
];

const CurrencyAmountInputWrapper = (props: any) => {
  const [value, setValue] = useState<MoneyAmount>(props.value || { amount: 0, currencyCode: 'INR' });
  
  return (
    <Stack>
      <CurrencyAmountInput
        {...props}
        value={value}
        onChange={setValue}
        currencies={props.currencies || mockCurrencies}
      />
      <div>
        <Text size="sm" fw={500}>Current Value:</Text>
        <Code block>{JSON.stringify(value, null, 2)}</Code>
      </div>
    </Stack>
  );
};

export const Default: Story = {
  render: () => <CurrencyAmountInputWrapper />,
};

export const WithInitialValue: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      value={{ amount: 1000, currencyCode: 'USD' }}
    />
  ),
};

export const ShowExchangeRate: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      value={{ amount: 100, currencyCode: 'USD' }}
      showExchangeRate={true}
      showInrEquivalent={true}
    />
  ),
};

export const ForeignCurrency: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      value={{ amount: 500, currencyCode: 'EUR' }}
      showExchangeRate={true}
      showInrEquivalent={true}
    />
  ),
};

export const CustomLabel: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      label="Invoice Amount"
      required
      value={{ amount: 25000, currencyCode: 'INR' }}
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      value={{ amount: -100, currencyCode: 'USD' }}
      error="Amount cannot be negative"
    />
  ),
};

export const DisabledState: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      value={{ amount: 5000, currencyCode: 'INR' }}
      disabled
    />
  ),
};

export const NoExchangeDisplay: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      value={{ amount: 1000, currencyCode: 'USD' }}
      showExchangeRate={false}
      showInrEquivalent={false}
    />
  ),
};

export const LimitedCurrencies: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      currencies={[
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', isBaseCurrency: true },
        { code: 'USD', name: 'US Dollar', symbol: '$', isBaseCurrency: false },
      ]}
      value={{ amount: 100, currencyCode: 'USD' }}
    />
  ),
};

export const LargeAmount: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      value={{ amount: 9999999.99, currencyCode: 'INR' }}
    />
  ),
};

export const DecimalPrecision: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      value={{ amount: 123.45, currencyCode: 'USD' }}
      decimalScale={2}
      fixedDecimalScale={true}
    />
  ),
};

export const CustomBaseCurrency: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      value={{ amount: 100, currencyCode: 'INR' }}
      baseCurrency="USD"
      showExchangeRate={true}
    />
  ),
};

export const WithDescription: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      value={{ amount: 1000, currencyCode: 'USD' }}
      description="Enter the total amount including taxes"
    />
  ),
};

export const ReadOnlyAmount: Story = {
  render: () => (
    <CurrencyAmountInputWrapper
      value={{ amount: 5000, currencyCode: 'EUR' }}
      readOnly
    />
  ),
};