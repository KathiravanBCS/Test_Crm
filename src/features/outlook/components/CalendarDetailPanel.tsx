import { useState } from 'react';
import { 
  Card, 
  Stack, 
  Group, 
  Text, 
  Badge, 
  ActionIcon,
  Button,
  Avatar,
  AvatarGroup,
  Divider,
  ScrollArea,
  Skeleton,
  Alert,
  Paper,
  Tooltip,
  Box,
  ThemeIcon,
  rem,
  Table,
  CopyButton
} from '@mantine/core';
import { 
  IconX, 
  IconExternalLink, 
  IconCalendar,
  IconVideo,
  IconMapPin,
  IconClock,
  IconUsers,
  IconAlertCircle,
  IconCopy,
  IconCheck,
  IconUserCheck,
  IconUserX,
  IconUserQuestion,
  IconPhone,
  IconWorld
} from '@tabler/icons-react';
import { formatDateTime, formatDate } from '@/lib/utils/date';
import { useMeetingDetails } from '../api/useGetCalendar';
import { CRMCalendarEvent, CRMCalendarEventDetails } from '@/services/graph/types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

interface CalendarDetailPanelProps {
  meeting: CRMCalendarEvent;
  onClose?: () => void;
  onJoinMeeting?: () => void;
}

export function CalendarDetailPanel({
  meeting,
  onClose,
  onJoinMeeting
}: CalendarDetailPanelProps) {
  // Fetch full meeting details including body
  const { data: meetingDetails, isLoading, error } = useMeetingDetails(meeting.id);
  
  const handleOpenInOutlook = () => {
    window.open(meeting.webLink, '_blank');
  };
  
  const handleJoinOnlineMeeting = () => {
    if (meeting.onlineMeeting?.joinUrl) {
      window.open(meeting.onlineMeeting.joinUrl, '_blank');
    } else if (onJoinMeeting) {
      onJoinMeeting();
    }
  };
  
  const getDurationText = () => {
    const duration = dayjs.duration(meeting.duration, 'minutes');
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    
    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
  };
  
  const getAttendeeIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <IconUserCheck size={14} color="var(--mantine-color-green-6)" />;
      case 'declined':
        return <IconUserX size={14} color="var(--mantine-color-red-6)" />;
      case 'tentative':
        return <IconUserQuestion size={14} color="var(--mantine-color-yellow-6)" />;
      default:
        return <IconUsers size={14} color="var(--mantine-color-gray-6)" />;
    }
  };
  
  const getAttendeeStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'green';
      case 'declined': return 'red';
      case 'tentative': return 'yellow';
      default: return 'gray';
    }
  };
  
  return (
    <Card withBorder h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Stack gap="sm" mb="md">
        <Group justify="space-between">
          <Group>
            <IconCalendar size={24} />
            <Text fw={600} size="lg">Meeting Details</Text>
          </Group>
          <Group>
            <ActionIcon variant="subtle" onClick={handleOpenInOutlook}>
              <IconExternalLink size={20} />
            </ActionIcon>
            {onClose && (
              <ActionIcon variant="subtle" onClick={onClose}>
                <IconX size={20} />
              </ActionIcon>
            )}
          </Group>
        </Group>
        
        {/* Action Buttons */}
        {meeting.isOnlineMeeting && meeting.onlineMeeting?.joinUrl && !meeting.isPast && (
          <Button
            fullWidth
            leftSection={<IconVideo size={16} />}
            onClick={handleJoinOnlineMeeting}
            disabled={meeting.isCancelled}
          >
            Join Online Meeting
          </Button>
        )}
      </Stack>
      
      <Divider />
      
      {/* Meeting Content */}
      <ScrollArea style={{ flex: 1 }} mt="md">
        {isLoading ? (
          <Stack gap="md">
            <Skeleton height={60} />
            <Skeleton height={200} />
          </Stack>
        ) : error ? (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            Failed to load meeting details
          </Alert>
        ) : meetingDetails ? (
          <Stack gap="md">
            {/* Subject and Status */}
            <Box>
              <Group gap="xs" mb="xs">
                {meetingDetails.isCancelled && (
                  <Badge color="red" variant="filled">
                    Cancelled
                  </Badge>
                )}
                {meetingDetails.isUpcoming && (
                  <Badge color="blue" variant="light">
                    Upcoming
                  </Badge>
                )}
                {meetingDetails.isPast && (
                  <Badge color="gray" variant="light">
                    Past
                  </Badge>
                )}
              </Group>
              <Text fw={600} size="lg">{meetingDetails.subject}</Text>
              {meetingDetails.relatedEntityCodes.length > 0 && (
                <Group gap={4} mt="xs">
                  {meetingDetails.relatedEntityCodes.map((code: string) => (
                    <Badge key={code} size="sm" variant="light">
                      {code}
                    </Badge>
                  ))}
                </Group>
              )}
            </Box>
            
            {/* Time and Duration */}
            <Paper withBorder p="md">
              <Stack gap="sm">
                <Group gap="xs">
                  <IconClock size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                  <Box>
                    <Text size="sm" fw={500}>
                      {formatDateTime(meetingDetails.startDateTime)}
                      {' - '}
                      {dayjs(meetingDetails.endDateTime).format('h:mm A')}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {getDurationText()}
                      {meetingDetails.isAllDay && ' • All day'}
                    </Text>
                  </Box>
                </Group>
                
                {/* Location */}
                {meetingDetails.location && (
                  <Group gap="xs">
                    <IconMapPin size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                    <Box style={{ flex: 1 }}>
                      <Text size="sm">{meetingDetails.location.displayName}</Text>
                      {meetingDetails.location.address && (
                        <Text size="xs" c="dimmed">{meetingDetails.location.address}</Text>
                      )}
                    </Box>
                  </Group>
                )}
                
                {/* Online Meeting */}
                {meetingDetails.isOnlineMeeting && meetingDetails.onlineMeeting && (
                  <Group gap="xs">
                    <IconVideo size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />
                    <Box style={{ flex: 1 }}>
                      <Group gap="xs">
                        <Text size="sm" fw={500}>Online Meeting</Text>
                        <CopyButton value={meetingDetails.onlineMeeting.joinUrl}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied' : 'Copy link'}>
                              <ActionIcon 
                                color={copied ? 'teal' : 'gray'} 
                                variant="subtle" 
                                size="sm"
                                onClick={copy}
                              >
                                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Group>
                      {meetingDetails.onlineMeeting.conferenceId && (
                        <Text size="xs" c="dimmed">
                          Conference ID: {meetingDetails.onlineMeeting.conferenceId}
                        </Text>
                      )}
                      {meetingDetails.onlineMeeting.tollNumber && (
                        <Group gap="xs">
                          <IconPhone size={12} style={{ color: 'var(--mantine-color-gray-6)' }} />
                          <Text size="xs" c="dimmed">
                            {meetingDetails.onlineMeeting.tollNumber}
                          </Text>
                        </Group>
                      )}
                    </Box>
                  </Group>
                )}
              </Stack>
            </Paper>
            
            {/* Organizer */}
            <Paper withBorder p="md">
              <Text size="sm" fw={500} mb="sm">Organizer</Text>
              <Group>
                <Avatar size="sm" radius="xl">
                  {(meetingDetails.organizer.name || meetingDetails.organizer.email).charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Text size="sm">{meetingDetails.organizer.name || meetingDetails.organizer.email}</Text>
                  <Text size="xs" c="dimmed">{meetingDetails.organizer.email}</Text>
                </Box>
              </Group>
            </Paper>
            
            {/* Attendees */}
            {meetingDetails.attendees.length > 0 && (
              <Paper withBorder p="md">
                <Group justify="space-between" mb="sm">
                  <Text size="sm" fw={500}>
                    Attendees ({meetingDetails.attendees.length})
                  </Text>
                  <Group gap="xs">
                    <Text size="xs" c="dimmed">
                      {meetingDetails.attendees.filter((a: any) => a.responseStatus === 'accepted').length} accepted
                    </Text>
                  </Group>
                </Group>
                
                <Table horizontalSpacing="sm" verticalSpacing="xs">
                  <Table.Tbody>
                    {meetingDetails.attendees.map((attendee: any, idx: number) => (
                      <Table.Tr key={idx}>
                        <Table.Td>
                          <Group gap="xs">
                            <Avatar size="xs" radius="xl">
                              {(attendee.name || attendee.email).charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Text size="sm">{attendee.name || attendee.email}</Text>
                              <Text size="xs" c="dimmed">{attendee.email}</Text>
                            </Box>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            size="xs" 
                            variant="light"
                            color={attendee.type === 'required' ? 'blue' : 'gray'}
                          >
                            {attendee.type}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            {getAttendeeIcon(attendee.responseStatus)}
                            <Text size="xs" c={getAttendeeStatusColor(attendee.responseStatus)}>
                              {attendee.responseStatus}
                            </Text>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Paper>
            )}
            
            {/* Meeting Body/Description */}
            {meetingDetails.body.content && (
              <Paper withBorder p="md">
                <Text size="sm" fw={500} mb="sm">Description</Text>
                {meetingDetails.body.contentType === 'html' ? (
                  <Box
                    dangerouslySetInnerHTML={{ __html: meetingDetails.body.content }}
                    style={{
                      fontSize: rem(14),
                      lineHeight: 1.6,
                      wordBreak: 'break-word'
                    }}
                    className="email-content"
                  />
                ) : (
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {meetingDetails.body.content}
                  </Text>
                )}
              </Paper>
            )}
            
            {/* Categories */}
            {meetingDetails.categories.length > 0 && (
              <Paper withBorder p="md">
                <Text size="sm" fw={500} mb="sm">Categories</Text>
                <Group gap="xs">
                  {meetingDetails.categories.map((category: string, idx: number) => (
                    <Badge key={idx} variant="light">
                      {category}
                    </Badge>
                  ))}
                </Group>
              </Paper>
            )}
          </Stack>
        ) : null}
      </ScrollArea>
    </Card>
  );
}