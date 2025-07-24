import type { EmployeeProfile } from '@/types/common';
import { 
  generatePhoneNumber,
  generatePAN,
  generateIFSC,
  generateBankAccount
} from '../utils';

// Generate mock employees
export const mockEmployees: EmployeeProfile[] = [
  // Admin
  {
    id: 1,
    employeeCode: 'EMP001',
    name: 'Rajesh Kumar',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@vstn.in',
    phoneNumber: generatePhoneNumber(),
    address: '123, MG Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    pan: generatePAN(),
    ifsc: generateIFSC(),
    bankAccount: generateBankAccount().toString(),
    dateOfJoining: new Date('2020-01-15'),
    role: 'Admin',
    position: 'Administrator',
    department: 'Administration',
    officeLocation: 'Mumbai HQ',
    isActive: true,
    statusId: 23, // Active
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date()
  },
  
  // Managers
  {
    id: 2,
    employeeCode: 'EMP002',
    name: 'Priya Sharma',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@vstn.in',
    phoneNumber: generatePhoneNumber(),
    address: '456, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    pan: generatePAN(),
    ifsc: generateIFSC(),
    bankAccount: generateBankAccount().toString(),
    dateOfJoining: new Date('2020-03-10'),
    role: 'Manager',
    position: 'Senior Manager',
    department: 'Operations',
    officeLocation: 'Mumbai HQ',
    isActive: true,
    statusId: 23, // Active
    createdAt: new Date('2020-03-10'),
    updatedAt: new Date()
  },
  {
    id: 3,
    employeeCode: 'EMP003',
    name: 'Amit Patel',
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@vstn.in',
    phoneNumber: generatePhoneNumber(),
    address: '789, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    pan: generatePAN(),
    ifsc: generateIFSC(),
    bankAccount: generateBankAccount().toString(),
    dateOfJoining: new Date('2020-06-01'),
    role: 'Manager',
    position: 'Project Manager',
    department: 'Projects',
    officeLocation: 'Mumbai HQ',
    isActive: true,
    statusId: 23, // Active
    createdAt: new Date('2020-06-01'),
    updatedAt: new Date()
  },
  
  // Consultants
  {
    id: 4,
    employeeCode: 'EMP004',
    name: 'Sneha Reddy',
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@vstn.in',
    phoneNumber: generatePhoneNumber(),
    address: '321, Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400076',
    pan: generatePAN(),
    ifsc: generateIFSC(),
    bankAccount: generateBankAccount().toString(),
    dateOfJoining: new Date('2021-02-15'),
    role: 'Consultant',
    position: 'Senior Consultant',
    department: 'Consulting',
    officeLocation: 'Mumbai HQ',
    isActive: true,
    statusId: 23, // Active
    createdAt: new Date('2021-02-15'),
    updatedAt: new Date()
  },
  {
    id: 5,
    employeeCode: 'EMP005',
    name: 'Vikram Singh',
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@vstn.in',
    phoneNumber: generatePhoneNumber(),
    address: '654, Malad West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400064',
    pan: generatePAN(),
    ifsc: generateIFSC(),
    bankAccount: generateBankAccount().toString(),
    dateOfJoining: new Date('2021-07-01'),
    role: 'Consultant',
    position: 'Tax Consultant',
    department: 'Tax Advisory',
    officeLocation: 'Mumbai HQ',
    isActive: true,
    statusId: 23, // Active
    createdAt: new Date('2021-07-01'),
    updatedAt: new Date()
  },
  {
    id: 6,
    employeeCode: 'EMP006',
    name: 'Anjali Mehta',
    firstName: 'Anjali',
    lastName: 'Mehta',
    email: 'anjali.mehta@vstn.in',
    phoneNumber: generatePhoneNumber(),
    address: '987, Goregaon East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400063',
    pan: generatePAN(),
    ifsc: generateIFSC(),
    bankAccount: generateBankAccount().toString(),
    dateOfJoining: new Date('2022-01-10'),
    role: 'Consultant',
    position: 'Financial Consultant',
    department: 'Finance',
    officeLocation: 'Mumbai HQ',
    isActive: true,
    statusId: 23, // Active
    createdAt: new Date('2022-01-10'),
    updatedAt: new Date()
  },
  {
    id: 7,
    employeeCode: 'EMP007',
    name: 'Rohit Desai',
    firstName: 'Rohit',
    lastName: 'Desai',
    email: 'rohit.desai@vstn.in',
    phoneNumber: generatePhoneNumber(),
    address: '147, Vile Parle East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400057',
    pan: generatePAN(),
    ifsc: generateIFSC(),
    bankAccount: generateBankAccount().toString(),
    dateOfJoining: new Date('2022-04-15'),
    role: 'Consultant',
    position: 'Business Consultant',
    department: 'Business Advisory',
    officeLocation: 'Mumbai HQ',
    isActive: true,
    statusId: 23, // Active
    createdAt: new Date('2022-04-15'),
    updatedAt: new Date()
  },
  {
    id: 8,
    employeeCode: 'EMP008',
    name: 'Neha Kapoor',
    firstName: 'Neha',
    lastName: 'Kapoor',
    email: 'neha.kapoor@vstn.in',
    phoneNumber: generatePhoneNumber(),
    address: '258, Juhu',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400049',
    pan: generatePAN(),
    ifsc: generateIFSC(),
    bankAccount: generateBankAccount().toString(),
    dateOfJoining: new Date('2022-09-01'),
    role: 'Consultant',
    position: 'Compliance Consultant',
    department: 'Compliance',
    officeLocation: 'Mumbai HQ',
    isActive: false,
    statusId: 24, // On Leave
    createdAt: new Date('2022-09-01'),
    updatedAt: new Date()
  },
  {
    id: 9,
    employeeCode: 'EMP009',
    name: 'Arjun Nair',
    firstName: 'Arjun',
    lastName: 'Nair',
    email: 'arjun.nair@vstn.in',
    phoneNumber: generatePhoneNumber(),
    address: '369, Dadar West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400028',
    pan: generatePAN(),
    ifsc: generateIFSC(),
    bankAccount: generateBankAccount().toString(),
    dateOfJoining: new Date('2023-01-15'),
    dateOfResignation: new Date('2024-06-30'),
    role: 'Consultant',
    position: 'Junior Consultant',
    department: 'Consulting',
    officeLocation: 'Mumbai HQ',
    isActive: false,
    statusId: 25, // Resigned
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-06-30')
  },
  {
    id: 10,
    employeeCode: 'EMP010',
    name: 'Kavita Joshi',
    firstName: 'Kavita',
    lastName: 'Joshi',
    email: 'kavita.joshi@vstn.in',
    phoneNumber: generatePhoneNumber(),
    address: '741, Thane West',
    city: 'Thane',
    state: 'Maharashtra',
    pincode: '400601',
    pan: generatePAN(),
    ifsc: generateIFSC(),
    bankAccount: generateBankAccount().toString(),
    dateOfJoining: new Date('2023-06-01'),
    role: 'Consultant',
    position: 'Audit Consultant',
    department: 'Audit',
    officeLocation: 'Thane Office',
    isActive: true,
    statusId: 23, // Active
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date()
  }
];

// Helper to get active employees
export const getActiveEmployees = () => mockEmployees.filter(emp => emp.statusId === 23);

// Helper to get employees by role
export const getEmployeesByRole = (role: 'Admin' | 'Manager' | 'Consultant') => 
  mockEmployees.filter(emp => emp.role === role);

// Helper to get employee by id
export const getEmployeeById = (id: number) => 
  mockEmployees.find(emp => emp.id === id);