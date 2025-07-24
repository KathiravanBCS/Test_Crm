import type { Meta, StoryObj } from '@storybook/react';
import { CustomerPicker } from './CustomerPicker';
import { useState } from 'react';
import { Stack, Text, Code } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Customer } from '@/types/customer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 60 * 1000,
    },
  },
});

const mockCustomers: Customer[] = [
  {
    id: 1,
    customerCode: 'CUST001',
    customerName: 'ABC Corporation',
    customerType: 'direct',
    customerDescription: 'Leading enterprise solutions provider',
    currencyCode: 'INR',
    pan: 'ABCDE1234F',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    customerCode: 'CUST002',
    customerName: 'XYZ Industries',
    customerType: 'partner_referred',
    customerDescription: 'Industrial manufacturing company',
    partnerId: 1,
    currencyCode: 'USD',
    pan: 'XYZAB5678G',
    gstin: '22XYZAB5678G1Z5',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    customerCode: 'CUST003',
    customerName: 'Tech Solutions Ltd',
    customerType: 'partner_managed',
    customerDescription: 'Technology consulting services',
    partnerId: 1,
    currencyCode: 'USD',
    pan: 'TECHS9012H',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    customerCode: 'CUST004',
    customerName: 'Global Services Inc',
    customerType: 'direct',
    customerDescription: 'International services provider',
    currencyCode: 'EUR',
    pan: 'GLOBL3456I',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    customerCode: 'CUST005',
    customerName: 'Local Traders',
    customerType: 'direct',
    customerDescription: 'Local trading and distribution',
    currencyCode: 'INR',
    pan: 'LOCAL7890J',
    gstin: '27LOCAL7890J1Z5',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const meta: Meta<typeof CustomerPicker> = {
  title: 'UI/CustomerPicker',
  component: CustomerPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div style={{ minWidth: 400 }}>
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const CustomerPickerWrapper = (props: any) => {
  const [value, setValue] = useState<number | null>(props.value || null);
  
  return (
    <Stack>
      <CustomerPicker
        {...props}
        value={value}
        onChange={setValue}
      />
      <div>
        <Text size="sm" fw={500}>Selected Customer ID:</Text>
        <Code>{value || 'None'}</Code>
      </div>
    </Stack>
  );
};

export const Default: Story = {
  render: () => <CustomerPickerWrapper />,
};

export const WithInitialValue: Story = {
  render: () => <CustomerPickerWrapper value={1} />,
};

export const FilterByType: Story = {
  render: () => (
    <Stack>
      <CustomerPickerWrapper
        label="Direct Customers Only"
        customerTypeFilter="direct"
      />
      <CustomerPickerWrapper
        label="Partner Referred Customers"
        customerTypeFilter="partner_referred"
      />
      <CustomerPickerWrapper
        label="Partner Managed Customers"
        customerTypeFilter="partner_managed"
      />
    </Stack>
  ),
};

export const MultipleTypeFilter: Story = {
  render: () => (
    <CustomerPickerWrapper
      label="Direct or Partner Referred"
      customerTypeFilter={['direct', 'partner_referred']}
    />
  ),
};

export const FilterByPartner: Story = {
  render: () => (
    <CustomerPickerWrapper
      label="Customers from Partner 1"
      partnerFilter={1}
    />
  ),
};

export const FilterByCurrency: Story = {
  render: () => (
    <Stack>
      <CustomerPickerWrapper
        label="INR Customers"
        currencyFilter="INR"
      />
      <CustomerPickerWrapper
        label="USD Customers"
        currencyFilter="USD"
      />
    </Stack>
  ),
};

export const CombinedFilters: Story = {
  render: () => (
    <CustomerPickerWrapper
      label="Partner Managed USD Customers"
      customerTypeFilter="partner_managed"
      currencyFilter="USD"
      partnerFilter={1}
    />
  ),
};

export const Required: Story = {
  render: () => (
    <CustomerPickerWrapper
      label="Customer (Required)"
      required
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <CustomerPickerWrapper
      error="Please select a customer"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <CustomerPickerWrapper
      value={1}
      disabled
    />
  ),
};

export const CustomPlaceholder: Story = {
  render: () => (
    <CustomerPickerWrapper
      placeholder="Choose a customer from the list..."
    />
  ),
};

export const LoadingState: Story = {
  render: () => (
    <CustomerPicker
      label="Loading Example"
      value={null}
      onChange={() => {}}
      disabled
      placeholder="Loading customers..."
    />
  ),
};

export const NoMatches: Story = {
  render: () => (
    <CustomerPickerWrapper
      customerTypeFilter="partner_managed"
      currencyFilter="GBP"
      placeholder="No customers match the filters"
    />
  ),
};

export const WithDescription: Story = {
  render: () => (
    <CustomerPickerWrapper
      label="Primary Customer"
      description="Select the main customer for this engagement"
    />
  ),
};