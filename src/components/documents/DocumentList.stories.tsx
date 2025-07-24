import type { Meta, StoryObj } from '@storybook/react';
import { DocumentList } from './DocumentList';
import type { DocumentListItem } from './types';

const mockDocuments: DocumentListItem[] = [
  {
    id: 'folder-1',
    name: 'Proposals',
    type: 'folder',
    size: 0,
    webUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/Proposals',
    createdDateTime: '2024-01-15T10:30:00Z',
    lastModifiedDateTime: '2024-07-10T14:45:00Z',
    createdBy: {
      displayName: 'Rajesh Kumar',
      email: 'rajesh@vstn.com'
    },
    lastModifiedBy: {
      displayName: 'Priya Sharma',
      email: 'priya@vstn.com'
    },
    isLinked: false,
    hasChildren: true,
    isShared: true,
    permissions: ['read', 'write']
  },
  {
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
    isShared: false
  },
  {
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
    permissions: ['read', 'write']
  },
  {
    id: 'file-3',
    name: 'Client Photo.jpg',
    type: 'file',
    size: 1024000,
    mimeType: 'image/jpeg',
    webUrl: 'https://example.sharepoint.com/sites/vstn/Shared%20Documents/ClientPhoto.jpg',
    downloadUrl: 'https://example.sharepoint.com/sites/vstn/_layouts/download.aspx?share=file5',
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
    permissions: ['read']
  }
];

const meta: Meta<typeof DocumentList> = {
  title: 'Documents/DocumentList',
  component: DocumentList,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px', height: '500px', border: '1px solid #eee' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ListView: Story = {
  args: {
    documents: mockDocuments,
    loading: false,
    error: null,
    viewMode: 'list',
    selectedItems: [],
    onSelectionChange: () => {},
    onFolderOpen: () => {},
    entityType: 'customer',
    entityId: 1,
  },
};

export const GridView: Story = {
  args: {
    documents: mockDocuments,
    loading: false,
    error: null,
    viewMode: 'grid',
    selectedItems: [],
    onSelectionChange: () => {},
    onFolderOpen: () => {},
    entityType: 'customer',
    entityId: 1,
  },
};

export const Loading: Story = {
  args: {
    documents: [],
    loading: true,
    error: null,
    viewMode: 'list',
    selectedItems: [],
    onSelectionChange: () => {},
    onFolderOpen: () => {},
    entityType: 'customer',
    entityId: 1,
  },
};

export const Error: Story = {
  args: {
    documents: [],
    loading: false,
    error: 'Failed to load documents from OneDrive',
    viewMode: 'list',
    selectedItems: [],
    onSelectionChange: () => {},
    onFolderOpen: () => {},
    entityType: 'customer',
    entityId: 1,
  },
};

export const Empty: Story = {
  args: {
    documents: [],
    loading: false,
    error: null,
    viewMode: 'list',
    selectedItems: [],
    onSelectionChange: () => {},
    onFolderOpen: () => {},
    entityType: 'customer',
    entityId: 1,
  },
};

export const WithSelection: Story = {
  args: {
    documents: mockDocuments,
    loading: false,
    error: null,
    viewMode: 'list',
    selectedItems: ['file-1', 'file-2'],
    onSelectionChange: () => {},
    onFolderOpen: () => {},
    entityType: 'customer',
    entityId: 1,
  },
};