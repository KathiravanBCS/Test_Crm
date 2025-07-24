import { Grid, Card, Stack, Text, Group, Timeline, Badge, Box, Divider } from '@mantine/core';
import { IconClock, IconCalendar, IconFlag, IconAlertCircle } from '@tabler/icons-react';
import { formatDate } from '@/lib/utils/date';
import type { Engagement } from '../types';

interface EngagementOverviewProps {
  engagement: Engagement;
}

export function EngagementOverview({ engagement }: EngagementOverviewProps) {
  const formatDateLocal = (date: string | Date | null | undefined): string => {
    return formatDate(date) || 'Not set';
  };

  const calculateDaysLeft = () => {
    if (!engagement.endDate) return null;
    const end = new Date(engagement.endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Stack>
          {/* Timeline Information */}
          <Card withBorder>
            <Stack>
              <Text size="lg" fw={600}>Timeline & Progress</Text>
              <Divider />
              
              <Grid>
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed">Planned Timeline</Text>
                    <Group gap="xs">
                      <IconCalendar size={16} />
                      <Text size="sm" fw={500}>
                        {formatDateLocal(engagement.startDate)} - {formatDateLocal(engagement.endDate)}
                      </Text>
                    </Group>
                  </Stack>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed">Baseline Timeline</Text>
                    <Group gap="xs">
                      <IconFlag size={16} />
                      <Text size="sm" fw={500}>
                        {formatDateLocal(engagement.baselineStartDate)} - {formatDateLocal(engagement.baselineEndDate)}
                      </Text>
                    </Group>
                  </Stack>
                </Grid.Col>

                {engagement.actualStartDate && (
                  <Grid.Col span={6}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed">Actual Timeline</Text>
                      <Group gap="xs">
                        <IconClock size={16} />
                        <Text size="sm" fw={500}>
                          {formatDateLocal(engagement.actualStartDate)} - 
                          {engagement.actualEndDate ? formatDateLocal(engagement.actualEndDate) : 'In Progress'}
                        </Text>
                      </Group>
                    </Stack>
                  </Grid.Col>
                )}

                {engagement.scheduleVariance !== undefined && engagement.scheduleVariance !== 0 && (
                  <Grid.Col span={6}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed">Schedule Variance</Text>
                      <Group gap="xs">
                        <IconAlertCircle size={16} color="var(--mantine-color-red-6)" />
                        <Text size="sm" fw={500} c="red">
                          {Math.abs(engagement.scheduleVariance)} days {engagement.scheduleVariance > 0 ? 'behind' : 'ahead'}
                        </Text>
                      </Group>
                    </Stack>
                  </Grid.Col>
                )}
              </Grid>

              {daysLeft !== null && (
                <Box mt="md" p="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: 'var(--mantine-radius-md)' }}>
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>Time Remaining</Text>
                    <Badge color={daysLeft < 7 ? 'red' : daysLeft < 30 ? 'orange' : 'green'} size="lg">
                      {daysLeft > 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                    </Badge>
                  </Group>
                </Box>
              )}
            </Stack>
          </Card>

          {/* Phase Summary */}
          <Card withBorder>
            <Stack>
              <Text size="lg" fw={600}>Phase Summary</Text>
              <Divider />
              
              {engagement.phases && engagement.phases.length > 0 ? (
                <Timeline active={-1} bulletSize={24} lineWidth={2}>
                  {engagement.phases.map((phase) => (
                    <Timeline.Item
                      key={phase.id}
                      bullet={<IconFlag size={12} />}
                      title={phase.phaseName}
                      color={phase.status?.statusCode === 'completed' ? 'green' : phase.status?.statusCode === 'active' ? 'blue' : 'gray'}
                    >
                      <Text c="dimmed" size="sm">
                        {phase.phaseDescription || 'No description'}
                      </Text>
                      <Group gap="xs" mt="xs">
                        <Badge variant="light" size="sm">
                          {phase.status?.statusName || 'Not Started'}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {phase.progressPercentage || 0}% Complete
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {formatDateLocal(phase.phaseStartDate)} - {formatDateLocal(phase.phaseEndDate)}
                        </Text>
                      </Group>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <Text c="dimmed" ta="center" py="lg">No phases defined yet</Text>
              )}
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack>
          {/* Engagement Letter Info */}
          <Card withBorder>
            <Stack>
              <Text size="md" fw={600}>Engagement Letter</Text>
              <Divider />
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Code:</Text>
                  <Text size="sm">{engagement.engagementLetter?.engagementLetterCode || 'N/A'}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Title:</Text>
                  <Text size="sm">{engagement.engagementLetter?.engagementLetterTitle || 'N/A'}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Approval Date:</Text>
                  <Text size="sm">{formatDateLocal(engagement.engagementLetter?.approvalDate)}</Text>
                </Group>
              </Stack>
            </Stack>
          </Card>

          {/* Key Metrics */}
          <Card withBorder>
            <Stack>
              <Text size="md" fw={600}>Key Metrics</Text>
              <Divider />
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Total Phases:</Text>
                  <Badge variant="light">{engagement.phases?.length || 0}</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Service Items:</Text>
                  <Badge variant="light">
                    {engagement.phases?.reduce((sum, phase) => sum + (phase.serviceItems?.length || 0), 0) || 0}
                  </Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Completion:</Text>
                  <Badge 
                    variant="light" 
                    color={engagement.progressPercentage >= 75 ? 'green' : engagement.progressPercentage >= 50 ? 'blue' : 'orange'}
                  >
                    {engagement.progressPercentage || 0}%
                  </Badge>
                </Group>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}