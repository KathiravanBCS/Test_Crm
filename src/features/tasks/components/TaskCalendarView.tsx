import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Calendar,
  dayjsLocalizer,
  View,
  Views,
  SlotInfo,
  Event,
  EventProps,
  Formats,
  NavigateAction,
  Components,
} from 'react-big-calendar';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {
  Card,
  Group,
  Stack,
  Text,
  Badge,
  ActionIcon,
  Menu,
  Avatar,
  Tooltip,
  Box,
  ScrollArea,
  SegmentedControl,
  MultiSelect,
  Checkbox,
  Paper,
  Button,
  Modal,
  Drawer,
  Loader,
  Center,
  Select,
} from '@mantine/core';
import { IconCalendar, IconList, IconLayoutKanban, IconFilter, IconDownload, IconRefresh, IconChevronLeft, IconChevronRight, IconUsers, IconUser, IconCalendarEvent, IconClock, IconFlag, IconBuilding, IconBriefcase, IconClipboardList } from '@tabler/icons-react';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useTaskViewStore } from '@/app/store/taskView.store';
import { Task, TaskCalendarEvent, TaskCalendarViewSettings } from '../types';
import { getTaskPriorityColor, getTaskHealthColor } from '../utils';
import { TaskDetailDrawer } from './TaskDetailDrawer';
import { TaskForm } from './TaskForm';
import { OutlookCalendarSync } from './OutlookCalendarSync';
import { TeamCalendarView } from './TeamCalendarView';
import { fromApiDate } from '@/lib/utils/date';
import { useGetEmployees } from '@/features/employees/api/useGetEmployees';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import classes from './TaskCalendarView.module.css';

// Initialize dayjs plugins
dayjs.extend(localizedFormat);

// Create the localizer
const localizer = dayjsLocalizer(dayjs);

interface TaskCalendarViewProps {
  tasks: Task[];
  isLoading?: boolean;
  contextType?: string;
  contextId?: number;
  onTaskUpdate?: (task: Task) => void;
  onTaskCreate?: (task: Partial<Task>) => void;
}

// Define calendar event type
interface CalendarEvent extends Event {
  id: number;
  task: Task;
  resourceId?: number; // For employee view
}

// Custom event component
const CustomEvent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
  const { task } = event;
  const priorityColor = getTaskPriorityColor(task.priority);
  const healthColor = task.health_status ? getTaskHealthColor(task.health_status) : undefined;

  return (
    <div className={classes.eventContent}>
      <Group gap={4} wrap="nowrap">
        {task.priority !== 'normal' && (
          <IconFlag size={12} color={priorityColor} />
        )}
        <Text size="xs" truncate fw={500}>
          {task.title}
        </Text>
      </Group>
      {task.assigned_to_employee && (
        <Text size="xs" c="dimmed" truncate>
          {task.assigned_to_employee.name}
        </Text>
      )}
      {healthColor && (
        <Box className={classes.healthIndicator} style={{ backgroundColor: healthColor }} />
      )}
    </div>
  );
};

// Custom agenda event component
const CustomAgendaEvent: React.FC<{ event: CalendarEvent }> = ({ event }) => {
  const { task } = event;
  const priorityColor = getTaskPriorityColor(task.priority);

  return (
    <Group gap="sm" wrap="nowrap">
      {task.priority !== 'normal' && (
        <IconFlag size={14} color={priorityColor} />
      )}
      <Stack gap={0}>
        <Text size="sm" fw={500}>{task.title}</Text>
        {task.assigned_to_employee && (
          <Text size="xs" c="dimmed">
            Assigned to: {task.assigned_to_employee.name}
          </Text>
        )}
        {task.engagement_service_item && (
          <Text size="xs" c="dimmed">
            {task.engagement?.engagementName} - {task.engagement_service_item.serviceName}
          </Text>
        )}
      </Stack>
    </Group>
  );
};

