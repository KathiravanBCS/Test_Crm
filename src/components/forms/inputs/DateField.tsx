import { DatePickerInput, DatePickerInputProps } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { DATE_FORMATS } from '@/lib/utils/date';

interface DateFieldProps extends Omit<DatePickerInputProps, 'valueFormat' | 'value' | 'onChange'> {
  // Override to ensure consistent types
  value: Date | null | undefined;
  onChange: (value: Date | null) => void;
  // Allow customization but provide defaults
  leftSection?: React.ReactNode;
  placeholder?: string;
}

/**
 * Standardized date field component for consistent date selection across the app.
 * 
 * Features:
 * - Default calendar icon (customizable via leftSection)
 * - Standardized date format display
 * - Type-safe value handling
 * - Customizable placeholder
 * 
 * @example
 * <DateField
 *   label="Start Date"
 *   value={startDate}
 *   onChange={setStartDate}
 *   placeholder="Select start date"
 *   minDate={new Date()}
 *   required
 * />
 */
export function DateField({ 
  value, 
  onChange, 
  leftSection = <IconCalendar size={16} />,
  placeholder = "Select date",
  ...props 
}: DateFieldProps) {
  return (
    <DatePickerInput
      leftSection={leftSection}
      valueFormat={DATE_FORMATS.display}
      placeholder={placeholder}
      value={value || null}
      onChange={(dateValue) => {
        // Convert string value to Date object
        if (dateValue) {
          onChange(new Date(dateValue));
        } else {
          onChange(null);
        }
      }}
      {...props}
    />
  );
}