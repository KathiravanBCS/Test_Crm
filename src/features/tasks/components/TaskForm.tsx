import { useForm } from '@mantine/form';
import { TextInput, Textarea, Select, NumberInput, Button, Group, Stack, Checkbox } from '@mantine/core';
import { DateTimeField } from '@/components/forms/inputs/DateTimeField';
import { Task } from '../types';
import { useGetTaskStatuses, transformTaskStatus } from '../api/useGetTaskStatuses';
import { useGetEmployees } from '@/features/employees/api/useGetEmployees';

interface TaskFormProps {
  task?: Task;
  initialValues?: Partial<Task>;
  onSubmit: (values: Partial<Task>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TaskForm({ task, initialValues, onSubmit, onCancel, isSubmitting = false }: TaskFormProps) {
  const { data: statusesRaw = [] } = useGetTaskStatuses();
  const { data: employees = [] } = useGetEmployees();
  
  // Transform statuses from API format to expected format
  const statuses = statusesRaw.map(transformTaskStatus);

  const form = useForm({
    initialValues: {
      title: task?.title || initialValues?.title || '',
      description: task?.description || initialValues?.description || '',
      assigned_to: task?.assigned_to || initialValues?.assigned_to || undefined,
      status_id: task?.status_id || initialValues?.status_id || statuses.find(s => s.status_code === 'todo')?.id,
      priority: task?.priority || initialValues?.priority || 'normal',
      due_date: task?.due_date || initialValues?.due_date || '',
      estimated_hours: task?.estimated_hours || initialValues?.estimated_hours || undefined,
      requires_approval: task?.requires_approval || initialValues?.requires_approval || false,
      context_type: task?.context_type || initialValues?.context_type || undefined,
      context_id: task?.context_id || initialValues?.context_id || undefined,
    },

    validate: {
      title: (value) => !value ? 'Title is required' : null,
      assigned_to: (value) => !value ? 'Please assign the task to someone' : null,
      status_id: (value) => !value ? 'Status is required' : null,
      estimated_hours: (value) => value !== undefined && value < 0 ? 'Estimated hours must be positive' : null,
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    onSubmit(values);
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Title"
          placeholder="Enter task title"
          required
          {...form.getInputProps('title')}
        />

        <Textarea
          label="Description"
          placeholder="Enter task description"
          rows={4}
          {...form.getInputProps('description')}
        />

        <Group grow>
          <Select
            label="Assigned To"
            placeholder="Select employee"
            required
            data={employees.map(emp => ({
              value: emp.id.toString(),
              label: emp.name,
            }))}
            value={form.values.assigned_to?.toString()}
            onChange={(value) => form.setFieldValue('assigned_to', value ? parseInt(value) : undefined)}
            error={form.errors.assigned_to}
            searchable
          />

          <Select
            label="Status"
            placeholder="Select status"
            required
            data={statuses.map(status => ({
              value: status.id.toString(),
              label: status.status_name,
            }))}
            value={form.values.status_id?.toString()}
            onChange={(value) => form.setFieldValue('status_id', value ? parseInt(value) : undefined)}
            error={form.errors.status_id}
          />
        </Group>

        <Group grow>
          <Select
            label="Priority"
            placeholder="Select priority"
            required
            data={[
              { value: 'low', label: 'Low' },
              { value: 'normal', label: 'Normal' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
            value={form.values.priority}
            onChange={(value) => form.setFieldValue('priority', value as any)}
          />

          <NumberInput
            label="Estimated Hours"
            placeholder="Enter estimated hours"
            min={0}
            step={0.5}
            decimalScale={1}
            {...form.getInputProps('estimated_hours')}
          />
        </Group>

        <DateTimeField
          label="Due Date"
          placeholder="Select due date and time"
          value={form.values.due_date ? new Date(form.values.due_date) : null}
          onChange={(value) => form.setFieldValue('due_date', value?.toISOString() || '')}
          clearable
        />

        <Checkbox
          label="Requires approval"
          {...form.getInputProps('requires_approval', { type: 'checkbox' })}
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}