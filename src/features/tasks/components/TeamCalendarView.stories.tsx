import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import dayjs from 'dayjs';
import { TeamCalendarView } from './TeamCalendarView';
import { Task } from '../types';
import { EmployeeProfile } from '@/types/common';

// Import the same mock data generation from TaskCalendarView stories
import { faker } from '@faker-js/faker';

// Mock employees for team view
const mockEmployees: EmployeeProfile[] = [
  { 
    id: 1,
    employeeCode: 'EMP001',
    name: 'Rajesh Kumar',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh@company.com',
    phoneNumber: '+91-9876543210',
    role: 'Manager',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { 
    id: 2,
    employeeCode: 'EMP002',
    name: 'Priya Sharma',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya@company.com',
    phoneNumber: '+91-9876543211',
    role: 'Consultant',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { 
    id: 3,
    employeeCode: 'EMP003',
    name: 'Amit Patel',
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit@company.com',
    phoneNumber: '+91-9876543212',
    role: 'Consultant',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { 
    id: 4,
    employeeCode: 'EMP004',
    name: 'Sneha Gupta',
    firstName: 'Sneha',
    lastName: 'Gupta',
    email: 'sneha@company.com',
    phoneNumber: '+91-9876543213',
    role: 'Consultant',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  { 
    id: 5,
    employeeCode: 'EMP005',
    name: 'Vikram Singh',
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram@company.com',
    phoneNumber: '+91-9876543214',
    role: 'Manager',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock statuses
const mockStatuses = [
  { id: 1, status_code: 'todo', status_name: 'To Do', is_final: false },
  { id: 2, status_code: 'in_progress', status_name: 'In Progress', is_final: false },
  { id: 3, status_code: 'review', status_name: 'Review', is_final: false },
  { id: 4, status_code: 'done', status_name: 'Done', is_final: true },
];

// Generate tasks for team view
function generateTeamTasks(employeeIds: number[], tasksPerEmployee: number): Task[] {
  const tasks: Task[] = [];
  let taskId = 1;
  
  employeeIds.forEach(employeeId => {
    const employee = mockEmployees.find(e => e.id === employeeId);
    if (!employee) return;
    
    for (let i = 0; i < tasksPerEmployee; i++) {
      const dueDate = faker.date.between({
        from: dayjs().subtract(1, 'week').toDate(),
        to: dayjs().add(2, 'week').toDate(),
      });
      
      const priority = faker.helpers.arrayElement(['low', 'normal', 'high', 'urgent'] as const);
      const status = faker.helpers.arrayElement(mockStatuses);
      const estimatedHours = faker.number.int({ min: 1, max: 8 });
      
      tasks.push({
        id: taskId++,
        title: faker.helpers.arrayElement([
          `Review Q${faker.number.int({ min: 1, max: 4 })} reports`,
          `Client meeting - ${faker.company.name()}`,
          `Prepare ${faker.commerce.department()} analysis`,
          `Update ${faker.hacker.noun()} documentation`,
          `Audit ${faker.company.buzzPhrase()}`,
        ]),
        description: faker.lorem.sentence(),
        assigned_to: employeeId,
        assigned_to_employee: employee,
        created_by: 1,
        status_id: status.id,
        status: status as any,
        priority,
        due_date: dueDate.toISOString(),
        estimated_hours: estimatedHours,
        logged_hours: faker.number.float({ min: 0, max: estimatedHours, fractionDigits: 1 }),
        requires_approval: false,
        created_at: faker.date.past({ years: 0.1 }).toISOString(),
        updated_at: faker.date.recent({ days: 7 }).toISOString(),
      });
    }
  });
  
  return tasks;
}

const meta: Meta<typeof TeamCalendarView> = {
  title: 'Tasks/TeamCalendarView',
  component: TeamCalendarView,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic team view with 3 employees
export const Default: Story = {
  args: {
    tasks: generateTeamTasks([1, 2, 3], 10),
    employees: mockEmployees,
    selectedEmployeeIds: [1, 2, 3],
    isLoading: false,
  },
};

// Single employee view
export const SingleEmployee: Story = {
  args: {
    tasks: generateTeamTasks([1], 15),
    employees: mockEmployees,
    selectedEmployeeIds: [1],
    isLoading: false,
  },
};

// Full team view
export const FullTeam: Story = {
  args: {
    tasks: generateTeamTasks([1, 2, 3, 4, 5], 8),
    employees: mockEmployees,
    selectedEmployeeIds: [1, 2, 3, 4, 5],
    isLoading: false,
  },
};

// No employees selected
export const NoSelection: Story = {
  args: {
    tasks: generateTeamTasks([1, 2, 3], 10),
    employees: mockEmployees,
    selectedEmployeeIds: [],
    isLoading: false,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    tasks: [],
    employees: mockEmployees,
    selectedEmployeeIds: [1, 2, 3],
    isLoading: true,
  },
};

// Uneven workload distribution
export const UnevenWorkload: Story = {
  args: {
    tasks: [
      ...generateTeamTasks([1], 20), // Heavy load for employee 1
      ...generateTeamTasks([2], 5),  // Light load for employee 2
      ...generateTeamTasks([3], 12), // Medium load for employee 3
    ],
    employees: mockEmployees,
    selectedEmployeeIds: [1, 2, 3],
    isLoading: false,
  },
};

// Today's tasks focus
export const TodayFocus: Story = {
  args: {
    tasks: mockEmployees.slice(0, 3).flatMap(employee => 
      Array.from({ length: 3 }, (_, i) => ({
        id: employee.id * 10 + i,
        title: `Today's task ${i + 1} for ${employee.name}`,
        assigned_to: employee.id,
        assigned_to_employee: employee,
        due_date: dayjs().add(i * 2, 'hours').toISOString(),
        priority: 'normal' as const,
        status_id: 1,
        status: mockStatuses[0] as any,
        estimated_hours: 2,
        logged_hours: 0,
        created_at: dayjs().subtract(1, 'day').toISOString(),
        updated_at: dayjs().toISOString(),
        created_by: 1,
        requires_approval: false,
        description: '',
      }))
    ),
    employees: mockEmployees,
    selectedEmployeeIds: [1, 2, 3],
    isLoading: false,
  },
};

// Interactive with task selection
export const Interactive: Story = {
  render: () => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const tasks = generateTeamTasks([1, 2, 3], 10);

    return (
      <div>
        <TeamCalendarView
          tasks={tasks}
          employees={mockEmployees}
          selectedEmployeeIds={[1, 2, 3]}
          isLoading={false}
          onTaskClick={(task) => {
            setSelectedTask(task);
            console.log('Selected task:', task);
          }}
        />
        {selectedTask && (
          <div style={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20, 
            background: 'white', 
            padding: 20, 
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            maxWidth: 300,
          }}>
            <h4 style={{ margin: '0 0 10px' }}>Selected Task</h4>
            <p><strong>{selectedTask.title}</strong></p>
            <p>Assigned to: {selectedTask.assigned_to_employee?.name}</p>
            <p>Due: {dayjs(selectedTask.due_date).format('MMM DD, YYYY')}</p>
            <button onClick={() => setSelectedTask(null)}>Close</button>
          </div>
        )}
      </div>
    );
  },
};

// Manager view - high priority tasks
export const ManagerView: Story = {
  args: {
    tasks: generateTeamTasks([1, 2, 3, 4, 5], 8).map(task => ({
      ...task,
      priority: faker.helpers.weightedArrayElement([
        { value: 'urgent' as const, weight: 3 },
        { value: 'high' as const, weight: 5 },
        { value: 'normal' as const, weight: 2 },
      ]),
    })),
    employees: mockEmployees,
    selectedEmployeeIds: [1, 2, 3, 4, 5],
    isLoading: false,
  },
};

// Weekend coverage
export const WeekendCoverage: Story = {
  args: {
    tasks: [1, 2, 3].flatMap(employeeId => 
      [0, 1].map(weekOffset => ({
        id: employeeId * 10 + weekOffset,
        title: `Weekend support duty`,
        assigned_to: employeeId,
        assigned_to_employee: mockEmployees.find(e => e.id === employeeId),
        due_date: dayjs().day(6).add(weekOffset, 'week').toISOString(),
        priority: 'high' as const,
        status_id: 1,
        status: mockStatuses[0] as any,
        estimated_hours: 4,
        logged_hours: 0,
        created_at: dayjs().subtract(1, 'week').toISOString(),
        updated_at: dayjs().toISOString(),
        created_by: 1,
        requires_approval: false,
        description: 'Weekend on-call support',
      }))
    ),
    employees: mockEmployees,
    selectedEmployeeIds: [1, 2, 3],
    isLoading: false,
  },
};