import { DateTimePicker, DateTimePickerProps } from '@mantine/dates';
import { IconCalendarTime } from '@tabler/icons-react';
import { DATE_FORMATS } from '@/lib/utils/date';

interface DateTimeFieldProps extends Omit<DateTimePickerProps, 'valueFormat' | 'value' | 'onChange'> {
  // Override to ensure consistent types
  value: Date | null | undefined;
  onChange: (value: Date | null) => void;
  // Allow customization but provide defaults
  leftSection?: React.ReactNode;
  placeholder?: string;
}

/**
 * Standardized datetime field component for consistent datetime selection across the app.
 * 
 * Features:
 * - Default calendar-time icon (customizable via leftSection)
 * - Standardized datetime format display
 * - Type-safe value handling
 * - Customizable placeholder
 * 
 * @example
 * <DateTimeField
 *   label="Meeting Time"
 *   value={meetingTime}
 *   onChange={setMeetingTime}
 *   placeholder="Select meeting time"
 *   minDate={new Date()}
 *   required
 * />
 */
export function DateTimeField({ 
  value, 
  onChange,
  leftSection = <IconCalendarTime size={16} />,
  placeholder = "Select date and time",
  ...props 
}: DateTimeFieldProps) {
  return (
    <DateTimePicker
      leftSection={leftSection}
      valueFormat={DATE_FORMATS.displayTime}
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