import { Card, Group, Stack, Text, Badge, Progress, Box, Tooltip } from '@mantine/core';
import { IconCalendar, IconUser, IconBriefcase, IconAlertCircle } from '@tabler/icons-react';
import { formatDate } from '@/lib/utils/date';
import type { Engagement } from '../types';

interface EngagementHeaderProps {
  engagement: Engagement;
}

export function EngagementHeader({ engagement }: EngagementHeaderProps) {
  const getStatusColor = (statusCode?: string) => {
    switch (statusCode) {
      case 'not_started': return 'gray';
      case 'active': return 'blue';
      case 'paused': return 'orange';
      case 'completed': return 'green';
      default: return 'gray';
    }
  };

  const getHealthStatus = () => {
    if (!engagement.scheduleVariance) return { color: 'green', label: 'On Track' };
    if (engagement.scheduleVariance > 7) return { color: 'red', label: 'At Risk' };
    if (engagement.scheduleVariance > 0) return { color: 'yellow', label: 'Caution' };
    return { color: 'green', label: 'On Track' };
  };

  const healthStatus = getHealthStatus();
  const isDelayed = engagement.isDelayed || (engagement.scheduleVariance !== undefined && engagement.scheduleVariance > 0);

  return (
    <Card withBorder>
      <Stack>
        <Group justify="space-between" align="flex-start">
          <Box>
            <Text size="xl" fw={700}>{engagement.engagementName}</Text>
            <Text size="sm" c="dimmed">{engagement.engagementCode}</Text>
          </Box>
          <Group>
            <Badge color={getStatusColor(engagement.status?.statusCode)} size="lg">
              {engagement.status?.statusName || 'Unknown'}
            </Badge>
            {isDelayed && (
              <Tooltip label={`Delayed by ${engagement.scheduleVariance} days`}>
                <Badge color="red" variant="light" leftSection={<IconAlertCircle size={14} />}>
                  Delayed
                </Badge>
              </Tooltip>
            )}
            <Badge color={healthStatus.color} variant="outline">
              {healthStatus.label}
            </Badge>
          </Group>
        </Group>

        <Group>
          <Group gap="xs">
            <IconBriefcase size={16} color="var(--mantine-color-dimmed)" />
            <Text size="sm" c="dimmed">Customer:</Text>
            <Text size="sm" fw={500}>{engagement.customer?.customerName || 'N/A'}</Text>
          </Group>
          {engagement.partner && (
            <Group gap="xs">
              <Text size="sm" c="dimmed">Partner:</Text>
              <Text size="sm" fw={500}>{engagement.partner.partnerName}</Text>
            </Group>
          )}
        </Group>

        <Group>
          <Group gap="xs">
            <IconUser size={16} color="var(--mantine-color-dimmed)" />
            <Text size="sm" c="dimmed">Manager:</Text>
            <Text size="sm" fw={500}>
              {engagement.manager ? engagement.manager.name : 'Not Assigned'}
            </Text>
          </Group>
          <Group gap="xs">
            <IconCalendar size={16} color="var(--mantine-color-dimmed)" />
            <Text size="sm" c="dimmed">Timeline:</Text>
            <Text size="sm" fw={500}>
              {formatDate(engagement.startDate) || 'TBD'} - 
              {formatDate(engagement.endDate) || 'TBD'}
            </Text>
          </Group>
        </Group>

        <Box>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Overall Progress</Text>
            <Text size="sm" fw={600}>{engagement.progressPercentage || 0}%</Text>
          </Group>
          <Progress 
            value={engagement.progressPercentage || 0} 
            size="lg" 
            radius="xl"
            color={engagement.progressPercentage >= 75 ? 'green' : engagement.progressPercentage >= 50 ? 'blue' : 'orange'}
          />
        </Box>
      </Stack>
    </Card>
  );
}