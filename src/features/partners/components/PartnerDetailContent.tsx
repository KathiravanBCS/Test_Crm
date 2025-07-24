import { Tabs, Card, Stack, Group, Text, Badge, Divider } from '@mantine/core';
import { IconUser, IconBriefcase, IconCurrencyRupee, IconMapPin, IconBuildingBank, IconMessage } from '@tabler/icons-react';
import { useGetPartner } from '../api/useGetPartner';
import { InfoField } from '@/components/display/InfoField';
import { formatDate } from '@/lib/utils/date';
import { MoneyDisplay } from '@/components/display/MoneyDisplay';
import { ContactList } from '@/components/display/ContactList';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useAuth } from '@/lib/auth/useAuth';
import { CommentsTab } from '@/features/comments/components/CommentsTab';

interface PartnerDetailContentProps {
  partnerId: number;
}

export function PartnerDetailContent({ partnerId }: PartnerDetailContentProps) {
  const { data: partner, isLoading } = useGetPartner(partnerId);
  const { canViewFinancial } = useUserRole();
  const { user } = useAuth();

  if (isLoading || !partner) {
    return <div>Loading...</div>;
  }

  return (
    <Stack gap="md">
      {/* Summary Card */}
      <Card>
        <Group justify="space-between" mb="md">
          <Group>
            <IconBriefcase size={24} />
            <div>
              <Text fw={500}>{partner.partnerName}</Text>
              {partner.referredCustomersCount !== undefined && partner.referredCustomersCount > 0 && (
                <Badge size="sm" variant="dot" color="blue">
                  {partner.referredCustomersCount} referrals
                </Badge>
              )}
            </div>
          </Group>
          <Badge 
            color={partner.activeStatus ? 'green' : 'gray'} 
            variant="light"
          >
            {partner.activeStatus ? 'Active' : 'Inactive'}
          </Badge>
        </Group>
        
        <Group gap="xl">
          <InfoField label="PAN" value={partner.pan} />
          <InfoField label="GSTIN" value={partner.gstin} />
        </Group>
      </Card>

      <Tabs defaultValue="details">
        <Tabs.List>
          <Tabs.Tab value="details" leftSection={<IconUser size={16} />}>
            Details
          </Tabs.Tab>
          <Tabs.Tab value="bank" leftSection={<IconBuildingBank size={16} />}>
            Bank Details
          </Tabs.Tab>
          <Tabs.Tab value="contacts" leftSection={<IconUser size={16} />}>
            Contacts
          </Tabs.Tab>
          <Tabs.Tab value="comments" leftSection={<IconMessage size={16} />}>
            Comments
          </Tabs.Tab>
          {canViewFinancial && (
            <Tabs.Tab value="financial" leftSection={<IconCurrencyRupee size={16} />}>
              Financial
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="details" pt="md">
          <Card>
            <Stack gap="md">
              <div>
                <Group gap="xs" mb="xs">
                  <IconMapPin size={16} />
                  <Text fw={500}>Tax Information</Text>
                </Group>
                <Group gap="xl">
                  <InfoField label="PAN" value={partner.pan} />
                  <InfoField label="GSTIN" value={partner.gstin} />
                </Group>
              </div>
              
              <Divider />
              
              <div>
                <Text fw={500} mb="xs">Registration Details</Text>
                <Group gap="xl">
                  <InfoField label="Created" value={formatDate(partner.createdAt)} />
                  <InfoField label="Last Updated" value={formatDate(partner.updatedAt)} />
                </Group>
              </div>
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="bank" pt="md">
          <Card>
            <Stack gap="md">
              <Text fw={500}>Banking Information</Text>
              <Group gap="xl">
                {partner.bankAccounts && partner.bankAccounts.length > 0 ? (
                  <InfoField 
                    label="Bank Accounts" 
                    value={`${partner.bankAccounts.length} account${partner.bankAccounts.length > 1 ? 's' : ''} on file`} 
                  />
                ) : (
                  <Text size="sm" c="dimmed">No bank accounts on file</Text>
                )}
              </Group>
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="contacts" pt="md">
          <ContactList 
            contacts={partner.contacts || []} 
            readOnly={true}
          />
        </Tabs.Panel>

        <Tabs.Panel value="comments" pt="md">
          {user && (
            <CommentsTab
              entityType="partner"
              entityId={partnerId}
              currentUserId={user.id}
            />
          )}
        </Tabs.Panel>

        {canViewFinancial && (
          <Tabs.Panel value="financial" pt="md">
            <Card>
              <Stack gap="md">
                <Text fw={500}>Commission Overview</Text>
                <Group gap="xl">
                  <div>
                    <Text size="sm" c="dimmed">Total Commission</Text>
                    <MoneyDisplay 
                      amount={partner.totalCommissionAmount || 0} 
                      currencyCode="INR"
                      size="lg"
                      fw={500}
                      color="green"
                    />
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Referrals</Text>
                    <Text size="lg" fw={500}>
                      {partner.referredCustomersCount || 0}
                    </Text>
                  </div>
                  {partner.referredCustomersCount !== undefined && partner.referredCustomersCount > 0 && (
                    <div>
                      <Text size="sm" c="dimmed">Average Commission</Text>
                      <MoneyDisplay 
                        amount={(partner.totalCommissionAmount || 0) / partner.referredCustomersCount} 
                        currencyCode="INR"
                        size="lg"
                        fw={500}
                      />
                    </div>
                  )}
                </Group>
              </Stack>
            </Card>
          </Tabs.Panel>
        )}
      </Tabs>
    </Stack>
  );
}