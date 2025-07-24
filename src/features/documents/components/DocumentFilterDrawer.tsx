import { useState } from 'react';
import {
  Drawer,
  Stack,
  Select,
  MultiSelect,
  Button,
  Group,
  Text,
  Divider,
} from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import { DateField } from '@/components/forms/inputs/DateField';
import { DocumentFilter, DocumentMetadata } from '../types';
import { useGetEmployees } from '@/features/employees/api/useGetEmployees';

interface DocumentFilterDrawerProps {
  opened: boolean;
  onClose: () => void;
  onApply: (filters: DocumentFilter) => void;
  entityType?: DocumentMetadata['entityType'];
}

export function DocumentFilterDrawer({
  opened,
  onClose,
  onApply,
  entityType,
}: DocumentFilterDrawerProps) {
  const { data: employees } = useGetEmployees();
  
  const [filters, setFilters] = useState<DocumentFilter>({
    entityType: entityType,
    status: undefined,
    uploadedBy: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    tags: [],
  });

  const handleApply = () => {
    // Remove undefined values
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : true)) {
        acc[key as keyof DocumentFilter] = value;
      }
      return acc;
    }, {} as DocumentFilter);

    onApply(cleanFilters);
  };

  const handleReset = () => {
    setFilters({
      entityType: entityType,
      status: undefined,
      uploadedBy: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      tags: [],
    });
  };

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'pendingReview', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'archived', label: 'Archived' },
  ];

  const employeeOptions = employees?.map(emp => ({
    value: emp.id.toString(),
    label: `${emp.firstName} ${emp.lastName}`,
  })) || [];

  const commonTags = [
    'Contract',
    'Invoice',
    'Report',
    'Presentation',
    'Email',
    'Legal',
    'Financial',
    'Technical',
    'Meeting Notes',
    'Deliverable',
  ];

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconFilter size={20} />
          <Text fw={600}>Filter Documents</Text>
        </Group>
      }
      position="right"
      size="sm"
    >
      <Stack gap="md">
        <Select
          label="Status"
          placeholder="All statuses"
          data={statusOptions}
          value={filters.status}
          onChange={(value) => setFilters({ ...filters, status: value as any })}
          clearable
        />

        <Select
          label="Uploaded By"
          placeholder="All employees"
          data={employeeOptions}
          searchable
          value={filters.uploadedBy?.toString()}
          onChange={(value) => setFilters({ ...filters, uploadedBy: value ? parseInt(value) : undefined })}
          clearable
        />

        <Divider />

        <DateField
          label="From Date"
          placeholder="Select start date"
          value={filters.dateFrom ? new Date(filters.dateFrom) : null}
          onChange={(value) => setFilters({ ...filters, dateFrom: value?.toISOString() })}
          clearable
        />

        <DateField
          label="To Date"
          placeholder="Select end date"
          value={filters.dateTo ? new Date(filters.dateTo) : null}
          onChange={(value) => setFilters({ ...filters, dateTo: value?.toISOString() })}
          clearable
        />

        <Divider />

        <MultiSelect
          label="Tags"
          placeholder="Select tags"
          data={commonTags}
          value={filters.tags || []}
          onChange={(value) => setFilters({ ...filters, tags: value })}
          searchable
          clearable
        />

        <Divider />

        <Group grow>
          <Button variant="default" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </Group>
      </Stack>
    </Drawer>
  );
}