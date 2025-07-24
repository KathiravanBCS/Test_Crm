import { useState } from 'react';
import { Container, Title, Grid, Stack, Text, Card, Tabs, Paper } from '@mantine/core';
import { IconFileDescription, IconChartBar, IconListDetails } from '@tabler/icons-react';
import { DocumentListWidget } from '../components/DocumentListWidget';
import { DocumentSummaryWidget } from '../components/DocumentSummaryWidget';
import { DocumentViewer } from '../components/DocumentViewer';
import { DocumentMetadata } from '../types';

// Example page showing how to integrate document management into existing detail pages
export function DocumentManagementExample() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentMetadata | null>(null);
  const [viewerOpened, setViewerOpened] = useState(false);

  // Example entity - in real usage, this would come from your entity data
  const entityType = 'proposal' as const;
  const entityId = 123;

  const handleDocumentClick = (document: DocumentMetadata) => {
    setSelectedDocument(document);
    setViewerOpened(true);
  };

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Title order={2}>Document Management Integration Example</Title>
        
        <Text c="dimmed">
          This example shows how to integrate the document management components into your existing detail pages.
        </Text>

        <Tabs defaultValue="list">
          <Tabs.List>
            <Tabs.Tab value="list" leftSection={<IconListDetails size={16} />}>
              List View Integration
            </Tabs.Tab>
            <Tabs.Tab value="dashboard" leftSection={<IconChartBar size={16} />}>
              Dashboard Integration
            </Tabs.Tab>
            <Tabs.Tab value="detail" leftSection={<IconFileDescription size={16} />}>
              Detail Page Integration
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="list" pt="xl">
            <Stack gap="md">
              <Text fw={500}>1. Full Document List Widget</Text>
              <Text size="sm" c="dimmed">
                Use this in proposal, engagement letter, or engagement detail pages to show all related documents.
              </Text>
              
              <DocumentListWidget
                entityType={entityType}
                entityId={entityId}
                title="Proposal Documents"
                onDocumentClick={handleDocumentClick}
              />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="dashboard" pt="xl">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="md">
                  <Text fw={500}>2. Document Summary Widget</Text>
                  <Text size="sm" c="dimmed">
                    Use this in dashboards or overview pages to show document statistics.
                  </Text>
                  
                  <DocumentSummaryWidget
                    entityType={entityType}
                    entityId={entityId}
                    title="Document Overview"
                  />
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="md">
                  <Text fw={500}>3. Compact List Widget</Text>
                  <Text size="sm" c="dimmed">
                    Use a compact version of the list widget for sidebar or smaller spaces.
                  </Text>
                  
                  <DocumentListWidget
                    entityType={entityType}
                    entityId={entityId}
                    title="Recent Documents"
                    maxHeight={250}
                    showFilters={false}
                  />
                </Stack>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="detail" pt="xl">
            <Paper p="md" withBorder>
              <Stack gap="md">
                <Text fw={500}>4. Integration Pattern for Detail Pages</Text>
                <Text size="sm" c="dimmed">
                  Here's how to integrate documents into your existing detail pages:
                </Text>
                
                <Card withBorder>
                  <pre style={{ margin: 0, fontSize: '0.875rem' }}>
{`// In your ProposalDetailPage.tsx
import { DocumentListWidget } from '@/features/documents/components';

function ProposalDetailPage({ proposalId }) {
  return (
    <Stack>
      {/* Your existing proposal details */}
      <ProposalInfo />
      
      {/* Add document management */}
      <DocumentListWidget
        entityType="proposal"
        entityId={proposalId}
        title="Proposal Documents"
      />
    </Stack>
  );
}`}
                  </pre>
                </Card>

                <Card withBorder>
                  <pre style={{ margin: 0, fontSize: '0.875rem' }}>
{`// For engagement service items
<DocumentListWidget
  entityType="engagement_service_item"
  entityId={serviceItemId}
  title="Service Deliverables"
  showUpload={canEditEngagement}
/>`}
                  </pre>
                </Card>
              </Stack>
            </Paper>
          </Tabs.Panel>
        </Tabs>

        {/* Document Viewer Modal */}
        <DocumentViewer
          document={selectedDocument}
          opened={viewerOpened}
          onClose={() => {
            setViewerOpened(false);
            setSelectedDocument(null);
          }}
        />
      </Stack>
    </Container>
  );
}