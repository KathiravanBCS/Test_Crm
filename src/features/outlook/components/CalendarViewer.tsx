import { useState, useMemo } from 'react';
import { 
  Grid, 
  Card, 
  Stack, 
  TextInput, 
  Select, 
  Group, 
  Button,
  Badge,
  Text,
  ScrollArea,
  Skeleton,
  Alert,
  ActionIcon,
  Box,
  UnstyledButton,
  Paper,
  rem,
  Tooltip,
  Avatar,
  AvatarGroup,
  Divider,
  Tabs,
  ThemeIcon,
  Timeline,
  SegmentedControl
} from '@mantine/core';
import { 
  IconSearch, 
  IconFilter, 
  IconRefresh, 
  IconCalendar,
  IconVideo,
  IconMapPin,
  IconClock,
  IconUsers,
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconAlertCircle,
  IconX,
  IconList,
  IconCalendarWeek,
  IconCalendarMonth
} from '@tabler/icons-react';
import { DatePicker } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { useRecentMeetings } from '../api/useGetCalendar';
import { CRMCalendarEvent, CRMCalendarFilter } from '@/services/graph/types';
import { formatDateTime, formatDate } from '@/lib/utils/date';
import { CalendarDetailPanel } from './CalendarDetailPanel';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

interface CalendarViewerProps {
  entityType?: 'proposal' | 'engagement_letter' | 'engagement' | 'customer' | 'partner';
  entityId?: number;
  entityCode?: string;
  relatedCodes?: string[];
  defaultView?: 'list' | 'week' | 'month';
  onMeetingSelect?: (meeting: CRMCalendarEvent) => void;
}

