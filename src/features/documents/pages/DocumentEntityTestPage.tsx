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
  Badge,
  Select,
  TextInput,
  Tabs,
  JsonInput,
  Divider,
  Paper,
  FileInput,
  Progress,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconX,
  IconFolder,
  IconUpload,
  IconFile,
  IconRefresh,
  IconTrash,
  IconEye,
  IconDownload,
} from '@tabler/icons-react';
import { useAccount, useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import { SHAREPOINT_CONFIG, buildSharePointPath } from '../config/sharepoint-config';
import { SharePointDocumentService } from '../services/sharepoint-service';

interface TestEntity {
  type: string;
  label: string;
  data: Record<string, any>;
  expectedPath: string;
  subfolders?: string[];
}

const TEST_ENTITIES: TestEntity[] = [
  {
    type: 'customer',
    label: 'Customer - ABC Company',
    data: {
      customerName: 'ABC Company',
      customerCode: 'CUST001',
    },
    expectedPath: '/Customers/ABC Company_CUST001',
    subfolders: SHAREPOINT_CONFIG.folderStructure.subfolders,
  },
  {
    type: 'partner',
    label: 'Partner - XYZ Partners',
    data: {
      partnerName: 'XYZ Partners',
      partnerCode: 'PART001',
    },
    expectedPath: '/Partners/XYZ Partners_PART001',
  },
  {
    type: 'proposal',
    label: 'Proposal - Annual Audit 2025',
    data: {
      customerName: 'ABC Company',
      customerCode: 'CUST001',
      proposalCode: 'PROP-2025-001',
      proposalName: 'Annual Audit Proposal',
    },
    expectedPath: '/Customers/ABC Company_CUST001',
    subfolders: ['01_Proposal'],
  },
  {
    type: 'engagement_letter',
    label: 'Engagement Letter - Q1 Services',
    data: {
      customerName: 'DEF Corporation',
      customerCode: 'CUST002',
      engagementCode: 'ENG-2025-001',
      engagementName: 'Q1 Advisory Services',
    },
    expectedPath: '/Customers/DEF Corporation_CUST002',
    subfolders: ['02_Engagement_Letter'],
  },
  {
    type: 'engagement',
    label: 'Engagement - Transfer Pricing Study',
    data: {
      customerName: 'GHI Industries',
      customerCode: 'CUST003',
      engagementCode: 'ENG-2025-002',
      engagementName: 'Transfer Pricing Study',
    },
    expectedPath: '/Customers/GHI Industries_CUST003',
    subfolders: SHAREPOINT_CONFIG.folderStructure.subfolders,
  },
  {
    type: 'employee',
    label: 'Employee - John Doe',
    data: {
      employeeName: 'John Doe',
      employeeCode: 'EMP001',
    },
    expectedPath: '/Internal/Employee_Documents/John Doe_EMP001',
  },
];

interface FolderTest {
  entity: TestEntity;
  status: 'pending' | 'success' | 'error' | 'not_tested';
  message?: string;
  createdFolders?: string[];
  uploadedFile?: any;
  downloadUrl?: string;
}

export function DocumentEntityTestPage() {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [isLoading, setIsLoading] = useState(false);
  const [folderTests, setFolderTests] = useState<FolderTest[]>(
    TEST_ENTITIES.map(entity => ({ entity, status: 'not_tested' }))
  );
  const [selectedEntity, setSelectedEntity] = useState<TestEntity | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm({
    initialValues: {
      entityType: '',
      file: null as File | null,
    },
    validate: {
      entityType: (value) => (!value ? 'Please select an entity' : null),
      file: (value) => (!value ? 'Please select a file' : null),
    },
  });

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

  const updateFolderTest = (entityType: string, update: Partial<FolderTest>) => {
    setFolderTests(prev =>
      prev.map(test =>
        test.entity.type === entityType
          ? { ...test, ...update }
          : test
      )
    );
  };

  const testAllFolders = async () => {
    setIsLoading(true);
    const graphClient = await getGraphClient();
    const service = new SharePointDocumentService(graphClient);

    for (const entity of TEST_ENTITIES) {
      updateFolderTest(entity.type, { status: 'pending', message: 'Creating folder structure...' });

      try {
        // Test path generation
        const generatedPath = buildSharePointPath(entity.type, entity.data);
        if (generatedPath !== entity.expectedPath) {
          throw new Error(`Path mismatch: expected ${entity.expectedPath}, got ${generatedPath}`);
        }

        // Create folder structure
        await service.ensureFolderStructure(entity.type, entity.data);

        // Verify folders were created
        const createdFolders: string[] = [];
        const basePath = entity.expectedPath;

        // Check main folder
        try {
          await graphClient
            .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:${basePath}`)
            .get();
          createdFolders.push(basePath);
        } catch (error) {
          throw new Error(`Failed to create main folder: ${basePath}`);
        }

        // Check subfolders if any
        if (entity.subfolders) {
          for (const subfolder of entity.subfolders) {
            const subfolderPath = `${basePath}/${subfolder}`;
            try {
              await graphClient
                .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:${subfolderPath}`)
                .get();
              createdFolders.push(subfolderPath);
            } catch (error) {
              console.warn(`Subfolder not created: ${subfolderPath}`);
            }
          }
        }

        updateFolderTest(entity.type, {
          status: 'success',
          message: `Created ${createdFolders.length} folders`,
          createdFolders,
        });

      } catch (error: any) {
        updateFolderTest(entity.type, {
          status: 'error',
          message: error.message,
        });
      }
    }

    setIsLoading(false);
    notifications.show({
      title: 'Test Complete',
      message: 'Folder structure test completed',
      color: 'green',
    });
  };

  const testFileUpload = async () => {
    const values = form.values;
    if (!values.file || !values.entityType) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const graphClient = await getGraphClient();
      const service = new SharePointDocumentService(graphClient);
      const entity = TEST_ENTITIES.find(e => e.type === values.entityType);
      
      if (!entity) throw new Error('Entity not found');

      // Ensure folder exists
      setUploadProgress(20);
      await service.ensureFolderStructure(entity.type, entity.data);

      // Determine target folder
      const basePath = buildSharePointPath(entity.type, entity.data);
      let targetPath = basePath;
      
      // For specific entities, use appropriate subfolder
      if (entity.type === 'proposal') {
        targetPath = `${basePath}/01_Proposal`;
      } else if (entity.type === 'engagement_letter') {
        targetPath = `${basePath}/02_Engagement_Letter`;
      }

      // Create upload session
      setUploadProgress(40);
      const { uploadUrl } = await service.createUploadSession(
        targetPath,
        values.file.name
      );

      // Upload file
      setUploadProgress(60);
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: values.file,
        headers: {
          'Content-Type': values.file.type || 'application/octet-stream',
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      // Get file metadata
      setUploadProgress(80);
      const filePath = `${targetPath}/${values.file.name}`;
      const metadata = await service.getFileMetadata(filePath);

      setUploadProgress(100);
      updateFolderTest(entity.type, {
        uploadedFile: metadata,
        downloadUrl: metadata.download_url,
      });

      notifications.show({
        title: 'Success',
        message: 'File uploaded successfully',
        color: 'green',
      });

      // Reset form
      form.reset();
      setUploadProgress(0);

    } catch (error: any) {
      notifications.show({
        title: 'Upload Failed',
        message: error.message,
        color: 'red',
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const cleanupTestFolders = async () => {
    if (!window.confirm('This will delete all test folders. Are you sure?')) return;

    setIsLoading(true);
    const graphClient = await getGraphClient();

    for (const test of folderTests) {
      if (test.status === 'success' && test.createdFolders) {
        updateFolderTest(test.entity.type, { status: 'pending', message: 'Cleaning up...' });

        try {
          // Delete main folder (this will delete all subfolders)
          const mainFolder = test.entity.expectedPath;
          const folder = await graphClient
            .api(`/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:${mainFolder}`)
            .get();

          await graphClient
            .api(`/drives/${SHAREPOINT_CONFIG.driveId}/items/${folder.id}`)
            .delete();

          updateFolderTest(test.entity.type, {
            status: 'not_tested',
            message: undefined,
            createdFolders: undefined,
            uploadedFile: undefined,
          });

        } catch (error: any) {
          console.error(`Failed to delete ${test.entity.type}:`, error);
        }
      }
    }

    setIsLoading(false);
    notifications.show({
      title: 'Cleanup Complete',
      message: 'Test folders have been deleted',
      color: 'blue',
    });
  };

  const getStatusBadge = (status: FolderTest['status']) => {
    const config = {
      pending: { color: 'yellow', icon: <IconRefresh size={14} className="spin" /> },
      success: { color: 'green', icon: <IconCheck size={14} /> },
      error: { color: 'red', icon: <IconX size={14} /> },
      not_tested: { color: 'gray', icon: null },
    };

    return (
      <Badge color={config[status].color} leftSection={config[status].icon}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Title order={2}>Document Entity Test</Title>

        <Alert variant="light">
          Test document management with different entity types. This will create real folders in your SharePoint.
        </Alert>

        <Tabs defaultValue="folders">
          <Tabs.List>
            <Tabs.Tab value="folders">Folder Structure Test</Tabs.Tab>
            <Tabs.Tab value="upload">File Upload Test</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="folders" pt="xl">
            <Stack gap="md">
              <Group justify="space-between">
                <Button
                  leftSection={<IconFolder size={16} />}
                  onClick={testAllFolders}
                  loading={isLoading}
                >
                  Test All Folder Structures
                </Button>
                <Button
                  color="red"
                  variant="outline"
                  leftSection={<IconTrash size={16} />}
                  onClick={cleanupTestFolders}
                  loading={isLoading}
                >
                  Cleanup Test Folders
                </Button>
              </Group>

              <Stack gap="sm">
                {folderTests.map((test) => (
                  <Card key={test.entity.type} withBorder>
                    <Group justify="space-between" mb="sm">
                      <div>
                        <Text fw={600}>{test.entity.label}</Text>
                        <Text size="xs" c="dimmed">Type: {test.entity.type}</Text>
                      </div>
                      {getStatusBadge(test.status)}
                    </Group>

                    <Stack gap="xs">
                      <Group gap="xs">
                        <Text size="sm" c="dimmed">Expected Path:</Text>
                        <Code>{test.entity.expectedPath}</Code>
                      </Group>

                      {test.message && (
                        <Text size="sm" c={test.status === 'error' ? 'red' : 'dimmed'}>
                          {test.message}
                        </Text>
                      )}

                      {test.createdFolders && (
                        <Paper p="xs" bg="gray.0">
                          <Text size="xs" fw={500} mb={4}>Created Folders:</Text>
                          {test.createdFolders.map((folder, idx) => (
                            <Text key={idx} size="xs" c="dimmed">
                              • {folder}
                            </Text>
                          ))}
                        </Paper>
                      )}

                      {test.uploadedFile && (
                        <Group gap="xs">
                          <IconFile size={16} />
                          <Text size="sm">{test.uploadedFile.file_name}</Text>
                          {test.downloadUrl && (
                            <Tooltip label="Download">
                              <ActionIcon
                                size="sm"
                                variant="subtle"
                                component="a"
                                href={test.downloadUrl}
                                target="_blank"
                              >
                                <IconDownload size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Group>
                      )}
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="upload" pt="xl">
            <Card>
              <form onSubmit={form.onSubmit(() => testFileUpload())}>
                <Stack gap="md">
                  <Select
                    label="Select Entity Type"
                    placeholder="Choose an entity to test upload"
                    data={TEST_ENTITIES.map(e => ({
                      value: e.type,
                      label: e.label,
                    }))}
                    {...form.getInputProps('entityType')}
                  />

                  <FileInput
                    label="Select Test File"
                    placeholder="Choose a file to upload"
                    leftSection={<IconUpload size={16} />}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
                    {...form.getInputProps('file')}
                  />

                  {form.values.entityType && (
                    <Paper p="sm" bg="gray.0">
                      <Text size="sm" c="dimmed">
                        File will be uploaded to:{' '}
                        <Code>
                          {(() => {
                            const entity = TEST_ENTITIES.find(e => e.type === form.values.entityType);
                            if (!entity) return '';
                            let path = entity.expectedPath;
                            if (entity.type === 'proposal') path += '/01_Proposal';
                            if (entity.type === 'engagement_letter') path += '/02_Engagement_Letter';
                            return path;
                          })()}
                        </Code>
                      </Text>
                    </Paper>
                  )}

                  {uploadProgress > 0 && (
                    <Progress value={uploadProgress} animated />
                  )}

                  <Button
                    type="submit"
                    leftSection={<IconUpload size={16} />}
                    loading={isLoading}
                    disabled={!form.values.file || !form.values.entityType}
                  >
                    Test Upload
                  </Button>
                </Stack>
              </form>
            </Card>

            {selectedEntity && (
              <Card mt="md">
                <Text fw={600} mb="sm">Entity Data</Text>
                <JsonInput
                  value={JSON.stringify(selectedEntity.data, null, 2)}
                  readOnly
                  autosize
                  maxRows={10}
                />
              </Card>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}