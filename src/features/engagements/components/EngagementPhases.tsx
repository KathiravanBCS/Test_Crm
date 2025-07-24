import { useState } from 'react';
import { 
  Stack, 
  Card, 
  Text, 
  Group, 
  Badge, 
  Progress, 
  Collapse, 
  ActionIcon,
  Box,
  Grid,
  Divider,
  Tooltip,
  Button,
} from '@mantine/core';
import { 
  IconChevronDown, 
  IconChevronRight, 
  IconUser, 
  IconCalendar,
  IconClock,
  IconEdit,
  IconPlus,
} from '@tabler/icons-react';
import { formatDate } from '@/lib/utils/date';
import type { Engagement, EngagementPhase, EngagementServiceItem } from '../types';

interface EngagementPhasesProps {
  engagement: Engagement;
}

export function EngagementPhases({ engagement }: EngagementPhasesProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const togglePhase = (phaseId: number) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  const toggleItem = (itemId: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusColor = (statusCode?: string) => {
    switch (statusCode) {
      case 'not_started': return 'gray';
      case 'active': return 'blue';
      case 'completed': return 'green';
      case 'on_hold': return 'orange';
      default: return 'gray';
    }
  };

  const formatDateLocal = (date?: string): string => {
    return formatDate(date) || 'Not set';
  };

  if (!engagement.phases || engagement.phases.length === 0) {
    return (
      <Card withBorder>
        <Stack align="center" py="xl">
          <Text c="dimmed">No phases defined for this engagement</Text>
          <Button leftSection={<IconPlus size={16} />} variant="light">
            Add Phase
          </Button>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack>
      {engagement.phases.map((phase) => {
        const isExpanded = expandedPhases.has(phase.id);
        
        return (
          <Card key={phase.id} withBorder>
            <Stack>
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap" style={{ flex: 1 }}>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => togglePhase(phase.id)}
                  >
                    {isExpanded ? <IconChevronDown size={20} /> : <IconChevronRight size={20} />}
                  </ActionIcon>
                  <Box style={{ flex: 1 }}>
                    <Group justify="space-between">
                      <Text fw={600} size="lg">{phase.phaseName}</Text>
                      <Group>
                        <Badge color={getStatusColor(phase.status?.statusCode)}>
                          {phase.status?.statusName || 'Not Started'}
                        </Badge>
                        <Tooltip label="Edit Phase">
                          <ActionIcon variant="subtle">
                            <IconEdit size={18} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                    {phase.phaseDescription && (
                      <Text size="sm" c="dimmed" mt={4}>{phase.phaseDescription}</Text>
                    )}
                  </Box>
                </Group>
              </Group>

              <Grid>
                <Grid.Col span={4}>
                  <Group gap="xs">
                    <IconCalendar size={16} color="var(--mantine-color-dimmed)" />
                    <Text size="sm" c="dimmed">Timeline:</Text>
                    <Text size="sm">{formatDateLocal(phase.phaseStartDate)} - {formatDateLocal(phase.phaseEndDate)}</Text>
                  </Group>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Group gap="xs">
                    <IconClock size={16} color="var(--mantine-color-dimmed)" />
                    <Text size="sm" c="dimmed">Service Items:</Text>
                    <Badge variant="light">{phase.serviceItems?.length || 0}</Badge>
                  </Group>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Box>
                    <Group justify="space-between" mb={4}>
                      <Text size="sm" c="dimmed">Progress:</Text>
                      <Text size="sm" fw={600}>{phase.progressPercentage || 0}%</Text>
                    </Group>
                    <Progress value={phase.progressPercentage || 0} size="sm" />
                  </Box>
                </Grid.Col>
              </Grid>

              <Collapse in={isExpanded}>
                <Stack mt="md">
                  <Divider />
                  
                  {/* Service Items */}
                  <Box>
                    <Group justify="space-between" mb="md">
                      <Text fw={600}>Service Items</Text>
                      <Button size="xs" leftSection={<IconPlus size={14} />} variant="light">
                        Add Service Item
                      </Button>
                    </Group>
                    
                    {phase.serviceItems && phase.serviceItems.length > 0 ? (
                      <Stack gap="xs">
                        {phase.serviceItems.map((item) => (
                          <ServiceItemCard
                            key={item.id}
                            item={item}
                            isExpanded={expandedItems.has(item.id)}
                            onToggle={() => toggleItem(item.id)}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Text c="dimmed" ta="center" py="md">No service items in this phase</Text>
                    )}
                  </Box>
                </Stack>
              </Collapse>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}

interface ServiceItemCardProps {
  item: EngagementServiceItem;
  isExpanded: boolean;
  onToggle: () => void;
}

function ServiceItemCard({ item, isExpanded, onToggle }: ServiceItemCardProps) {
  const getStatusColor = (statusCode?: string) => {
    switch (statusCode) {
      case 'not_started': return 'gray';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'blocked': return 'red';
      default: return 'gray';
    }
  };

  const formatDateLocal = (date?: string): string => {
    return formatDate(date) || 'Not set';
  };

  return (
    <Card withBorder p="sm">
      <Stack gap="xs">
        <Group justify="space-between">
          <Group>
            <ActionIcon variant="subtle" size="sm" onClick={onToggle}>
              {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
            </ActionIcon>
            <Box>
              <Text fw={500}>{item.serviceName}</Text>
              {!isExpanded && item.serviceDescription && (
                <Text size="xs" c="dimmed" lineClamp={1}>{item.serviceDescription}</Text>
              )}
            </Box>
          </Group>
          <Badge size="sm" color={getStatusColor(item.status?.statusCode)}>
            {item.status?.statusName || 'Not Started'}
          </Badge>
        </Group>

        {!isExpanded && (
          <Group gap="xl">
            {item.assignedToEmployee && (
              <Group gap="xs">
                <IconUser size={14} color="var(--mantine-color-dimmed)" />
                <Text size="xs" c="dimmed">
                  {item.assignedToEmployee.name}
                </Text>
              </Group>
            )}
            <Group gap="xs">
              <IconCalendar size={14} color="var(--mantine-color-dimmed)" />
              <Text size="xs" c="dimmed">
                {formatDateLocal(item.plannedStartDate)} - {formatDateLocal(item.plannedEndDate)}
              </Text>
            </Group>
            {item.estimatedHours && (
              <Text size="xs" c="dimmed">
                {item.loggedHours || 0}/{item.estimatedHours}h
              </Text>
            )}
          </Group>
        )}

        <Collapse in={isExpanded}>
          <Stack mt="sm" gap="sm">
            <Divider />
            
            {item.serviceDescription && (
              <Box>
                <Text size="sm" fw={500} mb={4}>Description</Text>
                <Text size="sm" c="dimmed">{item.serviceDescription}</Text>
              </Box>
            )}

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} mb={4}>Assigned To</Text>
                <Group gap="xs">
                  <IconUser size={16} />
                  <Text size="sm">
                    {item.assignedToEmployee 
                      ? item.assignedToEmployee.name
                      : 'Unassigned'}
                  </Text>
                </Group>
              </Grid.Col>
              
              <Grid.Col span={6}>
                <Text size="sm" fw={500} mb={4}>Effort Tracking</Text>
                <Text size="sm">
                  {item.loggedHours || 0} / {item.estimatedHours || '?'} hours
                </Text>
                {item.estimatedHours && (
                  <Progress 
                    value={(item.loggedHours || 0) / item.estimatedHours * 100} 
                    size="xs" 
                    mt={4}
                  />
                )}
              </Grid.Col>

              <Grid.Col span={6}>
                <Text size="sm" fw={500} mb={4}>Planned Timeline</Text>
                <Text size="sm">{formatDateLocal(item.plannedStartDate)} - {formatDateLocal(item.plannedEndDate)}</Text>
              </Grid.Col>

              <Grid.Col span={6}>
                <Text size="sm" fw={500} mb={4}>Actual Timeline</Text>
                <Text size="sm">
                  {item.actualStartDate ? formatDateLocal(item.actualStartDate) : 'Not started'} - 
                  {item.actualEndDate ? formatDateLocal(item.actualEndDate) : 'In progress'}
                </Text>
              </Grid.Col>
            </Grid>

            {item.deliveryNotes && (
              <Box>
                <Text size="sm" fw={500} mb={4}>Delivery Notes</Text>
                <Text size="sm" c="dimmed">{item.deliveryNotes}</Text>
              </Box>
            )}

            <Group>
              <Button size="xs" variant="light">View Tasks</Button>
              <Button size="xs" variant="subtle">Edit Service Item</Button>
            </Group>
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  );
}