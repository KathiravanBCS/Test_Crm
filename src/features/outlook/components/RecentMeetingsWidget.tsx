import { useState, useMemo, useEffect } from 'react';
import { 
  Card, 
  Group, 
  Text, 
  Badge, 
  Stack, 
  Skeleton, 
  ActionIcon,
  Tooltip,
  Paper,
  UnstyledButton,
  Box,
  rem,
  Alert,
  Tabs,
  ThemeIcon,
  Avatar,
  AvatarGroup
} from '@mantine/core';
import { 
  IconCalendar, 
  IconRefresh, 
  IconExternalLink,
  IconAlertCircle,
  IconVideo,
  IconMapPin,
  IconClock,
  IconUsers
} from '@tabler/icons-react';
import { formatDate, formatDateTime } from '@/lib/utils/date';
import { CRMCalendarEvent, CRMCalendarFilter } from '@/services/graph/types';
import { useRecentMeetings } from '../api/useGetCalendar';
import dayjs from 'dayjs';

interface RecentMeetingsWidgetProps {
  entityType: 'proposal' | 'engagement_letter' | 'engagement' | 'customer' | 'partner';
  entityId: number;
  entityCode?: string;
  relatedCodes?: string[];
  maxItems?: number;
  showRefresh?: boolean;
  showUpcoming?: boolean;
  onMeetingClick?: (meeting: CRMCalendarEvent) => void;
  className?: string;
  loadDelay?: number; // Delay before loading data (for staggering requests)
}

