import type { ServiceItem, ServiceItemWithSubItems, ServiceItemFilters } from '@/types/service-item';
import { BaseMockService } from './BaseService';
import { mockServiceItems, getAllServiceItemsFlat } from '../data/serviceItems';
import { delay } from '../utils';

export class MockServiceItemService extends BaseMockService<ServiceItemWithSubItems, Partial<ServiceItem>, Partial<ServiceItem>> {
  constructor() {
    super(mockServiceItems, 400, 300); // Start ID at 400 for new items
    
    // Bind methods
    this.getWithFilters = this.getWithFilters.bind(this);
    this.getByCategory = this.getByCategory.bind(this);
    this.getActiveItems = this.getActiveItems.bind(this);
    this.getItemWithSubItems = this.getItemWithSubItems.bind(this);
    this.searchItems = this.searchItems.bind(this);
  }

  // Get service items with filters
  async getWithFilters(filters: ServiceItemFilters): Promise<ServiceItemWithSubItems[]> {
    await delay(this.delayMs);
    
    let results = [...this.data];
    
    // Apply active filter
    if (filters.is_active !== undefined) {
      results = results.filter(item => item.is_active === filters.is_active);
    }
    
    // Apply category filter
    if (filters.category) {
      results = results.filter(item => item.category === filters.category);
    }
    
    // Apply parent only filter
    if (filters.parent_only) {
      results = results.filter(item => !item.parent_id);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const flatItems = getAllServiceItemsFlat();
      
      // Search in flat list then reconstruct with sub-items
      const matchingIds = new Set<number>();
      
      flatItems.forEach(item => {
        if (
          item.name.toLowerCase().includes(searchLower) ||
          item.code.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
        ) {
          // Add the item itself
          matchingIds.add(item.id);
          
          // If it's a sub-item, also add its parent
          if (item.parent_id) {
            matchingIds.add(item.parent_id);
          }
          
          // If it's a parent with sub-items, this will include it
          const parent = this.data.find(p => p.id === item.id);
          if (parent?.has_sub_items) {
            matchingIds.add(parent.id);
          }
        }
      });
      
      results = results.filter(item => matchingIds.has(item.id));
    }
    
    return results;
  }

  // Get service items by category
  async getByCategory(category: ServiceItem['category']): Promise<ServiceItemWithSubItems[]> {
    await delay(this.delayMs);
    return this.data.filter(item => item.category === category && item.is_active);
  }

  // Get only active service items
  async getActiveItems(): Promise<ServiceItemWithSubItems[]> {
    await delay(this.delayMs);
    return this.data.filter(item => item.is_active);
  }

  // Get a specific item with its sub-items
  async getItemWithSubItems(id: number): Promise<ServiceItemWithSubItems | null> {
    await delay(this.delayMs);
    const item = this.data.find(item => item.id === id);
    return item || null;
  }

  // Search service items
  async searchItems(query: string): Promise<ServiceItemWithSubItems[]> {
    return this.getWithFilters({ search: query, is_active: true });
  }

  // Override create to handle sub-items
  async create(data: Partial<ServiceItem>): Promise<ServiceItemWithSubItems> {
    const newItem: ServiceItemWithSubItems = {
      id: this.nextId++,
      code: data.code || `CUSTOM-${this.nextId}`,
      name: data.name || '',
      description: data.description,
      default_price: data.default_price || 0,
      currency_code: data.currency_code || 'INR',
      category: data.category || 'other',
      is_active: data.is_active ?? true,
      has_sub_items: false,
      parent_id: data.parent_id,
      master_service_id: data.master_service_id,
      sub_items: []
    };
    
    this.data.push(newItem);
    return newItem;
  }

  // Override update to maintain consistency
  async update(id: number, data: Partial<ServiceItem>): Promise<ServiceItemWithSubItems> {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Service item with id ${id} not found`);
    }
    
    const existing = this.data[index];
    const updated: ServiceItemWithSubItems = {
      ...existing,
      ...data,
      id: existing.id, // Preserve ID
      sub_items: existing.sub_items // Preserve sub-items
    };
    
    this.data[index] = updated;
    return updated;
  }
}

// Create singleton instance
export const mockServiceItemService = new MockServiceItemService();