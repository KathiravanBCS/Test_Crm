import type { Meta, StoryObj } from '@storybook/react';
import { PanInput, validatePAN } from './PanInput';
import { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';

const meta: Meta<typeof PanInput> = {
  title: 'UI/PanInput',
  component: PanInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const PanInputWrapper = (props: any) => {
  const [value, setValue] = useState(props.value || '');
  
  return (
    <Stack>
      <PanInput
        {...props}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <Card withBorder p="sm">
        <Stack gap="xs">
          <Text size="sm" fw={500}>Value:</Text>
          <Code>{value || 'Empty'}</Code>
          {value && (
            <>
              <Text size="sm" fw={500}>Validation:</Text>
              <Code>{validatePAN(value) || 'Valid'}</Code>
              <Text size="sm" fw={500}>Format Check:</Text>
              <Code>{/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value) ? 'Valid Format' : 'Invalid Format'}</Code>
            </>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

export const Default: Story = {
  render: () => <PanInputWrapper />,
};

export const WithInitialValue: Story = {
  render: () => <PanInputWrapper value="ABCDE1234F" />,
};

export const ValidPANs: Story = {
  render: () => (
    <Stack>
      <PanInputWrapper value="ABCDE1234F" label="Individual PAN" />
      <PanInputWrapper value="XYZAB5678G" label="Company PAN" />
      <PanInputWrapper value="PQRST9012H" label="Trust PAN" />
    </Stack>
  ),
};

export const InvalidPAN: Story = {
  render: () => <PanInputWrapper value="INVALID123" />,
};

export const Required: Story = {
  render: () => (
    <PanInputWrapper
      label="PAN (Required)"
      required
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <PanInputWrapper
      value="INVALID"
      error="Please enter a valid PAN"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <PanInputWrapper
      value="ABCDE1234F"
      disabled
    />
  ),
};

export const CustomLabel: Story = {
  render: () => (
    <PanInputWrapper
      label="Company PAN Number"
    />
  ),
};

export const WithDescription: Story = {
  render: () => (
    <PanInputWrapper
      description="Enter your 10-character Permanent Account Number"
    />
  ),
};

export const PartialInput: Story = {
  render: () => {
    const [value, setValue] = useState('ABCDE');
    
    return (
      <Stack>
        <PanInput
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          label="Type to see validation"
        />
        <Text size="sm" c="dimmed">
          Keep typing - validation appears after blur
        </Text>
      </Stack>
    );
  },
};

export const PlaceholderVariations: Story = {
  render: () => (
    <Stack>
      <PanInputWrapper placeholder="ABCDE1234F" />
      <PanInputWrapper placeholder="Enter PAN" />
      <PanInputWrapper placeholder="XXXXX9999X" />
    </Stack>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <PanInputWrapper
      value="ABCDE1234F"
      readOnly
    />
  ),
};

export const ValidationDemo: Story = {
  render: () => {
    const testCases = [
      { value: 'ABCDE1234F', label: 'Valid PAN' },
      { value: 'abcde1234f', label: 'Lowercase (will be converted)' },
      { value: 'ABCDE1234', label: 'Too Short' },
      { value: 'ABCDE1234FG', label: 'Too Long' },
      { value: '12345ABCDE', label: 'Wrong Format' },
      { value: 'ABCD12345F', label: 'Wrong Pattern' },
      { value: '', label: 'Empty (Valid)' },
    ];
    
    return (
      <Stack>
        {testCases.map((test, index) => (
          <div key={index}>
            <Text size="sm" fw={500} mb={4}>{test.label}:</Text>
            <PanInputWrapper value={test.value} />
          </div>
        ))}
      </Stack>
    );
  },
};

export const WithIcons: Story = {
  render: () => (
    <Stack>
      <PanInputWrapper
        label="With Default Icon"
      />
      <PanInputWrapper
        label="Without Icon"
        leftSection={null}
      />
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack>
      <PanInputWrapper size="xs" label="Extra Small" />
      <PanInputWrapper size="sm" label="Small" />
      <PanInputWrapper size="md" label="Medium (Default)" />
      <PanInputWrapper size="lg" label="Large" />
      <PanInputWrapper size="xl" label="Extra Large" />
    </Stack>
  ),
};

export const RealWorldExample: Story = {
  render: () => {
    const [pan, setPan] = useState('');
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = () => {
      const error = validatePAN(pan);
      if (!error && pan) {
        setSubmitted(true);
      }
    };
    
    return (
      <Stack>
        <PanInput
          value={pan}
          onChange={(e) => setPan(e.currentTarget.value)}
          label="Enter your PAN"
          required
          error={submitted && validatePAN(pan)}
        />
        <button onClick={handleSubmit}>Submit</button>
        {submitted && !validatePAN(pan) && pan && (
          <Card withBorder p="sm" bg="green.0">
            <Text c="green" size="sm">PAN submitted successfully!</Text>
          </Card>
        )}
      </Stack>
    );
  },
};