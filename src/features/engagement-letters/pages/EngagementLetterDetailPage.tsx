import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BreadcrumbLink } from '@/components/navigation/BreadcrumbLink';
import {
  Container,
  Title,
  Paper,
  Breadcrumbs,
  Skeleton,
  Alert,
  Group,
  Button,
  Stack,
  Text,
  Badge,
  Card,
  SimpleGrid,
  Divider,
  Table,
  ActionIcon,
  Menu,
  Tabs,
  Timeline,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconEdit,
  IconDownload,
  IconDots,
  IconSend,
  IconCheck,
  IconX,
  IconFileText,
  IconCash,
  IconHistory,
  IconMessage,
  IconPaperclip,
  IconExternalLink,
  IconCurrencyRupee,
  IconBriefcase,
} from '@tabler/icons-react';
import { useGetEngagementLetter } from '../api/useGetEngagementLetter';
import { useGetBranches } from '@/lib/hooks/useGetBranches';
import { MoneyDisplay } from '@/components/display/MoneyDisplay';
import { InfoField } from '@/components/display/InfoField';
import { StatusBadge } from '@/components/display/StatusBadge';
import { formatDate as formatDateUtil, formatDateTime } from '@/lib/utils/date';
import { DocumentListWidget, DocumentViewer, DocumentSummaryWidget } from '@/features/documents/components';
import { DocumentMetadata } from '@/features/documents/types';

// Helper function to safely format dates
const formatDate = (date: string | Date | null | undefined, formatString?: string): string => {
  if (formatString === 'PPp') {
    return formatDateTime(date);
  }
  return formatDateUtil(date);
};

