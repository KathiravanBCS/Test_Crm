import { useState } from 'react';
import {
  Card,
  Group,
  Text,
  Button,
  Stack,
  Badge,
  ActionIcon,
  Menu,
  TextInput,
  Loader,
  Center,
  ScrollArea,
  Tooltip,
  Divider,
  rem,
} from '@mantine/core';
import {
  IconUpload,
  IconSearch,
  IconDownload,
  IconEye,
  IconShare,
  IconDots,
  IconCheck,
  IconX,
  IconFileTypePdf,
  IconFileTypeDoc,
  IconFileTypeXls,
  IconFile,
  IconFilter,
  IconRefresh,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useGetDocuments } from '../api/useGetDocuments';
import { useReviewDocument } from '../api/useReviewDocument';
import { DocumentMetadata } from '../types';
import { formatDate } from '@/lib/utils/date';
import { DocumentUploadModal } from './DocumentUploadModal';
import { DocumentShareModal } from './DocumentShareModal';
import { DocumentReviewModal } from './DocumentReviewModal';
import { DocumentFilterDrawer } from './DocumentFilterDrawer';
import { useUserRole } from '@/lib/hooks/useUserRole';

interface DocumentListWidgetProps {
  entityType: DocumentMetadata['entityType'];
  entityId: number;
  title?: string;
  maxHeight?: number;
  showUpload?: boolean;
  showFilters?: boolean;
  onDocumentClick?: (document: DocumentMetadata) => void;
}

