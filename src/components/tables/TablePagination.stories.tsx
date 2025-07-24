import type { Meta, StoryObj } from '@storybook/react';
import { TablePagination } from './TablePagination';
import { useState } from 'react';
import { Card } from '@mantine/core';

const meta: Meta<typeof TablePagination> = {
  title: 'Tables/TablePagination',
  component: TablePagination,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Card withBorder style={{ width: '100%', maxWidth: 1200 }}>
        <Story />
      </Card>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    return (
      <TablePagination
        page={page}
        totalRecords={248}
        recordsPerPage={pageSize}
        onPageChange={setPage}
        recordsPerPageOptions={[10, 25, 50, 100]}
        onRecordsPerPageChange={setPageSize}
      />
    );
  },
};

export const FirstPage: Story = {
  args: {
    page: 1,
    totalRecords: 150,
    recordsPerPage: 25,
    onPageChange: () => {},
  },
};

export const MiddlePage: Story = {
  args: {
    page: 5,
    totalRecords: 150,
    recordsPerPage: 10,
    onPageChange: () => {},
  },
};

export const LastPage: Story = {
  args: {
    page: 15,
    totalRecords: 150,
    recordsPerPage: 10,
    onPageChange: () => {},
  },
};

export const LargeDataset: Story = {
  args: {
    page: 50,
    totalRecords: 10000,
    recordsPerPage: 50,
    onPageChange: () => {},
  },
};

export const SmallDataset: Story = {
  args: {
    page: 1,
    totalRecords: 20,
    recordsPerPage: 10,
    onPageChange: () => {},
  },
};

export const SinglePage: Story = {
  args: {
    page: 1,
    totalRecords: 8,
    recordsPerPage: 10,
    onPageChange: () => {},
  },
};

export const Loading: Story = {
  args: {
    page: 1,
    totalRecords: 100,
    recordsPerPage: 10,
    onPageChange: () => {},
    loading: true,
  },
};

export const NoRecordsPerPageChange: Story = {
  args: {
    page: 1,
    totalRecords: 100,
    recordsPerPage: 10,
    onPageChange: () => {},
    onRecordsPerPageChange: undefined,
  },
};

export const WithCustomPageSizes: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    
    return (
      <TablePagination
        page={page}
        totalRecords={500}
        recordsPerPage={pageSize}
        onPageChange={setPage}
        recordsPerPageOptions={[20, 40, 60, 80, 100]}
        onRecordsPerPageChange={setPageSize}
      />
    );
  },
};