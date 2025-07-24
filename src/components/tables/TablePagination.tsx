import { Group, Pagination, Select, Text, Box } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import classes from './TablePagination.module.css';

interface TablePaginationProps {
  page: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  recordsPerPageOptions?: number[];
  onRecordsPerPageChange?: (size: number) => void;
  loading?: boolean;
}

export function TablePagination({
  page,
  totalRecords,
  recordsPerPage,
  onPageChange,
  recordsPerPageOptions = [10, 25, 50, 100],
  onRecordsPerPageChange,
  loading = false
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const from = totalRecords === 0 ? 0 : (page - 1) * recordsPerPage + 1;
  const to = Math.min(page * recordsPerPage, totalRecords);

  return (
    <Box
      className={classes.paginationContainer}
      px="md"
      py="sm"
    >
      <Group justify="space-between" wrap="nowrap">
        {/* Left side - Records info */}
        <Group gap="lg">
          <Text size="sm" c="dimmed">
            Showing <Text component="span" fw={500} c="dark">{from}</Text> to{' '}
            <Text component="span" fw={500} c="dark">{to}</Text> of{' '}
            <Text component="span" fw={500} c="dark">{totalRecords}</Text> entries
          </Text>
          
          {onRecordsPerPageChange && (
            <Group gap="xs">
              <Text size="sm" c="dimmed">Show</Text>
              <Select
                size="xs"
                value={String(recordsPerPage)}
                onChange={(value) => value && onRecordsPerPageChange(Number(value))}
                data={recordsPerPageOptions.map(size => ({
                  value: String(size),
                  label: String(size)
                }))}
                disabled={loading}
                classNames={{
                  input: classes.recordsSelectInput,
                  dropdown: classes.recordsSelectDropdown
                }}
              />
              <Text size="sm" c="dimmed">entries</Text>
            </Group>
          )}
        </Group>

        {/* Right side - Pagination controls */}
        <Pagination
          value={page}
          onChange={onPageChange}
          total={totalPages}
          siblings={1}
          boundaries={1}
          disabled={loading}
          size="sm"
          classNames={{
            control: classes.paginationControl,
            dots: classes.paginationDots
          }}
          previousIcon={IconChevronLeft}
          nextIcon={IconChevronRight}
          firstIcon={IconChevronsLeft}
          lastIcon={IconChevronsRight}
          withEdges
          getItemProps={(page) => ({
            className: classes.paginationItem
          })}
          getControlProps={(control) => {
            if (control === 'first' || control === 'last') {
              return {
                className: classes.paginationEdgeControl
              };
            }
            return {};
          }}
        />
      </Group>
    </Box>
  );
}