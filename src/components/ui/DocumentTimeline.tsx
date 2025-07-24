import { Timeline, Text, Group, Badge, Avatar, Paper, Stack } from '@mantine/core';
import { 
  IconFileText, 
  IconSend, 
  IconEye, 
  IconCheck, 
  IconX,
  IconEdit,
  IconClock,
  IconUser
} from '@tabler/icons-react';
import { formatDateTime, formatRelativeTime } from '@/lib/utils/date';

export interface TimelineEvent {
  id: string;
  type: 'created' | 'status_changed' | 'updated' | 'approved' | 'rejected' | 'sent' | 'viewed';
  title: string;
  description?: string;
  timestamp: Date;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: {
    from?: string;
    to?: string;
    fieldName?: string;
    oldValue?: any;
    newValue?: any;
  };
}

interface DocumentTimelineProps {
  events: TimelineEvent[];
  showUser?: boolean;
  compact?: boolean;
}

const eventIcons: Record<TimelineEvent['type'], React.ReactNode> = {
  created: <IconFileText size={16} />,
  status_changed: <IconEdit size={16} />,
  updated: <IconEdit size={16} />,
  approved: <IconCheck size={16} />,
  rejected: <IconX size={16} />,
  sent: <IconSend size={16} />,
  viewed: <IconEye size={16} />
};

const eventColors: Record<TimelineEvent['type'], string> = {
  created: 'blue',
  status_changed: 'cyan',
  updated: 'gray',
  approved: 'green',
  rejected: 'red',
  sent: 'violet',
  viewed: 'orange'
};

export function DocumentTimeline({ events, showUser = true, compact = false }: DocumentTimelineProps) {
  if (events.length === 0) {
    return (
      <Paper p="lg" withBorder>
        <Group justify="center">
          <IconClock size={32} stroke={1.5} style={{ color: 'var(--mantine-color-gray-5)' }} />
          <Text c="dimmed">No activity to display</Text>
        </Group>
      </Paper>
    );
  }

  return (
    <Timeline
      active={events.length}
      bulletSize={compact ? 20 : 24}
      lineWidth={2}
    >
      {events.map((event, index) => (
        <Timeline.Item
          key={event.id}
          bullet={eventIcons[event.type]}
          color={eventColors[event.type]}
          title={
            <Group gap="xs">
              <Text size={compact ? 'sm' : 'md'} fw={500}>
                {event.title}
              </Text>
              {event.metadata?.from && event.metadata?.to && (
                <Group gap={4}>
                  <Badge size="sm" variant="light" color="gray">
                    {event.metadata.from}
                  </Badge>
                  <Text size="xs" c="dimmed">→</Text>
                  <Badge size="sm" variant="filled" color={eventColors[event.type]}>
                    {event.metadata.to}
                  </Badge>
                </Group>
              )}
            </Group>
          }
          lineVariant={index === events.length - 1 ? 'dashed' : 'solid'}
        >
          <Stack gap="xs">
            {event.description && (
              <Text size="sm" c="dimmed" mt={compact ? 2 : 4}>
                {event.description}
              </Text>
            )}
            
            {showUser && event.user && (
              <Group gap="xs" mt={4}>
                <Avatar size="sm" radius="xl" color="blue">
                  {event.user.avatar ? (
                    <img src={event.user.avatar} alt={event.user.name} />
                  ) : (
                    <IconUser size={14} />
                  )}
                </Avatar>
                <Text size="xs" c="dimmed">
                  {event.user.name}
                </Text>
              </Group>
            )}
            
            <Text size="xs" c="dimmed">
              {formatDateTime(event.timestamp)} • {formatRelativeTime(event.timestamp)}
            </Text>
          </Stack>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}