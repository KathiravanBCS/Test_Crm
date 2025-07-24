import { delay } from '../utils';

export abstract class BaseMockService<T extends { id: number }, CreateDTO, UpdateDTO> {
  protected data: T[];
  protected nextId: number;
  protected delayMs: number;

  constructor(initialData: T[], startId: number = 1000, delayMs: number = 300) {
    this.data = [...initialData];
    this.nextId = startId;
    this.delayMs = delayMs;
    
    // Bind methods to preserve 'this' context
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(): Promise<T[]> {
    await delay(this.delayMs);
    return [...this.data];
  }

  async getById(id: number): Promise<T> {
    await delay(this.delayMs);
    const item = this.data.find(item => item.id === id);
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    return { ...item };
  }

  async create(data: CreateDTO): Promise<T> {
    await delay(this.delayMs);
    const newItem = {
      ...data,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    } as unknown as T;
    
    this.data.push(newItem);
    return { ...newItem };
  }

  async update(id: number, data: UpdateDTO): Promise<T> {
    await delay(this.delayMs);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    const updatedItem = {
      ...this.data[index],
      ...data,
      updatedAt: new Date()
    } as T;
    
    this.data[index] = updatedItem;
    return { ...updatedItem };
  }

  async delete(id: number): Promise<void> {
    await delay(this.delayMs);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    this.data.splice(index, 1);
  }

  // Helper method to reset data (useful for tests)
  reset(data: T[]) {
    this.data = [...data];
  }
}