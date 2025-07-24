import { useState } from 'react';
import { 
  Tabs, 
  Group, 
  Text, 
  Badge, 
  ActionIcon, 
  Button, 
  TextInput, 
  Select,
  Card,
  Stack
} from '@mantine/core';
import { 
  IconMail, 
  IconCalendar, 
  IconRefresh, 
  IconSearch, 
  IconPlus
} from '@tabler/icons-react';
import { EmailList } from './EmailList';
import { MeetingList } from './MeetingList';
import { useGraphEmails } from './hooks/useGraphEmails';
import { useGraphCalendarEvents } from './hooks/useGraphCalendarEvents';

interface CommunicationTabProps {
  entityType: string;
  entityId: number;
  entityName?: string;
}

export function CommunicationTab({ entityType, entityId, entityName }: CommunicationTabProps) {
  const [activeTab, setActiveTab] = useState<string>('emails');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('30');

  const { 
    data: emails, 
    isLoading: emailsLoading, 
    refetch: refetchEmails,
    error: emailsError 
  } = useGraphEmails({
    entityType,
    entityId,
    search: searchQuery,
    days: parseInt(dateFilter)
  });

  const { 
    data: events, 
    isLoading: eventsLoading, 
    refetch: refetchEvents,
    error: eventsError 
  } = useGraphCalendarEvents({
    entityType,
    entityId,
    search: searchQuery,
    days: parseInt(dateFilter)
  });

  const handleRefresh = () => {
    if (activeTab === 'emails') {
      refetchEmails();
    } else {
      refetchEvents();
    }
  };

  const getTabCount = (type: 'emails' | 'meetings') => {
    if (type === 'emails') {
      return emails?.data?.length || 0;
    }
    return events?.data?.length || 0;
  };

  return (
    <Card withBorder h="100%">
      <Stack gap="md" h="100%">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="lg" fw={600}>Communication</Text>
            {entityName && (
              <Text size="sm" c="dimmed">
                Related to {entityName}
              </Text>
            )}
          </div>
          <Group gap="xs">
            <Button 
              size="xs" 
              variant="light" 
              leftSection={<IconPlus size={14} />}
            >
              Link Email
            </Button>
            <ActionIcon 
              variant="light" 
              onClick={handleRefresh}
              loading={emailsLoading || eventsLoading}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Filters */}
        <Group gap="md">
          <TextInput
            placeholder="Search communications..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1 }}
            size="sm"
          />
          <Select
            placeholder="Time period"
            value={dateFilter}
            onChange={(value) => setDateFilter(value || '30')}
            data={[
              { value: '7', label: 'Last 7 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 3 months' },
              { value: '365', label: 'Last year' },
              { value: 'all', label: 'All time' }
            ]}
            size="sm"
            w={150}
          />
        </Group>

        {/* Tabs */}
        <Tabs 
          value={activeTab} 
          onChange={(value) => setActiveTab(value || 'emails')}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <Tabs.List>
            <Tabs.Tab 
              value="emails" 
              leftSection={<IconMail size={16} />}
              rightSection={
                <Badge size="xs" variant="light">
                  {getTabCount('emails')}
                </Badge>
              }
            >
              Emails
            </Tabs.Tab>
            <Tabs.Tab 
              value="meetings" 
              leftSection={<IconCalendar size={16} />}
              rightSection={
                <Badge size="xs" variant="light">
                  {getTabCount('meetings')}
                </Badge>
              }
            >
              Meetings
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel 
            value="emails" 
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <EmailList
              emails={emails?.data || []}
              loading={emailsLoading}
              error={emailsError?.message || null}
              entityType={entityType}
              entityId={entityId}
            />
          </Tabs.Panel>

          <Tabs.Panel 
            value="meetings"
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <MeetingList
              events={events?.data || []}
              loading={eventsLoading}
              error={eventsError?.message || null}
              entityType={entityType}
              entityId={entityId}
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Card>
  );
}