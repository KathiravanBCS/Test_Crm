import type { Meta, StoryObj } from '@storybook/react';
import { MoneyDisplay } from './MoneyDisplay';
import { Stack, Card, Text } from '@mantine/core';
import type { MoneyAmount } from '@/types/common';

const meta: Meta<typeof MoneyDisplay> = {
  title: 'Display/MoneyDisplay',
  component: MoneyDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    amount: 1000,
  },
};

export const WithCurrency: Story = {
  args: {
    amount: 1000,
    currencyCode: 'USD',
  },
};

export const SimpleNumber: Story = {
  render: () => (
    <Stack>
      <MoneyDisplay amount={1000} />
      <MoneyDisplay amount={50000} />
      <MoneyDisplay amount={1234567.89} />
    </Stack>
  ),
};

export const MoneyAmountObject: Story = {
  render: () => {
    const amounts: MoneyAmount[] = [
      { amount: 1000, currencyCode: 'USD' },
      { amount: 2500, currencyCode: 'EUR' },
      { amount: 50000, currencyCode: 'INR' },
      { amount: 100, currencyCode: 'GBP' },
    ];
    
    return (
      <Stack>
        {amounts.map((amt, index) => (
          <MoneyDisplay key={index} amount={amt} />
        ))}
      </Stack>
    );
  },
};

export const WithINRConversion: Story = {
  render: () => {
    const amount: MoneyAmount = {
      amount: 100,
      currencyCode: 'USD',
      amountInr: 8250,
      exchangeRateToInr: 82.5,
    };
    
    return (
      <Stack>
        <MoneyDisplay amount={amount} showInr={true} />
        <MoneyDisplay amount={amount} showInr={false} />
      </Stack>
    );
  },
};

export const FormatOptions: Story = {
  render: () => {
    const amount = 1234567.89;
    
    return (
      <Stack>
        <Card withBorder p="sm">
          <Text size="sm" fw={500} mb="xs">Full Format (Default):</Text>
          <MoneyDisplay amount={amount} format="full" />
        </Card>
        
        <Card withBorder p="sm">
          <Text size="sm" fw={500} mb="xs">Compact Format:</Text>
          <MoneyDisplay amount={amount} format="compact" />
        </Card>
        
        <Card withBorder p="sm">
          <Text size="sm" fw={500} mb="xs">Abbreviated Format:</Text>
          <MoneyDisplay amount={amount} format="abbreviated" />
        </Card>
      </Stack>
    );
  },
};

export const AbbreviatedFormats: Story = {
  render: () => {
    const amounts = [999, 1500, 50000, 250000, 1500000, 25000000];
    
    return (
      <Stack>
        {amounts.map((amount) => (
          <Card key={amount} withBorder p="sm">
            <Text size="xs" c="dimmed">Original: {amount.toLocaleString()}</Text>
            <MoneyDisplay amount={amount} format="abbreviated" />
          </Card>
        ))}
      </Stack>
    );
  },
};

export const DifferentCurrencies: Story = {
  render: () => (
    <Stack>
      <MoneyDisplay amount={1000} currencyCode="INR" />
      <MoneyDisplay amount={1000} currencyCode="USD" />
      <MoneyDisplay amount={1000} currencyCode="EUR" />
      <MoneyDisplay amount={1000} currencyCode="GBP" />
      <MoneyDisplay amount={1000} currencyCode="AED" />
      <MoneyDisplay amount={1000} currencyCode="SGD" />
    </Stack>
  ),
};

export const ShowHideCurrency: Story = {
  render: () => (
    <Stack>
      <Card withBorder p="sm">
        <Text size="sm" fw={500} mb="xs">With Currency (Default):</Text>
        <MoneyDisplay amount={5000} currencyCode="USD" showCurrency={true} />
      </Card>
      
      <Card withBorder p="sm">
        <Text size="sm" fw={500} mb="xs">Without Currency:</Text>
        <MoneyDisplay amount={5000} currencyCode="USD" showCurrency={false} />
      </Card>
    </Stack>
  ),
};

export const TextSizes: Story = {
  render: () => (
    <Stack>
      <MoneyDisplay amount={1000} size="xs" />
      <MoneyDisplay amount={1000} size="sm" />
      <MoneyDisplay amount={1000} size="md" />
      <MoneyDisplay amount={1000} size="lg" />
      <MoneyDisplay amount={1000} size="xl" />
    </Stack>
  ),
};

export const TextColors: Story = {
  render: () => (
    <Stack>
      <MoneyDisplay amount={1000} c="green" />
      <MoneyDisplay amount={-1000} c="red" />
      <MoneyDisplay amount={0} c="gray" />
      <MoneyDisplay amount={1000} c="blue" />
    </Stack>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <Stack>
      <MoneyDisplay amount={1000} fw={400} />
      <MoneyDisplay amount={1000} fw={500} />
      <MoneyDisplay amount={1000} fw={600} />
      <MoneyDisplay amount={1000} fw={700} />
    </Stack>
  ),
};

export const ComplexExample: Story = {
  render: () => {
    const foreignAmount: MoneyAmount = {
      amount: 1500,
      currencyCode: 'EUR',
      amountInr: 135000,
      exchangeRateToInr: 90,
    };
    
    return (
      <Stack>
        <Card withBorder>
          <Stack>
            <Text fw={500}>Invoice Total</Text>
            <MoneyDisplay 
              amount={foreignAmount} 
              showInr={true}
              size="lg"
              fw={600}
            />
          </Stack>
        </Card>
        
        <Card withBorder>
          <Stack>
            <Text fw={500}>Compact View</Text>
            <MoneyDisplay 
              amount={foreignAmount} 
              showInr={true}
              format="abbreviated"
            />
          </Stack>
        </Card>
      </Stack>
    );
  },
};

export const EdgeCases: Story = {
  render: () => (
    <Stack>
      <Card withBorder p="sm">
        <Text size="sm" fw={500} mb="xs">Zero Amount:</Text>
        <MoneyDisplay amount={0} />
      </Card>
      
      <Card withBorder p="sm">
        <Text size="sm" fw={500} mb="xs">Negative Amount:</Text>
        <MoneyDisplay amount={-5000} c="red" />
      </Card>
      
      <Card withBorder p="sm">
        <Text size="sm" fw={500} mb="xs">Very Large Amount:</Text>
        <MoneyDisplay amount={99999999999.99} format="abbreviated" />
      </Card>
      
      <Card withBorder p="sm">
        <Text size="sm" fw={500} mb="xs">Decimal Precision:</Text>
        <MoneyDisplay amount={123.456789} />
      </Card>
    </Stack>
  ),
};