import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Button, Group, Tabs, Stack, LoadingOverlay, Alert, rem, SimpleGrid, Card, Text, Avatar } from '@mantine/core';
import {
  IconArrowLeft,
  IconEdit,
  IconBuilding,
  IconBuildingBank,
  IconUsers,
  IconMapPin,
  IconCurrencyRupee,
  IconAlertCircle,
  IconMail,
  IconFolder
} from '@tabler/icons-react';
import { useGetPartner } from '../api/useGetPartner';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { PartnerInfoCard } from '../components/PartnerInfoCard';
import { PartnerAddressCard } from '../components/PartnerAddressCard';
import { PartnerBankingCard } from '../components/PartnerBankingCard';
import { PartnerContactsCard } from '../components/PartnerContactsCard';
import { PartnerCommissionCard } from '../components/PartnerCommissionCard';
import { CommunicationTab } from '@/components/communication';
import { DocumentListWidget, DocumentViewer, DocumentSummaryWidget } from '@/features/documents/components';
import { RecentEmailWidget } from '@/features/outlook/components/RecentEmailWidget';
import { RecentMeetingsWidget } from '@/features/outlook/components/RecentMeetingsWidget';
import { DocumentMetadata } from '@/features/documents/types';

export function PartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const partnerId = parseInt(id || '0');
  const { data: partner, isLoading, error } = useGetPartner(partnerId);
  const { canViewFinancial } = useUserRole();
  const [selectedDocument, setSelectedDocument] = useState<DocumentMetadata | null>(null);
  const [documentViewerOpened, setDocumentViewerOpened] = useState(false);

  if (!partnerId) {
    return (
      <Container>
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          Invalid partner ID
        </Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          Failed to load partner: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" pos="relative">
      <LoadingOverlay visible={isLoading} />

      {/* Header */}
      <Group justify="space-between" mb="xl">
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate('/partners')}
          >
            Back to Partners
          </Button>
          {partner && <Title order={2}>{partner.partnerName}</Title>}
        </Group>
        <Button
          leftSection={<IconEdit size={16} />}
          onClick={() => navigate(`/partners/${partnerId}/edit`)}
        >
          Edit Partner
        </Button>
      </Group>

      {partner && (
        <Stack gap="xl">
          {/* Partner Info Card */}
          <PartnerInfoCard partner={partner} />

          {/* Tabbed Content */}
          <Tabs defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab
                value="overview"
                leftSection={<IconBuilding style={{ width: rem(16), height: rem(16) }} />}
              >
                Overview
              </Tabs.Tab>
              <Tabs.Tab
                value="contacts"
                leftSection={<IconUsers style={{ width: rem(16), height: rem(16) }} />}
              >
                Contacts
              </Tabs.Tab>
              <Tabs.Tab
                value="communication"
                leftSection={<IconMail style={{ width: rem(16), height: rem(16) }} />}
              >
                Communication
              </Tabs.Tab>
              <Tabs.Tab
                value="documents"
                leftSection={<IconFolder style={{ width: rem(16), height: rem(16) }} />}
              >
                Documents
              </Tabs.Tab>
              {canViewFinancial && (
                <Tabs.Tab
                  value="financial"
                  leftSection={<IconCurrencyRupee style={{ width: rem(16), height: rem(16) }} />}
                >
                  Financial
                </Tabs.Tab>
              )}
            </Tabs.List>

            <Tabs.Panel value="overview" pt="xl">
              <Stack gap="lg">
                {partner.partnerDescription && (
                  <Card withBorder>
                    <Stack gap="sm">
                      <Text fw={600}>About</Text>
                      <Text>{partner.partnerDescription}</Text>
                    </Stack>
                  </Card>
                )}

                <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
                  <Stack gap="lg">
                    <PartnerAddressCard partner={partner} />
                  </Stack>

                  <Stack gap="lg">
                    <PartnerBankingCard partner={partner} />
                  </Stack>

                  <Stack gap="lg">
                    <DocumentSummaryWidget
                      entityType="partner"
                      entityId={partnerId}
                      title="Document Overview"
                    />

                    <RecentEmailWidget
                      entityType="partner"
                      entityId={partnerId}
                      entityCode={partner.partnerCode}
                      maxItems={5}
                    />

                    <RecentMeetingsWidget
                      entityType="partner"
                      entityId={partnerId}
                      entityCode={partner.partnerCode}
                      maxItems={5}
                      showUpcoming={true}
                    />
                  </Stack>
                </SimpleGrid>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="contacts" pt="xl">
              <PartnerContactsCard
                contacts={partner.contacts || []}
                editable={false}
              />
            </Tabs.Panel>

            <Tabs.Panel value="communication" pt="xl">
              <CommunicationTab
                entityType="partner"
                entityId={partnerId}
                entityName={partner.partnerName}
              />
            </Tabs.Panel>

            <Tabs.Panel value="documents" pt="xl">
              <DocumentListWidget
                entityType="partner"
                entityId={partnerId}
                title={`Documents for ${partner.partnerName}`}
                showUpload={true}
                showFilters={true}
                onDocumentClick={(document) => {
                  setSelectedDocument(document);
                  setDocumentViewerOpened(true);
                }}
              />
            </Tabs.Panel>

            {canViewFinancial && (
              <Tabs.Panel value="financial" pt="xl">
                <PartnerCommissionCard partner={partner} />
              </Tabs.Panel>
            )}
          </Tabs>
        </Stack>
      )}

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