import { useState, useEffect } from 'react';
import { NumberInput, Select, Group, Text, Stack } from '@mantine/core';
import type { NumberInputProps } from '@mantine/core';
import { IconCurrencyRupee } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import type { MasterCurrency, MoneyAmount } from '@/types/common';
import { api } from '@/lib/api';

interface CurrencyAmountInputProps extends Omit<NumberInputProps, 'value' | 'onChange'> {
  value?: MoneyAmount;
  onChange?: (value: MoneyAmount) => void;
  currencies?: MasterCurrency[];
  baseCurrency?: string;
  showExchangeRate?: boolean;
  showInrEquivalent?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
}

export function CurrencyAmountInput({
  value = { amount: 0, currencyCode: 'INR' },
  onChange,
  currencies: providedCurrencies,
  baseCurrency = 'INR',
  showExchangeRate = true,
  showInrEquivalent = true,
  label = 'Amount',
  required = false,
  error,
  ...numberInputProps
}: CurrencyAmountInputProps) {
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  
  // Fetch currencies if not provided
  const { data: fetchedCurrencies = [] } = useQuery<MasterCurrency[]>({
    queryKey: ['currencies'],
    queryFn: () => api.masterData.getCurrencies() as Promise<MasterCurrency[]>,
    enabled: !providedCurrencies,
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
  });

  const currencies = providedCurrencies || fetchedCurrencies;
  const selectedCurrency = currencies.find(c => c.code === value.currencyCode);

  // Fetch exchange rate when currency changes
  useEffect(() => {
    if (value.currencyCode === baseCurrency) {
      setExchangeRate(1);
      return;
    }

    if (showExchangeRate || showInrEquivalent) {
      (api.masterData.getExchangeRate(value.currencyCode, baseCurrency) as Promise<number>)
        .then((rate: number) => setExchangeRate(rate))
        .catch(() => setExchangeRate(1));
    }
  }, [value.currencyCode, baseCurrency, showExchangeRate, showInrEquivalent]);

  const handleAmountChange = (amount: number | undefined) => {
    onChange?.({
      ...value,
      amount: amount || 0,
      exchangeRateToInr: value.currencyCode !== 'INR' ? exchangeRate : undefined,
      exchangeRateDate: value.currencyCode !== 'INR' ? new Date() : undefined,
      amountInr: value.currencyCode !== 'INR' ? (amount || 0) * exchangeRate : undefined,
    });
  };

  const handleCurrencyChange = (currencyCode: string | null) => {
    if (!currencyCode) return;
    
    onChange?.({
      ...value,
      currencyCode,
      exchangeRateToInr: undefined,
      exchangeRateDate: undefined,
      amountInr: undefined,
    });
  };

  const currencySelectData = currencies.map(currency => ({
    value: currency.code,
    label: `${currency.symbol} ${currency.code}`,
  }));

  return (
    <Stack gap="xs">
      <Group align="flex-end" gap="xs" grow>
        <Select
          label={label}
          required={required}
          error={error}
          data={currencySelectData}
          value={value.currencyCode}
          onChange={handleCurrencyChange}
          style={{ width: 120 }}
        />
        <NumberInput
          placeholder="0.00"
          value={value.amount}
          onChange={(val) => handleAmountChange(typeof val === 'string' ? parseFloat(val) : val)}
          decimalScale={2}
          fixedDecimalScale={false}
          thousandSeparator=","
          leftSection={selectedCurrency ? selectedCurrency.symbol : undefined}
          {...numberInputProps}
        />
      </Group>

      {showExchangeRate && value.currencyCode !== baseCurrency && exchangeRate !== 1 && (
        <Text size="xs" color="dimmed">
          Exchange Rate: 1 {value.currencyCode} = {exchangeRate.toFixed(4)} {baseCurrency}
        </Text>
      )}

      {showInrEquivalent && value.currencyCode !== 'INR' && exchangeRate > 0 && (
        <Group gap={4}>
          <IconCurrencyRupee size={14} stroke={1.5} />
          <Text size="sm" fw={500}>
            {new Intl.NumberFormat('en-IN').format(value.amount * exchangeRate)} INR
          </Text>
        </Group>
      )}
    </Stack>
  );
}