import { useState } from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Badge,
  ActionIcon,
  Avatar,
  Loader,
  Center,
  Alert,
  Card,
  Tooltip
} from '@mantine/core';
import {
  IconCalendar,
  IconExternalLink,
  IconLink,
  IconAlertCircle,
  IconCalendarOff,
  IconVideo,
  IconMapPin,
  IconUsers,
  IconClock
} from '@tabler/icons-react';
import { MeetingListItem } from './types';
import { MeetingDetailDrawer } from './MeetingDetailDrawer';

interface MeetingListProps {
  events: MeetingListItem[];
  loading: boolean;
  error: string | null;
  entityType: string;
  entityId: number;
}

export function MeetingList({ events, loading, error, entityType, entityId }: MeetingListProps) {
  const [selectedEvent, setSelectedEvent] = useState<MeetingListItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleEventClick = (event: MeetingListItem) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  const formatDateTime = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const now = new Date();
    
    const isToday = startDate.toDateString() === now.toDateString();
    const isTomorrow = startDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    let dateLabel = '';
    if (isToday) {
      dateLabel = 'Today';
    } else if (isTomorrow) {
      dateLabel = 'Tomorrow';
    } else {
      dateLabel = startDate.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short' 
      });
    }
    
    const timeLabel = `${startDate.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    })} - ${endDate.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    })}`;

    return { dateLabel, timeLabel };
  };

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  const getStatusBadge = (event: MeetingListItem) => {
    const now = new Date();
    const startDate = new Date(event.start.dateTime);
    const endDate = new Date(event.end.dateTime);

    if (event.isCancelled) {
      return <Badge size="xs" color="red" variant="light">Cancelled</Badge>;
    }
    
    if (now < startDate) {
      return <Badge size="xs" color="blue" variant="light">Upcoming</Badge>;
    } else if (now >= startDate && now <= endDate) {
      return <Badge size="xs" color="green" variant="light">In Progress</Badge>;
    } else {
      return <Badge size="xs" color="gray" variant="light">Completed</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading meetings...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error loading meetings">
        Failed to load calendar events from Outlook. Please try again later.
      </Alert>
    );
  }

  if (events.length === 0) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <IconCalendarOff size={48} stroke={1} style={{ color: 'var(--mantine-color-gray-5)' }} />
          <div style={{ textAlign: 'center' }}>
            <Text fw={500} c="dimmed">No meetings found</Text>
            <Text size="sm" c="dimmed">
              No calendar events found for this entity.
            </Text>
          </div>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <Box style={{ flex: 1, overflow: 'hidden' }}>
        <Stack gap="xs" style={{ height: '100%', overflow: 'auto' }}>
          {events.map((event) => {
            const { dateLabel, timeLabel } = formatDateTime(
              event.start.dateTime, 
              event.end.dateTime
            );
            
            return (
              <Card
                key={event.id}
                p="md"
                radius="sm"
                withBorder
                style={{
                  cursor: 'pointer',
                  backgroundColor: event.isCancelled 
                    ? 'var(--mantine-color-red-0)' 
                    : 'var(--mantine-color-white)',
                  opacity: event.isCancelled ? 0.7 : 1,
                  borderLeft: event.isLinked 
                    ? '3px solid var(--mantine-color-green-6)' 
                    : '3px solid transparent'
                }}
                onClick={() => handleEventClick(event)}
              >
                <Stack gap="sm">
                  {/* Header Row */}
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
                      <Avatar size="sm" color="teal">
                        <IconCalendar size={16} />
                      </Avatar>
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Group gap="xs" align="center" wrap="nowrap">
                          <Text 
                            size="sm" 
                            fw={600}
                            truncate
                            style={{ flex: 1 }}
                          >
                            {event.subject}
                          </Text>
                          {event.isLinked && (
                            <Tooltip label="Linked to CRM">
                              <IconLink size={14} style={{ color: 'var(--mantine-color-green-6)' }} />
                            </Tooltip>
                          )}
                        </Group>
                        <Group gap="xs" align="center">
                          <Text size="xs" c="dimmed">
                            Organized by {event.organizer.emailAddress.name}
                          </Text>
                          {!event.isOrganizer && (
                            <Badge size="xs" variant="light" color="gray">
                              Attendee
                            </Badge>
                          )}
                        </Group>
                      </Box>
                    </Group>
                    
                    <Group gap="xs" align="center">
                      {getStatusBadge(event)}
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="gray"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(event.webLink, '_blank');
                        }}
                      >
                        <IconExternalLink size={14} />
                      </ActionIcon>
                    </Group>
                  </Group>

                  {/* Date and Time */}
                  <Group gap="md" style={{ marginLeft: 40 }}>
                    <Group gap="xs">
                      <IconClock size={14} style={{ color: 'var(--mantine-color-gray-6)' }} />
                      <Text size="xs" fw={500}>{dateLabel}</Text>
                      <Text size="xs" c="dimmed">{timeLabel}</Text>
                      <Text size="xs" c="dimmed">({getDuration(event.start.dateTime, event.end.dateTime)})</Text>
                    </Group>
                  </Group>

                  {/* Location and Meeting Type */}
                  <Group gap="md" style={{ marginLeft: 40 }}>
                    {event.isOnlineMeeting ? (
                      <Group gap="xs">
                        <IconVideo size={14} style={{ color: 'var(--mantine-color-blue-6)' }} />
                        <Text size="xs" c="dimmed">Online Meeting</Text>
                        {event.onlineMeetingProvider && (
                          <Badge size="xs" variant="light">
                            {event.onlineMeetingProvider === 'teamsForBusiness' ? 'Teams' : event.onlineMeetingProvider}
                          </Badge>
                        )}
                      </Group>
                    ) : event.location.displayName ? (
                      <Group gap="xs">
                        <IconMapPin size={14} style={{ color: 'var(--mantine-color-gray-6)' }} />
                        <Text size="xs" c="dimmed" truncate>
                          {event.location.displayName}
                        </Text>
                      </Group>
                    ) : null}
                  </Group>

                  {/* Attendees */}
                  {event.attendees.length > 0 && (
                    <Group gap="xs" style={{ marginLeft: 40 }}>
                      <IconUsers size={14} style={{ color: 'var(--mantine-color-gray-6)' }} />
                      <Text size="xs" c="dimmed">
                        {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                      </Text>
                      <Group gap="xs">
                        {event.attendees.slice(0, 3).map((attendee, index) => (
                          <Tooltip key={index} label={attendee.emailAddress.name}>
                            <Avatar size="xs" color="gray">
                              {getInitials(attendee.emailAddress.name)}
                            </Avatar>
                          </Tooltip>
                        ))}
                        {event.attendees.length > 3 && (
                          <Text size="xs" c="dimmed">
                            +{event.attendees.length - 3} more
                          </Text>
                        )}
                      </Group>
                    </Group>
                  )}

                  {/* Response Status */}
                  {!event.isOrganizer && (
                    <Group gap="xs" style={{ marginLeft: 40 }}>
                      <Text size="xs" c="dimmed">Your response:</Text>
                      <Badge 
                        size="xs" 
                        color={
                          event.responseStatus.response === 'accepted' ? 'green' :
                          event.responseStatus.response === 'declined' ? 'red' :
                          event.responseStatus.response === 'tentativelyAccepted' ? 'yellow' :
                          'gray'
                        }
                        variant="light"
                      >
                        {event.responseStatus.response === 'accepted' ? 'Accepted' :
                         event.responseStatus.response === 'declined' ? 'Declined' :
                         event.responseStatus.response === 'tentativelyAccepted' ? 'Tentative' :
                         'Not Responded'}
                      </Badge>
                    </Group>
                  )}
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </Box>

      <MeetingDetailDrawer
        event={selectedEvent}
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        entityType={entityType}
        entityId={entityId}
      />
    </>
  );
}