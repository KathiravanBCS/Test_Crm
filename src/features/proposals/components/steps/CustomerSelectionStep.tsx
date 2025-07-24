import { useState, useEffect } from 'react';
import { UseFormReturnType } from '@mantine/form';
import { Stack, Card, Text, Group, Badge, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { CustomerPicker } from '@/components/forms/pickers/CustomerPicker';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Customer } from '@/features/customers/types';

interface CustomerSelectionStepProps {
  form: UseFormReturnType<any>;
}

export function CustomerSelectionStep({ form }: CustomerSelectionStepProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    form.values.customer || null
  );

  // Fetch all customers to find the selected one
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: api.customers.getAll,
  });

  // Update selected customer when value changes
  useEffect(() => {
    if (form.values.customer_id && customers.length > 0) {
      const customer = customers.find(c => c.id === form.values.customer_id);
      if (customer && customer.id !== selectedCustomer?.id) {
        setSelectedCustomer(customer);
      }
    }
  }, [form.values.customer_id, customers]);

  const handleCustomerSelect = (customerId: number | null) => {
    const customer = customerId ? customers.find(c => c.id === customerId) || null : null;
    
    setSelectedCustomer(customer);
    form.setFieldValue('customer', customer);
    form.setFieldValue('customer_id', customer?.id);

    // Auto-populate partner if customer is partner-referred
    if (customer?.customerType === 'partner_referred' || customer?.customerType === 'partner_managed') {
      form.setFieldValue('partner', customer.partner);
    } else {
      form.setFieldValue('partner', undefined);
    }

    // Set preferred currency
    form.setFieldValue('currency_code', customer?.currencyCode || 'INR');
  };

  return (
    <Stack gap="md" mt="xl">
      <CustomerPicker
        value={form.values.customer_id || null}
        onChange={handleCustomerSelect}
        error={form.errors.customer_id as string}
      />

      {selectedCustomer && (
        <Card withBorder>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm" fw={500}>Customer Details</Text>
              <Badge 
                color={
                  selectedCustomer.customerType === 'direct' ? 'blue' :
                  selectedCustomer.customerType === 'partner_referred' ? 'orange' : 'purple'
                }
              >
                {selectedCustomer.customerType.replace('_', ' ')}
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

      {/* Show recent proposals info if needed */}
      {selectedCustomer && (
        <Alert icon={<IconInfoCircle />} color="blue" variant="light">
          <Text size="sm" fw={500} mb="xs">Proposal History</Text>
          <Text size="sm">
            You can view previous proposals for this customer in the customer detail page.
          </Text>
        </Alert>
      )}
    </Stack>
  );
}