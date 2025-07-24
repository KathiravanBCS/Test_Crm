import { TextInput, TextInputProps, Text, Group } from '@mantine/core';
import { IconReceipt } from '@tabler/icons-react';

interface GstinInputProps extends TextInputProps {
  showStateInfo?: boolean;
}

// GSTIN validation regex
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

// State codes mapping
const STATE_CODES: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra & Nagar Haveli and Daman & Diu',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh (New)',
  '38': 'Ladakh'
};

export function GstinInput({
  showStateInfo = true,
  label = 'GSTIN',
  placeholder = '22ABCDE1234F1Z5',
  leftSection = <IconReceipt size={16} />,
  description,
  value,
  ...props
}: GstinInputProps) {
  // Extract state code and name for display purposes only
  const displayValue = typeof value === 'string' ? value : '';
  const stateCode = displayValue.substring(0, 2);
  const stateName = STATE_CODES[stateCode];

  // Custom description with state info
  const customDescription = showStateInfo && stateName && displayValue.length >= 2 ? (
    <Group component="span" gap={4}>
      <Text component="span" size="xs" c="dimmed">State:</Text>
      <Text component="span" size="xs" fw={500}>{stateName}</Text>
    </Group>
  ) : description;

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      leftSection={leftSection}
      description={customDescription}
      value={value}
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
export const validateGSTIN = (gstin: string): string | undefined => {
  if (!gstin) return undefined;
  if (!GSTIN_REGEX.test(gstin)) {
    return 'GSTIN must be 15 characters in the correct format';
  }
  
  const stateCode = gstin.substring(0, 2);
  if (!STATE_CODES[stateCode]) {
    return 'Invalid state code in GSTIN';
  }
  
  return undefined;
};

// Helper to extract state from GSTIN
export const getStateFromGSTIN = (gstin: string): { code: string; name: string } | null => {
  if (gstin.length < 2) return null;
  
  const code = gstin.substring(0, 2);
  const name = STATE_CODES[code];
  
  return name ? { code, name } : null;
};