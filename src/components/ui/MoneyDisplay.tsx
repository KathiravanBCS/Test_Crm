import { Text, type TextProps } from '@mantine/core';
import type { CurrencyCode } from '@/types/common';
import { CURRENCY_SYMBOLS } from '@/types/common';

interface MoneyDisplayProps extends Omit<TextProps, 'children'> {
  amount: number;
  currency?: CurrencyCode | string; // Accept both typed and unknown currencies
  showCurrency?: boolean;
  colored?: boolean;                     // Red for negative, green for positive
  decimals?: number;                     // Number of decimal places (default: 2)
  compact?: boolean;                     // Show in compact format (e.g., 1.5M)
}

export function MoneyDisplay({
  amount,
  currency = 'INR',
  showCurrency = true,
  colored = false,
  decimals = 2,
  compact = false,
  ...textProps
}: MoneyDisplayProps) {
  // Format number with proper locale
  const formatNumber = (value: number): string => {
    if (compact && Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (compact && Math.abs(value) >= 100000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formattedAmount = formatNumber(amount);
  
  // Get currency symbol or use currency code if symbol not available
  const currencySymbol = CURRENCY_SYMBOLS[currency as CurrencyCode] || currency;
  
  // Determine display format
  const displayValue = showCurrency
    ? `${currencySymbol}${formattedAmount}`
    : formattedAmount;

  // Determine color
  let color = textProps.c;
  if (colored) {
    if (amount < 0) color = 'red';
    else if (amount > 0) color = 'green';
  }

  return (
    <Text {...textProps} c={color} component="span">
      {displayValue}
    </Text>
  );
}

// Utility function for consistent currency formatting across the app
export function formatCurrency(
  amount: number,
  currency: CurrencyCode | string = 'INR', // Accept both typed and unknown currencies
  options?: {
    showCurrency?: boolean;
    decimals?: number;
    compact?: boolean;
  }
): string {
  const { showCurrency = true, decimals = 2, compact = false } = options || {};
  
  if (compact && Math.abs(amount) >= 1000000) {
    const formatted = `${(amount / 1000000).toFixed(1)}M`;
    const currencySymbol = CURRENCY_SYMBOLS[currency as CurrencyCode] || currency;
    return showCurrency ? `${currencySymbol}${formatted}` : formatted;
  }
  if (compact && Math.abs(amount) >= 100000) {
    const formatted = `${(amount / 1000).toFixed(0)}K`;
    const currencySymbol = CURRENCY_SYMBOLS[currency as CurrencyCode] || currency;
    return showCurrency ? `${currencySymbol}${formatted}` : formatted;
  }
  
  const formatted = amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  const currencySymbol = CURRENCY_SYMBOLS[currency as CurrencyCode] || currency;
  return showCurrency ? `${currencySymbol}${formatted}` : formatted;
}