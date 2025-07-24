import { useMemo } from 'react';

export function useFilteredData<T extends Record<string, any>>(
  data: T[],
  filters: Record<string, any>,
  searchFields: (keyof T)[] = []
): T[] {
  return useMemo(() => {
    let filtered = [...data];

    // Apply search filter
    if (filters.search && searchFields.length > 0) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'search' || value === undefined || value === null || value === '') {
        return;
      }

      filtered = filtered.filter(item => {
        const itemValue = item[key];

        // Handle array filters (e.g., status in [1, 2, 3])
        if (Array.isArray(value)) {
          return value.includes(itemValue);
        }

        // Handle range filters (e.g., { min: 100, max: 1000 })
        if (typeof value === 'object' && (value.min !== undefined || value.max !== undefined)) {
          const numValue = Number(itemValue);
          if (isNaN(numValue)) return true;
          
          if (value.min !== undefined && numValue < value.min) return false;
          if (value.max !== undefined && numValue > value.max) return false;
          return true;
        }

        // Handle date range filters
        if (typeof value === 'object' && (value.from !== undefined || value.to !== undefined)) {
          const dateValue = itemValue instanceof Date ? itemValue : new Date(itemValue);
          if (isNaN(dateValue.getTime())) return true;
          
          if (value.from && dateValue < new Date(value.from)) return false;
          if (value.to && dateValue > new Date(value.to)) return false;
          return true;
        }

        // Handle boolean filters specially
        if (typeof value === 'boolean') {
          return Boolean(itemValue) === value;
        }

        // Default equality check
        return itemValue === value;
      });
    });

    return filtered;
  }, [data, filters, searchFields]);
}