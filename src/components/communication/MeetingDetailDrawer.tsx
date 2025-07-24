import {
  Drawer,
  Stack,
  Group,
  Text,
  Badge,
  Avatar,
  Divider,
  Button,
  ScrollArea,
  Card,
  Tooltip,
  Alert,
  Box
} from '@mantine/core';
import {
  IconExternalLink,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconVideo,
  IconUsers,
  IconLink,
  IconUnlink,
  IconInfoCircle,
  IconCheck,
  IconMinus,
  IconX as IconXMark,
  IconQuestionMark
} from '@tabler/icons-react';
import { MeetingListItem } from './types';

interface MeetingDetailDrawerProps {
  event: MeetingListItem | null;
  opened: boolean;
  onClose: () => void;
  entityType: string;
  entityId: number;
}

export function MeetingDetailDrawer({ 
  event, 
  opened, 
  onClose, 
  entityType, 
  entityId 
}: MeetingDetailDrawerProps) {
  if (!event) return null;

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return minutes > 0 ? `${hours} hours ${minutes} minutes` : `${hours} hours`;
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

  const getResponseIcon = (response: string) => {
    switch (response) {
      case 'accepted':
        return <IconCheck size={16} style={{ color: 'var(--mantine-color-green-6)' }} />;
      case 'declined':
        return <IconXMark size={16} style={{ color: 'var(--mantine-color-red-6)' }} />;
      case 'tentativelyAccepted':
        return <IconMinus size={16} style={{ color: 'var(--mantine-color-yellow-6)' }} />;
      case 'organizer':
        return <IconUsers size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />;
      default:
        return <IconQuestionMark size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />;
    }
  };

  const getResponseText = (response: string) => {
    switch (response) {
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      case 'tentativelyAccepted':
        return 'Tentative';
      case 'organizer':
        return 'Organizer';
      default:
        return 'Not Responded';
    }
  };

  const handleLinkToCRM = () => {
    console.log('Linking meeting to CRM:', { event: event.id, entityType, entityId });
  };

  const handleUnlinkFromCRM = () => {
    console.log('Unlinking meeting from CRM:', { event: event.id, entityType, entityId });
  };

  const renderEventContent = () => {
    if (event.body.contentType === 'html') {
      return (
        <Box 
          dangerouslySetInnerHTML={{ __html: event.body.content }}
          style={{
            '& img': { maxWidth: '100%', height: 'auto' },
            '& table': { maxWidth: '100%', overflowX: 'auto' },
            '& a': { color: 'var(--mantine-color-blue-6)' }
          }}
        />
      );
    } else {
      return (
        <Text style={{ whiteSpace: 'pre-wrap' }}>
          {event.body.content}
        </Text>
      );
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      title={
        <Group gap="sm">
          <IconCalendar size={20} />
          <Text fw={600}>Meeting Details</Text>
        </Group>
      }
      padding="md"
    >
      <Stack gap="md" h="100%">
        {/* Meeting Header */}
        <Card withBorder p="md">
          <Stack gap="sm">
            {/* Subject and Status */}
            <Group justify="space-between" align="flex-start">
              <Text size="lg" fw={600} style={{ flex: 1 }}>
                {event.subject}
              </Text>
              <Group gap="xs">
                {event.isCancelled ? (
                  <Badge size="sm" color="red" variant="light">Cancelled</Badge>
                ) : (
                  <Badge 
                    size="sm" 
                    color={
                      new Date() < new Date(event.start.dateTime) ? 'blue' :
                      new Date() <= new Date(event.end.dateTime) ? 'green' : 'gray'
                    } 
                    variant="light"
                  >
                    {new Date() < new Date(event.start.dateTime) ? 'Upcoming' :
                     new Date() <= new Date(event.end.dateTime) ? 'In Progress' : 'Completed'}
                  </Badge>
                )}
              </Group>
            </Group>

            {/* Organizer */}
            <Group gap="sm">
              <Avatar size="md" color="teal">
                {getInitials(event.organizer.emailAddress.name)}
              </Avatar>
              <div style={{ flex: 1 }}>
                <Group gap="xs" align="center">
                  <Text fw={500}>{event.organizer.emailAddress.name}</Text>
                  <Badge size="xs" color="blue" variant="light">Organizer</Badge>
                  {event.isLinked && (
                    <Tooltip label="Linked to CRM">
                      <IconLink size={14} style={{ color: 'var(--mantine-color-green-6)' }} />
                    </Tooltip>
                  )}
                </Group>
                <Text size="sm" c="dimmed">{event.organizer.emailAddress.address}</Text>
              </div>
            </Group>

            {/* Date and Time */}
            <Group gap="sm">
              <IconClock size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
              <div>
                <Text size="sm" fw={500}>
                  {formatDateTime(event.start.dateTime)}
                </Text>
                <Text size="xs" c="dimmed">
                  Duration: {getDuration(event.start.dateTime, event.end.dateTime)}
                </Text>
              </div>
            </Group>

            {/* Location */}
            <Group gap="sm">
              {event.isOnlineMeeting ? (
                <>
                  <IconVideo size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />
                  <div>
                    <Text size="sm" fw={500}>Online Meeting</Text>
                    {event.onlineMeetingProvider && (
                      <Badge size="xs" variant="light" color="blue">
                        {event.onlineMeetingProvider === 'teamsForBusiness' ? 'Microsoft Teams' : event.onlineMeetingProvider}
                      </Badge>
                    )}
                  </div>
                </>
              ) : event.location.displayName ? (
                <>
                  <IconMapPin size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                  <div>
                    <Text size="sm" fw={500}>{event.location.displayName}</Text>
                    {event.location.address && (
                      <Text size="xs" c="dimmed">
                        {event.location.address.street}, {event.location.address.city}
                      </Text>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <IconMapPin size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                  <Text size="sm" c="dimmed">No location specified</Text>
                </>
              )}
            </Group>

            {/* CRM Link Status */}
            {event.isLinked ? (
              <Alert 
                icon={<IconInfoCircle size={16} />} 
                color="green" 
                variant="light"
                style={{ padding: '8px 12px' }}
              >
                <Group justify="space-between" align="center">
                  <Text size="sm">This meeting is linked to the current record</Text>
                  <Button 
                    size="xs" 
                    variant="light" 
                    color="red"
                    leftSection={<IconUnlink size={14} />}
                    onClick={handleUnlinkFromCRM}
                  >
                    Unlink
                  </Button>
                </Group>
              </Alert>
            ) : (
              <Alert 
                icon={<IconInfoCircle size={16} />} 
                color="yellow" 
                variant="light"
                style={{ padding: '8px 12px' }}
              >
                <Group justify="space-between" align="center">
                  <Text size="sm">This meeting is not linked to the current record</Text>
                  <Button 
                    size="xs" 
                    variant="light"
                    leftSection={<IconLink size={14} />}
                    onClick={handleLinkToCRM}
                  >
                    Link to CRM
                  </Button>
                </Group>
              </Alert>
            )}
          </Stack>
        </Card>

        {/* Actions */}
        <Group>
          {event.isOnlineMeeting && event.onlineMeetingUrl && (
            <Button 
              variant="filled" 
              leftSection={<IconVideo size={16} />}
              onClick={() => window.open(event.onlineMeetingUrl, '_blank')}
            >
              Join Meeting
            </Button>
          )}
          <Button 
            variant="outline" 
            leftSection={<IconExternalLink size={16} />}
            onClick={() => window.open(event.webLink, '_blank')}
          >
            Open in Outlook
          </Button>
        </Group>

        <Divider />

        {/* Attendees */}
        {event.attendees.length > 0 && (
          <Card withBorder p="md">
            <Text fw={500} mb="sm">
              Attendees ({event.attendees.length})
            </Text>
            <Stack gap="sm">
              {event.attendees.map((attendee, index) => (
                <Group key={index} gap="sm">
                  <Avatar size="sm" color="gray">
                    {getInitials(attendee.emailAddress.name)}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Group gap="xs" align="center">
                      <Text size="sm" fw={500}>{attendee.emailAddress.name}</Text>
                      {attendee.type === 'required' && (
                        <Badge size="xs" color="blue" variant="light">Required</Badge>
                      )}
                      {attendee.type === 'optional' && (
                        <Badge size="xs" color="gray" variant="light">Optional</Badge>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed">{attendee.emailAddress.address}</Text>
                  </div>
                  <Group gap="xs" align="center">
                    {getResponseIcon(attendee.status.response)}
                    <Text size="xs" c="dimmed">
                      {getResponseText(attendee.status.response)}
                    </Text>
                  </Group>
                </Group>
              ))}
            </Stack>
          </Card>
        )}

        {/* Meeting Content/Description */}
        {event.body.content && (
          <Card withBorder style={{ flex: 1 }}>
            <Text fw={500} mb="sm">Description</Text>
            <ScrollArea h="100%" style={{ flex: 1 }}>
              <Box>
                {renderEventContent()}
              </Box>
            </ScrollArea>
          </Card>
        )}

        {/* Meeting Details */}
        <Card withBorder p="md">
          <Text fw={500} mb="sm">Meeting Details</Text>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Sensitivity:</Text>
              <Badge size="xs" variant="light">
                {event.sensitivity.charAt(0).toUpperCase() + event.sensitivity.slice(1)}
              </Badge>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Show as:</Text>
              <Badge size="xs" variant="light">
                {event.showAs.charAt(0).toUpperCase() + event.showAs.slice(1)}
              </Badge>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Meeting type:</Text>
              <Badge size="xs" variant="light">
                {event.type === 'singleInstance' ? 'Single Instance' : 
                 event.type === 'occurrence' ? 'Recurring Occurrence' :
                 event.type === 'exception' ? 'Exception' : 'Series Master'}
              </Badge>
            </Group>
            {event.recurrence && (
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Recurrence:</Text>
                <Badge size="xs" variant="light">
                  {event.recurrence.pattern.type.charAt(0).toUpperCase() + event.recurrence.pattern.type.slice(1)}
                  {event.recurrence.pattern.interval > 1 && ` (every ${event.recurrence.pattern.interval})`}
                </Badge>
              </Group>
            )}
          </Stack>
        </Card>
      </Stack>
    </Drawer>
  );
}