import { Task, TaskStatus } from '@/features/tasks/types';
import { mockEmployees } from '../data/employees';
import { engagements as mockEngagements } from '../data/engagements';

// Mock task statuses
const mockTaskStatuses: TaskStatus[] = [
  { id: 1, context: 'TASK', status_code: 'pending', status_name: 'Pending', sequence: 10, is_final: false, is_active: true },
  { id: 2, context: 'TASK', status_code: 'in_progress', status_name: 'In Progress', sequence: 20, is_final: false, is_active: true },
  { id: 3, context: 'TASK', status_code: 'review', status_name: 'Under Review', sequence: 30, is_final: false, is_active: true },
  { id: 4, context: 'TASK', status_code: 'completed', status_name: 'Completed', sequence: 40, is_final: true, is_active: true },
  { id: 5, context: 'TASK', status_code: 'cancelled', status_name: 'Cancelled', sequence: 50, is_final: true, is_active: true }
];

// Additional tasks for calendar view testing
const additionalTasks: Task[] = [
  // Tasks for current week
  {
    id: 9,
    title: 'Quarterly Review Meeting',
    description: 'Complete comprehensive review and provide recommendations',
    assigned_to: 2,
    assigned_to_employee: mockEmployees[1],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'high',
    due_date: '2025-01-22',
    context_type: 'ENGAGEMENT',
    context_id: 1,
    estimated_hours: 4,
    logged_hours: 0,
    requires_approval: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
    engagement: mockEngagements[0]
  },
  {
    id: 10,
    title: 'Budget Analysis',
    description: 'Analyze data and prepare detailed report',
    assigned_to: 3,
    assigned_to_employee: mockEmployees[2],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 2,
    status: mockTaskStatuses[1],
    priority: 'normal',
    due_date: '2025-01-22',
    context_type: 'ENGAGEMENT_SERVICE_ITEM',
    context_id: 2,
    estimated_hours: 8,
    logged_hours: 2,
    requires_approval: false,
    created_at: '2025-01-16T09:00:00Z',
    updated_at: '2025-01-20T14:00:00Z',
    engagement: mockEngagements[0]
  },
  {
    id: 11,
    title: 'Compliance Audit',
    description: 'Review and validate all relevant documentation',
    assigned_to: 1,
    assigned_to_employee: mockEmployees[0],
    created_by: 2,
    created_by_employee: mockEmployees[1],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'urgent',
    due_date: '2025-01-24',
    context_type: 'ENGAGEMENT_PHASE',
    context_id: 1,
    estimated_hours: 12,
    logged_hours: 0,
    requires_approval: true,
    created_at: '2025-01-17T11:00:00Z',
    updated_at: '2025-01-17T11:00:00Z',
    engagement: mockEngagements[1]
  },
  // Tasks for next week
  {
    id: 12,
    title: 'Risk Assessment Report',
    description: 'Assess current status and identify improvement areas',
    assigned_to: 2,
    assigned_to_employee: mockEmployees[1],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'high',
    due_date: '2025-01-27',
    context_type: 'ENGAGEMENT',
    context_id: 2,
    estimated_hours: 10,
    logged_hours: 0,
    requires_approval: false,
    created_at: '2025-01-18T08:00:00Z',
    updated_at: '2025-01-18T08:00:00Z',
    engagement: mockEngagements[1]
  },
  {
    id: 13,
    title: 'Financial Statement Review',
    description: 'Conduct thorough evaluation and present findings',
    assigned_to: 3,
    assigned_to_employee: mockEmployees[2],
    created_by: 2,
    created_by_employee: mockEmployees[1],
    status_id: 2,
    status: mockTaskStatuses[1],
    priority: 'normal',
    due_date: '2025-01-28',
    context_type: 'ENGAGEMENT_SERVICE_ITEM',
    context_id: 3,
    estimated_hours: 6,
    logged_hours: 3,
    requires_approval: true,
    created_at: '2025-01-19T10:00:00Z',
    updated_at: '2025-01-20T16:00:00Z',
    engagement: mockEngagements[0]
  },
  // February tasks
  {
    id: 14,
    title: 'Tax Planning Session',
    description: 'Review tax compliance documentation',
    assigned_to: 1,
    assigned_to_employee: mockEmployees[0],
    created_by: 2,
    created_by_employee: mockEmployees[1],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'high',
    due_date: '2025-02-03',
    context_type: 'ENGAGEMENT',
    context_id: 1,
    estimated_hours: 8,
    logged_hours: 0,
    requires_approval: false,
    created_at: '2025-01-20T09:00:00Z',
    updated_at: '2025-01-20T09:00:00Z',
    engagement: mockEngagements[0]
  },
  {
    id: 15,
    title: 'Client Status Update',
    description: 'Present current project status to client',
    assigned_to: 2,
    assigned_to_employee: mockEmployees[1],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'normal',
    due_date: '2025-02-05',
    context_type: 'ENGAGEMENT_PHASE',
    context_id: 2,
    estimated_hours: 2,
    logged_hours: 0,
    requires_approval: false,
    created_at: '2025-01-20T11:00:00Z',
    updated_at: '2025-01-20T11:00:00Z',
    engagement: mockEngagements[1]
  },
  {
    id: 16,
    title: 'Internal Process Review',
    description: 'Review and optimize internal processes',
    assigned_to: 3,
    assigned_to_employee: mockEmployees[2],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'low',
    due_date: '2025-02-10',
    context_type: 'ENGAGEMENT',
    context_id: 1,
    estimated_hours: 16,
    logged_hours: 0,
    requires_approval: true,
    created_at: '2025-01-20T13:00:00Z',
    updated_at: '2025-01-20T13:00:00Z',
    engagement: mockEngagements[0]
  },
  // Multiple tasks on same day
  {
    id: 17,
    title: 'Morning Team Meeting',
    description: 'Weekly team sync meeting',
    assigned_to: 1,
    assigned_to_employee: mockEmployees[0],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'normal',
    due_date: '2025-01-25',
    context_type: 'ENGAGEMENT',
    context_id: 1,
    estimated_hours: 1,
    logged_hours: 0,
    requires_approval: false,
    created_at: '2025-01-20T14:00:00Z',
    updated_at: '2025-01-20T14:00:00Z',
    engagement: mockEngagements[0]
  },
  {
    id: 18,
    title: 'Afternoon Client Call',
    description: 'Discuss project progress with client',
    assigned_to: 1,
    assigned_to_employee: mockEmployees[0],
    created_by: 2,
    created_by_employee: mockEmployees[1],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'high',
    due_date: '2025-01-25',
    context_type: 'ENGAGEMENT',
    context_id: 1,
    estimated_hours: 2,
    logged_hours: 0,
    requires_approval: false,
    created_at: '2025-01-20T14:30:00Z',
    updated_at: '2025-01-20T14:30:00Z',
    engagement: mockEngagements[0]
  },
  {
    id: 19,
    title: 'Document Submission Deadline',
    description: 'Submit all required documents',
    assigned_to: 2,
    assigned_to_employee: mockEmployees[1],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'urgent',
    due_date: '2025-01-25',
    context_type: 'ENGAGEMENT_SERVICE_ITEM',
    context_id: 1,
    estimated_hours: 3,
    logged_hours: 0,
    requires_approval: true,
    created_at: '2025-01-20T15:00:00Z',
    updated_at: '2025-01-20T15:00:00Z',
    engagement: mockEngagements[0]
  }
];

