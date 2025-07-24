import { useState } from 'react';
import {
  Container,
  Stack,
  Title,
  Card,
  Text,
  Button,
  Group,
  Code,
  Alert,
  Loader,
  Badge,
  Divider,
  JsonInput,
  Tabs,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconX,
  IconFolder,
  IconUpload,
  IconDownload,
  IconRefresh,
} from '@tabler/icons-react';
import { useAccount, useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import { SHAREPOINT_CONFIG, buildSharePointPath } from '../config/sharepoint-config';

interface TestResult {
  step: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  data?: any;
}

export function SharePointTestPage() {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [driveInfo, setDriveInfo] = useState<any>(null);
  const [folderContents, setFolderContents] = useState<any>(null);

  const getAccessToken = async () => {
    if (!account) {
      throw new Error('No account found');
    }

    const request = {
      scopes: ['Sites.ReadWrite.All', 'Files.ReadWrite.All'],
      account: account,
    };

    try {
      const response = await instance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const response = await instance.acquireTokenPopup(request);
        return response.accessToken;
      }
      throw error;
    }
  };

  const getGraphClient = async () => {
    const accessToken = await getAccessToken();
    return Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
  };

  const updateTestResult = (step: string, status: TestResult['status'], message?: string, data?: any) => {
    setTestResults(prev => {
      const existing = prev.findIndex(r => r.step === step);
      const result = { step, status, message, data };
      
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = result;
        return updated;
      }
      return [...prev, result];
    });
  };

  const testSharePointConnection = async () => {
    setIsLoading(true);
    setTestResults([]);

    try {
      // Step 1: Get Graph Client
      updateTestResult('Get Graph Client', 'pending');
      const graphClient = await getGraphClient();
      updateTestResult('Get Graph Client', 'success', 'Successfully authenticated with Graph API');

      // Step 2: Verify Site Access
      updateTestResult('Verify Site Access', 'pending');
      try {
        const site = await graphClient
          .api(`/sites/${SHAREPOINT_CONFIG.siteId}`)
          .get();
        updateTestResult('Verify Site Access', 'success', `Site found: ${site.displayName}`, site);
      } catch (error: any) {
        updateTestResult('Verify Site Access', 'error', error.message);
        throw error;
      }

      // Step 3: Verify Drive Access
      updateTestResult('Verify Drive Access', 'pending');
      try {
        const drive = await graphClient
          .api(`/drives/${SHAREPOINT_CONFIG.driveId}`)
          .get();
        setDriveInfo(drive);
        updateTestResult('Verify Drive Access', 'success', `Drive found: ${drive.name}`, drive);
      } catch (error: any) {
        updateTestResult('Verify Drive Access', 'error', error.message);
        throw error;
      }

      // Step 4: List Root Folders
      updateTestResult('List Root Folders', 'pending');
      try {
        const rootContents = await graphClient
          .api(`/drives/${SHAREPOINT_CONFIG.driveId}/root/children`)
          .get();
        setFolderContents(rootContents);
        updateTestResult('List Root Folders', 'success', `Found ${rootContents.value.length} items`, rootContents);

        // Step 5: Check Required Folders
        updateTestResult('Check Required Folders', 'pending');
        const requiredFolders = ['Customers', 'Partners', 'Internal'];
        const foundFolders = rootContents?.value?.filter((item: any) => 
          item.folder && requiredFolders.includes(item.name)
        ).map((item: any) => item.name) || [];
        
        if (foundFolders.length === requiredFolders.length) {
          updateTestResult('Check Required Folders', 'success', 
            `All required folders found: ${foundFolders.join(', ')}`);
        } else {
          const missing = requiredFolders.filter(f => !foundFolders.includes(f));
          updateTestResult('Check Required Folders', 'error', 
            `Missing folders: ${missing.join(', ')}`);
        }
      } catch (error: any) {
        updateTestResult('List Root Folders', 'error', error.message);
      }

      notifications.show({
        title: 'Success',
        message: 'SharePoint connection test completed',
        color: 'green',
      });

    } catch (error: any) {
      notifications.show({
        title: 'Test Failed',
        message: error.message || 'Failed to connect to SharePoint',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testCreateFolder = async () => {
    setIsLoading(true);
    try {
      const graphClient = await getGraphClient();
      const testFolderName = `Test_Folder_${Date.now()}`;
      
      updateTestResult('Create Test Folder', 'pending');
      
      const newFolder = await graphClient
        .api(`/drives/${SHAREPOINT_CONFIG.driveId}/root/children`)
        .post({
          name: testFolderName,
          folder: {},
          '@microsoft.graph.conflictBehavior': 'rename'
        });
      
      updateTestResult('Create Test Folder', 'success', 
        `Created folder: ${newFolder.name}`, newFolder);
      
      // Clean up - delete the test folder
      setTimeout(async () => {
        try {
          await graphClient
            .api(`/drives/${SHAREPOINT_CONFIG.driveId}/items/${newFolder.id}`)
            .delete();
          updateTestResult('Cleanup', 'success', 'Test folder deleted');
        } catch (error) {
          console.error('Failed to delete test folder:', error);
        }
      }, 5000);
      
    } catch (error: any) {
      updateTestResult('Create Test Folder', 'error', error.message);
      notifications.show({
        title: 'Test Failed',
        message: error.message,
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testBuildPath = () => {
    const testCases = [
      {
        entityType: 'proposal',
        entityData: { customerName: 'ABC Company', customerCode: 'CUST001' },
      },
      {
        entityType: 'partner',
        entityData: { partnerName: 'XYZ Partners', partnerCode: 'PART001' },
      },
      {
        entityType: 'employee',
        entityData: { employeeName: 'John Doe', employeeCode: 'EMP001' },
      },
    ];

    const paths = testCases.map(test => ({
      ...test,
      path: buildSharePointPath(test.entityType, test.entityData),
    }));

    updateTestResult('Build SharePoint Paths', 'success', 
      'Path generation test completed', paths);
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const colors = {
      pending: 'yellow',
      success: 'green',
      error: 'red',
    };
    const icons = {
      pending: <Loader size={14} />,
      success: <IconCheck size={14} />,
      error: <IconX size={14} />,
    };
    
    return (
      <Badge color={colors[status]} leftSection={icons[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <Container size="lg">
      <Stack gap="xl">
        <Title order={2}>SharePoint Integration Test</Title>
        
        <Alert icon={<IconFolder size={16} />} variant="light">
          <Text size="sm">
            <strong>Site ID:</strong> <Code>{SHAREPOINT_CONFIG.siteId}</Code>
          </Text>
          <Text size="sm">
            <strong>Drive ID:</strong> <Code>{SHAREPOINT_CONFIG.driveId}</Code>
          </Text>
        </Alert>

        <Card>
          <Stack gap="md">
            <Text fw={600}>Test Actions</Text>
            <Group>
              <Button
                leftSection={<IconRefresh size={16} />}
                onClick={testSharePointConnection}
                loading={isLoading}
              >
                Test Connection
              </Button>
              <Button
                leftSection={<IconFolder size={16} />}
                onClick={testCreateFolder}
                loading={isLoading}
                variant="default"
              >
                Test Create Folder
              </Button>
              <Button
                leftSection={<IconFolder size={16} />}
                onClick={testBuildPath}
                variant="default"
              >
                Test Path Builder
              </Button>
            </Group>
          </Stack>
        </Card>

        {testResults.length > 0 && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Test Results</Text>
              {testResults.map((result, index) => (
                <Card key={index} withBorder p="sm">
                  <Group justify="space-between" mb="xs">
                    <Text fw={500}>{result.step}</Text>
                    {getStatusBadge(result.status)}
                  </Group>
                  {result.message && (
                    <Text size="sm" c={result.status === 'error' ? 'red' : 'dimmed'}>
                      {result.message}
                    </Text>
                  )}
                  {result.data && (
                    <JsonInput
                      value={JSON.stringify(result.data, null, 2)}
                      readOnly
                      autosize
                      maxRows={10}
                      mt="xs"
                    />
                  )}
                </Card>
              ))}
            </Stack>
          </Card>
        )}

        {driveInfo && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Drive Information</Text>
              <JsonInput
                value={JSON.stringify(driveInfo, null, 2)}
                readOnly
                autosize
                maxRows={15}
              />
            </Stack>
          </Card>
        )}

        {folderContents && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Root Folder Contents</Text>
              <Stack gap="xs">
                {folderContents.value.map((item: any) => (
                  <Group key={item.id} gap="xs">
                    <IconFolder size={16} />
                    <Text size="sm">{item.name}</Text>
                    <Badge size="xs" variant="light">
                      {item.folder ? 'Folder' : 'File'}
                    </Badge>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  );
}