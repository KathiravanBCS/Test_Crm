import { useState } from 'react';
import {
  Modal,
  Stack,
  Group,
  Text,
  Button,
  Badge,
  ActionIcon,
  Tabs,
  Timeline,
  Card,
  ScrollArea,
  Center,
  Loader,
  rem,
} from '@mantine/core';
import {
  IconX,
  IconDownload,
  IconShare,
  IconEye,
  IconHistory,
  IconFileDescription,
  IconUser,
  IconClock,
} from '@tabler/icons-react';
import { DocumentMetadata, DocumentActivity } from '../types';
import { formatDateTime } from '@/lib/utils/date';
import { useGetDocumentActivities } from '../api/useGetDocumentActivities';
import { modals } from '@mantine/modals';
import { DocumentShareModal } from './DocumentShareModal';

interface DocumentViewerProps {
  document: DocumentMetadata | null;
  opened: boolean;
  onClose: () => void;
}

export function DocumentViewer({ document, opened, onClose }: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<string | null>('details');
  const { data: activities, isLoading: activitiesLoading } = useGetDocumentActivities(
    document?.id || 0
  );

  if (!document) return null;

  const handleDownload = () => {
    window.open(document.downloadUrl, '_blank');
  };

  const handleView = () => {
    window.open(document.webUrl, '_blank');
  };

  const handleShare = () => {
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

  const getActivityIcon = (action: DocumentActivity['action']) => {
    switch (action) {
      case 'uploaded':
        return <IconFileDescription size={12} />;
      case 'viewed':
        return <IconEye size={12} />;
      case 'downloaded':
        return <IconDownload size={12} />;
      case 'shared':
        return <IconShare size={12} />;
      case 'approved':
      case 'rejected':
      case 'reviewed':
        return <IconUser size={12} />;
      default:
        return <IconClock size={12} />;
    }
  };

  const getActivityColor = (action: DocumentActivity['action']) => {
    switch (action) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'shared':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconFileDescription size={20} />
          <Text fw={600}>Document Details</Text>
        </Group>
      }
      size="lg"
    >
      <Stack gap="md">
        <Card p="sm" withBorder>
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={4}>
              <Text fw={500} size="lg" lineClamp={1}>
                {document.fileName}
              </Text>
              <Group gap="xs">
                <Badge size="sm" color={document.status === 'approved' ? 'green' : 'yellow'}>
                  {document.status}
                </Badge>
                {document.reviewStatus && (
                  <Badge size="sm" color="orange">
                    {document.reviewStatus}
                  </Badge>
                )}
                <Text size="xs" c="dimmed">
                  {(document.fileSizeKb / 1024).toFixed(2)} MB
                </Text>
              </Group>
            </Stack>
            <Group gap="xs" wrap="nowrap">
              <Button
                size="xs"
                variant="default"
                leftSection={<IconEye size={14} />}
                onClick={handleView}
              >
                View
              </Button>
              <Button
                size="xs"
                variant="default"
                leftSection={<IconDownload size={14} />}
                onClick={handleDownload}
              >
                Download
              </Button>
              <Button
                size="xs"
                variant="default"
                leftSection={<IconShare size={14} />}
                onClick={handleShare}
              >
                Share
              </Button>
            </Group>
          </Group>
        </Card>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="details" leftSection={<IconFileDescription size={16} />}>
              Details
            </Tabs.Tab>
            <Tabs.Tab value="activity" leftSection={<IconHistory size={16} />}>
              Activity History
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="details" pt="md">
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Uploaded by</Text>
                <Text size="sm">
                  {document.uploadedBy.firstName} {document.uploadedBy.lastName}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Upload date</Text>
                <Text size="sm">{formatDateTime(document.uploadedAt)}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">File type</Text>
                <Text size="sm">{document.fileType}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Version</Text>
                <Text size="sm">v{document.version || 1}</Text>
              </Group>
              {document.tags && document.tags.length > 0 && (
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Tags</Text>
                  <Group gap={4}>
                    {document.tags.map((tag, index) => (
                      <Badge key={index} size="sm" variant="light">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                </Group>
              )}
              {document.reviewedBy && (
                <>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Reviewed by</Text>
                    <Text size="sm">
                      {document.reviewedBy.firstName} {document.reviewedBy.lastName}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Review date</Text>
                    <Text size="sm">{formatDateTime(document.reviewedAt!)}</Text>
                  </Group>
                </>
              )}
              {document.approvalNotes && (
                <Stack gap={4}>
                  <Text size="sm" c="dimmed">Review notes</Text>
                  <Card p="sm" bg="gray.0">
                    <Text size="sm">{document.approvalNotes}</Text>
                  </Card>
                </Stack>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="activity" pt="md">
            <ScrollArea h={300}>
              {activitiesLoading ? (
                <Center h={200}>
                  <Loader size="sm" />
                </Center>
              ) : activities && activities.length > 0 ? (
                <Timeline bulletSize={24} lineWidth={2}>
                  {activities.map((activity) => (
                    <Timeline.Item
                      key={activity.id}
                      bullet={getActivityIcon(activity.action)}
                      color={getActivityColor(activity.action)}
                      title={
                        <Group gap="xs">
                          <Text size="sm">
                            {activity.performedBy.firstName} {activity.performedBy.lastName}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {activity.action.replace('_', ' ')}
                          </Text>
                        </Group>
                      }
                    >
                      <Text size="xs" c="dimmed">
                        {formatDateTime(activity.performedAt)}
                      </Text>
                      {activity.details?.notes && (
                        <Text size="sm" mt={4}>
                          {activity.details.notes}
                        </Text>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <Center h={200}>
                  <Text c="dimmed" size="sm">No activity history</Text>
                </Center>
              )}
            </ScrollArea>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Modal>
  );
}