export function TaskCalendarView({
  tasks,
  isLoading = false,
  contextType,
  contextId,
  onTaskUpdate,
  onTaskCreate,
}: TaskCalendarViewProps) {
  const { role, canEditTasks } = useUserRole();
  const { calendarSettings, updateCalendarSettings } = useTaskViewStore();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>(calendarSettings?.defaultView || Views.MONTH);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(calendarSettings?.selectedEmployees || []);
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(calendarSettings?.showMyTasksOnly || false);
  const [showWeekends, setShowWeekends] = useState(calendarSettings?.showWeekends ?? true);
  const [showTeamView, setShowTeamView] = useState(false);
  
  const { data: allEmployees = [] } = useGetEmployees();

  // Get unique employees from tasks
  const employees = useMemo(() => {
    const employeeMap = new Map<number, { id: number; name: string }>();
    tasks.forEach(task => {
      if (task.assigned_to_employee) {
        employeeMap.set(task.assigned_to_employee.id, {
          id: task.assigned_to_employee.id,
          name: task.assigned_to_employee.name,
        });
      }
    });
    return Array.from(employeeMap.values());
  }, [tasks]);

  // Convert tasks to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return tasks
      .filter(task => {
        // Filter by selected employees if in team view
        if (selectedEmployees.length > 0 && task.assigned_to_employee) {
          if (!selectedEmployees.includes(task.assigned_to_employee.id.toString())) {
            return false;
          }
        }
        
        // Filter by current user if "My Tasks Only" is checked
        if (showMyTasksOnly) {
          // TODO: Get current user ID from auth context
          // For now, we'll skip this filter
        }

        return task.due_date;
      })
      .map(task => {
        const dueDate = task.due_date ? new Date(task.due_date) : new Date();
        
        // Calculate start time based on estimated hours
        const startDate = new Date(dueDate);
        if (task.estimated_hours) {
          startDate.setHours(startDate.getHours() - task.estimated_hours);
        } else {
          // Default to 1 hour duration
          startDate.setHours(startDate.getHours() - 1);
        }

        return {
          id: task.id,
          title: task.title,
          start: startDate,
          end: dueDate,
          task,
          resourceId: task.assigned_to_employee?.id,
          allDay: false,
        };
      });
  }, [tasks, selectedEmployees, showMyTasksOnly]);

  // Calendar formats
  const formats: Formats = useMemo(() => ({
    dayFormat: 'DD',
    dayHeaderFormat: 'dddd, MMMM DD',
    dayRangeHeaderFormat: ({ start, end }) => 
      `${dayjs(start).format('MMMM DD')} - ${dayjs(end).format('MMMM DD, YYYY')}`,
    monthHeaderFormat: 'MMMM YYYY',
    weekdayFormat: 'ddd',
    timeGutterFormat: 'h:mm A',
    eventTimeRangeFormat: ({ start, end }) => 
      `${dayjs(start).format('h:mm A')} - ${dayjs(end).format('h:mm A')}`,
    agendaDateFormat: 'ddd MMM DD',
    agendaTimeFormat: 'h:mm A',
    agendaTimeRangeFormat: ({ start, end }) => 
      `${dayjs(start).format('h:mm A')} - ${dayjs(end).format('h:mm A')}`,
  }), []);

  // Custom components
  const components: Components<CalendarEvent> = useMemo(() => ({
    event: CustomEvent,
    agenda: {
      event: CustomAgendaEvent,
    },
  }), []);

  // Handle slot selection (for creating new tasks)
  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    if (canEditTasks) {
      setSelectedSlot(slotInfo);
      setShowTaskForm(true);
    }
  }, [canEditTasks]);

  // Handle event selection
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedTask(event.task);
  }, []);

  // Handle navigation
  const handleNavigate = useCallback((newDate: Date, view: View, action: NavigateAction) => {
    setCurrentDate(newDate);
  }, []);

  // Handle view change
  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
    updateCalendarSettings({ ...calendarSettings, defaultView: newView });
  }, [calendarSettings, updateCalendarSettings]);

  // Save settings when they change
  useEffect(() => {
    updateCalendarSettings({
      defaultView: view,
      selectedEmployees,
      showMyTasksOnly,
      showWeekends,
    });
  }, [view, selectedEmployees, showMyTasksOnly, showWeekends, updateCalendarSettings]);

  // Custom toolbar
  const toolbar = (
    <Group justify="space-between" mb="md">
      <Group>
        <Button.Group>
          <Button
            variant="default"
            size="sm"
            leftSection={<IconChevronLeft size={16} />}
            onClick={() => {
              const newDate = dayjs(currentDate).subtract(1, view === Views.DAY ? 'day' : view === Views.WEEK ? 'week' : 'month').toDate();
              setCurrentDate(newDate);
            }}
          >
            Previous
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="default"
            size="sm"
            rightSection={<IconChevronRight size={16} />}
            onClick={() => {
              const newDate = dayjs(currentDate).add(1, view === Views.DAY ? 'day' : view === Views.WEEK ? 'week' : 'month').toDate();
              setCurrentDate(newDate);
            }}
          >
            Next
          </Button>
        </Button.Group>
        
        <Text size="lg" fw={600}>
          {dayjs(currentDate).format(view === Views.DAY ? 'MMMM DD, YYYY' : 'MMMM YYYY')}
        </Text>
      </Group>

      <Group>
        <OutlookCalendarSync tasks={tasks} />
        
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="default" size="lg">
              <IconFilter size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>View Options</Menu.Label>
            <Menu.Item>
              <Checkbox
                label="Show weekends"
                checked={showWeekends}
                onChange={(e) => setShowWeekends(e.currentTarget.checked)}
              />
            </Menu.Item>
            <Menu.Item>
              <Checkbox
                label="My tasks only"
                checked={showMyTasksOnly}
                onChange={(e) => setShowMyTasksOnly(e.currentTarget.checked)}
              />
            </Menu.Item>
            <Menu.Item>
              <Checkbox
                label="Team view"
                checked={showTeamView}
                onChange={(e) => setShowTeamView(e.currentTarget.checked)}
              />
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>Team View</Menu.Label>
            <MultiSelect
              data={employees.map(emp => ({
                value: emp.id.toString(),
                label: emp.name,
              }))}
              value={selectedEmployees}
              onChange={setSelectedEmployees}
              placeholder="Select team members"
              clearable
              searchable
              size="xs"
            />
          </Menu.Dropdown>
        </Menu>

        <SegmentedControl
          value={view}
          onChange={(value) => handleViewChange(value as View)}
          data={[
            { label: 'Month', value: Views.MONTH },
            { label: 'Week', value: Views.WEEK },
            { label: 'Day', value: Views.DAY },
            { label: 'Agenda', value: Views.AGENDA },
          ]}
          size="sm"
        />
      </Group>
    </Group>
  );

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <>
      <Card p="md" h="100%">
        {toolbar}
        
        {showTeamView && selectedEmployees.length > 0 ? (
          <TeamCalendarView
            tasks={tasks}
            employees={allEmployees}
            selectedEmployeeIds={selectedEmployees.map(id => parseInt(id))}
            isLoading={isLoading}
            onTaskClick={(task) => setSelectedTask(task)}
          />
        ) : (
          <Box className={classes.calendarContainer}>
            <Calendar<CalendarEvent>
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              view={view}
              onNavigate={handleNavigate}
              onView={handleViewChange}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable={canEditTasks}
              popup
              toolbar={false}
              formats={formats}
              components={components}
              style={{ height: 'calc(100vh - 300px)', minHeight: 600 }}
              dayLayoutAlgorithm="no-overlap"
              showAllEvents
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            />
          </Box>
        )}
      </Card>

      {/* Task Detail Drawer */}
      {selectedTask && (
        <TaskDetailDrawer
          task={selectedTask}
          opened={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={onTaskUpdate}
        />
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <Modal
          opened={showTaskForm}
          onClose={() => {
            setShowTaskForm(false);
            setSelectedSlot(null);
          }}
          title="Create Task"
          size="lg"
        >
          <TaskForm
            initialValues={{
              due_date: selectedSlot?.start ? selectedSlot.start.toISOString() : undefined,
              context_type: contextType,
              context_id: contextId,
            }}
            onSubmit={(values) => {
              onTaskCreate?.(values);
              setShowTaskForm(false);
              setSelectedSlot(null);
            }}
            onCancel={() => {
              setShowTaskForm(false);
              setSelectedSlot(null);
            }}
          />
        </Modal>
      )}
    </>
  );
}