// Mock tasks - original set plus generated ones
const baseTasksArray: Task[] = [
  {
    id: 1,
    title: 'Review Transaction Analysis Report',
    description: 'Review and validate the transaction analysis report for Q1 2025',
    assigned_to: 2,
    assigned_to_employee: mockEmployees[1],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 2,
    status: mockTaskStatuses[1],
    priority: 'high',
    due_date: '2025-02-15',
    context_type: 'ENGAGEMENT_SERVICE_ITEM',
    context_id: 1,
    estimated_hours: 8,
    logged_hours: 3,
    requires_approval: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-18T14:30:00Z',
    engagement: mockEngagements[0],
    engagement_phase: {
      id: 1,
      engagementId: 1,
      phaseName: 'Data Gathering',
      phaseDescription: 'Collect and organize financial data',
      statusId: 2,
      progressPercentage: 45,
      phaseStartDate: '2025-01-15',
      phaseEndDate: '2025-02-15',
      baselineStartDate: '2025-01-15',
      baselineEndDate: '2025-02-15',
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15')
    }
  },
  {
    id: 2,
    title: 'Prepare Benchmarking Analysis',
    description: 'Create comprehensive benchmarking analysis comparing with industry standards',
    assigned_to: 3,
    assigned_to_employee: mockEmployees[2],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'normal',
    due_date: '2025-02-20',
    context_type: 'ENGAGEMENT_SERVICE_ITEM',
    context_id: 1,
    estimated_hours: 12,
    logged_hours: 0,
    requires_approval: false,
    created_at: '2025-01-16T09:00:00Z',
    updated_at: '2025-01-16T09:00:00Z',
    engagement: mockEngagements[0]
  },
  {
    id: 3,
    title: 'Client Meeting - Discuss Initial Findings',
    description: 'Present initial findings and gather feedback from client',
    assigned_to: 1,
    assigned_to_employee: mockEmployees[0],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 4,
    status: mockTaskStatuses[3],
    priority: 'urgent',
    due_date: '2025-01-20',
    context_type: 'ENGAGEMENT',
    context_id: 1,
    estimated_hours: 2,
    logged_hours: 2,
    requires_approval: false,
    created_at: '2025-01-10T11:00:00Z',
    updated_at: '2025-01-20T16:00:00Z',
    engagement: mockEngagements[0]
  },
  {
    id: 4,
    title: 'Update Financial Model',
    description: 'Incorporate latest data into the financial model',
    assigned_to: 2,
    assigned_to_employee: mockEmployees[1],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 2,
    status: mockTaskStatuses[1],
    priority: 'high',
    due_date: '2025-01-25',
    context_type: 'ENGAGEMENT_PHASE',
    context_id: 1,
    estimated_hours: 6,
    logged_hours: 4,
    requires_approval: true,
    created_at: '2025-01-18T13:00:00Z',
    updated_at: '2025-01-19T10:00:00Z',
    engagement: mockEngagements[0]
  },
  {
    id: 5,
    title: 'Document Control Procedures',
    description: 'Document all control procedures identified during the audit',
    assigned_to: 3,
    assigned_to_employee: mockEmployees[2],
    created_by: 2,
    created_by_employee: mockEmployees[1],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'normal',
    due_date: '2025-03-01',
    context_type: 'ENGAGEMENT_SERVICE_ITEM',
    context_id: 2,
    estimated_hours: 10,
    logged_hours: 0,
    requires_approval: false,
    created_at: '2025-01-19T14:00:00Z',
    updated_at: '2025-01-19T14:00:00Z',
    engagement: mockEngagements[1]
  },
  {
    id: 6,
    title: 'Review Draft Proposal',
    description: 'Review and provide feedback on the draft proposal for new engagement',
    assigned_to: 1,
    assigned_to_employee: mockEmployees[0],
    created_by: 2,
    created_by_employee: mockEmployees[1],
    status_id: 3,
    status: mockTaskStatuses[2],
    priority: 'high',
    due_date: '2025-01-22',
    context_type: 'PROPOSAL',
    context_id: 1,
    estimated_hours: 3,
    logged_hours: 1.5,
    requires_approval: false,
    created_at: '2025-01-17T10:00:00Z',
    updated_at: '2025-01-19T15:00:00Z'
  },
  {
    id: 7,
    title: 'Compliance Check - Tax Returns',
    description: 'Verify compliance of tax returns with latest regulations',
    assigned_to: 2,
    assigned_to_employee: mockEmployees[1],
    created_by: 1,
    created_by_employee: mockEmployees[0],
    status_id: 1,
    status: mockTaskStatuses[0],
    priority: 'low',
    due_date: '2025-02-28',
    context_type: 'ENGAGEMENT_SERVICE_ITEM',
    context_id: 3,
    estimated_hours: 20,
    logged_hours: 0,
    requires_approval: true,
    created_at: '2025-01-20T08:00:00Z',
    updated_at: '2025-01-20T08:00:00Z',
    engagement: mockEngagements[1]
  },
  {
    id: 8,
    title: 'Data Validation - Q4 2024',
    description: 'Validate financial data for Q4 2024 before processing',
    assigned_to: 3,
    assigned_to_employee: mockEmployees[2],
    created_by: 2,
    created_by_employee: mockEmployees[1],
    status_id: 2,
    status: mockTaskStatuses[1],
    priority: 'urgent',
    due_date: '2025-01-21',
    context_type: 'ENGAGEMENT_PHASE',
    context_id: 1,
    estimated_hours: 4,
    logged_hours: 3.5,
    requires_approval: false,
    created_at: '2025-01-19T09:00:00Z',
    updated_at: '2025-01-20T11:00:00Z',
    engagement: mockEngagements[0]
  }
];

