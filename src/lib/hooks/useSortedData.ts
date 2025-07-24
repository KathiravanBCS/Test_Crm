import React, { useMemo } from 'react';

export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export function useSortedData<T extends Record<string, any>>(
  data: T[],
  sortConfig: SortConfig<T> | null
): T[] {
  return useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle different types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // Case-insensitive string comparison
        const compareResult = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        return sortConfig.direction === 'asc' ? compareResult : -compareResult;
      }

      if (aValue && bValue && Object.prototype.toString.call(aValue) === '[object Date]' && Object.prototype.toString.call(bValue) === '[object Date]') {
        const compareResult = aValue.getTime() - bValue.getTime();
        return sortConfig.direction === 'asc' ? compareResult : -compareResult;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const compareResult = aValue - bValue;
        return sortConfig.direction === 'asc' ? compareResult : -compareResult;
      }

      // Fallback to string comparison
      const aStr = String(aValue);
      const bStr = String(bValue);
      const compareResult = aStr.localeCompare(bStr);
      return sortConfig.direction === 'asc' ? compareResult : -compareResult;
    });

    return sorted;
  }, [data, sortConfig]);
}

// Hook for managing sort state
export function useSortState<T>(defaultSort?: SortConfig<T>) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig<T> | null>(defaultSort || null);

  const handleSort = React.useCallback((key: keyof T) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      
      // Reset sort on third click
      return null;
    });
  }, []);

  return { sortConfig, handleSort };
}