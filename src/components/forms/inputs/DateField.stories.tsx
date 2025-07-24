import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Stack, Text, Code } from '@mantine/core';
import { IconCalendarEvent } from '@tabler/icons-react';
import { DateField } from './DateField';
import { formatDate } from '@/lib/utils/date';

const meta: Meta<typeof DateField> = {
  title: 'Forms/Inputs/DateField',
  component: DateField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Standardized date input field with consistent formatting and behavior across the application.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'date' },
      description: 'The selected date value',
    },
    onChange: {
      description: 'Callback fired when the date value changes',
    },
    label: {
      control: 'text',
      description: 'Field label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text (defaults to "Select date")',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    description: {
      control: 'text',
      description: 'Helper text below the field',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    minDate: {
      control: { type: 'date' },
      description: 'Minimum selectable date',
    },
    maxDate: {
      control: { type: 'date' },
      description: 'Maximum selectable date',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component to show the value
function DateFieldDemo(props: any) {
  const [value, setValue] = useState<Date | null>(props.value || null);

  return (
    <Stack gap="md" w={300}>
      <DateField
        {...props}
        value={value}
        onChange={(date) => {
          setValue(date);
          props.onChange?.(date);
        }}
      />
      <div>
        <Text size="sm" c="dimmed">Selected value:</Text>
        <Code>{value ? formatDate(value) : 'null'}</Code>
      </div>
    </Stack>
  );
}

export const Default: Story = {
  render: (args) => <DateFieldDemo {...args} />,
  args: {
    label: 'Select Date',
  },
};

export const WithPlaceholder: Story = {
  render: (args) => <DateFieldDemo {...args} />,
  args: {
    label: 'Start Date',
    placeholder: 'Select project start date',
  },
};

export const Required: Story = {
  render: (args) => <DateFieldDemo {...args} />,
  args: {
    label: 'Due Date',
    placeholder: 'Select due date',
    required: true,
  },
};

export const WithError: Story = {
  render: (args) => <DateFieldDemo {...args} />,
  args: {
    label: 'Expiry Date',
    error: 'Expiry date is required',
    required: true,
  },
};

export const WithDescription: Story = {
  render: (args) => <DateFieldDemo {...args} />,
  args: {
    label: 'Proposal Date',
    description: 'Date when the proposal will be sent',
  },
};

export const WithMinMaxDates: Story = {
  render: (args) => <DateFieldDemo {...args} />,
  args: {
    label: 'Appointment Date',
    placeholder: 'Select appointment date',
    minDate: new Date(),
    maxDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    description: 'You can only select dates within the next 3 months',
  },
};

export const Disabled: Story = {
  render: (args) => <DateFieldDemo {...args} />,
  args: {
    label: 'Locked Date',
    value: new Date(),
    disabled: true,
  },
};

export const WithCustomIcon: Story = {
  render: (args) => <DateFieldDemo {...args} />,
  args: {
    label: 'Event Date',
    placeholder: 'Select event date',
    leftSection: <IconCalendarEvent size={16} />,
  },
};

export const PrefilledValue: Story = {
  render: (args) => <DateFieldDemo {...args} />,
  args: {
    label: 'Created Date',
    value: new Date(),
  },
};

export const DateRangeExample: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    return (
      <Stack gap="md" w={300}>
        <DateField
          label="Start Date"
          placeholder="Select start date"
          value={startDate}
          onChange={setStartDate}
          maxDate={endDate || undefined}
          required
        />
        <DateField
          label="End Date"
          placeholder="Select end date"
          value={endDate}
          onChange={setEndDate}
          minDate={startDate || undefined}
          required
          error={startDate && endDate && endDate < startDate ? 'End date must be after start date' : undefined}
        />
        <div>
          <Text size="sm" c="dimmed">Selected range:</Text>
          <Code>
            {startDate && endDate 
              ? `${formatDate(startDate)} - ${formatDate(endDate)}`
              : 'Select both dates'
            }
          </Code>
        </div>
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing how to create a date range with proper validation',
      },
    },
  },
};