import { useState } from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Badge,
  ActionIcon,
  Avatar,
  Loader,
  Center,
  Alert,
  Card,
  Tooltip,
  Checkbox,
  SimpleGrid,
} from '@mantine/core';
import {
  IconFile,
  IconFolder,
  IconExternalLink,
  IconLink,
  IconAlertCircle,
  IconDownload,
  IconShare,
  IconFileText,
  IconFileTypePdf,
  IconFileSpreadsheet,
  IconFileWord,
  IconPhoto,
  IconVideo,
  IconMusic,
  IconFileZip
} from '@tabler/icons-react';
import type { DocumentListItem } from './types';
import { DocumentDetailDrawer } from './DocumentDetailDrawer';

interface DocumentListProps {
  documents: DocumentListItem[];
  loading: boolean;
  error: string | null;
  viewMode: 'list' | 'grid';
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  onFolderOpen: (folderId: string, folderName: string) => void;
  entityType: string;
  entityId: number;
}

export function DocumentList({ 
  documents, 
  loading, 
  error, 
  viewMode,
  selectedItems,
  onSelectionChange,
  onFolderOpen,
  entityType, 
  entityId 
}: DocumentListProps) {
  const [selectedDocument, setSelectedDocument] = useState<DocumentListItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDocumentClick = (document: DocumentListItem) => {
    if (document.type === 'folder') {
      onFolderOpen(document.id, document.name);
    } else {
      setSelectedDocument(document);
      setDrawerOpen(true);
    }
  };

  const handleSelectionToggle = (documentId: string) => {
    const newSelection = selectedItems.includes(documentId)
      ? selectedItems.filter(id => id !== documentId)
      : [...selectedItems, documentId];
    onSelectionChange(newSelection);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('en-IN', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric' 
      });
    }
  };

  const getFileIcon = (document: DocumentListItem) => {
    if (document.type === 'folder') {
      return <IconFolder size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />;
    }

    if (!document.mimeType) {
      return <IconFile size={20} style={{ color: 'var(--mantine-color-gray-6)' }} />;
    }

    const mimeType = document.mimeType.toLowerCase();
    
    if (mimeType.includes('pdf')) {
      return <IconFileTypePdf size={20} style={{ color: 'var(--mantine-color-red-6)' }} />;
    }
    if (mimeType.includes('word') || mimeType.includes('document')) {
      return <IconFileWord size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />;
    }
    if (mimeType.includes('sheet') || mimeType.includes('excel')) {
      return <IconFileSpreadsheet size={20} style={{ color: 'var(--mantine-color-green-6)' }} />;
    }
    if (mimeType.includes('image')) {
      return <IconPhoto size={20} style={{ color: 'var(--mantine-color-orange-6)' }} />;
    }
    if (mimeType.includes('video')) {
      return <IconVideo size={20} style={{ color: 'var(--mantine-color-grape-6)' }} />;
    }
    if (mimeType.includes('audio')) {
      return <IconMusic size={20} style={{ color: 'var(--mantine-color-pink-6)' }} />;
    }
    if (mimeType.includes('zip') || mimeType.includes('compressed')) {
      return <IconFileZip size={20} style={{ color: 'var(--mantine-color-yellow-6)' }} />;
    }
    if (mimeType.includes('text')) {
      return <IconFileText size={20} style={{ color: 'var(--mantine-color-gray-6)' }} />;
    }

    return <IconFile size={20} style={{ color: 'var(--mantine-color-gray-6)' }} />;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading documents...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error loading documents">
        Failed to load documents from OneDrive. Please try again later.
      </Alert>
    );
  }

  if (documents.length === 0) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <IconFile size={48} stroke={1} style={{ color: 'var(--mantine-color-gray-5)' }} />
          <div style={{ textAlign: 'center' }}>
            <Text fw={500} c="dimmed">No documents found</Text>
            <Text size="sm" c="dimmed">
              No documents found for this entity or search criteria.
            </Text>
          </div>
        </Stack>
      </Center>
    );
  }

  if (viewMode === 'grid') {
    return (
      <>
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <SimpleGrid 
            cols={{ base: 2, sm: 3, md: 4, lg: 6 }} 
            spacing="md"
            style={{ height: '100%', overflow: 'auto', padding: '8px' }}
          >
            {documents.map((document) => (
              <Card
                key={document.id}
                p="md"
                radius="sm"
                withBorder
                style={{
                  cursor: 'pointer',
                  height: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  borderLeft: document.isLinked 
                    ? '3px solid var(--mantine-color-green-6)' 
                    : '3px solid transparent'
                }}
                onClick={() => handleDocumentClick(document)}
              >
                <Checkbox
                  checked={selectedItems.includes(document.id)}
                  onChange={() => handleSelectionToggle(document.id)}
                  style={{ position: 'absolute', top: 8, left: 8, zIndex: 10 }}
                  onClick={(e) => e.stopPropagation()}
                />

                <Center style={{ flex: 1 }}>
                  {getFileIcon(document)}
                </Center>

                <Stack gap="xs" mt="md">
                  <Text 
                    size="sm" 
                    fw={500}
                    lineClamp={2}
                    ta="center"
                  >
                    {document.name}
                  </Text>
                  
                  <Group justify="center" gap="xs">
                    {document.isLinked && (
                      <Tooltip label="Linked to CRM">
                        <IconLink size={12} style={{ color: 'var(--mantine-color-green-6)' }} />
                      </Tooltip>
                    )}
                    {document.type === 'file' && (
                      <Text size="xs" c="dimmed">
                        {formatFileSize(document.size)}
                      </Text>
                    )}
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        <DocumentDetailDrawer
          document={selectedDocument}
          opened={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          entityType={entityType}
          entityId={entityId}
        />
      </>
    );
  }

  // List view
  return (
    <>
      <Box style={{ flex: 1, overflow: 'hidden' }}>
        <Stack gap="xs" style={{ height: '100%', overflow: 'auto' }}>
          {documents.map((document) => (
            <Card
              key={document.id}
              p="sm"
              radius="sm"
              withBorder
              style={{
                cursor: 'pointer',
                borderLeft: document.isLinked 
                  ? '3px solid var(--mantine-color-green-6)' 
                  : '3px solid transparent'
              }}
              onClick={() => handleDocumentClick(document)}
            >
              <Group gap="sm" wrap="nowrap">
                <Checkbox
                  checked={selectedItems.includes(document.id)}
                  onChange={() => handleSelectionToggle(document.id)}
                  onClick={(e) => e.stopPropagation()}
                />

                {getFileIcon(document)}

                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Group gap="xs" align="center" wrap="nowrap">
                    <Text 
                      size="sm" 
                      fw={500}
                      truncate
                      style={{ flex: 1 }}
                    >
                      {document.name}
                    </Text>
                    {document.isLinked && (
                      <Tooltip label="Linked to CRM">
                        <IconLink size={14} style={{ color: 'var(--mantine-color-green-6)' }} />
                      </Tooltip>
                    )}
                    {document.isShared && (
                      <Tooltip label="Shared">
                        <IconShare size={14} style={{ color: 'var(--mantine-color-blue-6)' }} />
                      </Tooltip>
                    )}
                  </Group>

                  <Group gap="md" mt="xs">
                    <Group gap="xs">
                      <Avatar size="xs" color="gray">
                        {getInitials(document.lastModifiedBy.displayName)}
                      </Avatar>
                      <Text size="xs" c="dimmed">
                        Modified by {document.lastModifiedBy.displayName}
                      </Text>
                    </Group>
                    
                    <Text size="xs" c="dimmed">
                      {formatDateTime(document.lastModifiedDateTime)}
                    </Text>
                    
                    {document.type === 'file' && (
                      <Text size="xs" c="dimmed">
                        {formatFileSize(document.size)}
                      </Text>
                    )}
                    
                    {document.type === 'folder' && document.hasChildren && (
                      <Badge size="xs" variant="light">
                        {document.hasChildren} items
                      </Badge>
                    )}
                  </Group>
                </Box>

                <Group gap="xs">
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="gray"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (document.downloadUrl) {
                        window.open(document.downloadUrl, '_blank');
                      }
                    }}
                    disabled={document.type === 'folder' || !document.downloadUrl}
                  >
                    <IconDownload size={14} />
                  </ActionIcon>
                  
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="gray"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(document.webUrl, '_blank');
                    }}
                  >
                    <IconExternalLink size={14} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      </Box>

      <DocumentDetailDrawer
        document={selectedDocument}
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        entityType={entityType}
        entityId={entityId}
      />
    </>
  );
}