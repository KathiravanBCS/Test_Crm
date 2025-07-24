import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDebouncedValue, useLocalStorage } from '@mantine/hooks';
import { ColumnDefinition } from '@/components/tables/ColumnSelector';
import { DataTableSortStatus } from 'mantine-datatable';
import { sortBy } from 'lodash';

interface UseListPageStateProps<T extends Record<string, any>> {
  data: T[];
  pageSize?: number;
  searchFields?: (keyof T)[];
  searchDebounce?: number;
  columns?: ColumnDefinition[];
  storageKey?: string;
}

export function useListPageState<T extends Record<string, any>>({
  data,
  pageSize = 10,
  searchFields = [],
  searchDebounce = 300,
  columns = [],
  storageKey = 'list-page'
}: UseListPageStateProps<T>) {
  // Search
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, searchDebounce);
  
  // Filters
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filterDrawerOpened, setFilterDrawerOpened] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  
  // Selected item for detail view
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [detailDrawerOpened, setDetailDrawerOpened] = useState(false);

  // Column visibility
  const defaultVisibleColumns = columns
    .filter(col => col.defaultVisible !== false)
    .map(col => col.accessor);
  
  const [visibleColumns, setVisibleColumns] = useLocalStorage<string[]>({
    key: `${storageKey}-visible-columns`,
    defaultValue: defaultVisibleColumns
  });

  // Column order
  const [columnOrder, setColumnOrder] = useLocalStorage<string[]>({
    key: `${storageKey}-column-order`,
    defaultValue: columns.map(col => col.accessor)
  });

  // Selected rows for bulk actions
  const [selectedRecords, setSelectedRecords] = useState<T[]>([]);

  // Sorting
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor: 'id',
    direction: 'asc'
  });

  // Process data following Mantine DataTable best practices
  const processedData = useMemo(() => {
    let result = [...data];

    // Step 1: Apply search filter
    if (debouncedSearch && searchFields.length > 0) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field =>
          String(item[field] || '').toLowerCase().includes(searchLower)
        )
      );
    }

    // Step 2: Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        result = result.filter(item => item[key] === value);
      }
    });

    // Step 3: Apply sorting (client-side)
    if (sortStatus.columnAccessor) {
      const sorted = sortBy(result, sortStatus.columnAccessor);
      result = sortStatus.direction === 'desc' ? sorted.reverse() : sorted;
    }

    return result;
  }, [data, debouncedSearch, searchFields, filters, sortStatus]);

  // Calculate pagination values
  const totalRecords = processedData.length;
  const totalPages = Math.ceil(totalRecords / currentPageSize);

  // Get paginated data for display
  const paginatedData = useMemo(() => {
    const start = (page - 1) * currentPageSize;
    const end = start + currentPageSize;
    return processedData.slice(start, end);
  }, [processedData, page, currentPageSize]);

  // Reset page when filters/search/sort changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters, sortStatus]);

  // Reset page if current page is out of bounds
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  // Update filters with page reset
  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
  }, []);

  // Update sort status
  const updateSortStatus = useCallback((newSortStatus: DataTableSortStatus<T>) => {
    setSortStatus(newSortStatus);
  }, []);

  // Handle row click
  const handleRowClick = useCallback((item: T) => {
    setSelectedItem(item);
    setDetailDrawerOpened(true);
  }, []);

  // Filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(v => v !== undefined && v !== '' && v !== null).length;
  }, [filters]);

  // Clear selected records when data changes
  useEffect(() => {
    setSelectedRecords([]);
  }, [filters, search, sortStatus]);

  return {
    // Search
    search,
    setSearch,
    
    // Filters
    filters,
    setFilters: updateFilters,
    filterDrawerOpened,
    setFilterDrawerOpened,
    openFilterDrawer: () => setFilterDrawerOpened(true),
    closeFilterDrawer: () => setFilterDrawerOpened(false),
    activeFilterCount,
    
    // Pagination - For Mantine DataTable
    page,
    setPage,
    pageSize: currentPageSize,
    setPageSize: (size: number) => {
      setCurrentPageSize(size);
      setPage(1);
    },
    totalRecords,
    
    // Data
    processedData,      // All filtered and sorted data
    paginatedData,      // Data for current page
    filteredData: processedData, // Alias for backward compatibility
    
    // Detail view
    selectedItem,
    setSelectedItem,
    detailDrawerOpened,
    setDetailDrawerOpened,
    handleRowClick,
    
    // Column management
    visibleColumns,
    setVisibleColumns,
    columnOrder,
    setColumnOrder,
    
    // Selected records
    selectedRecords,
    setSelectedRecords,
    clearSelection: () => setSelectedRecords([]),
    
    // Sorting - For Mantine DataTable
    sortStatus,
    setSortStatus: updateSortStatus,
    
    // Utilities
    resetFilters: () => {
      setFilters({});
      setSearch('');
      setPage(1);
    },
    resetAll: () => {
      setFilters({});
      setSearch('');
      setPage(1);
      setSelectedRecords([]);
      setVisibleColumns(defaultVisibleColumns);
      setColumnOrder(columns.map(col => col.accessor));
      setSortStatus({ columnAccessor: 'id', direction: 'asc' });
    }
  };
}