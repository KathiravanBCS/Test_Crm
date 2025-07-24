import React, { useMemo } from 'react';
import { Select, Group, Text, Badge } from '@mantine/core';
import type { SelectProps } from '@mantine/core';
import { IconBuilding } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import type { Customer } from '@/features/customers/types';
import type { CustomerType } from '@/types/common';
import { api } from '@/lib/api';

interface CustomerPickerProps extends Omit<SelectProps, 'data' | 'value' | 'onChange'> {
  value?: number | null;
  onChange?: (value: number | null) => void;
  customerTypeFilter?: CustomerType | CustomerType[];
  partnerFilter?: number;
  currencyFilter?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export function CustomerPicker({
  value,
  onChange,
  customerTypeFilter,
  partnerFilter,
  currencyFilter,
  label = 'Customer',
  placeholder = 'Select customer...',
  required = false,
  disabled = false,
  error,
  ...restProps
}: CustomerPickerProps) {
  // Fetch customers
  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ['customers', 'picker'],
    queryFn: () => api.customers.getAll(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Filter customers based on props
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Filter by type
      if (customerTypeFilter) {
        const types = Array.isArray(customerTypeFilter) ? customerTypeFilter : [customerTypeFilter];
        if (!types.includes(customer.customerType)) return false;
      }
      
      // Filter by partner
      if (partnerFilter && customer.partnerId !== partnerFilter) return false;
      
      // Filter by currency
      if (currencyFilter && customer.currencyCode !== currencyFilter) return false;
      
      return true;
    });
  }, [customers, customerTypeFilter, partnerFilter, currencyFilter]);

  // Prepare data for Select
  const selectData = filteredCustomers.map(customer => ({
    value: String(customer.id),
    label: customer.customerName,
  }));

  // Custom render option for Mantine v8
  const renderOption: SelectProps['renderOption'] = ({ option }) => {
    const customer = filteredCustomers.find(c => c.id === Number(option.value));
    if (!customer) return <Text size="sm">{option.label}</Text>;
    
    return (
      <Group wrap="nowrap">
        <IconBuilding size={20} stroke={1.5} />
        <div style={{ flex: 1 }}>
          <Text size="sm">{customer.customerName}</Text>
          <Group gap="xs">
            <Badge size="xs" variant="light" color="gray">
              {customer.customerType.replace('_', ' ')}
            </Badge>
            <Text size="xs" c="dimmed">
              {customer.currencyCode}
            </Text>
          </Group>
        </div>
      </Group>
    );
  };

  return (
    <Select
      label={label}
      placeholder={placeholder}
      required={required}
      disabled={disabled || isLoading}
      error={error}
      data={selectData}
      value={value ? String(value) : null}
      onChange={(val) => onChange?.(val ? Number(val) : null)}
      renderOption={renderOption}
      searchable
      clearable
      maxDropdownHeight={280}
      nothingFoundMessage="No customers found"
      {...restProps}
    />
  );
}