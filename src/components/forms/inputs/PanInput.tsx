import { TextInput, TextInputProps } from '@mantine/core';
import { IconId } from '@tabler/icons-react';

interface PanInputProps extends TextInputProps {
  // Allow both controlled and uncontrolled usage
}

// PAN validation regex
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export function PanInput({
  label = 'PAN',
  placeholder = 'ABCDE1234F',
  leftSection = <IconId size={16} />,
  ...props
}: PanInputProps) {
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      leftSection={leftSection}
      styles={{
        input: {
          textTransform: 'uppercase',
          fontFamily: 'monospace'
        }
      }}
      {...props}
    />
  );
}

// Validation helper
export const validatePAN = (pan: string): string | undefined => {
  if (!pan) return undefined;
  if (!PAN_REGEX.test(pan)) {
    return 'PAN must be in format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)';
  }
  return undefined;
};