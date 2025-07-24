import { useState } from 'react';
import { Button, Group, Text, Modal, Stack, Alert, Checkbox, Select, Badge, Loader, Paper } from '@mantine/core';
import { IconBrandOffice, IconRefresh, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Task } from '../types';
import { useOutlookCalendarSync } from '../api/useOutlookCalendarSync';
import { formatDateTime } from '@/lib/utils/date';

interface OutlookCalendarSyncProps {
  task?: Task;
  tasks?: Task[];
  onSyncComplete?: () => void;
}

export function OutlookCalendarSync({ task, tasks, onSyncComplete }: OutlookCalendarSyncProps) {
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<string>('');
  const [syncOptions, setSyncOptions] = useState({
    createEvent: true,
    updateExisting: true,
    sendInvites: false,
    includeDescription: true,
    includeEngagementInfo: true,
  });

  const { mutate: syncToOutlook, isPending: isLoading, data: syncResult } = useOutlookCalendarSync();

  const handleSync = () => {
    const itemsToSync = task ? [task] : tasks || [];
    
    if (itemsToSync.length === 0) {
      notifications.show({
        title: 'No tasks to sync',
        message: 'Please select at least one task to sync with Outlook',
        color: 'orange',
      });
      return;
    }

    syncToOutlook({
      tasks: itemsToSync,
      calendarId: selectedCalendar,
      options: syncOptions,
    }, {
      onSuccess: (result) => {
        notifications.show({
          title: 'Sync completed',
          message: `Successfully synced ${result.successCount} task(s) to Outlook`,
          color: 'green',
          icon: <IconCheck />,
        });
        setModalOpened(false);
        onSyncComplete?.();
      },
      onError: (error) => {
        notifications.show({
          title: 'Sync failed',
          message: error.message || 'Failed to sync tasks to Outlook',
          color: 'red',
        });
      },
    });
  };

  const taskCount = task ? 1 : tasks?.length || 0;

  return (
    <>
      <Button
        leftSection={<IconBrandOffice size={16} />}
        variant="default"
        onClick={() => setModalOpened(true)}
        disabled={taskCount === 0}
      >
        Sync to Outlook {taskCount > 0 && `(${taskCount})`}
      </Button>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Group gap="sm">
            <IconBrandOffice size={20} />
            <Text fw={600}>Sync Tasks to Outlook Calendar</Text>
          </Group>
        }
        size="md"
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle />} color="blue">
            This will create or update calendar events in your Outlook calendar based on task due dates.
          </Alert>

          {task && (
            <Paper p="sm" withBorder>
              <Group justify="space-between">
                <Stack gap={4}>
                  <Text fw={500}>{task.title}</Text>
                  <Text size="sm" c="dimmed">
                    Due: {task.due_date ? formatDateTime(new Date(task.due_date)) : 'No due date'}
                  </Text>
                </Stack>
                <Badge color={task.priority === 'urgent' ? 'red' : task.priority === 'high' ? 'orange' : 'blue'}>
                  {task.priority}
                </Badge>
              </Group>
            </Paper>
          )}

          {tasks && tasks.length > 1 && (
            <Text size="sm" c="dimmed">
              {tasks.length} tasks will be synced to your calendar
            </Text>
          )}

          <Select
            label="Target Calendar"
            placeholder="Select Outlook calendar"
            data={[
              { value: 'default', label: 'Default Calendar' },
              { value: 'work', label: 'Work Calendar' },
              { value: 'personal', label: 'Personal Calendar' },
            ]}
            value={selectedCalendar}
            onChange={(value) => setSelectedCalendar(value || '')}
            required
          />

          <Stack gap="xs">
            <Text size="sm" fw={500}>Sync Options</Text>
            <Checkbox
              label="Create new calendar events"
              checked={syncOptions.createEvent}
              onChange={(e) => setSyncOptions({ ...syncOptions, createEvent: e.currentTarget.checked })}
            />
            <Checkbox
              label="Update existing events"
              checked={syncOptions.updateExisting}
              onChange={(e) => setSyncOptions({ ...syncOptions, updateExisting: e.currentTarget.checked })}
            />
            <Checkbox
              label="Send invites to assignees"
              checked={syncOptions.sendInvites}
              onChange={(e) => setSyncOptions({ ...syncOptions, sendInvites: e.currentTarget.checked })}
            />
            <Checkbox
              label="Include task description"
              checked={syncOptions.includeDescription}
              onChange={(e) => setSyncOptions({ ...syncOptions, includeDescription: e.currentTarget.checked })}
            />
            <Checkbox
              label="Include engagement information"
              checked={syncOptions.includeEngagementInfo}
              onChange={(e) => setSyncOptions({ ...syncOptions, includeEngagementInfo: e.currentTarget.checked })}
            />
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpened(false)}>
              Cancel
            </Button>
            <Button
              leftSection={isLoading ? <Loader size={16} /> : <IconRefresh size={16} />}
              onClick={handleSync}
              disabled={!selectedCalendar || isLoading}
              loading={isLoading}
            >
              Sync Now
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}