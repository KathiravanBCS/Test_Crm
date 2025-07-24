import { Card, Group, Avatar, Stack, Title, Badge, Text, Divider, SimpleGrid, Anchor } from '@mantine/core';
import { 
  IconBuilding, 
  IconCurrency, 
  IconUser,
  IconCalendar,
  IconWorldWww,
  IconFileText,
  IconCreditCard,
  IconBriefcase,
  IconCategory,
} from '@tabler/icons-react';
import { InfoField } from '@/components/display/InfoField';
import { useGetBranches } from '@/lib/hooks/useGetBranches';
import type { Customer } from '@/types/customer';

interface CustomerInfoCardProps {
  customer: Customer;
}

export function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
  const { data: branches = [] } = useGetBranches();
  
  const getCustomerTypeColor = (customerType: string) => {
    switch (customerType) {
      case 'direct':
        return 'blue';
      case 'partner_referred':
        return 'green';
      case 'partner_managed':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getCustomerTypeLabel = (customerType: string) => {
    return customerType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatPaymentTerm = (term?: string) => {
    if (!term) return '-';
    return term.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Stack gap="md">
      {/* Basic Info Card */}
      <Card>
        <Group align="flex-start" justify="space-between" mb="md">
          <Group>
            <Avatar size="lg" radius="xl" color={getCustomerTypeColor(customer.customerType)}>
              <IconBuilding size={28} />
            </Avatar>
            <div>
              <Title order={3}>{customer.customerName}</Title>
              <Text size="sm" c="dimmed" mb={4}>{customer.customerCode}</Text>
              <Group gap="xs">
                <Badge 
                  variant="dot" 
                  color={getCustomerTypeColor(customer.customerType)}
                >
                  {getCustomerTypeLabel(customer.customerType)}
                </Badge>
                {customer.customerSegment && (
                  <Badge variant="light" leftSection={<IconCategory size={12} />}>
                    {customer.customerSegment.split('_').map(w => 
                      w.charAt(0).toUpperCase() + w.slice(1)
                    ).join(' ')}
                  </Badge>
                )}
                <Badge variant="outline" leftSection={<IconCurrency size={12} />}>
                  {customer.currencyCode}
                </Badge>
              </Group>
              {customer.vstnBranchId && (
                <Text size="sm" c="dimmed" mt={2}>
                  Branch: {branches.find(b => b.id === customer.vstnBranchId)?.branchName || '—'}
                </Text>
              )}
            </div>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <InfoField 
            label="Industry" 
            value={customer.industry ? 
              customer.industry.split('_').map(w => 
                w.charAt(0).toUpperCase() + w.slice(1)
              ).join(' ') : '-'
            }
            icon={<IconBriefcase size={16} />}
          />
          <InfoField 
            label="Onboarded Date" 
            value={formatDate(customer.onboardedDate)}
            icon={<IconCalendar size={16} />}
          />
          <InfoField 
            label="Payment Terms" 
            value={formatPaymentTerm(customer.paymentTerm)}
            icon={<IconCreditCard size={16} />}
          />
          {customer.webUrl && (
            <InfoField 
              label="Website" 
              value={customer.webUrl}
              icon={<IconWorldWww size={16} />}
            />
          )}
        </SimpleGrid>

        {customer.customerDescription && (
          <>
            <Divider my="md" />
            <Stack gap="xs">
              <Group gap="xs">
                <IconFileText size={16} color="var(--mantine-color-dimmed)" />
                <Text size="sm" c="dimmed">Description</Text>
              </Group>
              <Text size="sm">{customer.customerDescription}</Text>
            </Stack>
          </>
        )}
      </Card>

      {/* Partner Info Card */}
      {customer.partner && (
        <Card>
          <Stack gap="sm">
            <Group gap="xs">
              <IconUser size={18} color="var(--mantine-color-dimmed)" />
              <Text fw={500}>Partner Information</Text>
            </Group>
            
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <InfoField 
                label="Partner Name" 
                value={customer.partner.partnerName}
              />
              <InfoField 
                label="Relationship Type" 
                value={customer.customerType === 'partner_referred' 
                  ? 'Referred by Partner'
                  : 'Managed by Partner'}
              />
            </SimpleGrid>

            {customer.partnershipNote && (
              <>
                <Divider />
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">Partnership Notes</Text>
                  <Text size="sm">{customer.partnershipNote}</Text>
                </Stack>
              </>
            )}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}