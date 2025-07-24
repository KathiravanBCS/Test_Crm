import { useState } from 'react';
import { Container, Title, Stack, Card, Text, Button, Group, Alert, Code, Badge } from '@mantine/core';
import { IconUpload, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { DocumentListWidget } from '../components/DocumentListWidget';
import { useIsMockApi } from '@/lib/api';

export function DocumentUploadTestPage() {
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'customer' | 'partner' | 'proposal';
    id: number;
    name: string;
  }>({
    type: 'customer',
    id: 1,
    name: 'Test Customer'
  });
  
  const isMockApi = useIsMockApi();

  const testEntities = [
    { type: 'customer' as const, id: 1, name: 'Test Customer' },
    { type: 'partner' as const, id: 1, name: 'Test Partner' },
    { type: 'proposal' as const, id: 1, name: 'Test Proposal' },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={2}>Document Upload Test</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Test document upload functionality with SharePoint integration
          </Text>
        </div>

        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="SharePoint Integration Status"
          color={isMockApi ? "blue" : "orange"}
        >
          <Stack gap="xs">
            <Group>
              <Text size="sm">API Mode:</Text>
              <Badge color={isMockApi ? "blue" : "orange"}>
                {isMockApi ? "Mock API with SharePoint" : "Real API"}
              </Badge>
            </Group>
            {isMockApi && (
              <>
                <Text size="sm">
                  The mock API is configured to upload files directly to SharePoint using Microsoft Graph API.
                </Text>
                <Text size="sm" c="dimmed">
                  Make sure you're logged in with your Microsoft account and have access to the configured SharePoint site.
                </Text>
              </>
            )}
          </Stack>
        </Alert>

        <Card withBorder>
          <Stack gap="md">
            <Text fw={500}>Test Entity Selection</Text>
            <Group>
              {testEntities.map((entity) => (
                <Button
                  key={`${entity.type}-${entity.id}`}
                  variant={selectedEntity.type === entity.type && selectedEntity.id === entity.id ? "filled" : "light"}
                  onClick={() => setSelectedEntity(entity)}
                  size="sm"
                >
                  {entity.name}
                </Button>
              ))}
            </Group>
            <Text size="sm" c="dimmed">
              Selected: {selectedEntity.name} (Type: {selectedEntity.type}, ID: {selectedEntity.id})
            </Text>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap="md">
            <Text fw={500}>Upload Instructions</Text>
            <Stack gap="xs">
              <Group gap="xs">
                <IconCheck size={16} color="var(--mantine-color-green-6)" />
                <Text size="sm">Click the "Upload Document" button in the widget below</Text>
              </Group>
              <Group gap="xs">
                <IconCheck size={16} color="var(--mantine-color-green-6)" />
                <Text size="sm">Select a file from your computer</Text>
              </Group>
              <Group gap="xs">
                <IconCheck size={16} color="var(--mantine-color-green-6)" />
                <Text size="sm">Add optional tags and description</Text>
              </Group>
              <Group gap="xs">
                <IconCheck size={16} color="var(--mantine-color-green-6)" />
                <Text size="sm">Click "Upload" to send the file to SharePoint</Text>
              </Group>
            </Stack>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap="md">
            <Text fw={500}>SharePoint Folder Structure</Text>
            <Code block>
{`/Customers/
  └── ${selectedEntity.type === 'customer' ? selectedEntity.id : '...'}/ (Customer files)
/Partners/
  └── ${selectedEntity.type === 'partner' ? selectedEntity.id : '...'}/ (Partner files)
/Internal/
  ├── proposal/
  │   └── ${selectedEntity.type === 'proposal' ? selectedEntity.id : '...'}/ (Proposal files)
  ├── engagement_letter/
  ├── engagement/
  └── engagement_service_item/`}
            </Code>
          </Stack>
        </Card>

        <DocumentListWidget
          entityType={selectedEntity.type}
          entityId={selectedEntity.id}
          title={`Documents for ${selectedEntity.name}`}
          showUpload={true}
          showFilters={true}
          maxHeight={500}
        />
      </Stack>
    </Container>
  );
}