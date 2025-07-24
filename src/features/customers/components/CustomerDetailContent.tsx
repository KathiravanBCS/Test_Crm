import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  Group,
  Title,
  Button,
  Tabs,
  SimpleGrid,
  LoadingOverlay,
  Alert,
  Badge,
  Text,
  Card,
} from '@mantine/core';
import {
  IconBuilding,
  IconUsers,
  IconFileText,
  IconReceipt,
  IconEdit,
  IconTrash,
  IconPlus,
  IconAlertCircle,
  IconMail,
  IconFolder,
  IconMessage,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { Can } from '@/components/auth/Can';
import { useGetCustomer } from '../api/useGetCustomer';
import { useDeleteCustomer } from '../api/useDeleteCustomer';
import { useAuth } from '@/lib/auth/useAuth';
import { CustomerInfoCard } from './CustomerInfoCard';
import { CustomerBusinessCard } from './CustomerBusinessCard';
import { ContactPersonList } from './ContactPersonList';
import { ProposalsList } from './ProposalsList';
import { DocumentsList } from './DocumentsList';
import { CommunicationTab } from '@/components/communication';
import { CommentsTab } from '@/features/comments/components/CommentsTab';
import { AddressManagement } from '@/components/forms/address/AddressManagement';
import { DocumentListWidget, DocumentViewer, DocumentSummaryWidget } from '@/features/documents/components';
import { DocumentMetadata } from '@/features/documents/types';

interface CustomerDetailContentProps {
  customerId: number;
}

export function CustomerDetailContent({ customerId }: CustomerDetailContentProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<DocumentMetadata | null>(null);
  const [documentViewerOpened, setDocumentViewerOpened] = useState(false);
  
  const { data: customer, isLoading, error } = useGetCustomer(customerId);
  const deleteCustomerMutation = useDeleteCustomer();

  const handleDelete = () => {
    if (!customer) return;
    
    modals.openConfirmModal({
      title: 'Delete Customer',
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{customer.customerName}</strong>? 
          This action cannot be undone and will remove all associated data.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteCustomerMutation.mutate(customer.id, {
          onSuccess: () => navigate('/customers'),
        });
      },
    });
  };

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (error || !customer) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
        {error?.message || 'Customer not found'}
      </Alert>
    );
  }

  // Calculate metrics
  const activeProposals = customer.proposals?.filter(p => 
    ['Draft', 'Submitted', 'Under Review', 'Negotiation'].includes(p.statusId.toString())
  ).length || 0;
  
  const totalProposals = customer.proposals?.length || 0;
  const totalContacts = customer.contacts?.length || 0;
  const totalDocuments = customer.documents?.length || 0;

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={1}>{customer.customerName}</Title>
        <Group>
          <Can I="update" a={customer}>
            <Button
              variant="default"
              leftSection={<IconEdit size={16} />}
              onClick={() => navigate(`/customers/${customer.id}/edit`)}
            >
              Edit
            </Button>
          </Can>
          <Can I="delete" a={customer}>
            <Button
              color="red"
              variant="subtle"
              leftSection={<IconTrash size={16} />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Can>
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconBuilding size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab 
            value="contacts" 
            leftSection={<IconUsers size={16} />}
            rightSection={
              totalContacts > 0 ? (
                <Badge size="xs" variant="filled" circle>
                  {totalContacts}
                </Badge>
              ) : null
            }
          >
            Contacts
          </Tabs.Tab>
          <Tabs.Tab 
            value="proposals" 
            leftSection={<IconFileText size={16} />}
            rightSection={
              activeProposals > 0 ? (
                <Badge size="xs" variant="filled" color="blue" circle>
                  {activeProposals}
                </Badge>
              ) : totalProposals > 0 ? (
                <Badge size="xs" variant="light" circle>
                  {totalProposals}
                </Badge>
              ) : null
            }
          >
            Proposals & Engagements
          </Tabs.Tab>
          <Tabs.Tab 
            value="communication" 
            leftSection={<IconMail size={16} />}
          >
            Communication
          </Tabs.Tab>
          <Tabs.Tab 
            value="documents" 
            leftSection={<IconFolder size={16} />}
            rightSection={
              totalDocuments > 0 ? (
                <Badge size="xs" variant="light" circle>
                  {totalDocuments}
                </Badge>
              ) : null
            }
          >
            Documents
          </Tabs.Tab>
          <Tabs.Tab 
            value="comments" 
            leftSection={<IconMessage size={16} />}
          >
            Comments
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="xl">
          <Stack gap="lg">
            <CustomerInfoCard customer={customer} />
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              <CustomerBusinessCard customer={customer} />
              <Card>
                <Stack gap="md">
                  <Title order={4}>Addresses</Title>
                  <AddressManagement 
                    addresses={customer.addresses || []}
                    onAdd={() => {/* TODO: Implement add address */}}
                    onUpdate={() => {/* TODO: Implement update address */}}
                    onDelete={() => {/* TODO: Implement delete address */}}
                  />
                </Stack>
              </Card>
            </SimpleGrid>
            <DocumentSummaryWidget
              entityType="customer"
              entityId={customerId}
              title="Document Overview"
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="contacts" pt="xl">
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Contact Persons</Title>
              <Can I="create" a="ContactPerson">
                <Button
                  size="sm"
                  leftSection={<IconPlus size={16} />}
                  onClick={() => {/* TODO: Open contact form */}}
                >
                  Add Contact
                </Button>
              </Can>
            </Group>
            <ContactPersonList customerId={customerId} />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="proposals" pt="xl">
          <Stack gap="xl">
            <div>
              <Group justify="space-between" mb="md">
                <Title order={3}>Proposals</Title>
                <Can I="create" a="Proposal">
                  <Button
                    size="sm"
                    leftSection={<IconPlus size={16} />}
                    onClick={() => navigate(`/proposals/new?customerId=${customerId}`)}
                  >
                    New Proposal
                  </Button>
                </Can>
              </Group>
              <ProposalsList customerId={customerId} />
            </div>

            <div>
              <Title order={3} mb="md">Engagement Letters</Title>
              <Text c="dimmed" size="sm">
                Engagement letters will appear here once proposals are approved
              </Text>
            </div>

            <div>
              <Title order={3} mb="md">Documents</Title>
              <DocumentsList entityType="customer" entityId={customerId} />
            </div>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="communication" pt="xl">
          <CommunicationTab
            entityType="customer"
            entityId={customerId}
            entityName={customer.customerName}
          />
        </Tabs.Panel>

        <Tabs.Panel value="documents" pt="xl">
          <DocumentListWidget
            entityType="customer"
            entityId={customerId}
            title={`Documents for ${customer.customerName}`}
            showUpload={true}
            showFilters={true}
            onDocumentClick={(document) => {
              setSelectedDocument(document);
              setDocumentViewerOpened(true);
            }}
          />
        </Tabs.Panel>

        <Tabs.Panel value="comments" pt="xl">
          {user && (
            <CommentsTab
              entityType="customer"
              entityId={customerId}
              currentUserId={user.id}
            />
          )}
        </Tabs.Panel>
      </Tabs>

      {/* Document Viewer Modal */}
      <DocumentViewer
        document={selectedDocument}
        opened={documentViewerOpened}
        onClose={() => {
          setDocumentViewerOpened(false);
          setSelectedDocument(null);
        }}
      />
    </Stack>
  );
}