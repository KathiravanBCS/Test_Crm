import { useState } from 'react';
import { 
  Container, 
  Title, 
  Stack, 
  Tabs,
  Card,
  Group,
  Button,
  Alert,
  Text,
  Badge,
  Select,
  TextInput,
  Switch,
  Paper,
  Grid,
  Code,
  ScrollArea,
  Divider
} from '@mantine/core';
import { 
  IconMail, 
  IconCalendar, 
  IconTestPipe,
  IconRefresh,
  IconSettings,
  IconExternalLink,
  IconAlertCircle,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { EmailViewer } from '../components/EmailViewer';
import { CalendarViewer } from '../components/CalendarViewer';
import { SimpleGraphTest } from '../components/SimpleGraphTest';
import { RecentEmailWidget } from '../components/RecentEmailWidget';
import { RecentMeetingsWidget } from '../components/RecentMeetingsWidget';
import { OutlookTabs } from '../components/OutlookTabs';
import { outlookServices } from '@/services/graph';
import { useOutlookReady } from '../hooks/useOutlookServices';

// Test entity codes
const TEST_ENTITY_CODES = [
  'PROP-2024-001',
  'PROP-2024-002',
  'EL-2024-001',
  'ENG-2024-001',
  'CUST-2024-001',
  'PRTN-2024-001'
];

export function OutlookTestPage() {
  const [activeTab, setActiveTab] = useState<string | null>('email-viewer');
  const [testEntityCode, setTestEntityCode] = useState<string>('PROP-2024-001');
  const [testEntityType, setTestEntityType] = useState<string>('proposal');
  const [testEntityId, setTestEntityId] = useState<string>('ENG-2024-001');
  const [showWidgets, setShowWidgets] = useState(true);
  const [useBackend, setUseBackend] = useState(outlookServices.isUsingBackend());
  
  const { isReady, isAuthenticated, hasGraphScopes, needsConsent } = useOutlookReady();

  const handleBackendToggle = () => {
    if (useBackend) {
      outlookServices.useGraphAPI();
    } else {
      outlookServices.useBackend();
    }
    setUseBackend(!useBackend);
    notifications.show({
      title: 'Service Mode Changed',
      message: `Now using ${!useBackend ? 'Backend API' : 'Graph API'}`,
      color: 'blue',
      icon: <IconSettings size={16} />
    });
  };

  const handleRefreshAll = () => {
    window.location.reload();
  };

  const getStatusBadge = () => {
    if (!isAuthenticated) {
      return <Badge color="red" variant="filled">Not Authenticated</Badge>;
    }
    if (needsConsent) {
      return <Badge color="yellow" variant="filled">Needs Consent</Badge>;
    }
    if (!isReady) {
      return <Badge color="orange" variant="filled">Not Ready</Badge>;
    }
    return <Badge color="green" variant="filled">Ready</Badge>;
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <Card withBorder>
          <Group justify="space-between" mb="md">
            <div>
              <Title order={2}>Outlook Integration Test Page</Title>
              <Text size="sm" c="dimmed" mt="xs">
                Test all Outlook/Graph API components and functionality
              </Text>
            </div>
            <Group>
              {getStatusBadge()}
              <Badge color={useBackend ? 'yellow' : 'green'} variant="light">
                {useBackend ? 'Using Backend' : 'Using Graph API'}
              </Badge>
            </Group>
          </Group>

          {/* Configuration Panel */}
          <Paper withBorder p="md" mb="md">
            <Grid>
              <Grid.Col span={3}>
                <Select
                  label="Test Entity Type"
                  value={testEntityType}
                  onChange={(value) => value && setTestEntityType(value)}
                  data={[
                    { value: 'proposal', label: 'Proposal' },
                    { value: 'engagement_letter', label: 'Engagement Letter' },
                    { value: 'engagement', label: 'Engagement' },
                    { value: 'customer', label: 'Customer' },
                    { value: 'partner', label: 'Partner' }
                  ]}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Select
                  label="Test Entity Code"
                  value={testEntityCode}
                  onChange={(value) => value && setTestEntityCode(value)}
                  data={TEST_ENTITY_CODES}
                  searchable
                  // creatable
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <TextInput
                  label="Entity ID"
                  value={testEntityId}
                  onChange={(e) => setTestEntityId(e.currentTarget.value)}
                  placeholder="1"
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Switch
                  label="Show Widgets"
                  checked={showWidgets}
                  onChange={(e) => setShowWidgets(e.currentTarget.checked)}
                  mt="md"
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Group mt="md" gap="xs">
                  <Button
                    variant="light"
                    leftSection={<IconSettings size={16} />}
                    onClick={handleBackendToggle}
                  >
                    Toggle API
                  </Button>
                  <Button
                    variant="light"
                    leftSection={<IconRefresh size={16} />}
                    onClick={handleRefreshAll}
                  >
                    Refresh
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Status Messages */}
          {!isAuthenticated && (
            <Alert color="red" icon={<IconAlertCircle size={16} />} mb="md">
              You are not authenticated. Please log in to test Outlook features.
            </Alert>
          )}
          {needsConsent && (
            <Alert color="yellow" icon={<IconAlertCircle size={16} />} mb="md">
              Additional permissions are required to access Outlook data. Please grant consent when prompted.
            </Alert>
          )}
        </Card>

        {/* Widget Test Section */}
        {showWidgets && (
          <Card withBorder>
            <Title order={3} mb="md">Widget Components</Title>
            <Grid>
              <Grid.Col span={6}>
                <Stack gap="md">
                  <Text fw={500}>Recent Email Widget</Text>
                  <RecentEmailWidget
                    entityType={testEntityType as any}
                    entityId={parseInt(testEntityId)}
                    entityCode={testEntityCode}
                    relatedCodes={[testEntityCode]}
                    maxItems={5}
                    loadDelay={200} // Stagger by 200ms
                  />
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap="md">
                  <Text fw={500}>Recent Meetings Widget</Text>
                  <RecentMeetingsWidget
                    entityType={testEntityType as any}
                    entityId={parseInt(testEntityId)}
                    entityCode={testEntityCode}
                    relatedCodes={[testEntityCode]}
                    maxItems={5}
                    loadDelay={400} // Stagger by 400ms
                  />
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        )}

        {/* Main Test Tabs */}
        <Card withBorder>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="email-viewer" leftSection={<IconMail size={16} />}>
                Email Viewer
              </Tabs.Tab>
              <Tabs.Tab value="calendar-viewer" leftSection={<IconCalendar size={16} />}>
                Calendar Viewer
              </Tabs.Tab>
              <Tabs.Tab value="outlook-tabs" leftSection={<IconExternalLink size={16} />}>
                Outlook Tabs
              </Tabs.Tab>
              <Tabs.Tab value="api-test" leftSection={<IconTestPipe size={16} />}>
                API Test
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="email-viewer" pt="md">
              {activeTab === 'email-viewer' && (
                <EmailViewer
                  entityType={testEntityType as any}
                  entityId={parseInt(testEntityId)}
                  entityCode={testEntityCode}
                  relatedCodes={[testEntityCode]}
                />
              )}
            </Tabs.Panel>

            <Tabs.Panel value="calendar-viewer" pt="md">
              {activeTab === 'calendar-viewer' && (
                <CalendarViewer
                  entityType={testEntityType as any}
                  entityId={parseInt(testEntityId)}
                  entityCode={testEntityCode}
                  relatedCodes={[testEntityCode]}
                />
              )}
            </Tabs.Panel>

            <Tabs.Panel value="outlook-tabs" pt="md">
              {activeTab === 'outlook-tabs' && (
                <OutlookTabs
                  entityType={testEntityType as any}
                  entityId={parseInt(testEntityId)}
                  entityCode={testEntityCode}
                  relatedCodes={[testEntityCode]}
                />
              )}
            </Tabs.Panel>

            <Tabs.Panel value="api-test" pt="md">
              {activeTab === 'api-test' && (
                <Stack gap="lg">
                  <SimpleGraphTest />
                
                <Divider />
                
                <Card withBorder>
                  <Title order={4} mb="md">Service Configuration</Title>
                  <Code block>
                    {JSON.stringify({
                      isUsingBackend: outlookServices.isUsingBackend(),
                      isAuthenticated,
                      hasGraphScopes,
                      needsConsent,
                      environment: {
                        VITE_USE_GRAPH_BACKEND: import.meta.env.VITE_USE_GRAPH_BACKEND,
                        VITE_USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API
                      }
                    }, null, 2)}
                  </Code>
                </Card>

                <Card withBorder>
                  <Title order={4} mb="md">Test Scenarios</Title>
                  <Stack gap="sm">
                    <Paper withBorder p="sm">
                      <Group justify="space-between">
                        <Text size="sm">Email Search with Entity Code</Text>
                        <Badge color={isReady ? 'green' : 'red'} variant="light">
                          {isReady ? <IconCheck size={14} /> : <IconX size={14} />}
                        </Badge>
                      </Group>
                    </Paper>
                    <Paper withBorder p="sm">
                      <Group justify="space-between">
                        <Text size="sm">Calendar Events with Entity Code</Text>
                        <Badge color={isReady ? 'green' : 'red'} variant="light">
                          {isReady ? <IconCheck size={14} /> : <IconX size={14} />}
                        </Badge>
                      </Group>
                    </Paper>
                    <Paper withBorder p="sm">
                      <Group justify="space-between">
                        <Text size="sm">Backend API Fallback</Text>
                        <Badge color="green" variant="light">
                          <IconCheck size={14} />
                        </Badge>
                      </Group>
                    </Paper>
                    <Paper withBorder p="sm">
                      <Group justify="space-between">
                        <Text size="sm">Authentication Flow</Text>
                        <Badge color={isAuthenticated ? 'green' : 'red'} variant="light">
                          {isAuthenticated ? <IconCheck size={14} /> : <IconX size={14} />}
                        </Badge>
                      </Group>
                    </Paper>
                  </Stack>
                </Card>
                </Stack>
              )}
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Stack>
    </Container>
  );
}