import { Card, Stack, Title, SimpleGrid } from '@mantine/core';
import { 
  IconFileText,
  IconCreditCard,
  IconReceipt,
  IconNumber,
} from '@tabler/icons-react';
import { InfoField } from '@/components/display/InfoField';
import type { Customer } from '@/types/customer';

interface CustomerBusinessCardProps {
  customer: Customer;
}

export function CustomerBusinessCard({ customer }: CustomerBusinessCardProps) {
  const formatPaymentTerm = (term?: string) => {
    if (!term) return '-';
    return term.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card>
      <Stack gap="md">
        <Title order={4}>Business & Tax Information</Title>
        
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <InfoField 
            label="Payment Terms" 
            value={formatPaymentTerm(customer.paymentTerm)}
            icon={<IconCreditCard size={16} />}
          />
          <InfoField 
            label="Currency" 
            value={customer.currencyCode}
            icon={<IconReceipt size={16} />}
          />
          <InfoField 
            label="PAN" 
            value={customer.pan || '-'}
            icon={<IconNumber size={16} />}
          />
          <InfoField 
            label="GSTIN" 
            value={customer.gstin || '-'}
            icon={<IconFileText size={16} />}
          />
          <InfoField 
            label="TAN" 
            value={customer.tan || '-'}
            icon={<IconNumber size={16} />}
          />
        </SimpleGrid>
      </Stack>
    </Card>
  );
}