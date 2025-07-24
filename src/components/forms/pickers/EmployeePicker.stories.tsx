import type { Meta, StoryObj } from '@storybook/react';
import { EmployeePicker } from './EmployeePicker';
import { useState } from 'react';
import { Stack, Text, Code } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { EmployeeRole } from '@/types/common';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 60 * 1000,
    },
  },
});

const meta: Meta<typeof EmployeePicker> = {
  title: 'UI/EmployeePicker',
  component: EmployeePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div style={{ minWidth: 400 }}>
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

interface SinglePickerWrapperProps {
  value?: number | null;
  label?: string;
  placeholder?: string;
  roleFilter?: EmployeeRole | EmployeeRole[];
  excludeInactive?: boolean;
  excludeIds?: number[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  maxDropdownHeight?: number;
  description?: string;
}

const SinglePickerWrapper = (props: SinglePickerWrapperProps) => {
  const [value, setValue] = useState<number | null>(props.value || null);
  
  return (
    <Stack>
      <EmployeePicker
        {...props}
        value={value}
        onChange={setValue}
      />
      <div>
        <Text size="sm" fw={500}>Selected Employee ID:</Text>
        <Code>{value || 'None'}</Code>
      </div>
    </Stack>
  );
};

interface MultiPickerWrapperProps extends Omit<SinglePickerWrapperProps, 'value'> {
  value?: number[];
}

const MultiPickerWrapper = (props: MultiPickerWrapperProps) => {
  const [value, setValue] = useState<number[]>(props.value || []);
  
  return (
    <Stack>
      <EmployeePicker
        {...props}
        multiple
        value={value}
        onChange={setValue}
      />
      <div>
        <Text size="sm" fw={500}>Selected Employee IDs:</Text>
        <Code>{value.length > 0 ? value.join(', ') : 'None'}</Code>
      </div>
    </Stack>
  );
};

export const Default: Story = {
  args: {} as never,
  render: () => <SinglePickerWrapper />,
};

export const WithInitialValue: Story = {
  args: {} as never,
  render: () => <SinglePickerWrapper value={1} />,
};

export const MultipleSelection: Story = {
  args: {} as never,
  render: () => <MultiPickerWrapper />,
};

export const MultipleWithInitialValues: Story = {
  args: {} as never,
  render: () => <MultiPickerWrapper value={[1, 3, 5]} />,
};

export const FilterByRole: Story = {
  args: {} as never,
  render: () => (
    <Stack>
      <SinglePickerWrapper
        label="Managers Only"
        roleFilter={"Manager" as EmployeeRole}
      />
      <SinglePickerWrapper
        label="Consultants Only"
        roleFilter={"Consultant" as EmployeeRole}
      />
      <SinglePickerWrapper
        label="Admins Only"
        roleFilter={"Admin" as EmployeeRole}
      />
    </Stack>
  ),
};

export const MultipleRoleFilter: Story = {
  args: {} as never,
  render: () => (
    <SinglePickerWrapper
      label="Managers or Consultants"
      roleFilter={['Manager', 'Consultant'] as EmployeeRole[]}
    />
  ),
};

export const ExcludeInactive: Story = {
  args: {} as never,
  render: () => (
    <Stack>
      <SinglePickerWrapper
        label="Active Employees Only"
        excludeInactive={true}
      />
      <SinglePickerWrapper
        label="All Employees (Including Inactive)"
        excludeInactive={false}
      />
    </Stack>
  ),
};

export const ExcludeSpecificIds: Story = {
  args: {} as never,
  render: () => (
    <SinglePickerWrapper
      label="Exclude Employees 1, 2, and 3"
      excludeIds={[1, 2, 3]}
    />
  ),
};

export const Required: Story = {
  args: {} as never,
  render: () => (
    <SinglePickerWrapper
      label="Employee (Required)"
      required
    />
  ),
};

export const WithError: Story = {
  args: {} as never,
  render: () => (
    <SinglePickerWrapper
      error="Please select an employee"
    />
  ),
};

export const Disabled: Story = {
  args: {} as never,
  render: () => (
    <Stack>
      <SinglePickerWrapper
        label="Disabled Single Select"
        value={1}
        disabled
      />
      <MultiPickerWrapper
        label="Disabled Multi Select"
        value={[1, 2]}
        disabled
      />
    </Stack>
  ),
};

export const CustomLabels: Story = {
  args: {} as never,
  render: () => (
    <Stack>
      <SinglePickerWrapper
        label="Project Manager"
        placeholder="Choose a project manager..."
      />
      <MultiPickerWrapper
        label="Team Members"
        placeholder="Select team members..."
      />
    </Stack>
  ),
};

export const WithDescription: Story = {
  args: {} as never,
  render: () => (
    <SinglePickerWrapper
      label="Task Assignee"
      description="Select the employee responsible for this task"
    />
  ),
};

export const ComplexFiltering: Story = {
  args: {} as never,
  render: () => (
    <MultiPickerWrapper
      label="Active Managers (Excluding ID 1)"
      roleFilter={"Manager" as EmployeeRole}
      excludeInactive={true}
      excludeIds={[1]}
    />
  ),
};

export const LoadingState: Story = {
  args: {} as never,
  render: () => (
    <EmployeePicker
      label="Loading Example"
      value={null}
      onChange={() => {}}
      disabled
      placeholder="Loading employees..."
    />
  ),
};

export const ClearableSelections: Story = {
  args: {} as never,
  render: () => (
    <Stack>
      <SinglePickerWrapper
        label="Clearable Single Select"
        value={1}
        clearable
      />
      <MultiPickerWrapper
        label="Clearable Multi Select"
        value={[1, 2, 3]}
        clearable
      />
    </Stack>
  ),
};

export const SearchableDropdown: Story = {
  args: {} as never,
  render: () => (
    <SinglePickerWrapper
      label="Searchable Employee List"
      searchable
      placeholder="Type to search employees..."
    />
  ),
};

export const MaxDropdownHeight: Story = {
  args: {} as never,
  render: () => (
    <SinglePickerWrapper
      label="Limited Dropdown Height"
      maxDropdownHeight={150}
    />
  ),
};