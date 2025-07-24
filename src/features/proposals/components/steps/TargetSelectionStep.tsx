import { UseFormReturnType } from '@mantine/form';
import { Stack, Card, Text, Group, Badge, Alert, SegmentedControl } from '@mantine/core';
import { IconInfoCircle, IconUsers, IconBuilding } from '@tabler/icons-react';
import { CustomerPicker } from '@/components/forms/pickers/CustomerPicker';
import { PartnerPicker } from '@/components/forms/pickers/PartnerPicker';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Customer } from '@/features/customers/types';
import type { Partner } from '@/features/partners/types';
import type { ProposalTarget } from '../../types';
import { toCurrencyCode } from '@/types/common';

interface TargetSelectionStepProps {
  form: UseFormReturnType<any>;
}

export function TargetSelectionStep({ form }: TargetSelectionStepProps) {
  const proposalTarget = form.values.proposal_target || 'customer';
  
  // Fetch all customers
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: api.customers.getAll,
  });

  // Fetch all partners
  const { data: partners = [] } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: () => api.partners.getAll(),
  });

  const handleTargetChange = (value: string) => {
    form.setFieldValue('proposal_target', value as ProposalTarget);
    
    // Clear the non-selected fields
    if (value === 'customer') {
      form.setFieldValue('partner_id', undefined);
      form.setFieldValue('partner', undefined);
    } else {
      form.setFieldValue('customer_id', undefined);
      form.setFieldValue('customer', undefined);
    }
  };

  const handleCustomerSelect = (customerId: number | null) => {
    const customer = customerId ? customers.find(c => c.id === customerId) || null : null;
    
    form.setFieldValue('customer', customer);
    form.setFieldValue('customer_id', customer?.id);

    // Auto-populate partner if customer is partner-referred
    if (customer?.customerType === 'partner_referred' || customer?.customerType === 'partner_managed') {
      form.setFieldValue('partner', customer.partner);
    } else {
      form.setFieldValue('partner', undefined);
    }

    // Set preferred currency
    form.setFieldValue('currency_code', toCurrencyCode(customer?.currencyCode));
  };

  const handlePartnerSelect = (partnerId: number | null) => {
    const partner = partnerId ? partners.find(p => p.id === partnerId) || null : null;
    
    form.setFieldValue('partner', partner);
    form.setFieldValue('partner_id', partner?.id);

    // Set preferred currency
    form.setFieldValue('currency_code', toCurrencyCode(partner?.currencyCode));
  };

  // Get selected entities from form values
  const selectedCustomer = form.values.customer;
  const selectedPartner = form.values.partner;

  return (
    <Stack gap="md" mt="xl">
      <Card withBorder>
        <Stack gap="md">
          <Text size="sm" fw={500}>Who is this proposal for?</Text>
          <SegmentedControl
            value={proposalTarget}
            onChange={handleTargetChange}
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
        </Stack>
      </Card>

      {proposalTarget === 'customer' ? (
        <>
          <CustomerPicker
            value={form.values.customer_id || null}
            onChange={handleCustomerSelect}
            error={form.errors.customer_id as string}
            label="Select Customer"
            placeholder="Choose a customer for this proposal"
            required
          />

          {selectedCustomer && (
            <Card withBorder>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm" fw={500}>Customer Details</Text>
                  <Badge 
                    color={
                      selectedCustomer.type === 'direct' ? 'blue' :
                      selectedCustomer.type === 'partner_referred' ? 'orange' : 'purple'
                    }
                  >
                    {selectedCustomer.type.replace('_', ' ')}
                  </Badge>
                </Group>
                
                {selectedCustomer.partner && (
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">Partner:</Text>
                    <Text size="sm">{selectedCustomer.partner.partnerName}</Text>
                  </Group>
                )}
                
                <Group gap="xs">
                  <Text size="sm" c="dimmed">Preferred Currency:</Text>
                  <Text size="sm" fw={500}>{form.values.currency_code || 'INR'}</Text>
                </Group>

                {selectedCustomer.email && (
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">Email:</Text>
                    <Text size="sm">{selectedCustomer.email}</Text>
                  </Group>
                )}

                {selectedCustomer.phone && (
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">Phone:</Text>
                    <Text size="sm">{selectedCustomer.phone}</Text>
                  </Group>
                )}
              </Stack>
            </Card>
          )}
        </>
      ) : (
        <>
          <PartnerPicker
            value={form.values.partner_id || null}
            onChange={handlePartnerSelect}
            error={form.errors.partner_id as string}
            label="Select Partner"
            placeholder="Choose a partner for this proposal"
            required
          />

          {selectedPartner && (
            <Card withBorder>
              <Stack gap="sm">
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
                
                <Group gap="xs">
                  <Text size="sm" c="dimmed">Preferred Currency:</Text>
                  <Text size="sm" fw={500}>{form.values.currency_code || 'INR'}</Text>
                </Group>

                {selectedPartner.commissionRate && (
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">Commission Rate:</Text>
                    <Text size="sm">{selectedPartner.commissionRate}%</Text>
                  </Group>
                )}

                {selectedPartner.webUrl && (
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">Website:</Text>
                    <Text size="sm">{selectedPartner.webUrl}</Text>
                  </Group>
                )}
              </Stack>
            </Card>
          )}

          <Alert icon={<IconInfoCircle />} color="blue" variant="light">
            <Text size="sm" fw={500} mb="xs">Direct Partner Proposal</Text>
            <Text size="sm">
              This proposal will be sent directly to the partner. The partner can then share it with their end customers as needed.
            </Text>
          </Alert>
        </>
      )}

      {/* Show recent proposals info if needed */}
      {(selectedCustomer || selectedPartner) && (
        <Alert icon={<IconInfoCircle />} color="gray" variant="light">
          <Text size="sm" fw={500} mb="xs">Proposal History</Text>
          <Text size="sm">
            You can view previous proposals for this {proposalTarget} in their detail page.
          </Text>
        </Alert>
      )}
    </Stack>
  );
}