export function RecentMeetingsWidget({
  entityType,
  entityId,
  entityCode,
  relatedCodes = [],
  maxItems = 5,
  showRefresh = true,
  showUpcoming = true,
  onMeetingClick,
  className,
  loadDelay = 0
}: RecentMeetingsWidgetProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(showUpcoming ? 'upcoming' : 'past');
  const [canLoad, setCanLoad] = useState(loadDelay === 0);
  
  // Apply load delay if specified
  useEffect(() => {
    if (loadDelay > 0) {
      const timer = setTimeout(() => setCanLoad(true), loadDelay);
      return () => clearTimeout(timer);
    }
  }, [loadDelay]);
  
  // Build filters for past and upcoming meetings
  // Use stable date values to prevent re-renders
  const now = useMemo(() => dayjs().startOf('minute').toDate(), []);
  
  const baseFilter: CRMCalendarFilter = {
    entityType,
    entityId,
    entityCode,
    relatedCodes: relatedCodes, // Don't duplicate entityCode here
    maxItems
  };
  
  const upcomingFilter: CRMCalendarFilter = {
    ...baseFilter,
    dateFrom: now,
    orderBy: 'start',
    orderDirection: 'asc'
  };
  
  const pastFilter: CRMCalendarFilter = {
    ...baseFilter,
    dateTo: now,
    orderBy: 'start',
    orderDirection: 'desc'
  };
  
  // Fetch upcoming meetings
  const upcomingQuery = useRecentMeetings(
    upcomingFilter,
    canLoad && showUpcoming && !!(entityCode || relatedCodes.length > 0)
  );
  
  // Fetch past meetings
  const pastQuery = useRecentMeetings(
    pastFilter,
    canLoad && !!(entityCode || relatedCodes.length > 0)
  );
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (showUpcoming) {
      await upcomingQuery.refetch();
    }
    await pastQuery.refetch();
    setIsRefreshing(false);
  };
  
  const handleMeetingClick = (meeting: CRMCalendarEvent) => {
    if (onMeetingClick) {
      onMeetingClick(meeting);
    } else {
      window.open(meeting.webLink, '_blank');
    }
  };
  
  const isLoading = (showUpcoming && upcomingQuery.isLoading) || pastQuery.isLoading;
  const error = (showUpcoming && upcomingQuery.error) || pastQuery.error;
  
  // Loading state
  if (isLoading) {
    return (
      <Card className={className} withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <IconCalendar size={20} />
            <Text fw={600}>Recent Meetings</Text>
          </Group>
        </Group>
        <Stack gap="xs">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={80} />
          ))}
        </Stack>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card className={className} withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <IconCalendar size={20} />
            <Text fw={600}>Recent Meetings</Text>
          </Group>
        </Group>
        <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
          Failed to load meetings
        </Alert>
      </Card>
    );
  }
  
  const upcomingMeetings = upcomingQuery.data?.events || [];
  const pastMeetings = pastQuery.data?.events || [];
  const totalMeetings = upcomingMeetings.length + pastMeetings.length;
  
  return (
    <Card className={className} withBorder>
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconCalendar size={20} />
          <Text fw={600}>Recent Meetings</Text>
          {totalMeetings > 0 && (
            <Badge size="sm" variant="light" color="gray">
              {totalMeetings}
            </Badge>
          )}
        </Group>
        {showRefresh && (
          <Tooltip label="Refresh meetings">
            <ActionIcon 
              variant="subtle" 
              onClick={handleRefresh}
              loading={isRefreshing}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
      
      {showUpcoming ? (
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="upcoming" leftSection={<IconClock size={14} />}>
              Upcoming ({upcomingMeetings.length})
            </Tabs.Tab>
            <Tabs.Tab value="past" leftSection={<IconCalendar size={14} />}>
              Past ({pastMeetings.length})
            </Tabs.Tab>
          </Tabs.List>
          
          <Tabs.Panel value="upcoming" pt="md">
            <MeetingsList 
              meetings={upcomingMeetings} 
              onMeetingClick={handleMeetingClick}
              emptyMessage="No upcoming meetings"
            />
          </Tabs.Panel>
          
          <Tabs.Panel value="past" pt="md">
            <MeetingsList 
              meetings={pastMeetings} 
              onMeetingClick={handleMeetingClick}
              emptyMessage="No past meetings"
            />
          </Tabs.Panel>
        </Tabs>
      ) : (
        <MeetingsList 
          meetings={pastMeetings} 
          onMeetingClick={handleMeetingClick}
          emptyMessage="No meetings found"
        />
      )}
    </Card>
  );
}

interface MeetingsListProps {
  meetings: CRMCalendarEvent[];
  onMeetingClick: (meeting: CRMCalendarEvent) => void;
  emptyMessage: string;
}

function MeetingsList({ meetings, onMeetingClick, emptyMessage }: MeetingsListProps) {
  if (meetings.length === 0) {
    return (
      <Text c="dimmed" size="sm" ta="center" py="xl">
        {emptyMessage}
      </Text>
    );
  }
  
  return (
    <Stack gap="xs">
      {meetings.map((meeting) => (
        <MeetingItem 
          key={meeting.id} 
          meeting={meeting} 
          onClick={() => onMeetingClick(meeting)}
        />
      ))}
    </Stack>
  );
}

interface MeetingItemProps {
  meeting: CRMCalendarEvent;
  onClick: () => void;
}

function MeetingItem({ meeting, onClick }: MeetingItemProps) {
  const getDurationText = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  const getStatusColor = () => {
    if (meeting.isCancelled) return 'red';
    if (meeting.isUpcoming) return 'blue';
    return 'gray';
  };
  
  return (
    <UnstyledButton onClick={onClick}>
      <Paper 
        p="sm" 
        withBorder 
        style={{ 
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          opacity: meeting.isCancelled ? 0.6 : 1
        }}
        className="hover-card"
      >
        <Group justify="space-between" wrap="nowrap">
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Group gap="xs" wrap="nowrap">
              {meeting.isOnlineMeeting && (
                <ThemeIcon size="sm" variant="light" color="blue">
                  <IconVideo size={12} />
                </ThemeIcon>
              )}
              <Text 
                size="sm" 
                fw={meeting.isUpcoming ? 600 : 400} 
                truncate
                td={meeting.isCancelled ? 'line-through' : undefined}
              >
                {meeting.subject}
              </Text>
            </Group>
            
            <Group gap="xs" mt={4}>
              <Text size="xs" c="dimmed">
                {formatDateTime(meeting.startDateTime)}
              </Text>
              <Text size="xs" c="dimmed">•</Text>
              <Text size="xs" c="dimmed">
                {getDurationText(meeting.duration)}
              </Text>
              {meeting.location && (
                <>
                  <Text size="xs" c="dimmed">•</Text>
                  <Group gap={4}>
                    <IconMapPin size={12} style={{ color: 'var(--mantine-color-gray-6)' }} />
                    <Text size="xs" c="dimmed" truncate style={{ maxWidth: rem(150) }}>
                      {meeting.location.displayName}
                    </Text>
                  </Group>
                </>
              )}
            </Group>
            
            {meeting.attendees.length > 0 && (
              <Group gap="xs" mt={6}>
                <IconUsers size={12} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <AvatarGroup spacing="xs">
                  {meeting.attendees.slice(0, 3).map((attendee, idx) => (
                    <Tooltip key={idx} label={attendee.name || attendee.email}>
                      <Avatar size="xs" radius="xl">
                        {(attendee.name || attendee.email).charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  ))}
                  {meeting.attendees.length > 3 && (
                    <Avatar size="xs" radius="xl">
                      +{meeting.attendees.length - 3}
                    </Avatar>
                  )}
                </AvatarGroup>
              </Group>
            )}
            
            {meeting.relatedEntityCodes.length > 0 && (
              <Group gap={4} mt={6}>
                {meeting.relatedEntityCodes.slice(0, 2).map((code) => (
                  <Badge key={code} size="xs" variant="light">
                    {code}
                  </Badge>
                ))}
                {meeting.relatedEntityCodes.length > 2 && (
                  <Text size="xs" c="dimmed">
                    +{meeting.relatedEntityCodes.length - 2} more
                  </Text>
                )}
              </Group>
            )}
          </Box>
          
          <Group gap="xs" wrap="nowrap" align="center">
            <Badge size="sm" color={getStatusColor()} variant="light">
              {meeting.isCancelled ? 'Cancelled' : meeting.isUpcoming ? 'Upcoming' : 'Past'}
            </Badge>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                // Handle external link click here if needed
                if (meeting.onlineMeeting?.joinUrl) {
                  window.open(meeting.onlineMeeting.joinUrl, '_blank');
                }
              }}
              style={{
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                color: 'var(--mantine-color-gray-6)',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: 'var(--mantine-color-gray-1)',
                  color: 'var(--mantine-color-gray-7)'
                }
              }}
              className="hover:bg-gray-100"
            >
              <IconExternalLink size={14} />
            </Box>
          </Group>
        </Group>
      </Paper>
    </UnstyledButton>
  );
}