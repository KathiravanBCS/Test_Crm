import { Drawer, Stack, Text, Select, SegmentedControl, Switch, Group, Divider, Button } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useTaskViewStore, type CardSize, type CardSpacing } from '@/app/store/taskView.store';

interface BoardSettingsDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function BoardSettingsDrawer({ opened, onClose }: BoardSettingsDrawerProps) {
  const { 
    boardDisplaySettings, 
    setBoardDisplaySettings, 
    toggleBoardField 
  } = useTaskViewStore();

  const handleReset = () => {
    setBoardDisplaySettings({
      cardSize: 'normal',
      columnWidth: 300,
      cardSpacing: 'normal',
      showFields: {
        priority: true,
        progress: true,
        dueDate: true,
        assignee: true,
        timeTracking: true,
        engagementContext: true,
        healthStatus: true,
      },
    });
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconSettings size={20} />
          <Text fw={600}>Board Display Settings</Text>
        </Group>
      }
      position="right"
      size="sm"
      padding="md"
    >
      <Stack gap="lg">
        {/* Card Size */}
        <div>
          <Text size="sm" fw={500} mb="xs">
            Card Size
          </Text>
          <SegmentedControl
            fullWidth
            value={boardDisplaySettings.cardSize}
            onChange={(value) => setBoardDisplaySettings({ cardSize: value as CardSize })}
            data={[
              { label: 'Normal', value: 'normal' },
              { label: 'Compact', value: 'compact' },
              { label: 'Minimal', value: 'minimal' },
            ]}
          />
        </div>

        {/* Column Width */}
        <div>
          <Text size="sm" fw={500} mb="xs">
            Column Width
          </Text>
          <Select
            value={boardDisplaySettings.columnWidth.toString()}
            onChange={(value) => setBoardDisplaySettings({ columnWidth: parseInt(value || '300') })}
            data={[
              { value: '250', label: 'Narrow (250px)' },
              { value: '300', label: 'Normal (300px)' },
              { value: '350', label: 'Wide (350px)' },
            ]}
          />
        </div>

        {/* Card Spacing */}
        <div>
          <Text size="sm" fw={500} mb="xs">
            Card Spacing
          </Text>
          <SegmentedControl
            fullWidth
            value={boardDisplaySettings.cardSpacing}
            onChange={(value) => setBoardDisplaySettings({ cardSpacing: value as CardSpacing })}
            data={[
              { label: 'Normal', value: 'normal' },
              { label: 'Tight', value: 'tight' },
            ]}
          />
        </div>

        <Divider />

        {/* Show Fields */}
        <div>
          <Text size="sm" fw={500} mb="sm">
            Show Fields
          </Text>
          <Stack gap="xs">
            <Switch
              label="Priority Badge"
              checked={boardDisplaySettings.showFields.priority}
              onChange={() => toggleBoardField('priority')}
            />
            <Switch
              label="Progress Bar"
              checked={boardDisplaySettings.showFields.progress}
              onChange={() => toggleBoardField('progress')}
            />
            <Switch
              label="Due Date"
              checked={boardDisplaySettings.showFields.dueDate}
              onChange={() => toggleBoardField('dueDate')}
            />
            <Switch
              label="Assignee"
              checked={boardDisplaySettings.showFields.assignee}
              onChange={() => toggleBoardField('assignee')}
            />
            <Switch
              label="Time Tracking"
              checked={boardDisplaySettings.showFields.timeTracking}
              onChange={() => toggleBoardField('timeTracking')}
            />
            <Switch
              label="Engagement Context"
              checked={boardDisplaySettings.showFields.engagementContext}
              onChange={() => toggleBoardField('engagementContext')}
            />
            <Switch
              label="Health Status"
              checked={boardDisplaySettings.showFields.healthStatus}
              onChange={() => toggleBoardField('healthStatus')}
            />
          </Stack>
        </div>

        <Divider />

        {/* Reset Button */}
        <Button variant="light" onClick={handleReset}>
          Reset to Defaults
        </Button>
      </Stack>
    </Drawer>
  );
}