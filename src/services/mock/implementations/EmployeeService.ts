import { BaseMockService } from './BaseService';
import type { EmployeeProfile } from '@/types/common';
import { mockEmployees } from '../data/employees';

export class EmployeeService extends BaseMockService<EmployeeProfile, Partial<EmployeeProfile>, Partial<EmployeeProfile>> {
  constructor() {
    super(mockEmployees, 1000, 300);
  }

  async getAll() {
    // Return all employees with simulated delay
    return super.getAll();
  }

  async getById(id: number) {
    return super.getById(id);
  }

  async getByRole(role: string) {
    await new Promise(resolve => setTimeout(resolve, this.delayMs));
    return this.data.filter(employee => employee.role === role);
  }

  async getActive() {
    await new Promise(resolve => setTimeout(resolve, this.delayMs));
    // Assuming statusId 1 means active
    return this.data.filter(employee => employee.statusId === 1);
  }

  async search(searchTerm: string) {
    await new Promise(resolve => setTimeout(resolve, this.delayMs));
    const term = searchTerm.toLowerCase();
    return this.data.filter(employee => 
      employee.name.toLowerCase().includes(term) ||
      employee.email.toLowerCase().includes(term) ||
      employee.role.toLowerCase().includes(term)
    );
  }
}

export const mockEmployeeService = new EmployeeService();