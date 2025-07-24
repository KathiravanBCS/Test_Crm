import type { Meta, StoryObj } from '@storybook/react';
import { IndianBusinessFields } from './IndianBusinessFields';
import { useState } from 'react';
import { Stack, Card, Text, Code } from '@mantine/core';

const meta: Meta<typeof IndianBusinessFields> = {
  title: 'UI/IndianBusinessFields',
  component: IndianBusinessFields,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: 600 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const IndianBusinessFieldsWrapper = (props: any) => {
  const [pan, setPan] = useState(props.panValue || '');
  const [gstin, setGstin] = useState(props.gstinValue || '');
  const [tan, setTan] = useState(props.tanValue || '');
  
  const panProps = {
    value: pan,
    onChange: setPan,
    ...props.panProps,
  };
  
  const gstinProps = props.showGstin ? {
    value: gstin,
    onChange: setGstin,
    ...props.gstinProps,
  } : undefined;
  
  const tanProps = props.showTan ? {
    value: tan,
    onChange: setTan,
    ...props.tanProps,
  } : undefined;
  
  return (
    <Stack>
      <IndianBusinessFields
        panProps={panProps}
        gstinProps={gstinProps}
        tanProps={tanProps}
      />
      <Card withBorder p="sm">
        <Stack gap="xs">
          <Text size="sm" fw={500}>Values:</Text>
          <Code block>
            {JSON.stringify({
              pan,
              ...(gstinProps && { gstin }),
              ...(tanProps && { tan }),
            }, null, 2)}
          </Code>
        </Stack>
      </Card>
    </Stack>
  );
};

export const Default: Story = {
  render: () => <IndianBusinessFieldsWrapper />,
};

export const AllFields: Story = {
  render: () => (
    <IndianBusinessFieldsWrapper
      showGstin
      showTan
    />
  ),
};

export const PanOnly: Story = {
  render: () => <IndianBusinessFieldsWrapper />,
};

export const PanAndGstin: Story = {
  render: () => (
    <IndianBusinessFieldsWrapper
      showGstin
      panValue="ABCDE1234F"
      gstinValue="27ABCDE1234F1Z5"
    />
  ),
};

export const PanAndTan: Story = {
  render: () => (
    <IndianBusinessFieldsWrapper
      showTan
      panValue="ABCDE1234F"
      tanValue="ABCD12345E"
    />
  ),
};

export const WithInitialValues: Story = {
  render: () => (
    <IndianBusinessFieldsWrapper
      showGstin
      showTan
      panValue="ABCDE1234F"
      gstinValue="27ABCDE1234F1Z5"
      tanValue="ABCD12345E"
    />
  ),
};

export const WithErrors: Story = {
  render: () => (
    <IndianBusinessFieldsWrapper
      showGstin
      showTan
      panProps={{ error: 'Invalid PAN format' }}
      gstinProps={{ error: 'Invalid GSTIN format' }}
      tanProps={{ error: 'Invalid TAN format' }}
    />
  ),
};

export const Required: Story = {
  render: () => (
    <IndianBusinessFieldsWrapper
      showGstin
      showTan
      panProps={{ required: true }}
      gstinProps={{ required: true }}
      tanProps={{ required: true }}
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <IndianBusinessFieldsWrapper
      showGstin
      showTan
      panValue="ABCDE1234F"
      gstinValue="27ABCDE1234F1Z5"
      tanValue="ABCD12345E"
      panProps={{ disabled: true }}
      gstinProps={{ disabled: true }}
      tanProps={{ disabled: true }}
    />
  ),
};

export const CustomLabels: Story = {
  render: () => (
    <IndianBusinessFieldsWrapper
      showGstin
      showTan
      panProps={{ label: 'Company PAN' }}
      gstinProps={{ label: 'Company GSTIN' }}
      tanProps={{ label: 'Company TAN' }}
    />
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <IndianBusinessFieldsWrapper
      showGstin
      showTan
      panProps={{ description: 'Permanent Account Number' }}
      gstinProps={{ description: 'Goods and Services Tax Identification Number' }}
      tanProps={{ description: 'Tax Deduction Account Number' }}
    />
  ),
};

export const ValidationStates: Story = {
  render: () => (
    <Stack>
      <Text fw={500} size="lg">Valid Entries:</Text>
      <IndianBusinessFieldsWrapper
        showGstin
        showTan
        panValue="ABCDE1234F"
        gstinValue="27ABCDE1234F1Z5"
        tanValue="ABCD12345E"
      />
      
      <Text fw={500} size="lg" mt="xl">Invalid Entries:</Text>
      <IndianBusinessFieldsWrapper
        showGstin
        showTan
        panValue="INVALID"
        gstinValue="INVALID123"
        tanValue="INVALID"
      />
    </Stack>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <IndianBusinessFieldsWrapper
      showGstin
      showTan
      panValue="ABCDE1234F"
      gstinValue="27ABCDE1234F1Z5"
      tanValue="ABCD12345E"
      panProps={{ readOnly: true }}
      gstinProps={{ readOnly: true }}
      tanProps={{ readOnly: true }}
    />
  ),
};

export const PartiallyFilled: Story = {
  render: () => (
    <IndianBusinessFieldsWrapper
      showGstin
      showTan
      panValue="ABCDE1234F"
      gstinValue=""
      tanValue=""
    />
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: 800 }}>
      <IndianBusinessFieldsWrapper
        showGstin
        showTan
        panValue="ABCDE1234F"
        gstinValue="27ABCDE1234F1Z5"
        tanValue="ABCD12345E"
      />
    </div>
  ),
};