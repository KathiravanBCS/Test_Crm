import { useState, useMemo } from 'react';
import { Stack, Text, Alert, Group, Button, Box } from '@mantine/core';
import { IconInfoCircle, IconArrowRight } from '@tabler/icons-react';
import { ServiceItemSelector } from '../service-items/ServiceItemSelector';
import { useGetServiceItems } from '../../api/useGetServiceItems';
import type { ServiceItemLineItem } from '@/types/service-item';
import type { UseFormReturnType } from '@mantine/form';

interface ServiceSelectionStepProps {
  form: UseFormReturnType<any>;
}

export function ServiceSelectionStep({ form }: ServiceSelectionStepProps) {
  const { data: availableServices = [], isLoading } = useGetServiceItems();
  const [selectedItems, setSelectedItems] = useState<ServiceItemLineItem[]>(
    form.values.service_items || []
  );

  // Calculate partner discount based on selected customer
  const partnerDiscount = useMemo(() => {
    const customer = form.values.customer;
    if (customer?.type === 'partner_referred' && customer?.partner?.commission_rate) {
      return customer.partner.commission_rate;
    }
    return 0;
  }, [form.values.customer]);

  const calculateEffectivePrice = (basePrice: number): number => {
    return partnerDiscount > 0 
      ? basePrice * (1 - partnerDiscount / 100)
      : basePrice;
  };

  const handleAddItem = (item: any) => {
    const newItem: ServiceItemLineItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      service_item_id: item.id,
      service_item_name: item.name,
      service_item_code: item.code,
      description: item.description,
      original_price: item.default_price,
      negotiated_price: calculateEffectivePrice(item.default_price),
      currency_code: 'INR',
      price_source: partnerDiscount > 0 ? 'partner' : 'default',
    };
    
    const updatedItems = [...selectedItems, newItem];
    setSelectedItems(updatedItems);
    form.setFieldValue('service_items', updatedItems);
  };

  const handleUpdateItem = (lineItemId: string, updates: Partial<ServiceItemLineItem>) => {
    const updatedItems = selectedItems.map(item => 
      item.id === lineItemId ? { ...item, ...updates } : item
    );
    setSelectedItems(updatedItems);
    form.setFieldValue('service_items', updatedItems);
  };

  const handleRemoveItem = (lineItemId: string) => {
    const updatedItems = selectedItems.filter(item => item.id !== lineItemId);
    setSelectedItems(updatedItems);
    form.setFieldValue('service_items', updatedItems);
  };

  return (
    <Stack gap="lg" mt="xl">
      <div>
        <Text size="lg" fw={600} mb="xs">Select Services</Text>
        <Text size="sm" c="dimmed">
          Choose the services you want to include in this proposal
        </Text>
      </div>

      {/* Partner Discount Alert */}
      {partnerDiscount > 0 && (
        <Alert 
          icon={<IconInfoCircle size={16} />} 
          color="blue" 
          variant="light"
        >
          <Text size="sm" fw={500}>
            Partner pricing active: {partnerDiscount}% discount applied to all services
          </Text>
        </Alert>
      )}

      {/* Service Selection */}
      <ServiceItemSelector
        availableItems={availableServices}
        selectedItems={selectedItems}
        partnerDiscount={partnerDiscount}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onRemoveItem={handleRemoveItem}
        calculateEffectivePrice={calculateEffectivePrice}
        allowPriceOverride={true}
      />

      {/* Validation Error */}
      {form.errors.service_items && (
        <Alert color="red" variant="light">
          <Text size="sm">{form.errors.service_items}</Text>
        </Alert>
      )}

      {/* Summary */}
      {selectedItems.length > 0 && (
        <Box>
          <Group justify="space-between" align="center">
            <Text size="sm" fw={500}>
              {selectedItems.length} service{selectedItems.length !== 1 ? 's' : ''} selected
            </Text>
            <Button
              size="sm"
              variant="light"
              rightSection={<IconArrowRight size={14} />}
              onClick={() => form.validateField('service_items')}
            >
              Continue
            </Button>
          </Group>
        </Box>
      )}
    </Stack>
  );
}