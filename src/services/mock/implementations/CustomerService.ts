import type { Customer, CustomerFormData, Address } from '@/types/customer';
import type { ContactPerson, ContactPersonFormData } from '@/types/common';
import { BaseMockService } from './BaseService';
import { mockCustomers } from '../data/customers';
import { generateId, generatePersonName, generateEmail, generatePhoneNumber, delay, generatePastDate } from '../utils';

export class MockCustomerService extends BaseMockService<Customer, CustomerFormData, CustomerFormData> {
  private contacts: ContactPerson[] = [];

  constructor() {
    super(mockCustomers, 1000, 300);
    this.initializeContacts();
    
    // Bind methods to preserve 'this' context
    this.getContacts = this.getContacts.bind(this);
    this.addContact = this.addContact.bind(this);
    this.updateContact = this.updateContact.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
  }

  private initializeContacts() {
    // Generate some sample contacts for existing customers
    mockCustomers.slice(0, 10).forEach(customer => {
      const contactCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < contactCount; i++) {
        const name = generatePersonName();
        this.contacts.push({
          id: generateId(),
          entityType: 'customer',
          entityId: customer.id,
          name,
          email: generateEmail(name, 'company.com'),
          phone: generatePhoneNumber(),
          designation: ['CEO', 'CFO', 'Finance Manager', 'Operations Head', 'Sales Director'][Math.floor(Math.random() * 5)],
          isPrimary: i === 0,
          createdAt: generatePastDate(30),
          updatedAt: new Date()
        });
      }
    });
  }

  async getContacts(customerId: number): Promise<ContactPerson[]> {
    await delay(this.delayMs);
    return this.contacts.filter(contact => contact.entityId === customerId);
  }

  async addContact(customerId: number, contact: ContactPersonFormData): Promise<ContactPerson> {
    await delay(this.delayMs);
    
    // Verify customer exists
    const customer = this.data.find(c => c.id === customerId);
    if (!customer) {
      throw new Error(`Customer with id ${customerId} not found`);
    }

    const newContact: ContactPerson = {
      id: generateId(),
      entityType: 'customer',
      entityId: customerId,
      ...contact,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.contacts.push(newContact);
    return newContact;
  }

  async updateContact(contactId: number, contact: ContactPersonFormData): Promise<ContactPerson> {
    await delay(this.delayMs);
    
    const index = this.contacts.findIndex(c => c.id === contactId);
    if (index === -1) {
      throw new Error(`Contact with id ${contactId} not found`);
    }

    const updatedContact = {
      ...this.contacts[index],
      ...contact
    };

    this.contacts[index] = updatedContact;
    return updatedContact;
  }

  async deleteContact(contactId: number): Promise<void> {
    await delay(this.delayMs);
    
    const index = this.contacts.findIndex(c => c.id === contactId);
    if (index === -1) {
      throw new Error(`Contact with id ${contactId} not found`);
    }

    this.contacts.splice(index, 1);
  }

  // Override create to handle partner validation and nested data
  async create(data: CustomerFormData): Promise<Customer> {
    if ((data.customerType === 'partner_referred' || data.customerType === 'partner_managed') && !data.partnerId) {
      throw new Error(`Partner ID is required for ${data.customerType} customers`);
    }

    // Extract nested data
    const { addresses, contacts, ...customerData } = data;

    // Create the customer using the base method
    const customer = await super.create({
      ...customerData,
      customerCode: `CUST-${String(generateId()).padStart(3, '0')}`,
      onboardedDate: data.onboardedDate || new Date()
    });
    
    // If partner is linked, add basic partner info
    let partner;
    if (data.partnerId) {
      // In a real app, we'd fetch the partner data
      // For mock, we'll create a simple partner object
      partner = {
        id: data.partnerId,
        partnerName: `Partner ${data.partnerId}`, // This would come from the partner service
        partnerCode: `PRTN-${data.partnerId}`
      };
    }

    // Create addresses
    const createdAddresses: Address[] = [];
    if (addresses && addresses.length > 0) {
      for (const address of addresses) {
        createdAddresses.push({
          id: generateId(),
          entityType: 'customer' as const,
          entityId: customer.id,
          ...address,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // Create contacts
    const createdContacts: ContactPerson[] = [];
    if (contacts && contacts.length > 0) {
      for (const contact of contacts) {
        const newContact = await this.addContact(customer.id, contact);
        createdContacts.push(newContact);
      }
    }
    
    return {
      ...customer,
      partner,
      addresses: createdAddresses,
      contacts: createdContacts
    };
  }

  // Override update to handle partner changes and nested data
  async update(id: number, data: CustomerFormData): Promise<Customer> {
    if ((data.customerType === 'partner_referred' || data.customerType === 'partner_managed') && !data.partnerId) {
      throw new Error(`Partner ID is required for ${data.customerType} customers`);
    }

    // Get the existing customer to preserve partner info
    const existingCustomer = await this.getById(id);
    
    // Extract nested data
    const { addresses, contacts, ...customerData } = data;
    
    // Update the customer using the base method
    const customer = await super.update(id, customerData);
    
    // Handle partner info
    let partner = existingCustomer.partner;
    if (data.partnerId && data.partnerId !== existingCustomer.partnerId) {
      // Partner changed, update it
      partner = {
        id: data.partnerId,
        partnerName: `Partner ${data.partnerId}`, // This would come from the partner service
        partnerCode: `PRTN-${data.partnerId}`
      };
    } else if (!data.partnerId && (data.customerType === 'direct')) {
      // Customer type changed to direct, remove partner
      partner = undefined;
    }

    // For mock purposes, we'll just return the addresses and contacts as provided
    // In a real API, these would be handled through separate endpoints
    const updatedAddresses: Address[] = (addresses as Address[]) || existingCustomer.addresses || [];
    const updatedContacts: ContactPerson[] = (contacts as ContactPerson[]) || existingCustomer.contacts || [];
    
    return {
      ...customer,
      partner,
      addresses: updatedAddresses,
      contacts: updatedContacts
    };
  }

}

// Create singleton instance
export const mockCustomerService = new MockCustomerService();