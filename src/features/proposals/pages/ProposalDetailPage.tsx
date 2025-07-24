import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Container, LoadingOverlay, Alert, Tabs, Grid, Card, Group, Button } from '@mantine/core';
import { 
  IconFileText, 
  IconEdit, 
  IconSend, 
  IconFileDownload,
  IconFileInvoice,
  IconCopy,
  IconTrash,
  IconClock,
  IconListCheck,
  IconUsers,
  IconMessage,
  IconMail,
  IconFolder
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useGetProposal } from '../api/useGetProposal';
import { useDeleteProposal } from '../api/useDeleteProposal';
import { useUpdateProposal } from '../api/useUpdateProposal';
import { useAuth } from '@/lib/auth/useAuth';
import { DocumentHeader } from '@/components/ui/DocumentHeader';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';
import { ServiceItemsDisplay } from '@/components/ui/ServiceItemsDisplay';
import { DocumentTimeline } from '@/components/ui/DocumentTimeline';
import { InfoField } from '@/components/display/InfoField';
import { ProposalDetailContent } from '../components/ProposalDetailContent';
import { CommunicationTab } from '@/components/communication';
import { CommentsTab } from '@/features/comments/components/CommentsTab';
import { DocumentListWidget, DocumentViewer, DocumentSummaryWidget } from '@/features/documents/components';
import { DocumentMetadata } from '@/features/documents/types';
import type { TimelineEvent } from '@/components/ui/DocumentTimeline';

