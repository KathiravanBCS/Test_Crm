import {
  Card,
  Group,
  Text,
  Stack,
  Badge,
  Select,
  NumberInput,
  Textarea,
  Grid,
  Box,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { DateField } from '@/components/forms/inputs/DateField';
import { IconCalendar, IconUser, IconClock, IconNotes } from '@tabler/icons-react';
import type { EngagementServiceItemFormData } from '../types';
import type { EmployeeProfile } from '@/types';

interface ServiceItemCardProps {
  item: EngagementServiceItemFormData;
  onChange: (updates: Partial<EngagementServiceItemFormData>) => void;
  employees: EmployeeProfile[];
  isNotStarted: boolean;
  phaseStartDate?: Date | null;
  phaseEndDate?: Date | null;
  isExpanded?: boolean;
}

export function ServiceItemCard({
  item,
  onChange,
  employees,
  isNotStarted,
  phaseStartDate,
  phaseEndDate,
  isExpanded = false,
}: ServiceItemCardProps) {
  const hasDateIssue = item.plannedStartDate && item.plannedEndDate && 
    item.plannedStartDate > item.plannedEndDate;

  const employeeOptions = employees.map(emp => ({
    value: emp.id.toString(),
    label: emp.name,
  }));

  if (!isExpanded) {
    return (
      <Card withBorder p="sm">
        <Group justify="space-between" wrap="nowrap">
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={500}>{item.serviceName}</Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {item.serviceDescription}
            </Text>
          </Box>
          <Group gap="xs">
            {item.assignedTo && (
              <Badge size="sm" variant="light" color="blue" leftSection={<IconUser size={12} />}>
                Assigned
              </Badge>
            )}
            {item.estimatedHours && (
              <Badge size="sm" variant="light" color="grape" leftSection={<IconClock size={12} />}>
                {item.estimatedHours}h
              </Badge>
            )}
            {(item.plannedStartDate || item.plannedEndDate) && (
              <Badge size="sm" variant="light" color="teal" leftSection={<IconCalendar size={12} />}>
                Scheduled
              </Badge>
            )}
          </Group>
        </Group>
      </Card>
    );
  }

  return (
    <Card withBorder>
      <Stack>
        <Box>
          <Text fw={500}>{item.serviceName}</Text>
          <Text size="sm" c="dimmed">
            {item.serviceDescription}
          </Text>
        </Box>

        <Grid>
          <Grid.Col span={6}>
            <Select
              label="Assigned To"
              placeholder="Select employee"
              data={employeeOptions}
              value={item.assignedTo?.toString() || null}
              onChange={(value) => onChange({ assignedTo: value ? parseInt(value) : undefined })}
              disabled={!isNotStarted}
              leftSection={<IconUser size={16} />}
              searchable
              clearable
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Estimated Hours"
              placeholder="0"
              value={item.estimatedHours || ''}
              onChange={(value) => onChange({ estimatedHours: typeof value === 'number' ? value : undefined })}
              disabled={!isNotStarted}
              leftSection={<IconClock size={16} />}
              min={0}
              step={0.5}
              decimalScale={1}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateField
              label="Planned Start Date"
              value={item.plannedStartDate ? new Date(item.plannedStartDate) : null}
              onChange={(date) => onChange({ plannedStartDate: date })}
              disabled={!isNotStarted}
              minDate={phaseStartDate ? new Date(phaseStartDate) : undefined}
              maxDate={item.plannedEndDate ? new Date(item.plannedEndDate) : phaseEndDate ? new Date(phaseEndDate) : undefined}
              error={hasDateIssue ? 'Start date must be before end date' : undefined}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateField
              label="Planned End Date"
              value={item.plannedEndDate ? new Date(item.plannedEndDate) : null}
              onChange={(date) => onChange({ plannedEndDate: date })}
              disabled={!isNotStarted}
              minDate={item.plannedStartDate ? new Date(item.plannedStartDate) : phaseStartDate ? new Date(phaseStartDate) : undefined}
              maxDate={phaseEndDate ? new Date(phaseEndDate) : undefined}
              error={hasDateIssue ? 'End date must be after start date' : undefined}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Delivery Notes"
              placeholder="Add any notes about delivery requirements"
              value={item.deliveryNotes || ''}
              onChange={(e) => onChange({ deliveryNotes: e.target.value })}
              disabled={!isNotStarted}
              leftSection={<IconNotes size={16} />}
              rows={2}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Card>
  );
}