export function DocumentListWidget({
  entityType,
  entityId,
  title = 'Documents',
  maxHeight = 400,
  showUpload = true,
  showFilters = true,
  onDocumentClick,
}: DocumentListWidgetProps) {
  const [search, setSearch] = useState('');
  const [filterOpened, setFilterOpened] = useState(false);
  const [filters, setFilters] = useState({});
  const { role, isManager, isAdmin } = useUserRole();
  
  const { data: documents, isLoading, refetch } = useGetDocuments(entityType, entityId, filters);
  const reviewMutation = useReviewDocument();

  const filteredDocuments = documents?.filter(doc =>
    doc.fileName.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <IconFileTypePdf size={20} />;
    if (fileType.includes('word') || fileType.includes('doc')) return <IconFileTypeDoc size={20} />;
    if (fileType.includes('excel') || fileType.includes('sheet')) return <IconFileTypeXls size={20} />;
    return <IconFile size={20} />;
  };

  const getStatusBadge = (status: DocumentMetadata['status']) => {
    const statusConfig = {
      draft: { color: 'gray', label: 'Draft' },
      pending_review: { color: 'yellow', label: 'Pending Review' },
      approved: { color: 'green', label: 'Approved' },
      rejected: { color: 'red', label: 'Rejected' },
      archived: { color: 'dark', label: 'Archived' },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return <Badge color={config.color} size="sm">{config.label}</Badge>;
  };

  const handleUploadClick = () => {
    modals.open({
      title: 'Upload Document',
      size: 'md',
      children: (
        <DocumentUploadModal
          entityType={entityType}
          entityId={entityId}
          onSuccess={() => {
            modals.closeAll();
            refetch();
          }}
        />
      ),
    });
  };

  const handleShareDocument = (document: DocumentMetadata) => {
    modals.open({
      title: 'Share Document',
      size: 'md',
      children: (
        <DocumentShareModal
          document={document}
          onSuccess={() => modals.closeAll()}
        />
      ),
    });
  };

  const handleReviewDocument = (document: DocumentMetadata) => {
    modals.open({
      title: 'Review Document',
      size: 'lg',
      children: (
        <DocumentReviewModal
          document={document}
          onSuccess={() => {
            modals.closeAll();
            refetch();
          }}
        />
      ),
    });
  };

  const handleQuickApprove = async (document: DocumentMetadata) => {
    await reviewMutation.mutateAsync({
      documentId: document.id,
      action: 'approve',
    });
  };

  const handleDownload = (document: DocumentMetadata) => {
    window.open(document.downloadUrl, '_blank');
  };

  const handleView = (document: DocumentMetadata) => {
    if (onDocumentClick) {
      onDocumentClick(document);
    } else {
      window.open(document.webUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <Center h={200}>
          <Loader />
        </Center>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={600} size="lg">{title}</Text>
            <Group gap="xs">
              <Tooltip label="Refresh">
                <ActionIcon variant="subtle" onClick={() => refetch()}>
                  <IconRefresh size={18} />
                </ActionIcon>
              </Tooltip>
              {showFilters && (
                <Tooltip label="Filter">
                  <ActionIcon variant="subtle" onClick={() => setFilterOpened(true)}>
                    <IconFilter size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
              {showUpload && (
                <Button
                  leftSection={<IconUpload size={16} />}
                  size="sm"
                  onClick={handleUploadClick}
                >
                  Upload
                </Button>
              )}
            </Group>
          </Group>

          <TextInput
            placeholder="Search documents..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            size="sm"
          />

          <Divider />

          <ScrollArea h={maxHeight} offsetScrollbars>
            <Stack gap="xs">
              {filteredDocuments.length === 0 ? (
                <Center h={100}>
                  <Text c="dimmed" size="sm">No documents found</Text>
                </Center>
              ) : (
                filteredDocuments.map((document) => (
                  <Card key={document.id} p="sm" withBorder>
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" style={{ flex: 1 }}>
                        {getFileIcon(document.fileType)}
                        <Stack gap={4} style={{ flex: 1 }}>
                          <Group gap="xs">
                            <Text size="sm" fw={500} lineClamp={1}>
                              {document.fileName}
                            </Text>
                            {getStatusBadge(document.status)}
                            {document.reviewStatus === 'pending' && (isManager || isAdmin) && (
                              <Badge color="orange" size="xs">Needs Review</Badge>
                            )}
                          </Group>
                          <Group gap="xs">
                            <Text size="xs" c="dimmed">
                              {formatDate(document.uploadedAt)}
                            </Text>
                            <Text size="xs" c="dimmed">•</Text>
                            <Text size="xs" c="dimmed">
                              {document.uploadedBy.firstName} {document.uploadedBy.lastName}
                            </Text>
                            <Text size="xs" c="dimmed">•</Text>
                            <Text size="xs" c="dimmed">
                              {(document.fileSizeKb / 1024).toFixed(2)} MB
                            </Text>
                          </Group>
                          {document.tags && document.tags.length > 0 && (
                            <Group gap={4}>
                              {document.tags.map((tag, index) => (
                                <Badge key={index} size="xs" variant="dot">
                                  {tag}
                                </Badge>
                              ))}
                            </Group>
                          )}
                        </Stack>
                      </Group>

                      <Group gap="xs" wrap="nowrap">
                        <Tooltip label="View">
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            onClick={() => handleView(document)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Download">
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            onClick={() => handleDownload(document)}
                          >
                            <IconDownload size={16} />
                          </ActionIcon>
                        </Tooltip>
                        
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" size="sm">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconShare size={14} />}
                              onClick={() => handleShareDocument(document)}
                            >
                              Share
                            </Menu.Item>
                            {document.reviewStatus === 'pending' && (isManager || isAdmin) && (
                              <>
                                <Menu.Divider />
                                <Menu.Item
                                  leftSection={<IconCheck size={14} />}
                                  color="green"
                                  onClick={() => handleQuickApprove(document)}
                                >
                                  Quick Approve
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconEye size={14} />}
                                  onClick={() => handleReviewDocument(document)}
                                >
                                  Review
                                </Menu.Item>
                              </>
                            )}
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Group>
                  </Card>
                ))
              )}
            </Stack>
          </ScrollArea>
        </Stack>
      </Card>

      <DocumentFilterDrawer
        opened={filterOpened}
        onClose={() => setFilterOpened(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setFilterOpened(false);
        }}
        entityType={entityType}
      />
    </>
  );
}