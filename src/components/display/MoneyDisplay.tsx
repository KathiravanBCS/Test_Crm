import React from 'react';
import { Text, TextProps, Group, Tooltip } from '@mantine/core';
import { MoneyAmount } from '@/types/common';

interface MoneyDisplayProps extends Omit<TextProps, 'children'> {
  amount: number | MoneyAmount;
  currencyCode?: string;
  showInr?: boolean;
  format?: 'compact' | 'full' | 'abbreviated';
  showCurrency?: boolean;
}

const currencySymbols: Record<string, string> = {
  INR: '₹',
  USD: '$',
  AED: 'د.إ',
  EUR: '€',
  GBP: '£',
  SGD: 'S$'
};

const formatNumber = (value: number, format: 'compact' | 'full' | 'abbreviated' = 'full'): string => {
  switch (format) {
    case 'compact':
      return new Intl.NumberFormat('en-IN', { 
        notation: 'compact',
        maximumFractionDigits: 2 
      }).format(value);
    
    case 'abbreviated':
      if (value >= 10000000) { // 1 crore
        return `${(value / 10000000).toFixed(2)}Cr`;
      } else if (value >= 100000) { // 1 lakh
        return `${(value / 100000).toFixed(2)}L`;
      } else if (value >= 1000) { // 1 thousand
        return `${(value / 1000).toFixed(2)}K`;
      }
      return value.toFixed(2);
    
    case 'full':
    default:
      return new Intl.NumberFormat('en-IN').format(value);
  }
};

export function MoneyDisplay({ 
  amount,
  currencyCode,
  showInr = false,
  format = 'full',
  showCurrency = true,
  size = 'sm',
  ...props 
}: MoneyDisplayProps) {
  // Handle both simple number and MoneyAmount object
  const isMoneyAmount = typeof amount === 'object' && amount !== null;
  const value = isMoneyAmount ? amount.amount : amount;
  const currency = currencyCode || (isMoneyAmount ? amount.currencyCode : 'INR');
  const inrValue = isMoneyAmount ? amount.amountInr : undefined;
  
  const symbol = currencySymbols[currency] || currency;
  const formattedValue = formatNumber(value, format);
  
  const mainDisplay = (
    <Text component="span" size={size} {...props}>
      {showCurrency && `${symbol} `}
      {formattedValue}
      {showCurrency && currency !== 'INR' && ` ${currency}`}
    </Text>
  );

  // Show INR conversion if available and requested
  if (showInr && inrValue && currency !== 'INR') {
    const formattedInr = formatNumber(inrValue, format);
    
    return (
      <Tooltip label={`${currencySymbols.INR} ${formatNumber(inrValue, 'full')} INR`}>
        <Group gap={4} align="baseline">
          {mainDisplay}
          <Text size="xs" color="dimmed">
            ({currencySymbols.INR} {formattedInr})
          </Text>
        </Group>
      </Tooltip>
    );
  }

  return mainDisplay;
}