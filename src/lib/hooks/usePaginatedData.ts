import { useMemo, useState, useCallback } from 'react';

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
}

export function usePaginatedData<T>(
  data: T[],
  initialPageSize: number = 25
): PaginationResult<T> {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, page, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    // Reset to first page when page size changes
    setPage(1);
  }, []);

  // Reset to first page if current page is out of bounds
  if (page > totalPages && totalPages > 0) {
    setPage(1);
  }

  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      total: data.length,
      totalPages,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
    },
  };
}