export function EngagementLetterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const engagementLetterId = id ? parseInt(id) : undefined;
  const [selectedDocument, setSelectedDocument] = useState<DocumentMetadata | null>(null);
  const [documentViewerOpened, setDocumentViewerOpened] = useState(false);

  const { data: engagementLetter, isLoading, error } = useGetEngagementLetter(
    engagementLetterId
  );
  const { data: branches = [] } = useGetBranches();

  if (isLoading) {
    return (
      <Container size="xl">
        <Skeleton height={50} mb="md" />
        <Skeleton height={30} width={200} mb="lg" />
        <Stack gap="lg">
          <Skeleton height={200} />
          <Skeleton height={400} />
        </Stack>
      </Container>
    );
  }

  if (error || !engagementLetter) {
    return (
      <Container size="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          mb="lg"
        >
          Failed to load engagement letter details
        </Alert>
      </Container>
    );
  }

  const totalAmount =
    engagementLetter.serviceItems?.reduce(
      (sum, item) => sum + item.serviceRate,
      0
    ) || 0;

  const advanceAmount =
    (totalAmount * (engagementLetter.paymentRequiredPercentageBeforeWorkStart || 0)) /
    100;

  return (
    <Container size="xl">
      <Breadcrumbs mb="md">
        <BreadcrumbLink to="/">Home</BreadcrumbLink>
        <BreadcrumbLink to="/engagement-letters">Engagement Letters</BreadcrumbLink>
        <span>{engagementLetter.engagementLetterCode}</span>
      </Breadcrumbs>

      <Group justify="space-between" mb="lg" align="flex-end">
        <div>
          <Title order={2}>{engagementLetter.engagementLetterTitle}</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Code: {engagementLetter.engagementLetterCode}
          </Text>
        </div>

        <Group>
          {(engagementLetter.status?.statusCode === 'approved' || engagementLetter.status?.statusName?.toLowerCase() === 'approved') && (
            <Button
              leftSection={<IconBriefcase size={16} />}
              onClick={() => navigate(`/engagements/new?engagementLetterId=${id}`)}
              variant="filled"
            >
              Create Engagement
            </Button>
          )}
          <Button
            leftSection={<IconEdit size={16} />}
            onClick={() => navigate(`/engagement-letters/${id}/edit`)}
            disabled={engagementLetter.status?.isFinal}
            variant="light"
          >
            Edit
          </Button>

          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" size="lg">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconDownload size={14} />}>
                Download PDF
              </Menu.Item>
              <Menu.Item leftSection={<IconSend size={14} />}>
                Send to Customer
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconCheck size={14} />}
                color="green"
                disabled={engagementLetter.status?.statusCode === 'approved'}
              >
                Approve
              </Menu.Item>
              <Menu.Item
                leftSection={<IconX size={14} />}
                color="red"
                disabled={engagementLetter.status?.statusCode === 'rejected'}
              >
                Reject
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mb="xl">
        <Card withBorder>
          <Stack gap="sm">
            <Text fw={600} size="lg">
              Overview
            </Text>
            <Text size="xs" c="dimmed">Status</Text>
            <StatusBadge status={engagementLetter.status || { statusCode: 'unknown', statusName: 'Unknown' }} />
            
            <Text size="xs" c="dimmed">Engagement Letter For</Text>
            <Badge color={engagementLetter.proposal?.proposal_target === 'partner' ? 'green' : 'blue'}>
              {engagementLetter.proposal?.proposal_target === 'partner' ? 'Partner' : 'Customer'}
            </Badge>
            
            {engagementLetter.proposal?.proposal_target === 'customer' ? (
              <>
                <InfoField 
                  label="Customer"
                  value={engagementLetter.customer?.customerName || '-'}
                />
                {engagementLetter.partner && (
                  <InfoField 
                    label="Partner"
                    value={engagementLetter.partner.partnerName || '-'}
                  />
                )}
              </>
            ) : (
              <>
                <InfoField 
                  label="Partner"
                  value={engagementLetter.partner?.partnerName || '-'}
                />
                <InfoField 
                  label="Target Customer"
                  value={engagementLetter.customer?.customerName || '-'}
                />
              </>
            )}
            
            <InfoField 
              label="Branch"
              value={branches.find(b => b.id === engagementLetter.customer?.vstnBranchId)?.branchName || '—'}
            />
            <InfoField 
              label="Proposal"
              value={engagementLetter.proposal?.proposal_number || engagementLetter.proposal?.proposalCode || '-'}
            />
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap="sm">
            <Text fw={600} size="lg">
              Financial Summary
            </Text>
            <Text size="xs" c="dimmed">Total Amount</Text>
            <MoneyDisplay
              amount={totalAmount}
              currencyCode={engagementLetter.currencyCode}
              size="lg"
              fw={600}
            />
            
            <Text size="xs" c="dimmed">Advance Required</Text>
            <Stack gap={4}>
              <MoneyDisplay
                amount={advanceAmount}
                currencyCode={engagementLetter.currencyCode}
              />
              <Text size="xs" c="dimmed">
                {engagementLetter.paymentRequiredPercentageBeforeWorkStart}%
                of total
              </Text>
            </Stack>
            
            <InfoField label="Currency" value={engagementLetter.currencyCode} />
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap="sm">
            <Text fw={600} size="lg">
              Key Dates
            </Text>
            <InfoField label="Created" value={formatDate(engagementLetter.createdAt)} />
            <InfoField label="Letter Date" value={formatDate(engagementLetter.engagementLetterDate)} />
            {engagementLetter.approvalDate && (
              <InfoField label="Approved" value={formatDate(engagementLetter.approvalDate)} />
            )}
            {engagementLetter.engagementResource && (
              <InfoField 
                label="Resource" 
                value={engagementLetter.engagementResource.name || '-'} 
              />
            )}
          </Stack>
        </Card>
      </SimpleGrid>

      <DocumentSummaryWidget
        entityType="engagement_letter"
        entityId={engagementLetterId!}
        title="Document Overview"
      />

      <Tabs defaultValue="services">
        <Tabs.List>
          <Tabs.Tab value="services" leftSection={<IconCash size={16} />}>
            Service Items ({engagementLetter.serviceItems?.length || 0})
          </Tabs.Tab>
          <Tabs.Tab value="details" leftSection={<IconFileText size={16} />}>
            Contract Details
          </Tabs.Tab>
          <Tabs.Tab value="timeline" leftSection={<IconHistory size={16} />}>
            Timeline
          </Tabs.Tab>
          <Tabs.Tab value="comments" leftSection={<IconMessage size={16} />}>
            Comments ({engagementLetter.commentsCount || 0})
          </Tabs.Tab>
          <Tabs.Tab value="documents" leftSection={<IconPaperclip size={16} />}>
            Documents ({engagementLetter.documentsCount || 0})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="services" pt="lg">
          <Card withBorder>
            <Stack gap="md">
              <Text fw={600} size="lg">
                Selected Service Items
              </Text>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Service</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Rate</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {engagementLetter.serviceItems?.map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td fw={500}>{item.serviceName}</Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {item.serviceDescription}
                        </Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>
                        <MoneyDisplay
                          amount={item.serviceRate}
                          currencyCode={engagementLetter.currencyCode}
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
                <Table.Tfoot>
                  <Table.Tr>
                    <Table.Th colSpan={2}>Total</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>
                      <MoneyDisplay
                        amount={totalAmount}
                        currencyCode={engagementLetter.currencyCode}
                        size="lg"
                        fw={600}
                      />
                    </Table.Th>
                  </Table.Tr>
                </Table.Tfoot>
              </Table>
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="details" pt="lg">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {engagementLetter.scopeOfWork && (
              <Card withBorder>
                <Stack gap="sm">
                  <Text fw={600}>Scope of Work</Text>
                  <Text style={{ whiteSpace: 'pre-wrap' }}>
                    {engagementLetter.scopeOfWork}
                  </Text>
                </Stack>
              </Card>
            )}

            {engagementLetter.deliverables && (
              <Card withBorder>
                <Stack gap="sm">
                  <Text fw={600}>Deliverables</Text>
                  <Text style={{ whiteSpace: 'pre-wrap' }}>
                    {engagementLetter.deliverables}
                  </Text>
                </Stack>
              </Card>
            )}

            {engagementLetter.timelines && (
              <Card withBorder>
                <Stack gap="sm">
                  <Text fw={600}>Timelines</Text>
                  <Text style={{ whiteSpace: 'pre-wrap' }}>
                    {engagementLetter.timelines}
                  </Text>
                </Stack>
              </Card>
            )}

            {engagementLetter.paymentTerms && (
              <Card withBorder>
                <Stack gap="sm">
                  <Text fw={600}>Payment Terms</Text>
                  <Text style={{ whiteSpace: 'pre-wrap' }}>
                    {engagementLetter.paymentTerms}
                  </Text>
                </Stack>
              </Card>
            )}

            {engagementLetter.specialConditions && (
              <Card withBorder>
                <Stack gap="sm">
                  <Text fw={600}>Special Conditions</Text>
                  <Text style={{ whiteSpace: 'pre-wrap' }}>
                    {engagementLetter.specialConditions}
                  </Text>
                </Stack>
              </Card>
            )}

            {engagementLetter.termsAndConditions && (
              <Card withBorder style={{ gridColumn: '1 / -1' }}>
                <Stack gap="sm">
                  <Text fw={600}>Terms and Conditions</Text>
                  <Text style={{ whiteSpace: 'pre-wrap' }}>
                    {engagementLetter.termsAndConditions}
                  </Text>
                </Stack>
              </Card>
            )}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="timeline" pt="lg">
          <Card withBorder>
            <Timeline active={1} bulletSize={24} lineWidth={2}>
              <Timeline.Item
                bullet={<IconFileText size={12} />}
                title="Engagement Letter Created"
              >
                <Text c="dimmed" size="sm">
                  {formatDate(engagementLetter.createdAt, 'PPp')}
                </Text>
              </Timeline.Item>

              {engagementLetter.approvalDate && (
                <Timeline.Item
                  bullet={<IconCheck size={12} />}
                  title="Approved"
                  lineVariant="dashed"
                >
                  <Text c="dimmed" size="sm">
                    {formatDate(engagementLetter.approvalDate, 'PPp')}
                  </Text>
                  {engagementLetter.signOffNotes && (
                    <Text size="sm" mt="xs">
                      {engagementLetter.signOffNotes}
                    </Text>
                  )}
                </Timeline.Item>
              )}
            </Timeline>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="comments" pt="lg">
          <Card withBorder>
            <Text c="dimmed" ta="center" py="xl">
              Comments functionality coming soon
            </Text>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="documents" pt="lg">
          <DocumentListWidget
            entityType="engagement_letter"
            entityId={engagementLetterId!}
            title={`Documents for ${engagementLetter.engagementLetterCode}`}
            showUpload={true}
            showFilters={true}
            onDocumentClick={(document) => {
              setSelectedDocument(document);
              setDocumentViewerOpened(true);
            }}
          />
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
    </Container>
  );
}