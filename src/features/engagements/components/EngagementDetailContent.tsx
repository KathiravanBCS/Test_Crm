import { Stack, Text, Group, Badge, Progress } from '@mantine/core';
import { useGetEngagement } from '../api/useGetEngagement';
import { StatusBadge } from '@/components/display/StatusBadge';
import { InfoField } from '@/components/display/InfoField';
import { formatDate } from '@/lib/utils/date';

interface EngagementDetailContentProps {
  engagementId: number;
}

export function EngagementDetailContent({ engagementId }: EngagementDetailContentProps) {
  const { data: engagement, isLoading } = useGetEngagement(engagementId);

  if (isLoading || !engagement) {
    return <Text>Loading...</Text>;
  }

  const scheduleVariance = engagement.scheduleVariance || 0;
  const varianceColor = scheduleVariance === 0 ? 'green' : scheduleVariance > 0 ? 'red' : 'blue';
  const varianceText = scheduleVariance === 0 ? 'On Track' : 
    scheduleVariance > 0 ? `${scheduleVariance} days late` : 
    `${Math.abs(scheduleVariance)} days early`;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="lg" fw={600}>{engagement.engagementName}</Text>
          <Text size="sm" c="dimmed">{engagement.engagementCode}</Text>
        </div>
        {engagement.status && (
          <StatusBadge status={{
            statusCode: engagement.status.statusCode,
            statusName: engagement.status.statusName
          }} />
        )}
      </Group>

      <div>
        <Text size="sm" fw={500} mb={4}>Progress</Text>
        <Progress value={engagement.progressPercentage} size="lg" />
        <Text size="xs" c="dimmed" mt={4}>{engagement.progressPercentage}% Complete</Text>
      </div>

      <Group gap="xl">
        <InfoField 
          label="Manager" 
          value={engagement.manager ? engagement.manager.name : '—'}
        />
        <Stack gap={4}>
          <Text size="xs" c="dimmed">Schedule Variance</Text>
          <Badge variant="light" color={varianceColor}>
            {varianceText}
          </Badge>
        </Stack>
      </Group>

      <Group gap="xl">
        <InfoField 
          label="Start Date" 
          value={formatDate(engagement.startDate)}
        />
        <InfoField 
          label="End Date" 
          value={formatDate(engagement.endDate)}
        />
      </Group>

      {engagement.customer && (
        <InfoField 
          label="Customer" 
          value={engagement.customer.customerName}
        />
      )}

      {engagement.partner && (
        <InfoField 
          label="Partner" 
          value={engagement.partner.partnerName}
        />
      )}
    </Stack>
  );
}