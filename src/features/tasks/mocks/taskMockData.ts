import type { Task, TaskStatus } from '../types';
import type { Engagement, EngagementServiceItem } from '@/features/engagements/types';
import type { EmployeeProfile, MasterStatus } from '@/types';

// Minimal mock data for stories and tests
export const mockEmployees: EmployeeProfile[] = [
  {
    id: 1,
    employeeCode: 'EMP001',
    name: 'John Manager',
    firstName: 'John',
    lastName: 'Manager',
    email: 'john.manager@company.com',
    phoneNumber: '+1 555-0101',
    role: 'Manager',
    statusId: 23, // Active
    status: { id: 23, context: 'EMPLOYEE', statusCode: 'active', statusName: 'Active', sequence: 10, isFinal: false, isActive: true },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    employeeCode: 'EMP002',
    name: 'Sarah Analyst',
    firstName: 'Sarah',
    lastName: 'Analyst',
    email: 'sarah.analyst@company.com',
    phoneNumber: '+1 555-0102',
    role: 'Consultant',
    statusId: 23, // Active
    status: { id: 23, context: 'EMPLOYEE', statusCode: 'active', statusName: 'Active', sequence: 10, isFinal: false, isActive: true },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const mockTaskStatuses: TaskStatus[] = [
  { id: 1, context: 'TASK', status_code: 'pending', status_name: 'Pending', sequence: 10, is_final: false, is_active: true },
  { id: 2, context: 'TASK', status_code: 'in_progress', status_name: 'In Progress', sequence: 20, is_final: false, is_active: true },
  { id: 3, context: 'TASK', status_code: 'completed', status_name: 'Completed', sequence: 30, is_final: true, is_active: true }
];

export const mockEngagement: Engagement = {
  id: 1,
  engagementName: 'Q1 2025 Tax Advisory',
  engagementLetterId: 1,
  statusId: 2,
  progressPercentage: 65,
  startDate: '2025-01-01',
  endDate: '2025-03-31',
  createdAt: new Date('2024-12-28'),
  updatedAt: new Date('2025-01-15'),
  status: { id: 2, context: 'ENGAGEMENT', statusCode: 'in_progress', statusName: 'In Progress', sequence: 20, isFinal: false, isActive: true }
};

export const mockServiceItem: EngagementServiceItem = {
  id: 1,
  serviceName: 'Tax Compliance Review',
  serviceDescription: 'Review tax compliance documentation',
  engagementPhaseId: 1,
  engagementLetterServiceItemId: 1,
  statusId: 2,
  createdAt: new Date('2024-12-28'),
  updatedAt: new Date('2025-01-15'),
  status: { id: 2, context: 'SERVICE_ITEM', statusCode: 'in_progress', statusName: 'In Progress', sequence: 20, isFinal: false, isActive: true }
};

export function createMockTask(overrides: Partial<Task> = {}): Task {
  const baseTask: Task = {
    id: 1,
    title: 'Sample Task',
    description: 'This is a sample task',
    assigned_to: 1,
    assigned_to_employee: mockEmployees[0],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'normal',
    due_date: '2025-02-01',
    context_type: 'ENGAGEMENT',
    context_id: 1,
    estimated_hours: 8,
    logged_hours: 0,
    requires_approval: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return { ...baseTask, ...overrides };
}

export function createMockTasks(count: number, baseDate = new Date()): Task[] {
  const tasks: Task[] = [];
  const priorities: Array<'low' | 'normal' | 'high' | 'urgent'> = ['low', 'normal', 'high', 'urgent'];
  const titles = [
    'Review Financial Documents',
    'Client Meeting',
    'Prepare Tax Report',
    'Compliance Check',
    'Budget Analysis',
    'Quarterly Review',
    'Audit Preparation',
    'Risk Assessment'
  ];

  for (let i = 0; i < count; i++) {
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));
    
    const statusId = Math.floor(Math.random() * 3) + 1;
    const assignedToId = Math.floor(Math.random() * 2) + 1;
    
    tasks.push({
      id: i + 1,
      title: titles[i % titles.length] + ` #${i + 1}`,
      description: `Description for task ${i + 1}`,
      assigned_to: assignedToId,
      assigned_to_employee: mockEmployees[assignedToId - 1],
      created_by: 1,
      created_by_employee: mockEmployees[0],
      status_id: statusId,
      status: mockTaskStatuses[statusId - 1],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      due_date: dueDate.toISOString().split('T')[0],
      context_type: 'ENGAGEMENT',
      context_id: 1,
      estimated_hours: Math.floor(Math.random() * 16) + 2,
      logged_hours: statusId > 1 ? Math.floor(Math.random() * 8) : 0,
      requires_approval: Math.random() > 0.7,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      engagement: mockEngagement
    });
  }

  return tasks;
}