import { useForm } from '@mantine/form';
import { useState } from 'react';
import {
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Button,
  Stack,
  Group,
  LoadingOverlay,
  Card,
  Title,
  Tabs,
  SimpleGrid,
  Alert,
  Text,
  Divider,
  SegmentedControl,
  Badge,
  Drawer,
  ScrollArea,
} from '@mantine/core';
import {
  IconFileText,
  IconList,
  IconCash,
  IconInfoCircle,
  IconAlertCircle,
  IconBuilding,
  IconUsers,
  IconX,
} from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { ProposalServiceItemSelector } from './ProposalServiceItemSelector';
import { ProposalPicker } from '@/components/forms/pickers/ProposalPicker';
import { CustomerPicker } from '@/components/forms/pickers/CustomerPicker';
import { PartnerPicker } from '@/components/forms/pickers/PartnerPicker';
import { EmployeePicker } from '@/components/forms/pickers/EmployeePicker';
import { CurrencySelector } from '@/components/forms/inputs/CurrencySelector';
import { useGetProposal } from '@/features/proposals/api/useGetProposal';
import { useGetEngagementLetters } from '../api/useGetEngagementLetters';
import { useGetEngagementLetter } from '../api/useGetEngagementLetter';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { MoneyDisplay } from '@/components/display/MoneyDisplay';
import { StatusBadge } from '@/components/display/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { InfoField } from '@/components/display/InfoField';
import type {
  EngagementLetterFormData,
  EngagementLetter,
  SelectedServiceItem,
  EngagementLetterTarget,
} from '../types';
import type { Proposal } from '@/features/proposals/types';
import type { Customer } from '@/features/customers/types';
import type { Partner } from '@/features/partners/types';

