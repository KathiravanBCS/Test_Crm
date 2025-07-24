import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@mantine/core';
import { DocumentDetailDrawer } from './DocumentDetailDrawer';
import type { DocumentListItem } from './types';

const mockPdfDocument: DocumentListItem = {
  id: 'file-1',
  name: 'Transfer Pricing Analysis Report.pdf',
  type: 'file',
  size: 2048576,
  mimeType: 'application/pdf',
  webUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/TPAnalysis.pdf',
  downloadUrl: 'https://example.sharepoint.com/sites/vstn/_layouts/download.aspx?share=file1',
  createdDateTime: '2024-06-15T14:30:00Z',
  lastModifiedDateTime: '2024-07-01T16:45:00Z',
  createdBy: {
    displayName: 'Rajesh Kumar',
    email: 'rajesh@vstn.com'
  },
  lastModifiedBy: {
    displayName: 'Priya Sharma',
    email: 'priya@vstn.com'
  },
  isLinked: true,
  linkedDocumentId: 102,
  isShared: false,
  parentPath: '/Shared Documents/Transfer Pricing'
};

const mockExcelDocument: DocumentListItem = {
  id: 'file-2',
  name: 'Client Data Analysis.xlsx',
  type: 'file',
  size: 1536000,
  mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  webUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/ClientData.xlsx',
  downloadUrl: 'https://example.sharepoint.com/sites/vstn/_layouts/download.aspx?share=file2',
  createdDateTime: '2024-06-20T09:15:00Z',
  lastModifiedDateTime: '2024-07-05T11:30:00Z',
  createdBy: {
    displayName: 'Amit Patel',
    email: 'amit@vstn.com'
  },
  lastModifiedBy: {
    displayName: 'Sneha Gupta',
    email: 'sneha@vstn.com'
  },
  isLinked: false,
  isShared: true,
  permissions: ['read', 'write'],
  parentPath: '/Shared Documents/Analysis'
};

const mockImageDocument: DocumentListItem = {
  id: 'file-3',
  name: 'Client Photo.jpg',
  type: 'file',
  size: 1024000,
  mimeType: 'image/jpeg',
  webUrl: 'https://picsum.photos/400/300', // Using placeholder image for demo
  downloadUrl: 'https://example.sharepoint.com/sites/vstn/_layouts/download.aspx?share=file3',
  createdDateTime: '2024-07-12T12:00:00Z',
  lastModifiedDateTime: '2024-07-12T12:00:00Z',
  createdBy: {
    displayName: 'Sneha Gupta',
    email: 'sneha@vstn.com'
  },
  lastModifiedBy: {
    displayName: 'Sneha Gupta',
    email: 'sneha@vstn.com'
  },
  isLinked: false,
  isShared: true,
  permissions: ['read'],
  parentPath: '/Shared Documents/Media'
};

const meta: Meta<typeof DocumentDetailDrawer> = {
  title: 'Documents/DocumentDetailDrawer',
  component: DocumentDetailDrawer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state for stories
const DrawerWrapper = ({ document, ...args }: any) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setOpened(true)}>
        Open {document?.name} Details
      </Button>
      <DocumentDetailDrawer
        {...args}
        document={document}
        opened={opened}
        onClose={() => setOpened(false)}
      />
    </>
  );
};

export const PdfDocument: Story = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    document: mockPdfDocument,
    entityType: 'customer',
    entityId: 1,
  },
};

export const ExcelDocument: Story = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    document: mockExcelDocument,
    entityType: 'customer',
    entityId: 1,
  },
};

export const ImageDocument: Story = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    document: mockImageDocument,
    entityType: 'customer',
    entityId: 1,
  },
};

export const LinkedDocument: Story = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    document: mockPdfDocument,
    entityType: 'proposal',
    entityId: 123,
  },
};

export const UnlinkedDocument: Story = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    document: mockExcelDocument,
    entityType: 'partner',
    entityId: 2,
  },
};

export const SharedDocument: Story = {
  render: (args) => <DrawerWrapper {...args} />,
  args: {
    document: mockImageDocument,
    entityType: 'customer',
    entityId: 1,
  },
};