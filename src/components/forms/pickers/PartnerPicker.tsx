import { forwardRef } from 'react';
import { Select, type SelectProps } from '@mantine/core';
import { useGetPartners } from '@/features/partners/api/useGetPartners';

interface PartnerPickerProps extends Omit<SelectProps, 'data' | 'value' | 'onChange'> {
  value?: number | null;
  onChange?: (value: number | null) => void;
}

export const PartnerPicker = forwardRef<HTMLInputElement, PartnerPickerProps>(
  ({ value, onChange, ...props }, ref) => {
    const { data: partners = [], isLoading } = useGetPartners();

    const options = partners.map((partner) => ({
      value: partner.id.toString(),
      label: `${partner.partnerCode} - ${partner.partnerName}`,
    }));

    const handleChange = (val: string | null) => {
      onChange?.(val ? parseInt(val) : null);
    };

    return (
      <Select
        ref={ref}
        data={options}
        value={value?.toString() || null}
        onChange={handleChange}
        searchable
        disabled={isLoading}
        nothingFoundMessage="No partners found"
        {...props}
      />
    );
  }
);

PartnerPicker.displayName = 'PartnerPicker';