interface EngagementLetterFormProps {
  initialData?: Partial<EngagementLetterFormData>;
  engagementLetter?: EngagementLetter;
  proposal?: Proposal;
  onSubmit: (data: EngagementLetterFormData) => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export function EngagementLetterForm({
  initialData,
  engagementLetter,
  proposal: initialProposal,
  onSubmit,
  isLoading = false,
  mode,
}: EngagementLetterFormProps) {
  const [previewEngagementLetterId, setPreviewEngagementLetterId] = useState<number | null>(null);
  
  const form = useForm<EngagementLetterFormData>({
    initialValues: {
      engagementTarget: initialData?.engagementTarget || 'customer',
      proposalId: initialData?.proposalId || 0,
      customerId: initialData?.customerId || 0,
      partnerId: initialData?.partnerId,
      targetCustomerId: initialData?.targetCustomerId,
      engagementLetterTitle: initialData?.engagementLetterTitle || '',
      engagementLetterDescription: initialData?.engagementLetterDescription || '',
      currencyCode: initialData?.currencyCode || 'INR',
      engagementResourceId: initialData?.engagementResourceId,
      scopeOfWork: initialData?.scopeOfWork || '',
      deliverables: initialData?.deliverables || '',
      timelines: initialData?.timelines || '',
      paymentTerms: initialData?.paymentTerms || '',
      specialConditions: initialData?.specialConditions || '',
      termsAndConditions: initialData?.termsAndConditions || '',
      paymentRequiredPercentageBeforeWorkStart:
        initialData?.paymentRequiredPercentageBeforeWorkStart || 0,
      selectedServiceItems: initialData?.selectedServiceItems || [],
    },
    validate: {
      proposalId: (value) => (value ? null : 'Proposal is required'),
      customerId: (value, values) => {
        if (values.engagementTarget === 'customer') {
          return value ? null : 'Customer is required';
        }
        return null;
      },
      partnerId: (value, values) => {
        if (values.engagementTarget === 'partner') {
          return value ? null : 'Partner is required';
        }
        return null;
      },
      targetCustomerId: (value, values) => {
        if (values.engagementTarget === 'partner') {
          return value ? null : 'Target customer is required';
        }
        return null;
      },
      engagementLetterTitle: (value) =>
        value.trim() ? null : 'Title is required',
      selectedServiceItems: (value) =>
        value.length > 0 ? null : 'At least one service item must be selected',
      paymentRequiredPercentageBeforeWorkStart: (value) =>
        value !== undefined && value >= 0 && value <= 100
          ? null
          : 'Percentage must be between 0 and 100',
    },
  });

  // Fetch proposal data when proposalId changes
  const { data: proposalData } = useGetProposal(form.values.proposalId || undefined);
  const proposal = initialProposal || proposalData;
  
  // Fetch customers and partners for display
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: api.customers.getAll,
  });

  const { data: partners = [] } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: () => api.partners.getAll(),
  });

  // If we have an initial proposal, preload customer and partner data
  if (initialProposal && form.values.customerId === 0 && initialProposal.customer_id) {
    form.setFieldValue('customerId', initialProposal.customer_id);
  }

  // Get existing engagement letters for the selected proposal
  const { data: existingEngagementLetters } = useGetEngagementLetters({
    proposalId: form.values.proposalId || undefined,
  });

  // Get recent engagement letters for the partner/customer combination
  const { data: recentEngagementLetters } = useGetEngagementLetters({
    customerId: form.values.engagementTarget === 'customer' 
      ? form.values.customerId || undefined
      : form.values.targetCustomerId || undefined,
    partnerId: form.values.partnerId || undefined,
  });

  // Get selected entities
  const selectedCustomer = form.values.customerId 
    ? customers.find((c: Customer) => c.id === form.values.customerId)
    : null;
  const selectedPartner = form.values.partnerId
    ? partners.find(p => p.id === form.values.partnerId)
    : null;
  const targetCustomer = form.values.targetCustomerId
    ? customers.find((c: Customer) => c.id === form.values.targetCustomerId)
    : null;

  const handleTargetChange = (value: string) => {
    form.setFieldValue('engagementTarget', value as EngagementLetterTarget);
    form.setFieldValue('proposalId', 0);
    form.setFieldValue('selectedServiceItems', []);
    
    if (value === 'customer') {
      form.setFieldValue('partnerId', undefined);
      form.setFieldValue('targetCustomerId', undefined);
    } else {
      form.setFieldValue('customerId', 0);
    }
  };

  const handleProposalChange = (proposal: Proposal | null) => {
    if (proposal) {
      const baseValues: any = {
        proposalId: proposal.id,
        currencyCode: proposal.currency_code || proposal.currencyCode || 'INR',
        engagementLetterTitle: `Engagement Letter - ${proposal.proposalTitle || proposal.proposal_number}`,
        termsAndConditions: proposal.termsAndConditions || '',
        timelines: proposal.timelines || '',
      };

      if (form.values.engagementTarget === 'customer') {
        baseValues.customerId = proposal.customer_id || proposal.customerId || 0;
        baseValues.partnerId = proposal.partner_id || proposal.partnerId;
      } else {
        baseValues.partnerId = proposal.partner_id || proposal.partnerId || 0;
        // Don't auto-set targetCustomerId - let user select
      }

      form.setValues(baseValues);
    }
  };

  const handleSubmit = form.onSubmit((values) => {
    onSubmit(values);
  });

  const handleEngagementLetterPreview = (id: number) => {
    setPreviewEngagementLetterId(id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg" pos="relative">
        <LoadingOverlay visible={isLoading} />

        {mode === 'create' && (
          <Alert
            icon={<IconInfoCircle />}
            title="Creating Engagement Letter"
            color="blue"
          >
            First select who this engagement letter is for, then choose an approved proposal.
            You can then select specific service items to include.
          </Alert>
        )}

        <Card withBorder>
          <Stack gap="md">
            <div>
              <Text size="sm" fw={500} mb="xs">Who is this Engagement Letter for?</Text>
              <SegmentedControl
                value={form.values.engagementTarget}
                onChange={handleTargetChange}
                disabled={mode === 'edit'}
                data={[
                  { 
                    label: (
                      <Group gap="xs">
                        <IconBuilding size={16} />
                        <span>Customer</span>
                      </Group>
                    ), 
                    value: 'customer' 
                  },
                  { 
                    label: (
                      <Group gap="xs">
                        <IconUsers size={16} />
                        <span>Partner</span>
                      </Group>
                    ), 
                    value: 'partner' 
                  }
                ]}
                fullWidth
              />
            </div>

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <ProposalPicker
                label="Proposal"
                placeholder={`Select an approved ${form.values.engagementTarget} proposal`}
                value={form.values.proposalId}
                onChange={(value, proposal) => {
                  form.setFieldValue('proposalId', value ?? 0);
                  if (proposal) handleProposalChange(proposal);
                }}
                error={form.errors.proposalId as string}
                required
                disabled={mode === 'edit'}
                filterStatus="approved"
                proposalTarget={form.values.engagementTarget}
              />

              {form.values.engagementTarget === 'customer' ? (
                <>
                  {/* Show customer info instead of picker */}
                  {selectedCustomer && (
                    <Card withBorder>
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>Customer</Text>
                        <Group gap="xs">
                          <Text size="sm">{selectedCustomer.customerName}</Text>
                          <Badge size="xs" variant="light" color="blue">
                            {selectedCustomer.customerCode}
                          </Badge>
                        </Group>
                        {selectedCustomer.email && (
                          <Text size="xs" c="dimmed">{selectedCustomer.email}</Text>
                        )}
                      </Stack>
                    </Card>
                  )}

                  {/* Show partner info if customer is partner-referred */}
                  {selectedPartner && (
                    <Card withBorder>
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>Partner</Text>
                        <Group gap="xs">
                          <Text size="sm">{selectedPartner.partnerName}</Text>
                          <Badge size="xs" variant="light" color="green">
                            {selectedPartner.partnerCode}
                          </Badge>
                        </Group>
                        {selectedPartner.commissionRate && (
                          <Text size="xs" c="dimmed">Commission: {selectedPartner.commissionRate}%</Text>
                        )}
                      </Stack>
                    </Card>
                  )}
                </>
              ) : (
                <>
                  {/* Show partner info instead of picker */}
                  {selectedPartner && (
                    <Card withBorder>
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>Partner</Text>
                        <Group gap="xs">
                          <Text size="sm">{selectedPartner.partnerName}</Text>
                          <Badge size="xs" variant="light" color="green">
                            {selectedPartner.partnerCode}
                          </Badge>
                        </Group>
                        {selectedPartner.commissionRate && (
                          <Text size="xs" c="dimmed">Commission: {selectedPartner.commissionRate}%</Text>
                        )}
                      </Stack>
                    </Card>
                  )}

                  <CustomerPicker
                    label="Target Customer"
                    placeholder="Select the customer for this engagement"
                    value={form.values.targetCustomerId}
                    onChange={(value) => form.setFieldValue('targetCustomerId', value ?? undefined)}
                    error={form.errors.targetCustomerId as string}
                    required
                    partnerFilter={form.values.partnerId}
                  />
                </>
              )}

              <CurrencySelector
                label="Currency"
                value={form.values.currencyCode}
                onChange={(value) =>
                  form.setFieldValue('currencyCode', value || 'INR')
                }
                required
              />
            </SimpleGrid>

            <TextInput
              label="Engagement Letter Title"
              placeholder="Enter engagement letter title"
              {...form.getInputProps('engagementLetterTitle')}
              required
            />

            <Textarea
              label="Description"
              placeholder="Brief description of the engagement"
              rows={3}
              {...form.getInputProps('engagementLetterDescription')}
            />

            <EmployeePicker
              label="Engagement Resource"
              placeholder="Select primary resource"
              value={form.values.engagementResourceId}
              onChange={(value) =>
                form.setFieldValue('engagementResourceId', value ?? undefined)
              }
            />
          </Stack>
        </Card>

        {/* Show entity details */}
        {(selectedCustomer || selectedPartner) && (
          <Card withBorder>
            <Stack gap="sm">
              {form.values.engagementTarget === 'customer' && selectedCustomer && (
                <>
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>Customer Details</Text>
                    <Badge 
                      color={
                        selectedCustomer.customerType === 'direct' ? 'blue' :
                        selectedCustomer.customerType === 'partner_referred' ? 'orange' : 'purple'
                      }
                    >
                      {selectedCustomer.customerType?.replace('_', ' ')}
                    </Badge>
                  </Group>
                  
                  {selectedPartner && (
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">Partner:</Text>
                      <Text size="sm">{selectedPartner.partnerName}</Text>
                    </Group>
                  )}
                  
                  {selectedCustomer.email && (
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">Email:</Text>
                      <Text size="sm">{selectedCustomer.email}</Text>
                    </Group>
                  )}
                </>
              )}

              {form.values.engagementTarget === 'partner' && selectedPartner && (
                <>
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>Partner Details</Text>
                    <Badge color="green">
                      {selectedPartner.partnerType || 'Partner'}
                    </Badge>
                  </Group>
                  
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">Partner Code:</Text>
                    <Text size="sm" fw={500}>{selectedPartner.partnerCode}</Text>
                  </Group>
                  
                  {selectedPartner.commissionRate && (
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">Commission Rate:</Text>
                      <Text size="sm">{selectedPartner.commissionRate}%</Text>
                    </Group>
                  )}

                  {targetCustomer && (
                    <>
                      <Divider my="xs" />
                      <Text size="sm" fw={500}>Target Customer</Text>
                      <Group gap="xs">
                        <Text size="sm" c="dimmed">Name:</Text>
                        <Text size="sm">{targetCustomer.customerName}</Text>
                      </Group>
                      {targetCustomer.email && (
                        <Group gap="xs">
                          <Text size="sm" c="dimmed">Email:</Text>
                          <Text size="sm">{targetCustomer.email}</Text>
                        </Group>
                      )}
                    </>
                  )}
                </>
              )}
            </Stack>
          </Card>
        )}

        {/* Show existing engagement letters from this proposal */}
        {proposal && existingEngagementLetters && existingEngagementLetters.data?.length > 0 && (
          <Card withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={600}>Existing Engagement Letters</Text>
                  <Text size="xs" c="dimmed">From proposal {proposal.proposal_number}</Text>
                </div>
                <Badge color="yellow" variant="light">
                  {existingEngagementLetters.data.length} Found
                </Badge>
              </Group>
              
              <Stack gap="xs">
                {existingEngagementLetters.data.slice(0, 3).map((el: EngagementLetter) => (
                  <Card key={el.id} withBorder p="sm">
                    <Group justify="space-between" wrap="nowrap">
                      <Stack gap={4} style={{ flex: 1 }}>
                        <Group gap="xs">
                          <Text size="sm" fw={500}>{el.engagementLetterCode}</Text>
                          <Badge size="xs" variant="light" color={
                            el.status?.statusCode === 'approved' ? 'green' :
                            el.status?.statusCode === 'draft' ? 'blue' :
                            el.status?.statusCode === 'sent_for_approval' ? 'yellow' :
                            'gray'
                          }>
                            {el.status?.statusName || 'Draft'}
                          </Badge>
                        </Group>
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {el.engagementLetterTitle}
                        </Text>
                        {el.createdAt && (
                          <Text size="xs" c="dimmed">
                            Created: {formatDate(el.createdAt)}
                          </Text>
                        )}
                      </Stack>
                      <Button
                        size="xs"
                        variant="subtle"
                        onClick={() => handleEngagementLetterPreview(el.id)}
                      >
                        View
                      </Button>
                    </Group>
                  </Card>
                ))}
              </Stack>
              
              <Alert icon={<IconAlertCircle />} color="yellow" variant="light">
                <Text size="xs">
                  Please ensure this new engagement letter covers different service items or scope.
                </Text>
              </Alert>
            </Stack>
          </Card>
        )}

        {/* Show recent engagement letters for this partner/customer combination */}
        {((form.values.engagementTarget === 'customer' && form.values.customerId) ||
          (form.values.engagementTarget === 'partner' && form.values.partnerId && form.values.targetCustomerId)) &&
          recentEngagementLetters && recentEngagementLetters.data?.length > 0 && (
          <Card withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={600}>Recent Engagement History</Text>
                  <Text size="xs" c="dimmed">
                    {form.values.engagementTarget === 'customer' 
                      ? selectedCustomer?.customerName 
                      : `${selectedPartner?.partnerName} - ${targetCustomer?.customerName}`}
                  </Text>
                </div>
                <Badge color="gray" variant="light">
                  {recentEngagementLetters.data.filter((el: EngagementLetter) => el.proposalId !== form.values.proposalId).length} Letters
                </Badge>
              </Group>
              
              <Stack gap="xs">
                {recentEngagementLetters.data
                  .filter((el: EngagementLetter) => el.proposalId !== form.values.proposalId)
                  .slice(0, 3)
                  .map((el: EngagementLetter) => (
                    <Card key={el.id} withBorder p="sm">
                      <Group justify="space-between" wrap="nowrap">
                        <Stack gap={4} style={{ flex: 1 }}>
                          <Group gap="xs">
                            <Text size="sm" fw={500}>{el.engagementLetterCode}</Text>
                            <Badge size="xs" variant="light" color={
                              el.status?.statusCode === 'approved' ? 'green' :
                              el.status?.statusCode === 'draft' ? 'blue' :
                              el.status?.statusCode === 'sent_for_approval' ? 'yellow' :
                              'gray'
                            }>
                              {el.status?.statusName || 'Draft'}
                            </Badge>
                          </Group>
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {el.engagementLetterTitle}
                          </Text>
                          <Group gap="xs">
                            <Text size="xs" c="dimmed">
                              Proposal: {el.proposal?.proposal_number || 'N/A'}
                            </Text>
                            {el.createdAt && (
                              <Text size="xs" c="dimmed">
                                • {formatDate(el.createdAt)}
                              </Text>
                            )}
                          </Group>
                        </Stack>
                        <Button
                          size="xs"
                          variant="subtle"
                          onClick={() => handleEngagementLetterPreview(el.id)}
                        >
                          View
                        </Button>
                      </Group>
                    </Card>
                  ))}
              </Stack>
            </Stack>
          </Card>
        )}

        <Tabs defaultValue="services">
          <Tabs.List>
            <Tabs.Tab value="services" leftSection={<IconList size={16} />}>
              Service Items
            </Tabs.Tab>
            <Tabs.Tab value="details" leftSection={<IconFileText size={16} />}>
              Contract Details
            </Tabs.Tab>
            <Tabs.Tab value="payment" leftSection={<IconCash size={16} />}>
              Payment Terms
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="services" pt="md">
            {form.values.proposalId && proposal ? (
              <ProposalServiceItemSelector
                proposalServiceItems={proposal.service_items || proposal.serviceItems || []}
                selectedItems={form.values.selectedServiceItems}
                onSelectionChange={(items) =>
                  form.setFieldValue('selectedServiceItems', items)
                }
                currencyCode={form.values.currencyCode}
              />
            ) : (
              <Alert
                icon={<IconAlertCircle />}
                title="Select a Proposal"
                color="yellow"
              >
                Please select a proposal first to view available service items
              </Alert>
            )}
            {form.errors.selectedServiceItems && (
              <Text c="red" size="sm" mt="sm">
                {form.errors.selectedServiceItems}
              </Text>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="details" pt="md">
            <Card withBorder>
              <Stack gap="md">
                <Textarea
                  label="Scope of Work"
                  placeholder="Define the scope of work for this engagement"
                  rows={4}
                  {...form.getInputProps('scopeOfWork')}
                />

                <Textarea
                  label="Deliverables"
                  placeholder="List all deliverables"
                  rows={4}
                  {...form.getInputProps('deliverables')}
                />

                <Textarea
                  label="Timelines"
                  placeholder="Project timelines and milestones"
                  rows={3}
                  {...form.getInputProps('timelines')}
                />

                <Textarea
                  label="Special Conditions"
                  placeholder="Any special conditions or requirements"
                  rows={3}
                  {...form.getInputProps('specialConditions')}
                />

                <Textarea
                  label="Terms and Conditions"
                  placeholder="Standard terms and conditions"
                  rows={5}
                  {...form.getInputProps('termsAndConditions')}
                />
              </Stack>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="payment" pt="md">
            <Card withBorder>
              <Stack gap="md">
                <NumberInput
                  label="Advance Payment Required (%)"
                  description="Percentage of payment required before work starts"
                  placeholder="Enter percentage (0-100)"
                  min={0}
                  max={100}
                  suffix="%"
                  {...form.getInputProps(
                    'paymentRequiredPercentageBeforeWorkStart'
                  )}
                />

                <Textarea
                  label="Payment Terms"
                  placeholder="Define payment terms and schedule"
                  rows={5}
                  {...form.getInputProps('paymentTerms')}
                />
              </Stack>
            </Card>
          </Tabs.Panel>
        </Tabs>

        <Divider />

        <Group justify="flex-end">
          <Button type="submit" loading={isLoading}>
            {mode === 'create' ? 'Create Engagement Letter' : 'Update Engagement Letter'}
          </Button>
        </Group>
      </Stack>

      {/* Engagement Letter Preview Drawer */}
      <EngagementLetterPreviewDrawer
        engagementLetterId={previewEngagementLetterId}
        opened={previewEngagementLetterId !== null}
        onClose={() => setPreviewEngagementLetterId(null)}
      />
    </form>
  );
}

// Preview Drawer Component
function EngagementLetterPreviewDrawer({
  engagementLetterId,
  opened,
  onClose,
}: {
  engagementLetterId: number | null;
  opened: boolean;
  onClose: () => void;
}) {
  const { data: engagementLetter, isLoading } = useGetEngagementLetter(
    engagementLetterId || undefined
  );

  const totalAmount = engagementLetter?.serviceItems?.reduce(
    (sum, item) => sum + item.serviceRate,
    0
  ) || 0;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Engagement Letter Preview"
      position="right"
      size="lg"
      closeButtonProps={{
        icon: <IconX size={20} />,
      }}
    >
      <ScrollArea h="calc(100vh - 80px)">
        {isLoading && (
          <Stack gap="md" p="md">
            <Card withBorder h={100} />
            <Card withBorder h={200} />
            <Card withBorder h={150} />
          </Stack>
        )}

        {engagementLetter && (
          <Stack gap="md" p="md">
            {/* Header */}
            <Card withBorder>
              <Stack gap="sm">
                <Group justify="space-between">
                  <div>
                    <Text fw={600}>{engagementLetter.engagementLetterCode}</Text>
                    <Text size="sm" c="dimmed">
                      {engagementLetter.engagementLetterTitle}
                    </Text>
                  </div>
                  <StatusBadge 
                    status={engagementLetter.status || { statusCode: 'draft', statusName: 'Draft' }} 
                  />
                </Group>
                
                <Group gap="xs">
                  <Badge color={engagementLetter.proposal?.proposal_target === 'partner' ? 'green' : 'blue'}>
                    {engagementLetter.proposal?.proposal_target === 'partner' ? 'Partner' : 'Customer'} Engagement
                  </Badge>
                  <Text size="xs" c="dimmed">
                    Created: {formatDate(engagementLetter.createdAt)}
                  </Text>
                </Group>
              </Stack>
            </Card>

            {/* Entities */}
            <Card withBorder>
              <Stack gap="sm">
                <Text fw={600}>Parties</Text>
                <SimpleGrid cols={2}>
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
                </SimpleGrid>
                <InfoField 
                  label="Proposal" 
                  value={engagementLetter.proposal?.proposal_number || '-'} 
                />
              </Stack>
            </Card>

            {/* Financial Summary */}
            <Card withBorder>
              <Stack gap="sm">
                <Text fw={600}>Financial Summary</Text>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Total Amount</Text>
                  <MoneyDisplay 
                    amount={totalAmount} 
                    currencyCode={engagementLetter.currencyCode} 
                    fw={600}
                  />
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Service Items</Text>
                  <Text size="sm">{engagementLetter.serviceItems?.length || 0} items</Text>
                </Group>
              </Stack>
            </Card>

            {/* Service Items */}
            {engagementLetter.serviceItems && engagementLetter.serviceItems.length > 0 && (
              <Card withBorder>
                <Stack gap="sm">
                  <Text fw={600}>Service Items</Text>
                  <Stack gap="xs">
                    {engagementLetter.serviceItems.map((item) => (
                      <Card key={item.id} withBorder p="xs">
                        <Group justify="space-between" align="flex-start">
                          <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>{item.serviceName}</Text>
                            <Text size="xs" c="dimmed" lineClamp={2}>
                              {item.serviceDescription}
                            </Text>
                          </div>
                          <MoneyDisplay 
                            amount={item.serviceRate} 
                            currencyCode={engagementLetter.currencyCode}
                            size="sm"
                          />
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            )}

            {/* Contract Details */}
            {(engagementLetter.scopeOfWork || engagementLetter.deliverables || engagementLetter.timelines) && (
              <Card withBorder>
                <Stack gap="sm">
                  <Text fw={600}>Contract Details</Text>
                  {engagementLetter.scopeOfWork && (
                    <div>
                      <Text size="sm" c="dimmed" mb={4}>Scope of Work</Text>
                      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {engagementLetter.scopeOfWork}
                      </Text>
                    </div>
                  )}
                  {engagementLetter.deliverables && (
                    <div>
                      <Text size="sm" c="dimmed" mb={4}>Deliverables</Text>
                      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {engagementLetter.deliverables}
                      </Text>
                    </div>
                  )}
                  {engagementLetter.timelines && (
                    <div>
                      <Text size="sm" c="dimmed" mb={4}>Timelines</Text>
                      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {engagementLetter.timelines}
                      </Text>
                    </div>
                  )}
                </Stack>
              </Card>
            )}
          </Stack>
        )}
      </ScrollArea>
    </Drawer>
  );
}