import { Stack, Select, MultiSelect, Checkbox, Group, Button } from '@mantine/core';
import { DateInput, DateValue } from '@mantine/dates';
import { IconRefresh } from '@tabler/icons-react';

interface TaskFiltersProps {
  filters: {
    status_id?: string;
    priority?: string;
    assigned_to?: string;
    due_date_start?: DateValue;
    due_date_end?: DateValue;
    has_overdue?: boolean;
    engagement_id?: string;
    phase_id?: string;
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
  statuses: Array<{ id: number; status_name: string }>;
  employees: Array<{ id: number; name: string }>;
  engagements?: Array<{ id: number; engagement_name: string }>;
  phases?: Array<{ id: number; phase_name: string }>;
}

export function TaskFilters({
  filters,
  onFiltersChange,
  onReset,
  statuses,
  employees,
  engagements = [],
  phases = []
}: TaskFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Stack gap="md">
      <Select
        label="Status"
        placeholder="All statuses"
        data={statuses.map(s => ({ value: s.id.toString(), label: s.status_name }))}
        value={filters.status_id || null}
        onChange={(value) => updateFilter('status_id', value)}
        clearable
      />

      <Select
        label="Priority"
        placeholder="All priorities"
        data={[
          { value: 'low', label: 'Low' },
          { value: 'normal', label: 'Normal' },
          { value: 'high', label: 'High' },
          { value: 'urgent', label: 'Urgent' }
        ]}
        value={filters.priority || null}
        onChange={(value) => updateFilter('priority', value)}
        clearable
      />

      <Select
        label="Assignee"
        placeholder="All assignees"
        data={employees.map(e => ({ 
          value: e.id.toString(), 
          label: e.name
        }))}
        value={filters.assigned_to || null}
        onChange={(value) => updateFilter('assigned_to', value)}
        clearable
        searchable
      />

      {engagements.length > 0 && (
        <Select
          label="Engagement"
          placeholder="All engagements"
          data={engagements.map(e => ({ 
            value: e.id.toString(), 
            label: e.engagement_name 
          }))}
          value={filters.engagement_id || null}
          onChange={(value) => updateFilter('engagement_id', value)}
          clearable
          searchable
        />
      )}

      {phases.length > 0 && (
        <Select
          label="Phase"
          placeholder="All phases"
          data={phases.map(p => ({ 
            value: p.id.toString(), 
            label: p.phase_name 
          }))}
          value={filters.phase_id || null}
          onChange={(value) => updateFilter('phase_id', value)}
          clearable
          searchable
        />
      )}

      <Stack gap="xs">
        <DateInput
          label="Due Date Start"
          placeholder="Select start date"
          value={filters.due_date_start}
          onChange={(value) => updateFilter('due_date_start', value)}
          clearable
        />
        <DateInput
          label="Due Date End"
          placeholder="Select end date"
          value={filters.due_date_end}
          onChange={(value) => updateFilter('due_date_end', value)}
          clearable
        />
      </Stack>

      <Checkbox
        label="Show only overdue tasks"
        checked={filters.has_overdue || false}
        onChange={(event) => updateFilter('has_overdue', event.currentTarget.checked)}
      />

      <Group justify="flex-end" mt="lg">
        <Button 
          variant="subtle" 
          leftSection={<IconRefresh size={16} />}
          onClick={onReset}
        >
          Reset Filters
        </Button>
      </Group>
    </Stack>
  );
}