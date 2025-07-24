import { useState, useMemo } from 'react';
import { Card, Group, Stack, Text, Avatar, Badge, ScrollArea, Box, Divider, Loader, Center, ActionIcon, Tooltip } from '@mantine/core';
import { Calendar, dayjsLocalizer, View, Views, Event } from 'react-big-calendar';
import dayjs from 'dayjs';
import { IconUser, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Task } from '../types';
import { getTaskPriorityColor, getTaskHealthColor } from '../utils';
import { fromApiDate } from '@/lib/utils/date';
import { EmployeeProfile } from '@/types';
import classes from './TeamCalendarView.module.css';

const localizer = dayjsLocalizer(dayjs);

interface TeamCalendarViewProps {
  tasks: Task[];
  employees: EmployeeProfile[];
  selectedEmployeeIds: number[];
  isLoading?: boolean;
  onTaskClick?: (task: Task) => void;
}

interface EmployeeCalendarEvent extends Event {
  task: Task;
  employeeId: number;
}

export function TeamCalendarView({ 
  tasks, 
  employees, 
  selectedEmployeeIds, 
  isLoading,
  onTaskClick 
}: TeamCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.WEEK);

  // Filter employees based on selection
  const selectedEmployees = useMemo(() => 
    employees.filter(emp => selectedEmployeeIds.includes(emp.id)),
    [employees, selectedEmployeeIds]
  );

  // Group tasks by employee
  const tasksByEmployee = useMemo(() => {
    const grouped = new Map<number, Task[]>();
    
    tasks.forEach(task => {
      if (task.assigned_to_employee && task.due_date) {
        const employeeId = task.assigned_to_employee.id;
        if (selectedEmployeeIds.includes(employeeId)) {
          if (!grouped.has(employeeId)) {
            grouped.set(employeeId, []);
          }
          grouped.get(employeeId)!.push(task);
        }
      }
    });

    return grouped;
  }, [tasks, selectedEmployeeIds]);

  // Create events for each employee
  const getEmployeeEvents = (employeeId: number): EmployeeCalendarEvent[] => {
    const employeeTasks = tasksByEmployee.get(employeeId) || [];
    
    return employeeTasks.map(task => {
      const dueDate = new Date(task.due_date!);
      const startDate = new Date(dueDate);
      
      if (task.estimated_hours) {
        startDate.setHours(startDate.getHours() - task.estimated_hours);
      } else {
        startDate.setHours(startDate.getHours() - 1);
      }

      return {
        id: task.id,
        title: task.title,
        start: startDate,
        end: dueDate,
        task,
        employeeId,
      };
    });
  };

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    let newDate = new Date(currentDate);
    
    switch (action) {
      case 'PREV':
        newDate = dayjs(currentDate).subtract(1, view === Views.DAY ? 'day' : 'week').toDate();
        break;
      case 'NEXT':
        newDate = dayjs(currentDate).add(1, view === Views.DAY ? 'day' : 'week').toDate();
        break;
      case 'TODAY':
        newDate = new Date();
        break;
    }
    
    setCurrentDate(newDate);
  };

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (selectedEmployees.length === 0) {
    return (
      <Card p="xl">
        <Center h={300}>
          <Stack align="center" gap="md">
            <IconUser size={48} color="var(--mantine-color-gray-6)" />
            <Text c="dimmed">Select team members to view their calendars</Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  return (
    <Card p="md">
      <Stack gap="md">
        {/* Navigation Header */}
        <Group justify="space-between">
          <Group>
            <ActionIcon 
              variant="default" 
              onClick={() => handleNavigate('PREV')}
            >
              <IconChevronLeft size={16} />
            </ActionIcon>
            <ActionIcon 
              variant="default" 
              onClick={() => handleNavigate('TODAY')}
            >
              Today
            </ActionIcon>
            <ActionIcon 
              variant="default" 
              onClick={() => handleNavigate('NEXT')}
            >
              <IconChevronRight size={16} />
            </ActionIcon>
            <Text fw={600}>
              {dayjs(currentDate).format('MMMM YYYY')}
            </Text>
          </Group>
          <Text size="sm" c="dimmed">
            {selectedEmployees.length} team member{selectedEmployees.length !== 1 ? 's' : ''}
          </Text>
        </Group>

        <Divider />

        {/* Employee Calendars */}
        <ScrollArea h="calc(100vh - 400px)" type="auto">
          <Stack gap="xl">
            {selectedEmployees.map((employee) => {
              const events = getEmployeeEvents(employee.id);
              const taskCount = events.length;
              
              return (
                <Box key={employee.id} className={classes.employeeCalendarSection}>
                  <Group mb="sm" justify="space-between">
                    <Group gap="sm">
                      <Avatar size="sm" color="blue" radius="xl">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Text fw={500}>
                        {employee.name}
                      </Text>
                      <Badge size="sm" variant="light">
                        {taskCount} task{taskCount !== 1 ? 's' : ''}
                      </Badge>
                    </Group>
                  </Group>
                  
                  <Box h={250} className={classes.calendarContainer}>
                    <Calendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      date={currentDate}
                      view={view}
                      onView={setView}
                      onNavigate={setCurrentDate}
                      toolbar={false}
                      style={{ height: '100%' }}
                      onSelectEvent={(event) => onTaskClick?.(event.task)}
                      views={[Views.WEEK, Views.DAY]}
                      eventPropGetter={(event: EmployeeCalendarEvent) => {
                        const priority = event.task.priority;
                        const priorityColor = getTaskPriorityColor(priority);
                        
                        return {
                          style: {
                            backgroundColor: priorityColor,
                            fontSize: '11px',
                            padding: '2px 4px',
                          },
                        };
                      }}
                      components={{
                        event: ({ event }: { event: EmployeeCalendarEvent }) => (
                          <Tooltip label={event.task.title}>
                            <Text size="xs" truncate>
                              {event.title}
                            </Text>
                          </Tooltip>
                        ),
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </ScrollArea>
      </Stack>
    </Card>
  );
}