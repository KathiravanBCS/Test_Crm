import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Stack,
  Group,
  Text,
  Button,
  Badge,
  Tabs,
  Card,
  LoadingOverlay,
  Box,
  ActionIcon,
  Menu,
  Breadcrumbs,
  Anchor,
} from '@mantine/core';
import {
  IconBriefcase,
  IconListDetails,
  IconActivity,
  IconFileText,
  IconMail,
  IconEdit,
  IconDots,
  IconEye,
  IconPlayerPause,
  IconPlayerPlay,
  IconCheck,
  IconArrowLeft,
  IconChecklist,
} from '@tabler/icons-react';
import { useGetEngagement } from '../api/useGetEngagement';
import { EngagementHeader } from '../components/EngagementHeader';
import { EngagementOverview } from '../components/EngagementOverview';
import { EngagementPhases } from '../components/EngagementPhases';
import { EngagementActivities } from '../components/EngagementActivities';
import { EngagementEmails } from '../components/EngagementEmails';
import { EngagementTaskView } from '../components/EngagementTaskView';
import { DocumentListWidget, DocumentViewer, DocumentSummaryWidget } from '@/features/documents/components';
import { DocumentMetadata } from '@/features/documents/types';

export function EngagementDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [selectedDocument, setSelectedDocument] = useState<DocumentMetadata | null>(null);
  const [documentViewerOpened, setDocumentViewerOpened] = useState(false);
  
  const { data: engagement, isLoading, error } = useGetEngagement(Number(id));

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" justify="center" h={400}>
          <LoadingOverlay visible />
          <Text>Loading engagement details...</Text>
        </Stack>
      </Container>
    );
  }

  if (error || !engagement) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" justify="center" h={400}>
          <Text c="red">Failed to load engagement details</Text>
          <Button onClick={() => navigate('/engagements')}>Back to List</Button>
        </Stack>
      </Container>
    );
  }

  const statusActions = [
    { label: 'Start Engagement', icon: IconPlayerPlay, status: 'active' },
    { label: 'Pause Engagement', icon: IconPlayerPause, status: 'paused' },
    { label: 'Complete Engagement', icon: IconCheck, status: 'completed' },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack>
        {/* Breadcrumbs */}
        <Group justify="space-between">
          <Breadcrumbs>
            <Anchor onClick={() => navigate('/engagements')} c="dimmed">
              Engagements
            </Anchor>
            <Text>{engagement.engagementCode || engagement.engagementName}</Text>
          </Breadcrumbs>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate('/engagements')}
          >
            Back to List
          </Button>
        </Group>

        {/* Header Section */}
        <EngagementHeader engagement={engagement} />

        {/* Actions */}
        <Group justify="flex-end">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDots size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size={16} />}
                onClick={() => navigate(`/engagements/${id}/edit`)}
              >
                Edit Engagement
              </Menu.Item>
              <Menu.Item
                leftSection={<IconEye size={16} />}
                onClick={() => navigate(`/engagement-letters/${engagement.engagementLetterId}`)}
              >
                View Engagement Letter
              </Menu.Item>
              <Menu.Divider />
              {statusActions.map((action) => (
                <Menu.Item
                  key={action.status}
                  leftSection={<action.icon size={16} />}
                  disabled={engagement.status?.statusCode === action.status}
                >
                  {action.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconBriefcase size={16} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="phases" leftSection={<IconListDetails size={16} />}>
              Phases & Service Items
            </Tabs.Tab>
            <Tabs.Tab value="tasks" leftSection={<IconChecklist size={16} />}>
              Tasks
            </Tabs.Tab>
            <Tabs.Tab value="comments" leftSection={<IconActivity size={16} />}>
              Comments
            </Tabs.Tab>
            <Tabs.Tab value="documents" leftSection={<IconFileText size={16} />}>
              Documents
            </Tabs.Tab>
            <Tabs.Tab value="emails" leftSection={<IconMail size={16} />}>
              Emails
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <Stack gap="lg">
              <EngagementOverview engagement={engagement} />
              <DocumentSummaryWidget
                entityType="engagement"
                entityId={Number(id)}
                title="Document Overview"
              />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="phases" pt="md">
            <EngagementPhases engagement={engagement} />
          </Tabs.Panel>

          <Tabs.Panel value="tasks" pt="md">
            <EngagementTaskView engagementId={engagement.id} />
          </Tabs.Panel>

          <Tabs.Panel value="comments" pt="md">
            <EngagementActivities engagementId={engagement.id} />
          </Tabs.Panel>

          <Tabs.Panel value="documents" pt="md">
            <DocumentListWidget
              entityType="engagement"
              entityId={engagement.id}
              title={`Documents for ${engagement.engagementCode || engagement.engagementName}`}
              showUpload={true}
              showFilters={true}
              onDocumentClick={(document) => {
                setSelectedDocument(document);
                setDocumentViewerOpened(true);
              }}
            />
          </Tabs.Panel>

          <Tabs.Panel value="emails" pt="md">
            <EngagementEmails engagementId={engagement.id} />
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Document Viewer Modal */}
      <DocumentViewer
        document={selectedDocument}
        opened={documentViewerOpened}
        onClose={() => {
          setDocumentViewerOpened(false);
          setSelectedDocument(null);
        }}
      />
    </Container>
  );
}