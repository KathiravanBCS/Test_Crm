import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Stack,
  Grid,
  Paper,
  Group,
  Title,
  Text,
  Button,
  Badge,
  ActionIcon,
  LoadingOverlay,
  Alert,
  Avatar,
  Card,
  Divider,
} from '@mantine/core';
import {
  IconEdit,
  IconChevronDown,
  IconBuilding,
  IconReceipt,
  IconUsers,
  IconFileText,
  IconCalendar,
  IconMail,
  IconPhone,
  IconAlertCircle,
  IconTrash,
  IconPlus,
  IconExternalLink,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { Can } from '@/components/auth/Can';
import { StatusBadge } from '@/components/display/StatusBadge';
import { MoneyDisplay } from '@/components/display/MoneyDisplay';
import { formatDate } from '@/lib/utils/date';
import { useEntityPermissions } from '@/lib/hooks/useEntityPermissions';
import { useGetCustomer } from '../api/useGetCustomer';
import { useDeleteCustomer } from '../api/useDeleteCustomer';
import { ContactPersonList } from './ContactPersonList';
import { CustomerInfo } from './CustomerInfo';
import { ProposalsList } from './ProposalsList';
import { DocumentsList } from './DocumentsList';

export function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customerId = Number(id);
  
  const { data: customer, isLoading, error } = useGetCustomer(customerId);
  const deleteCustomerMutation = useDeleteCustomer();
  const permissions = useEntityPermissions('Customer', customer);

  const [expandedSections, setExpandedSections] = useState({
    info: true,
    contacts: true,
    proposals: true,
    engagements: true,
    documents: true,
    comments: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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

  // Calculate some metrics
  const activeProposals = customer.proposals?.filter(p => 
    ['Draft', 'Submitted', 'Under Review', 'Negotiation'].includes(p.statusId.toString())
  ).length || 0;
  
  const activeEngagements = customer.engagementLetters?.filter(e => 
    e.statusId === 15 // Active status
  ).length || 0;

  return (
    <Stack gap="md">
      {/* Header */}
      <Paper p="md" withBorder>
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="md" align="center">
              <Avatar size="lg" radius="xl" color="blue">
                <IconBuilding size={28} />
              </Avatar>
              <div>
                <Title order={2}>{customer.customerName}</Title>
                <Group gap="xs" mt={4}>
                  <Badge 
                    variant="dot" 
                    color={
                      customer.customerType === 'direct' ? 'blue' : 
                      customer.customerType === 'partner_referred' ? 'green' : 'orange'
                    }
                  >
                    {customer.customerType.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">{customer.currencyCode}</Badge>
                  {customer.partner && (
                    <Badge variant="light" color="grape">
                      Partner: {customer.partner.partnerName}
                    </Badge>
                  )}
                </Group>
              </div>
            </Group>
          </div>
          
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
      </Paper>

      {/* Key Metrics */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Active Proposals
                </Text>
                <Text size="xl" fw={700}>{activeProposals}</Text>
              </div>
              <IconFileText size={24} stroke={1.5} />
            </Group>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Active Engagements
                </Text>
                <Text size="xl" fw={700}>{activeEngagements}</Text>
              </div>
              <IconCalendar size={24} stroke={1.5} />
            </Group>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Contact Persons
                </Text>
                <Text size="xl" fw={700}>{customer.contacts?.length || 0}</Text>
              </div>
              <IconUsers size={24} stroke={1.5} />
            </Group>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Documents
                </Text>
                <Text size="xl" fw={700}>{customer.documents?.length || 0}</Text>
              </div>
              <IconFileText size={24} stroke={1.5} />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid gutter="md">
        {/* Left Column - Main Content */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="md">
            {/* Basic Information Section */}
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  <IconBuilding size={20} />
                  <Text fw={600} size="lg">Basic Information</Text>
                </Group>
                <ActionIcon 
                  variant="subtle" 
                  onClick={() => toggleSection('info')}
                  size="sm"
                >
                  <IconChevronDown 
                    size={16} 
                    style={{ 
                      transform: expandedSections.info ? 'rotate(180deg)' : 'rotate(0deg)', 
                      transition: 'transform 200ms' 
                    }} 
                  />
                </ActionIcon>
              </Group>
              
              {expandedSections.info && (
                <CustomerInfo customer={customer} />
              )}
            </Paper>

            {/* Contact Persons Section */}
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  <IconUsers size={20} />
                  <Text fw={600} size="lg">Contact Persons</Text>
                  <Badge size="sm" variant="light">{customer.contacts?.length || 0}</Badge>
                </Group>
                <Group>
                  <Can I="create" a="ContactPerson">
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconPlus size={14} />}
                      onClick={() => {/* TODO: Open contact form */}}
                    >
                      Add Contact
                    </Button>
                  </Can>
                  <ActionIcon 
                    variant="subtle" 
                    onClick={() => toggleSection('contacts')}
                    size="sm"
                  >
                    <IconChevronDown 
                      size={16} 
                      style={{ 
                        transform: expandedSections.contacts ? 'rotate(180deg)' : 'rotate(0deg)', 
                        transition: 'transform 200ms' 
                      }} 
                    />
                  </ActionIcon>
                </Group>
              </Group>
              
              {expandedSections.contacts && (
                <ContactPersonList customerId={customerId} />
              )}
            </Paper>

            {/* Proposals Section */}
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  <IconFileText size={20} />
                  <Text fw={600} size="lg">Proposals</Text>
                  <Badge size="sm" variant="light">{customer.proposals?.length || 0}</Badge>
                </Group>
                <Group>
                  <Can I="create" a="Proposal">
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconPlus size={14} />}
                      onClick={() => navigate(`/proposals/new?customerId=${customerId}`)}
                    >
                      New Proposal
                    </Button>
                  </Can>
                  <ActionIcon 
                    variant="subtle" 
                    onClick={() => toggleSection('proposals')}
                    size="sm"
                  >
                    <IconChevronDown 
                      size={16} 
                      style={{ 
                        transform: expandedSections.proposals ? 'rotate(180deg)' : 'rotate(0deg)', 
                        transition: 'transform 200ms' 
                      }} 
                    />
                  </ActionIcon>
                </Group>
              </Group>
              
              {expandedSections.proposals && (
                <ProposalsList customerId={customerId} />
              )}
            </Paper>

            {/* Documents Section */}
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  <IconFileText size={20} />
                  <Text fw={600} size="lg">Documents</Text>
                  <Badge size="sm" variant="light">{customer.documents?.length || 0}</Badge>
                </Group>
                <Group>
                  <Button
                    size="xs"
                    variant="light"
                    leftSection={<IconExternalLink size={14} />}
                    onClick={() => {/* TODO: Open SharePoint folder */}}
                  >
                    SharePoint Folder
                  </Button>
                  <ActionIcon 
                    variant="subtle" 
                    onClick={() => toggleSection('documents')}
                    size="sm"
                  >
                    <IconChevronDown 
                      size={16} 
                      style={{ 
                        transform: expandedSections.documents ? 'rotate(180deg)' : 'rotate(0deg)', 
                        transition: 'transform 200ms' 
                      }} 
                    />
                  </ActionIcon>
                </Group>
              </Group>
              
              {expandedSections.documents && (
                <DocumentsList entityType="customer" entityId={customerId} />
              )}
            </Paper>
          </Stack>
        </Grid.Col>

        {/* Right Column - Additional Info */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="md">
            {/* Timestamps */}
            <Paper p="md" withBorder>
              <Text fw={600} mb="md">Timeline</Text>
              <Stack gap="xs">
                <div>
                  <Text size="xs" c="dimmed">Created</Text>
                  <Text size="sm">{formatDate(customer.createdAt)}</Text>
                </div>
                <Divider />
                <div>
                  <Text size="xs" c="dimmed">Last Updated</Text>
                  <Text size="sm">{formatDate(customer.updatedAt)}</Text>
                </div>
              </Stack>
            </Paper>

            {/* Partner Info (if applicable) */}
            {customer.partner && (
              <Paper p="md" withBorder>
                <Text fw={600} mb="md">Partner Information</Text>
                <Stack gap="xs">
                  <div>
                    <Text size="xs" c="dimmed">Partner Name</Text>
                    <Group gap="xs">
                      <Text size="sm">{customer.partner.partnerName}</Text>
                      <ActionIcon 
                        size="xs" 
                        variant="subtle"
                        onClick={() => navigate(`/partners/${customer.partnerId}`)}
                      >
                        <IconExternalLink size={14} />
                      </ActionIcon>
                    </Group>
                  </div>
                  {customer.customerType === 'partner_referred' && (
                    <>
                      <Divider />
                      <div>
                        <Text size="xs" c="dimmed">Referral Type</Text>
                        <Text size="sm">Customer pays VSTN directly</Text>
                      </div>
                    </>
                  )}
                  {customer.customerType === 'partner_managed' && (
                    <>
                      <Divider />
                      <div>
                        <Text size="xs" c="dimmed">Management Type</Text>
                        <Text size="sm">Partner manages billing</Text>
                      </div>
                    </>
                  )}
                </Stack>
              </Paper>
            )}

            {/* Quick Actions */}
            <Paper p="md" withBorder>
              <Text fw={600} mb="md">Quick Actions</Text>
              <Stack gap="xs">
                <Button 
                  variant="subtle" 
                  size="sm" 
                  fullWidth
                  leftSection={<IconMail size={16} />}
                  onClick={() => {/* TODO: Open email client */}}
                >
                  Send Email
                </Button>
                <Button 
                  variant="subtle" 
                  size="sm" 
                  fullWidth
                  leftSection={<IconPhone size={16} />}
                  onClick={() => {/* TODO: Show contact numbers */}}
                >
                  View Contacts
                </Button>
                <Button 
                  variant="subtle" 
                  size="sm" 
                  fullWidth
                  leftSection={<IconReceipt size={16} />}
                  onClick={() => navigate(`/invoices?customerId=${customerId}`)}
                >
                  View Invoices
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}