export function CalendarViewer({
  entityType,
  entityId,
  entityCode,
  relatedCodes = [],
  defaultView = 'list',
  onMeetingSelect
}: CalendarViewerProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<CRMCalendarEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'week' | 'month'>(defaultView);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showOnlineMeetingsOnly, setShowOnlineMeetingsOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);
  
  // Calculate date range based on view mode - memoized to prevent re-calculation
  const { dateFrom, dateTo } = useMemo(() => {
    const start = dayjs(selectedDate);
    let from: Date;
    let to: Date;
    
    switch (viewMode) {
      case 'week':
        from = start.startOf('isoWeek').toDate();
        to = start.endOf('isoWeek').toDate();
        break;
      case 'month':
        from = start.startOf('month').toDate();
        to = start.endOf('month').toDate();
        break;
      default: // list view - show next 30 days
        // Normalize to start of current minute to avoid millisecond changes
        from = dayjs().startOf('minute').toDate();
        to = dayjs().add(30, 'days').endOf('day').toDate();
    }
    
    return { dateFrom: from, dateTo: to };
  }, [selectedDate, viewMode]);
  
  // Build filter - memoized to prevent unnecessary re-renders
  const filter: CRMCalendarFilter = useMemo(() => ({
    entityType,
    entityId,
    entityCode,
    relatedCodes: relatedCodes.length > 0 ? relatedCodes : entityCode ? [entityCode] : [],
    search: debouncedSearch,
    isOnlineMeeting: showOnlineMeetingsOnly || undefined,
    dateFrom,
    dateTo,
    maxItems: 100,
    orderBy: 'start',
    orderDirection: 'asc',
    includeCancelled: true
  }), [entityType, entityId, entityCode, relatedCodes, debouncedSearch, showOnlineMeetingsOnly, dateFrom, dateTo]);
  
  // Fetch meetings
  const { data, isLoading, error, refetch } = useRecentMeetings(filter);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };
  
  const handleMeetingClick = (meeting: CRMCalendarEvent) => {
    setSelectedMeeting(meeting);
    if (onMeetingSelect) {
      onMeetingSelect(meeting);
    }
  };
  
  const navigateDate = (direction: 'prev' | 'next') => {
    const current = dayjs(selectedDate);
    let newDate: dayjs.Dayjs;
    
    switch (viewMode) {
      case 'week':
        newDate = direction === 'prev' ? current.subtract(1, 'week') : current.add(1, 'week');
        break;
      case 'month':
        newDate = direction === 'prev' ? current.subtract(1, 'month') : current.add(1, 'month');
        break;
      default:
        newDate = direction === 'prev' ? current.subtract(7, 'days') : current.add(7, 'days');
    }
    
    setSelectedDate(newDate.toDate());
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setShowOnlineMeetingsOnly(false);
  };
  
  const meetings = data?.events || [];
  const hasActiveFilters = debouncedSearch || showOnlineMeetingsOnly;
  
  // Group meetings by date for list view
  const groupMeetingsByDate = (meetings: CRMCalendarEvent[]) => {
    const groups: Record<string, CRMCalendarEvent[]> = {};
    
    meetings.forEach(meeting => {
      const dateKey = dayjs(meeting.startDateTime).format('YYYY-MM-DD');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(meeting);
    });
    
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  };
  
  return (
    <Grid gutter="md" style={{ height: '100%' }}>
      {/* Calendar List/Grid Panel */}
      <Grid.Col span={selectedMeeting ? 5 : 12}>
        <Card withBorder h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Stack gap="sm" mb="md">
            <Group justify="space-between">
              <Group>
                <IconCalendar size={24} />
                <Text fw={600} size="lg">Calendar</Text>
                {meetings.length > 0 && (
                  <Badge size="lg" variant="light" color="gray">
                    {meetings.length}
                  </Badge>
                )}
              </Group>
              <Group>
                <SegmentedControl
                  value={viewMode}
                  onChange={(value) => setViewMode(value as typeof viewMode)}
                  data={[
                    { label: 'List', value: 'list' },
                    { label: 'Week', value: 'week' },
                    { label: 'Month', value: 'month' }
                  ]}
                />
                <ActionIcon
                  variant="subtle"
                  onClick={handleRefresh}
                  loading={isRefreshing}
                >
                  <IconRefresh size={16} />
                </ActionIcon>
              </Group>
            </Group>
            
            {/* Date Navigation */}
            <Group justify="space-between">
              <Group>
                <ActionIcon variant="subtle" onClick={() => navigateDate('prev')}>
                  <IconChevronLeft size={16} />
                </ActionIcon>
                <DatePicker
                  value={selectedDate}
                  onChange={(date) => date && setSelectedDate(new Date(date))}
                  size="sm"
                />
                <ActionIcon variant="subtle" onClick={() => navigateDate('next')}>
                  <IconChevronRight size={16} />
                </ActionIcon>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Today
                </Button>
              </Group>
              
              <Text size="sm" fw={500}>
                {viewMode === 'week' 
                  ? `Week of ${dayjs(dateFrom).format('MMM D')} - ${dayjs(dateTo).format('MMM D, YYYY')}`
                  : viewMode === 'month'
                    ? dayjs(selectedDate).format('MMMM YYYY')
                    : `Next 30 days from ${formatDate(dateFrom)}`
                }
              </Text>
            </Group>
            
            {/* Search and Filters */}
            <Group>
              <TextInput
                placeholder="Search meetings..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                rightSection={
                  searchQuery && (
                    <ActionIcon variant="subtle" onClick={() => setSearchQuery('')}>
                      <IconX size={16} />
                    </ActionIcon>
                  )
                }
                style={{ flex: 1 }}
              />
              
              <Button
                variant={showOnlineMeetingsOnly ? 'filled' : 'default'}
                size="sm"
                leftSection={<IconVideo size={16} />}
                onClick={() => setShowOnlineMeetingsOnly(!showOnlineMeetingsOnly)}
              >
                Online Only
              </Button>
              
              {hasActiveFilters && (
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={clearFilters}
                  leftSection={<IconX size={16} />}
                >
                  Clear
                </Button>
              )}
            </Group>
          </Stack>
          
          <Divider />
          
          {/* Calendar Content */}
          <ScrollArea style={{ flex: 1 }} mt="md">
            {isLoading ? (
              <Stack gap="xs">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} height={80} />
                ))}
              </Stack>
            ) : error ? (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                Failed to load calendar events
              </Alert>
            ) : meetings.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                {hasActiveFilters ? 'No meetings match your filters' : 'No meetings scheduled'}
              </Text>
            ) : viewMode === 'list' ? (
              <Stack gap="lg">
                {groupMeetingsByDate(meetings).map(([date, dayMeetings]) => (
                  <Box key={date}>
                    <Text size="sm" fw={600} c="dimmed" mb="sm">
                      {dayjs(date).format('dddd, MMMM D, YYYY')}
                      {dayjs(date).isSame(dayjs(), 'day') && (
                        <Badge size="xs" color="blue" variant="light" ml="xs">
                          Today
                        </Badge>
                      )}
                    </Text>
                    <Stack gap="xs">
                      {dayMeetings.map((meeting) => (
                        <MeetingListItem
                          key={meeting.id}
                          meeting={meeting}
                          isSelected={selectedMeeting?.id === meeting.id}
                          onClick={() => handleMeetingClick(meeting)}
                        />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <CalendarGridView
                meetings={meetings}
                viewMode={viewMode}
                selectedDate={selectedDate}
                selectedMeeting={selectedMeeting}
                onMeetingClick={handleMeetingClick}
              />
            )}
          </ScrollArea>
        </Card>
      </Grid.Col>
      
      {/* Meeting Detail Panel */}
      {selectedMeeting && (
        <Grid.Col span={7}>
          <CalendarDetailPanel
            meeting={selectedMeeting}
            onClose={() => setSelectedMeeting(null)}
          />
        </Grid.Col>
      )}
    </Grid>
  );
}

interface MeetingListItemProps {
  meeting: CRMCalendarEvent;
  isSelected: boolean;
  onClick: () => void;
}

function MeetingListItem({ meeting, isSelected, onClick }: MeetingListItemProps) {
  const getDurationText = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  return (
    <UnstyledButton onClick={onClick}>
      <Paper
        p="sm"
        withBorder
        style={{
          backgroundColor: isSelected ? 'var(--mantine-color-blue-0)' : undefined,
          borderLeft: isSelected ? `3px solid var(--mantine-color-blue-6)` : undefined,
          opacity: meeting.isCancelled ? 0.6 : 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        className="hover-highlight"
      >
        <Group wrap="nowrap" gap="sm">
          <Box>
            <Text size="xs" fw={600} c="dimmed">
              {dayjs(meeting.startDateTime).format('h:mm A')}
            </Text>
            <Text size="xs" c="dimmed">
              {getDurationText(meeting.duration)}
            </Text>
          </Box>
          
          <Divider orientation="vertical" />
          
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Group gap="xs" wrap="nowrap" mb={4}>
              {meeting.isOnlineMeeting && (
                <ThemeIcon size="sm" variant="light" color="blue">
                  <IconVideo size={12} />
                </ThemeIcon>
              )}
              <Text 
                size="sm" 
                fw={500} 
                truncate
                td={meeting.isCancelled ? 'line-through' : undefined}
              >
                {meeting.subject}
              </Text>
            </Group>
            
            {meeting.location && (
              <Group gap={4} mb={4}>
                <IconMapPin size={12} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <Text size="xs" c="dimmed" truncate>
                  {meeting.location.displayName}
                </Text>
              </Group>
            )}
            
            {meeting.attendees.length > 0 && (
              <Group gap="xs">
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
            
            <Group gap={4} mt={4}>
              {meeting.isCancelled && (
                <Badge size="xs" color="red" variant="light">
                  Cancelled
                </Badge>
              )}
              {meeting.relatedEntityCodes.map((code) => (
                <Badge key={code} size="xs" variant="light">
                  {code}
                </Badge>
              ))}
            </Group>
          </Box>
        </Group>
      </Paper>
    </UnstyledButton>
  );
}

interface CalendarGridViewProps {
  meetings: CRMCalendarEvent[];
  viewMode: 'week' | 'month';
  selectedDate: Date;
  selectedMeeting: CRMCalendarEvent | null;
  onMeetingClick: (meeting: CRMCalendarEvent) => void;
}

function CalendarGridView({
  meetings,
  viewMode,
  selectedDate,
  selectedMeeting,
  onMeetingClick
}: CalendarGridViewProps) {
  // Simple week/month grid view placeholder
  // Full calendar grid implementation would be more complex
  return (
    <Alert icon={<IconCalendar size={16} />} variant="light">
      {viewMode === 'week' ? 'Week' : 'Month'} view coming soon. 
      Use List view to see all meetings.
    </Alert>
  );
}