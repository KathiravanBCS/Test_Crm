import { Card, Stack, Text, Group, Badge } from '@mantine/core';
import { IconMapPin, IconBuilding, IconMap, IconMailbox } from '@tabler/icons-react';
import { InfoField } from '@/components/display/InfoField';
import type { Partner } from '../types';

interface PartnerAddressCardProps {
  partner: Partner;
  editable?: boolean;
  onEdit?: () => void;
}

export function PartnerAddressCard({ partner }: PartnerAddressCardProps) {
  const addresses = partner.addresses || [];
  const primaryAddress = addresses.find(addr => addr.isPrimary) || addresses[0];

  if (!primaryAddress) {
    return (
      <Card withBorder>
        <Stack align="center" py="xl">
          <IconMapPin size={48} color="gray" />
          <Text c="dimmed" size="sm">No address information available</Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <IconMapPin size={20} />
          <Text fw={600}>Address Information</Text>
          {primaryAddress.isPrimary && (
            <Badge size="sm" variant="light">Primary</Badge>
          )}
        </Group>

        {(primaryAddress.addressLine1 || primaryAddress.addressLine2) && (
          <div>
            <Text size="sm" c="dimmed" mb={4}>Street Address</Text>
            <Text>{primaryAddress.addressLine1}</Text>
            {primaryAddress.addressLine2 && <Text>{primaryAddress.addressLine2}</Text>}
          </div>
        )}

        <Group grow>
          {primaryAddress.city && (
            <div>
              <Group gap={4} mb={4}>
                <IconBuilding size={14} />
                <Text size="sm" c="dimmed">City</Text>
              </Group>
              <Text>{primaryAddress.city}</Text>
            </div>
          )}
          
          {primaryAddress.state && (
            <div>
              <Group gap={4} mb={4}>
                <IconMap size={14} />
                <Text size="sm" c="dimmed">State</Text>
              </Group>
              <Text>{primaryAddress.state}</Text>
            </div>
          )}
        </Group>

        <Group grow>
          {primaryAddress.postalCode && (
            <div>
              <Group gap={4} mb={4}>
                <IconMailbox size={14} />
                <Text size="sm" c="dimmed">Postal Code</Text>
              </Group>
              <Text>{primaryAddress.postalCode}</Text>
            </div>
          )}
          
          {primaryAddress.country && (
            <div>
              <Text size="sm" c="dimmed" mb={4}>Country</Text>
              <Text>{primaryAddress.country}</Text>
            </div>
          )}
        </Group>
      </Stack>
    </Card>
  );
}