export function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const proposalId = parseInt(id || '0');
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<DocumentMetadata | null>(null);
  const [documentViewerOpened, setDocumentViewerOpened] = useState(false);
  
  const { data: proposal, isLoading, error } = useGetProposal(proposalId);
  const deleteProposalMutation = useDeleteProposal();
  const updateProposalMutation = useUpdateProposal();

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Delete Proposal',
      children: 'Are you sure you want to delete this proposal? This action cannot be undone.',
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteProposalMutation.mutate(proposalId, {
          onSuccess: () => navigate('/proposals')
        });
      },
    });
  };

  const handleDuplicate = () => {
    navigate('/proposals/new', { state: { duplicateFrom: proposalId } });
  };

  const handleCreateEngagement = () => {
    if (proposal?.status?.status_code !== 'approved') {
      modals.openConfirmModal({
        title: 'Cannot Create Engagement Letter',
        children: 'Engagement letters can only be created from approved proposals.',
        labels: { confirm: 'OK', cancel: '' },
        cancelProps: { style: { display: 'none' } },
      });
      return;
    }
    navigate(`/engagement-letters/new?proposalId=${proposalId}`);
  };

  const handleStatusUpdate = () => {
    // TODO: Implement status update modal
    console.log('Status update');
  };

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (error || !proposal) {
    return (
      <Container>
        <Alert color="red" title="Error">
          Failed to load proposal details
        </Alert>
      </Container>
    );
  }

  // Mock timeline events - in real app, these would come from the API
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'created',
      title: 'Proposal created',
      timestamp: proposal.created_at ? new Date(proposal.created_at) : new Date(),
      user: { id: '1', name: String(proposal.created_by || 'System') }
    },
    ...(proposal.status?.status_code === 'submitted' ? [{
      id: '2',
      type: 'sent' as const,
      title: 'Proposal sent to customer',
      timestamp: new Date(),
      user: { id: '1', name: 'Current User' }
    }] : [])
  ];

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <DocumentHeader
          title={proposal.proposal_number || `Proposal #${proposal.id}`}
          documentType="proposal"
          documentNumber={proposal.proposal_number}
          status={proposal.status}
          metadata={{
            customer: proposal.customer?.customerName,
            partner: proposal.customer?.partner?.partnerName,
            date: proposal.proposal_date ? new Date(proposal.proposal_date) : undefined,
            validUntil: proposal.valid_until ? new Date(proposal.valid_until) : undefined,
            value: proposal.total_amount,
            currency: proposal.currency_code
          }}
          actions={{
            primary: proposal.status?.status_code === 'draft' ? {
              label: 'Submit Proposal',
              icon: <IconSend size={16} />,
              onClick: handleStatusUpdate
            } : undefined,
            secondary: [
              {
                label: 'Edit',
                icon: <IconEdit size={16} />,
                onClick: () => navigate(`/proposals/${id}/edit`),
                disabled: proposal.status?.status_code !== 'draft'
              },
              {
                label: 'Duplicate',
                icon: <IconCopy size={16} />,
                onClick: handleDuplicate
              },
              {
                label: 'Download PDF',
                icon: <IconFileDownload size={16} />,
                onClick: () => console.log('Download PDF')
              },
              {
                label: 'Create Engagement Letter',
                icon: <IconFileInvoice size={16} />,
                onClick: handleCreateEngagement,
                disabled: proposal.status?.status_code !== 'approved'
              },
              {
                label: 'Delete',
                icon: <IconTrash size={16} />,
                onClick: handleDelete,
                color: 'red',
                disabled: proposal.status?.status_code !== 'draft'
              }
            ]
          }}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconFileText size={16} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="timeline" leftSection={<IconClock size={16} />}>
              Timeline
            </Tabs.Tab>
            <Tabs.Tab value="tasks" leftSection={<IconListCheck size={16} />}>
              Tasks
            </Tabs.Tab>
            <Tabs.Tab value="team" leftSection={<IconUsers size={16} />}>
              Team
            </Tabs.Tab>
            <Tabs.Tab value="communication" leftSection={<IconMail size={16} />}>
              Communication
            </Tabs.Tab>
            <Tabs.Tab value="documents" leftSection={<IconFolder size={16} />}>
              Documents
            </Tabs.Tab>
            <Tabs.Tab value="comments" leftSection={<IconMessage size={16} />}>
              Comments
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="lg">
                  {/* Service Items */}
                  <CollapsibleSection
                    title="Service Items"
                    badge={proposal.service_items?.length || 0}
                    defaultOpen={true}
                  >
                    <ServiceItemsDisplay
                      items={proposal.service_items || []}
                      currency={proposal.currency_code}
                      showTotals={true}
                    />
                  </CollapsibleSection>

                  {/* Terms & Conditions */}
                  {proposal.notes && (
                    <CollapsibleSection
                      title="Notes & Terms"
                      defaultOpen={false}
                    >
                      <Card p="md">
                        <pre style={{ 
                          whiteSpace: 'pre-wrap', 
                          fontFamily: 'inherit',
                          margin: 0 
                        }}>
                          {proposal.notes}
                        </pre>
                      </Card>
                    </CollapsibleSection>
                  )}
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="lg">
                  <ProposalDetailContent proposalId={proposalId} proposal={proposal} />
                  <DocumentSummaryWidget
                    entityType="proposal"
                    entityId={proposalId}
                    title="Document Overview"
                  />
                </Stack>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="timeline" pt="md">
            <Card withBorder>
              <DocumentTimeline events={timelineEvents} />
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="tasks" pt="md">
            <Alert color="blue" variant="light">
              Tasks feature coming soon
            </Alert>
          </Tabs.Panel>

          <Tabs.Panel value="team" pt="md">
            <Alert color="blue" variant="light">
              Team management feature coming soon
            </Alert>
          </Tabs.Panel>

          <Tabs.Panel value="communication" pt="md">
            <CommunicationTab
              entityType="proposal"
              entityId={proposalId}
              entityName={proposal.proposal_number || `Proposal #${proposal.id}`}
            />
          </Tabs.Panel>

          <Tabs.Panel value="documents" pt="md">
            <DocumentListWidget
              entityType="proposal"
              entityId={proposalId}
              title={`Documents for ${proposal.proposal_number || `Proposal #${proposal.id}`}`}
              showUpload={true}
              showFilters={true}
              onDocumentClick={(document) => {
                setSelectedDocument(document);
                setDocumentViewerOpened(true);
              }}
            />
          </Tabs.Panel>

          <Tabs.Panel value="comments" pt="md">
            {user && (
              <CommentsTab
                entityType="proposal"
                entityId={proposalId}
                currentUserId={user.id}
              />
            )}
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