// Combine base tasks with generated tasks for better calendar testing
// Generate additional tasks on demand to avoid build issues
const mockTasks: Task[] = baseTasksArray;

class TaskService {
  private tasks: Task[] = [...mockTasks, ...additionalTasks];
  private statuses: TaskStatus[] = [...mockTaskStatuses];

  private async simulateNetworkDelay() {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  }

  async getAll(params?: any): Promise<Task[]> {
    await this.simulateNetworkDelay();
    
    let filteredTasks = [...this.tasks];

    // Apply filters
    if (params) {
      if (params.engagement_id) {
        filteredTasks = filteredTasks.filter(t => t.engagement?.id === parseInt(params.engagement_id));
      }
      if (params.phase_id) {
        filteredTasks = filteredTasks.filter(t => t.engagement_phase?.id === parseInt(params.phase_id));
      }
      if (params.service_item_id) {
        filteredTasks = filteredTasks.filter(t => t.engagement_service_item?.id === parseInt(params.service_item_id));
      }
      if (params.assignee_id) {
        filteredTasks = filteredTasks.filter(t => t.assigned_to === parseInt(params.assignee_id));
      }
      if (params.status_id) {
        filteredTasks = filteredTasks.filter(t => t.status_id === parseInt(params.status_id));
      }
      if (params.priority) {
        filteredTasks = filteredTasks.filter(t => t.priority === params.priority);
      }
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredTasks = filteredTasks.filter(t => 
          t.title.toLowerCase().includes(searchLower) ||
          (t.description && t.description.toLowerCase().includes(searchLower))
        );
      }
    }

