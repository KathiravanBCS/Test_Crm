import { Card, Stack, Group, Text, Badge, Avatar, Tooltip } from '@mantine/core';
import { IconBuilding, IconCurrency, IconPercentage, IconCash, IconUser } from '@tabler/icons-react';
import { InfoField } from '@/components/display/InfoField';
import { useGetBranches } from '@/lib/hooks/useGetBranches';
import type { Partner } from '../types';

interface PartnerInfoCardProps {
  partner: Partner;
  showStatus?: boolean;
}

export function PartnerInfoCard({ partner, showStatus = true }: PartnerInfoCardProps) {
  const displayName = partner.partnerName || 'Unknown Partner';
  const partnerCode = partner.partnerCode || partner.id?.toString();
  const currencyCode = partner.currencyCode || 'INR';
  const { data: branches = [] } = useGetBranches();
  const branch = branches.find(b => b.id === partner.vstnBranchId);
  
  return (
    <Card withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Group>
            <Avatar size="lg" radius="md" color="blue">
              {partner.partnerType === 'individual' ? <IconUser size={24} /> : <IconBuilding size={24} />}
            </Avatar>
            <div>
              <Group gap="xs">
                <Text size="lg" fw={600}>{displayName}</Text>
                <Badge size="sm" variant="outline">{partnerCode}</Badge>
              </Group>
              <Group gap="xs" mt={4}>
                <Badge size="sm" variant="light" color="blue">
                  {partner.partnerType === 'individual' ? 'Individual' : 'Firm'}
                </Badge>
                {partner.referredCustomersCount !== undefined && partner.referredCustomersCount > 0 && (
                  <Badge size="sm" variant="dot" color="green">
                    {partner.referredCustomersCount} referrals
                  </Badge>
                )}
                {currencyCode && currencyCode !== 'INR' && (
                  <Badge size="sm" variant="light" color="grape" leftSection={<IconCurrency size={12} />}>
                    {currencyCode}
                  </Badge>
                )}
                {partner.commissionType && (
                  <Tooltip label={`Commission: ${partner.commissionRate}${partner.commissionType === 'percentage' ? '%' : ` ${partner.commissionCurrencyCode || currencyCode}`}`}>
                    <Badge 
                      size="sm" 
                      variant="light" 
                      color="teal" 
                      leftSection={partner.commissionType === 'percentage' ? <IconPercentage size={12} /> : <IconCash size={12} />}
                    >
                      {partner.commissionType === 'percentage' ? `${partner.commissionRate}%` : 'Fixed'}
                    </Badge>
                  </Tooltip>
                )}
              </Group>
            </div>
          </Group>
          {showStatus && (
            <Badge 
              size="lg"
              color={partner.activeStatus ? 'green' : 'gray'} 
              variant="light"
            >
              {partner.activeStatus ? 'Active' : 'Inactive'}
            </Badge>
          )}
        </Group>

        <Group gap="xl">
          <InfoField label="Branch" value={branch?.branchName || '—'} />
          <InfoField label="PAN" value={partner.pan} />
          <InfoField label="GSTIN" value={partner.gstin} />
          <InfoField label="Payment Terms" value={partner.paymentTerm} />
          {partner.webUrl && (
            <InfoField label="Website" value={partner.webUrl} />
          )}
        </Group>
      </Stack>
    </Card>
  );
}