import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Stack, Text, Code } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { DateTimeField } from './DateTimeField';
import { formatDateTime } from '@/lib/utils/date';

const meta: Meta<typeof DateTimeField> = {
  title: 'Forms/Inputs/DateTimeField',
  component: DateTimeField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Standardized datetime input field for selecting both date and time with consistent formatting.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'date' },
      description: 'The selected datetime value',
    },
    onChange: {
      description: 'Callback fired when the datetime value changes',
    },
    label: {
      control: 'text',
      description: 'Field label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text (defaults to "Select date and time")',
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
      description: 'Minimum selectable datetime',
    },
    maxDate: {
      control: { type: 'date' },
      description: 'Maximum selectable datetime',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component to show the value
function DateTimeFieldDemo(props: any) {
  const [value, setValue] = useState<Date | null>(props.value || null);

  return (
    <Stack gap="md" w={350}>
      <DateTimeField
        {...props}
        value={value}
        onChange={(date) => {
          setValue(date);
          props.onChange?.(date);
        }}
      />
      <div>
        <Text size="sm" c="dimmed">Selected value:</Text>
        <Code>{value ? formatDateTime(value) : 'null'}</Code>
      </div>
      {value && (
        <div>
          <Text size="sm" c="dimmed">ISO format:</Text>
          <Code>{value.toISOString()}</Code>
        </div>
      )}
    </Stack>
  );
}

export const Default: Story = {
  render: (args) => <DateTimeFieldDemo {...args} />,
  args: {
    label: 'Select Date & Time',
  },
};

export const WithPlaceholder: Story = {
  render: (args) => <DateTimeFieldDemo {...args} />,
  args: {
    label: 'Meeting Time',
    placeholder: 'Select meeting date and time',
  },
};

export const Required: Story = {
  render: (args) => <DateTimeFieldDemo {...args} />,
  args: {
    label: 'Appointment',
    placeholder: 'Select appointment time',
    required: true,
  },
};

export const WithError: Story = {
  render: (args) => <DateTimeFieldDemo {...args} />,
  args: {
    label: 'Deadline',
    error: 'Deadline is required',
    required: true,
  },
};

export const WithDescription: Story = {
  render: (args) => <DateTimeFieldDemo {...args} />,
  args: {
    label: 'Schedule Call',
    description: 'Select a time for the conference call',
  },
};

export const WithMinDate: Story = {
  render: (args) => <DateTimeFieldDemo {...args} />,
  args: {
    label: 'Future Event',
    placeholder: 'Select a future date and time',
    minDate: new Date(),
    description: 'You can only select future dates',
  },
};

export const Disabled: Story = {
  render: (args) => <DateTimeFieldDemo {...args} />,
  args: {
    label: 'Locked DateTime',
    value: new Date(),
    disabled: true,
  },
};

export const WithCustomIcon: Story = {
  render: (args) => <DateTimeFieldDemo {...args} />,
  args: {
    label: 'Time Entry',
    placeholder: 'Select time',
    leftSection: <IconClock size={16} />,
  },
};

export const PrefilledValue: Story = {
  render: (args) => <DateTimeFieldDemo {...args} />,
  args: {
    label: 'Last Updated',
    value: new Date(),
  },
};

export const EventSchedulingExample: Story = {
  render: () => {
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);

    // Helper to add hours to a date
    const addHours = (date: Date, hours: number) => {
      const newDate = new Date(date);
      newDate.setHours(newDate.getHours() + hours);
      return newDate;
    };

    return (
      <Stack gap="md" w={350}>
        <DateTimeField
          label="Event Start"
          placeholder="Select start time"
          value={startTime}
          onChange={(date) => {
            setStartTime(date);
            // Auto-set end time to 1 hour later
            if (date && !endTime) {
              setEndTime(addHours(date, 1));
            }
          }}
          required
        />
        <DateTimeField
          label="Event End"
          placeholder="Select end time"
          value={endTime}
          onChange={setEndTime}
          minDate={startTime || undefined}
          required
          error={startTime && endTime && endTime <= startTime ? 'End time must be after start time' : undefined}
        />
        {startTime && endTime && (
          <div>
            <Text size="sm" c="dimmed">Duration:</Text>
            <Code>
              {Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))} minutes
            </Code>
          </div>
        )}
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing event scheduling with automatic end time calculation and validation',
      },
    },
  },
};

export const BusinessHoursExample: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);

    // Helper to check if time is within business hours (9 AM - 6 PM)
    const isBusinessHours = (date: Date) => {
      const hours = date.getHours();
      return hours >= 9 && hours < 18;
    };

    return (
      <Stack gap="md" w={350}>
        <DateTimeField
          label="Schedule Meeting"
          placeholder="Select meeting time"
          value={value}
          onChange={setValue}
          description="Business hours: 9:00 AM - 6:00 PM"
          error={value && !isBusinessHours(value) ? 'Please select a time within business hours' : undefined}
        />
        {value && (
          <div>
            <Text size="sm" fw={500}>
              {isBusinessHours(value) ? '✅ Within business hours' : '❌ Outside business hours'}
            </Text>
          </div>
        )}
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing validation for business hours constraint',
      },
    },
  },
};