import React, { useMemo } from 'react';
import { Select, SelectProps, Group, Text, Badge } from '@mantine/core';
import { IconBuildingBank } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { Partner } from '@/features/partners/types';
import { mockPartners } from '@/services/mock/data/partners';

interface PartnerPickerProps extends Omit<SelectProps, 'data' | 'value' | 'onChange'> {
  value?: number | null;
  onChange?: (value: number | null) => void;
}

export function PartnerPicker({
  value,
  onChange,
  label = 'Partner',
  placeholder = 'Select partner...',
  required = false,
  disabled = false,
  error,
  ...restProps
}: PartnerPickerProps) {
  // TODO: Replace with actual API call
  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['partners', 'picker'],
    queryFn: async () => mockPartners,
    staleTime: 5 * 60 * 1000,
  });

  // Prepare data for Select
  const selectData = partners.map(partner => ({
    value: String(partner.id),
    label: partner.partnerName,
  }));

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
      searchable
      clearable
      maxDropdownHeight={280}
      nothingFoundMessage="No partners found"
      leftSection={<IconBuildingBank size={16} />}
      {...restProps}
    />
  );
}