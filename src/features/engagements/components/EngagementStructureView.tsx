import {
  Card,
  Stack,
  Group,
  Text,
  Badge,
  Box,
  Timeline,
  ThemeIcon,
  Progress,
  Tooltip,
  Paper,
  Divider,
} from '@mantine/core';
import {
  IconBriefcase,
  IconListDetails,
  IconFileText,
  IconUser,
  IconCalendar,
  IconCircleCheck,
  IconCircle,
  IconAlertCircle,
} from '@tabler/icons-react';
import { formatDate } from '@/lib/utils/date';
import type { Engagement, EngagementPhase, EngagementServiceItem } from '../types';

// Helper function to safely format dates
function formatDateLocal(date: Date | string | null | undefined): string {
  return formatDateLocal(date) || 'Not set';
}

interface EngagementStructureViewProps {
  engagement: Engagement;
}

export function EngagementStructureView({ engagement }: EngagementStructureViewProps) {
  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <IconCircleCheck size={16} />;
      case 'active':
      case 'in_progress':
        return <IconCircle size={16} />;
      default:
        return <IconAlertCircle size={16} />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'green';
      case 'active':
      case 'in_progress':
        return 'blue';
      case 'not_started':
        return 'gray';
      default:
        return 'orange';
    }
  };

  return (
    <Stack>
      {/* Engagement Header */}
      <Card withBorder>
        <Group justify="space-between">
          <Box>
            <Group>
              <ThemeIcon size="lg" variant="light" color="blue">
                <IconBriefcase size={20} />
              </ThemeIcon>
              <Box>
                <Text fw={500}>{engagement.engagementName}</Text>
                <Text size="sm" c="dimmed">
                  {engagement.engagementCode || 'Draft'}
                </Text>
              </Box>
            </Group>
          </Box>
          <Stack gap="xs" align="flex-end">
            <Badge color={getStatusColor(engagement.status?.statusName)} variant="light">
              {engagement.status?.statusName || 'Not Started'}
            </Badge>
            <Progress value={engagement.progressPercentage} size="sm" w={100} />
          </Stack>
        </Group>

        <Divider my="md" />

        <Group>
          <Box>
            <Text size="xs" c="dimmed">Manager</Text>
            <Group gap="xs">
              <IconUser size={14} />
              <Text size="sm">
                {engagement.manager 
                  ? engagement.manager.name
                  : 'Not assigned'}
              </Text>
            </Group>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">Duration</Text>
            <Group gap="xs">
              <IconCalendar size={14} />
              <Text size="sm">
                {formatDateLocal(engagement.startDate)} - 
                {formatDateLocal(engagement.endDate)}
              </Text>
            </Group>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">Customer</Text>
            <Text size="sm">{engagement.customer?.customerName}</Text>
          </Box>
        </Group>
      </Card>

      {/* Phases Timeline */}
      <Card withBorder>
        <Text fw={500} mb="md">Phases & Service Items</Text>
        
        {engagement.phases && engagement.phases.length > 0 ? (
          <Timeline bulletSize={24} lineWidth={2}>
            {engagement.phases.map((phase, index) => (
              <Timeline.Item
                key={phase.id}
                bullet={
                  <ThemeIcon
                    size={24}
                    variant="light"
                    color={getStatusColor(phase.status?.statusName)}
                  >
                    {getStatusIcon(phase.status?.statusName)}
                  </ThemeIcon>
                }
                title={
                  <Group justify="space-between">
                    <Text fw={500}>{phase.phaseName}</Text>
                    <Badge size="sm" variant="light">
                      {phase.serviceItems?.length || 0} items
                    </Badge>
                  </Group>
                }
              >
                <Paper p="sm" withBorder mt="xs">
                  <Stack gap="xs">
                    {phase.phaseDescription && (
                      <Text size="sm" c="dimmed">{phase.phaseDescription}</Text>
                    )}
                    
                    {(phase.phaseStartDate || phase.phaseEndDate) && (
                      <Group gap="xs">
                        <IconCalendar size={14} color="var(--mantine-color-gray-6)" />
                        <Text size="xs" c="dimmed">
                          {formatDateLocal(phase.phaseStartDate)} - 
                          {formatDateLocal(phase.phaseEndDate)}
                        </Text>
                      </Group>
                    )}

                    {phase.progressPercentage > 0 && (
                      <Progress value={phase.progressPercentage} size="xs" />
                    )}

                    {/* Service Items */}
                    {phase.serviceItems && phase.serviceItems.length > 0 && (
                      <Box mt="xs">
                        <Text size="xs" fw={500} c="dimmed" mb="xs">Service Items:</Text>
                        <Stack gap={4}>
                          {phase.serviceItems.map((item) => (
                            <Group key={item.id} gap="xs">
                              <Box
                                w={8}
                                h={8}
                                style={{
                                  borderRadius: '50%',
                                  backgroundColor: `var(--mantine-color-${getStatusColor(item.status?.statusName)}-6)`,
                                }}
                              />
                              <Text size="xs">{item.serviceName}</Text>
                              {item.assignedToEmployee && (
                                <Tooltip label={`Assigned to ${item.assignedToEmployee.name}`}>
                                  <IconUser size={12} color="var(--mantine-color-gray-6)" />
                                </Tooltip>
                              )}
                            </Group>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Text c="dimmed" ta="center" py="xl">
            No phases created yet
          </Text>
        )}
      </Card>
    </Stack>
  );
}