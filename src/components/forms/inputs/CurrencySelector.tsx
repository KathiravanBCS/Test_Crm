import { forwardRef } from 'react';
import { Select, type SelectProps } from '@mantine/core';
import { useGetCurrencies } from '@/lib/hooks/useGetCurrencies';

interface CurrencySelectorProps extends Omit<SelectProps, 'data' | 'value' | 'onChange'> {
  value?: string | null;
  onChange?: (value: string | null) => void;
}

export const CurrencySelector = forwardRef<HTMLInputElement, CurrencySelectorProps>(
  ({ value, onChange, ...props }, ref) => {
    const { data: currencies = [], isLoading } = useGetCurrencies();

    const options = currencies.map((currency) => ({
      value: currency.code,
      label: `${currency.code} - ${currency.name}`,
    }));

    return (
      <Select
        ref={ref}
        data={options}
        value={value || null}
        onChange={onChange}
        searchable
        disabled={isLoading}
        nothingFoundMessage="No currencies found"
        {...props}
      />
    );
  }
);

CurrencySelector.displayName = 'CurrencySelector';