import {
  Drawer,
  Stack,
  Group,
  Text,
  Badge,
  Avatar,
  Divider,
  Button,
  Card,
  Alert,
  Box,
  Image,
  Center
} from '@mantine/core';
import {
  IconExternalLink,
  IconDownload,
  IconShare,
  IconLink,
  IconUnlink,
  IconFile,
  IconInfoCircle,
  IconEye,
  IconCopy,
  IconUser,
  IconCalendar,
  IconRuler,
  IconFileText,
  IconX
} from '@tabler/icons-react';
import type { DocumentListItem } from './types';

interface DocumentDetailDrawerProps {
  document: DocumentListItem | null;
  opened: boolean;
  onClose: () => void;
  entityType: string;
  entityId: number;
}

export function DocumentDetailDrawer({ 
  document, 
  opened, 
  onClose, 
  entityType, 
  entityId 
}: DocumentDetailDrawerProps) {
  if (!document) return null;

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMimeTypeDisplay = (mimeType?: string) => {
    if (!mimeType) return 'Unknown';
    
    const mimeMap: Record<string, string> = {
      'application/pdf': 'PDF Document',
      'application/msword': 'Word Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
      'application/vnd.ms-excel': 'Excel Spreadsheet',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
      'application/vnd.ms-powerpoint': 'PowerPoint Presentation',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation',
      'text/plain': 'Text File',
      'text/csv': 'CSV File',
      'image/jpeg': 'JPEG Image',
      'image/png': 'PNG Image',
      'image/gif': 'GIF Image',
      'image/bmp': 'BMP Image',
      'video/mp4': 'MP4 Video',
      'video/avi': 'AVI Video',
      'audio/mp3': 'MP3 Audio',
      'audio/wav': 'WAV Audio',
      'application/zip': 'ZIP Archive',
      'application/x-rar-compressed': 'RAR Archive'
    };

    return mimeMap[mimeType] || mimeType;
  };

  const canPreview = (mimeType?: string) => {
    if (!mimeType) return false;
    
    const previewableMimes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/bmp',
      'image/webp',
      'text/plain',
      'application/pdf'
    ];
    
    return previewableMimes.includes(mimeType);
  };

  const handleLinkToCRM = () => {
    console.log('Linking document to CRM:', { 
      document: document.id, 
      entityType, 
      entityId 
    });
  };

  const handleUnlinkFromCRM = () => {
    console.log('Unlinking document from CRM:', { 
      document: document.id, 
      entityType, 
      entityId 
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(document.webUrl);
  };

  const renderPreview = () => {
    if (!canPreview(document.mimeType)) {
      return (
        <Center h={200} style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
          <Stack align="center" gap="sm">
            <IconFile size={48} style={{ color: 'var(--mantine-color-gray-5)' }} />
            <Text size="sm" c="dimmed">Preview not available</Text>
          </Stack>
        </Center>
      );
    }

    if (document.mimeType?.startsWith('image/')) {
      return (
        <Box style={{ maxHeight: 300, overflow: 'hidden', borderRadius: 'var(--mantine-radius-sm)' }}>
          <Image 
            src={document.webUrl} 
            alt={document.name}
            fit="contain"
            h={200}
            onError={() => {
              // Handle image load error
            }}
          />
        </Box>
      );
    }

    return (
      <Center h={200} style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
        <Stack align="center" gap="sm">
          <IconFileText size={48} style={{ color: 'var(--mantine-color-blue-5)' }} />
          <Text size="sm" c="dimmed">
            {getMimeTypeDisplay(document.mimeType)}
          </Text>
        </Stack>
      </Center>
    );
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      title={
        <Group gap="sm">
          <IconFile size={20} />
          <Text fw={600}>Document Details</Text>
        </Group>
      }
      padding="md"
    >
      <Stack gap="md" h="100%">
        {/* Document Header */}
        <Card withBorder p="md">
          <Stack gap="sm">
            {/* Name and Type */}
            <Group justify="space-between" align="flex-start">
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text size="lg" fw={600} style={{ wordBreak: 'break-word' }}>
                  {document.name}
                </Text>
                <Text size="sm" c="dimmed">
                  {getMimeTypeDisplay(document.mimeType)} • {formatFileSize(document.size)}
                </Text>
              </Box>
              <Group gap="xs">
                {document.isShared && (
                  <Badge size="sm" color="blue" variant="light">Shared</Badge>
                )}
                {document.isLinked && (
                  <Badge size="sm" color="green" variant="light">Linked</Badge>
                )}
              </Group>
            </Group>

            {/* Preview */}
            {renderPreview()}

            {/* CRM Link Status */}
            {document.isLinked ? (
              <Alert 
                icon={<IconInfoCircle size={16} />} 
                color="green" 
                variant="light"
                style={{ padding: '8px 12px' }}
              >
                <Group justify="space-between" align="center">
                  <Text size="sm">This document is linked to the current record</Text>
                  <Button 
                    size="xs" 
                    variant="light" 
                    color="red"
                    leftSection={<IconUnlink size={14} />}
                    onClick={handleUnlinkFromCRM}
                  >
                    Unlink
                  </Button>
                </Group>
              </Alert>
            ) : (
              <Alert 
                icon={<IconInfoCircle size={16} />} 
                color="yellow" 
                variant="light"
                style={{ padding: '8px 12px' }}
              >
                <Group justify="space-between" align="center">
                  <Text size="sm">This document is not linked to the current record</Text>
                  <Button 
                    size="xs" 
                    variant="light"
                    leftSection={<IconLink size={14} />}
                    onClick={handleLinkToCRM}
                  >
                    Link to CRM
                  </Button>
                </Group>
              </Alert>
            )}
          </Stack>
        </Card>

        {/* Actions */}
        <Group>
          {canPreview(document.mimeType) && (
            <Button 
              variant="filled" 
              leftSection={<IconEye size={16} />}
              onClick={() => window.open(document.webUrl, '_blank')}
            >
              Preview
            </Button>
          )}
          
          {document.downloadUrl && (
            <Button 
              variant="light" 
              leftSection={<IconDownload size={16} />}
              onClick={() => window.open(document.downloadUrl, '_blank')}
            >
              Download
            </Button>
          )}
          
          <Button 
            variant="light" 
            leftSection={<IconShare size={16} />}
            onClick={() => window.open(document.webUrl, '_blank')}
          >
            Share
          </Button>
          
          <Button 
            variant="outline" 
            leftSection={<IconCopy size={16} />}
            onClick={handleCopyLink}
          >
            Copy Link
          </Button>
          
          <Button 
            variant="outline" 
            leftSection={<IconExternalLink size={16} />}
            onClick={() => window.open(document.webUrl, '_blank')}
          >
            Open in OneDrive
          </Button>
        </Group>

        <Divider />

        {/* Document Properties */}
        <Card withBorder p="md">
          <Text fw={500} mb="sm">Properties</Text>
          <Stack gap="sm">
            <Group justify="space-between">
              <Group gap="xs">
                <IconFile size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <Text size="sm" c="dimmed">Type:</Text>
              </Group>
              <Text size="sm">{getMimeTypeDisplay(document.mimeType)}</Text>
            </Group>

            <Group justify="space-between">
              <Group gap="xs">
                <IconRuler size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <Text size="sm" c="dimmed">Size:</Text>
              </Group>
              <Text size="sm">{formatFileSize(document.size)}</Text>
            </Group>

            <Group justify="space-between">
              <Group gap="xs">
                <IconCalendar size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <Text size="sm" c="dimmed">Created:</Text>
              </Group>
              <Text size="sm">{formatDateTime(document.createdDateTime)}</Text>
            </Group>

            <Group justify="space-between">
              <Group gap="xs">
                <IconCalendar size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <Text size="sm" c="dimmed">Modified:</Text>
              </Group>
              <Text size="sm">{formatDateTime(document.lastModifiedDateTime)}</Text>
            </Group>

            <Group justify="space-between">
              <Group gap="xs">
                <IconUser size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <Text size="sm" c="dimmed">Created by:</Text>
              </Group>
              <Group gap="xs">
                <Avatar size="xs" color="blue">
                  {getInitials(document.createdBy.displayName)}
                </Avatar>
                <Text size="sm">{document.createdBy.displayName}</Text>
              </Group>
            </Group>

            <Group justify="space-between">
              <Group gap="xs">
                <IconUser size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <Text size="sm" c="dimmed">Modified by:</Text>
              </Group>
              <Group gap="xs">
                <Avatar size="xs" color="gray">
                  {getInitials(document.lastModifiedBy.displayName)}
                </Avatar>
                <Text size="sm">{document.lastModifiedBy.displayName}</Text>
              </Group>
            </Group>

            {document.parentPath && (
              <Group justify="space-between" align="flex-start">
                <Group gap="xs">
                  <IconFile size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                  <Text size="sm" c="dimmed">Location:</Text>
                </Group>
                <Text size="sm" style={{ textAlign: 'right', wordBreak: 'break-all' }}>
                  {document.parentPath}
                </Text>
              </Group>
            )}
          </Stack>
        </Card>

        {/* Sharing Information */}
        {document.isShared && document.permissions && (
          <Card withBorder p="md">
            <Text fw={500} mb="sm">Sharing</Text>
            <Stack gap="xs">
              {document.permissions.map((permission, index) => (
                <Group key={index} justify="space-between">
                  <Text size="sm">{permission}</Text>
                  <Badge size="xs" variant="light">Active</Badge>
                </Group>
              ))}
            </Stack>
          </Card>
        )}
      </Stack>
    </Drawer>
  );
}