    return filteredTasks;
  }

  async getById(id: number): Promise<Task> {
    await this.simulateNetworkDelay();
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return task;
  }

  async create(data: any): Promise<Task> {
    await this.simulateNetworkDelay();
    
    const newTask: Task = {
      id: this.tasks.length + 1,
      title: data.title,
      description: data.description,
      assigned_to: data.assigned_to,
      assigned_to_employee: mockEmployees.find(e => e.id === data.assigned_to),
      created_by: 1, // Current user
      created_by_employee: mockEmployees[0],
      status_id: data.status_id || 1,
      status: this.statuses.find(s => s.id === (data.status_id || 1)),
      priority: data.priority || 'normal',
      due_date: data.due_date,
      context_type: data.context_type,
      context_id: data.context_id,
      estimated_hours: data.estimated_hours || 0,
      logged_hours: 0,
      requires_approval: data.requires_approval || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.tasks.push(newTask);
    return newTask;
  }

  async update(id: number, data: any): Promise<Task> {
    await this.simulateNetworkDelay();
    
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    const updatedTask = {
      ...this.tasks[index],
      ...data,
      updated_at: new Date().toISOString()
    };

    // Update related fields
    if (data.status_id) {
      updatedTask.status = this.statuses.find(s => s.id === data.status_id);
    }
    if (data.assigned_to) {
      updatedTask.assigned_to_employee = mockEmployees.find(e => e.id === data.assigned_to);
    }

    this.tasks[index] = updatedTask;
    return updatedTask;
  }

  async delete(id: number): Promise<void> {
    await this.simulateNetworkDelay();
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    this.tasks.splice(index, 1);
  }

  async approve(id: number): Promise<Task> {
    await this.simulateNetworkDelay();
    const task = await this.getById(id);
    if (!task.requires_approval) {
      throw new Error('Task does not require approval');
    }
    
    return this.update(id, {
      approved_by: 1, // Current user
      approved_at: new Date().toISOString()
    });
  }

  async getStatuses(context: string): Promise<TaskStatus[]> {
    await this.simulateNetworkDelay();
    if (context === 'TASK') {
      return this.statuses;
    }
    return [];
  }
}

export const mockTaskService = new TaskService();