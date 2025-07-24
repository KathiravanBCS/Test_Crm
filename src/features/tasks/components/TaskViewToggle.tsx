import { SegmentedControl, Group, Tooltip } from '@mantine/core';
import { IconList, IconLayoutKanban, IconCalendar, IconTimeline } from '@tabler/icons-react';
import type { TaskViewType } from '../types';

interface TaskViewToggleProps {
  value: TaskViewType;
  onChange: (value: TaskViewType) => void;
  availableViews?: TaskViewType[];
}

const viewConfig: Record<TaskViewType, { label: string; icon: React.ReactNode; tooltip: string }> = {
  list: {
    label: 'List',
    icon: <IconList size={16} />,
    tooltip: 'Table view with grouping options',
  },
  board: {
    label: 'Board',
    icon: <IconLayoutKanban size={16} />,
    tooltip: 'Kanban board view',
  },
  calendar: {
    label: 'Calendar',
    icon: <IconCalendar size={16} />,
    tooltip: 'Calendar view with scheduling and team management',
  },
  gantt: {
    label: 'Timeline',
    icon: <IconTimeline size={16} />,
    tooltip: 'Gantt chart view (coming soon)',
  },
};

export function TaskViewToggle({
  value,
  onChange,
  availableViews = ['list', 'board'],
}: TaskViewToggleProps) {
  const data = availableViews.map((view) => {
    const config = viewConfig[view];
    const isDisabled = view === 'gantt';
    
    return {
      value: view,
      label: (
        <Tooltip label={config.tooltip} disabled={!isDisabled}>
          <Group gap={6} wrap="nowrap">
            {config.icon}
            <span>{config.label}</span>
          </Group>
        </Tooltip>
      ),
      disabled: isDisabled,
    };
  });

  return (
    <SegmentedControl
      value={value}
      onChange={(val) => onChange(val as TaskViewType)}
      data={data}
      size="sm"
    />
  );
}