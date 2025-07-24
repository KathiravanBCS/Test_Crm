import { Card, Group, Text, Stack, Badge, ThemeIcon, RingProgress, Center } from '@mantine/core';
import {
  IconFiles,
  IconClock,
  IconCheck,
  IconX,
  IconArchive,
} from '@tabler/icons-react';
import { useGetDocuments } from '../api/useGetDocuments';
import { DocumentMetadata } from '../types';

interface DocumentSummaryWidgetProps {
  entityType: DocumentMetadata['entityType'];
  entityId: number;
  title?: string;
}

export function DocumentSummaryWidget({
  entityType,
  entityId,
  title = 'Document Summary',
}: DocumentSummaryWidgetProps) {
  const { data: documents } = useGetDocuments(entityType, entityId);

  const stats = {
    total: documents?.length || 0,
    pending: documents?.filter(d => d.status === 'pending_review').length || 0,
    approved: documents?.filter(d => d.status === 'approved').length || 0,
    rejected: documents?.filter(d => d.status === 'rejected').length || 0,
    archived: documents?.filter(d => d.status === 'archived').length || 0,
  };

  const approvalRate = stats.total > 0 
    ? Math.round((stats.approved / stats.total) * 100)
    : 0;

  return (
    <Card>
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={600} size="lg">{title}</Text>
          <ThemeIcon variant="light" size="lg">
            <IconFiles size={20} />
          </ThemeIcon>
        </Group>

        <Group grow>
          <Stack gap={4} align="center">
            <Text size="xl" fw={700}>{stats.total}</Text>
            <Text size="xs" c="dimmed">Total Documents</Text>
          </Stack>
          
          <Center>
            <RingProgress
              size={80}
              thickness={8}
              label={
                <Center>
                  <Text size="xs" fw={500}>{approvalRate}%</Text>
                </Center>
              }
              sections={[
                { value: approvalRate, color: 'green' },
              ]}
            />
          </Center>
        </Group>

        <Stack gap="xs">
          <Group justify="space-between">
            <Group gap="xs">
              <ThemeIcon size="xs" variant="light" color="yellow">
                <IconClock size={14} />
              </ThemeIcon>
              <Text size="sm">Pending Review</Text>
            </Group>
            <Badge color="yellow" variant="light">{stats.pending}</Badge>
          </Group>

          <Group justify="space-between">
            <Group gap="xs">
              <ThemeIcon size="xs" variant="light" color="green">
                <IconCheck size={14} />
              </ThemeIcon>
              <Text size="sm">Approved</Text>
            </Group>
            <Badge color="green" variant="light">{stats.approved}</Badge>
          </Group>

          <Group justify="space-between">
            <Group gap="xs">
              <ThemeIcon size="xs" variant="light" color="red">
                <IconX size={14} />
              </ThemeIcon>
              <Text size="sm">Rejected</Text>
            </Group>
            <Badge color="red" variant="light">{stats.rejected}</Badge>
          </Group>

          <Group justify="space-between">
            <Group gap="xs">
              <ThemeIcon size="xs" variant="light" color="gray">
                <IconArchive size={14} />
              </ThemeIcon>
              <Text size="sm">Archived</Text>
            </Group>
            <Badge color="gray" variant="light">{stats.archived}</Badge>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}