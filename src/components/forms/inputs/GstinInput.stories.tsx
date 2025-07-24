import type { Meta, StoryObj } from '@storybook/react';
import { GstinInput, validateGSTIN, getStateFromGSTIN } from './GstinInput';
import { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';

const meta: Meta<typeof GstinInput> = {
  title: 'UI/GstinInput',
  component: GstinInput,
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

const GstinInputWrapper = (props: any) => {
  const [value, setValue] = useState(props.value || '');
  
  return (
    <Stack>
      <GstinInput
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
              <Code>{validateGSTIN(value) || 'Valid'}</Code>
              <Text size="sm" fw={500}>State Info:</Text>
              <Code>{JSON.stringify(getStateFromGSTIN(value), null, 2)}</Code>
            </>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

export const Default: Story = {
  render: () => <GstinInputWrapper />,
};

export const WithInitialValue: Story = {
  render: () => <GstinInputWrapper value="27AABCU9603R1ZM" />,
};

export const ValidGSTINs: Story = {
  render: () => (
    <Stack>
      <GstinInputWrapper
        value="27AABCU9603R1ZM"
        label="Maharashtra GSTIN"
      />
      <GstinInputWrapper
        value="06AAJCS7859Q1ZS"
        label="Haryana GSTIN"
      />
      <GstinInputWrapper
        value="29AAGCB6932D1ZX"
        label="Karnataka GSTIN"
      />
    </Stack>
  ),
};

export const InvalidGSTIN: Story = {
  render: () => <GstinInputWrapper value="INVALID123456789" />,
};

export const ShowStateInfo: Story = {
  render: () => (
    <Stack>
      <GstinInputWrapper
        value="27AABCU9603R1ZM"
        showStateInfo={true}
        label="With State Info (Default)"
      />
      <GstinInputWrapper
        value="27AABCU9603R1ZM"
        showStateInfo={false}
        label="Without State Info"
      />
    </Stack>
  ),
};

export const Required: Story = {
  render: () => (
    <GstinInputWrapper
      label="GSTIN (Required)"
      required
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <GstinInputWrapper
      value="INVALID"
      error="Please enter a valid GSTIN"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <GstinInputWrapper
      value="27AABCU9603R1ZM"
      disabled
    />
  ),
};

export const CustomDescription: Story = {
  render: () => (
    <GstinInputWrapper
      description="Enter your 15-digit GST Identification Number"
    />
  ),
};

export const DifferentStates: Story = {
  render: () => (
    <Stack>
      <Text fw={500} size="lg">GSTIN Examples from Different States:</Text>
      <GstinInputWrapper value="01AMBPG7773M1Z5" label="Jammu & Kashmir" />
      <GstinInputWrapper value="07AAGFF2194N1Z1" label="Delhi" />
      <GstinInputWrapper value="19AABCU9603R1ZM" label="West Bengal" />
      <GstinInputWrapper value="24AAJCS7859Q1ZS" label="Gujarat" />
      <GstinInputWrapper value="32AAGCB6932D1ZX" label="Kerala" />
      <GstinInputWrapper value="33AABCU9603R1ZM" label="Tamil Nadu" />
      <GstinInputWrapper value="36AAJCS7859Q1ZS" label="Telangana" />
      <GstinInputWrapper value="38AAGCB6932D1ZX" label="Ladakh" />
    </Stack>
  ),
};

export const PartialInput: Story = {
  render: () => {
    const [value, setValue] = useState('27');
    
    return (
      <Stack>
        <GstinInput
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          label="Type to see state detection"
        />
        <Text size="sm" c="dimmed">
          Start typing a GSTIN - state info appears after 2 digits
        </Text>
      </Stack>
    );
  },
};

export const Placeholder: Story = {
  render: () => (
    <GstinInputWrapper
      placeholder="22ABCDE1234F1Z5"
    />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <GstinInputWrapper
      value="27AABCU9603R1ZM"
      readOnly
    />
  ),
};

export const WithLabel: Story = {
  render: () => (
    <GstinInputWrapper
      label="GST Identification Number"
      value="27AABCU9603R1ZM"
    />
  ),
};

export const ValidationDemo: Story = {
  render: () => {
    const testCases = [
      { value: '27AABCU9603R1ZM', label: 'Valid GSTIN' },
      { value: '99AABCU9603R1ZM', label: 'Invalid State Code' },
      { value: '27AAAAA9999A9A9', label: 'Invalid Format' },
      { value: '27AABCU9603R1Z', label: 'Too Short' },
      { value: '27AABCU9603R1ZMX', label: 'Too Long' },
      { value: '', label: 'Empty (Valid)' },
    ];
    
    return (
      <Stack>
        {testCases.map((test, index) => (
          <div key={index}>
            <Text size="sm" fw={500} mb={4}>{test.label}:</Text>
            <GstinInput
              value={test.value}
              onChange={() => {}}
              readOnly
            />
          </div>
        ))}
      </Stack>
    );
  },
};