import { Card, Stack, Text, Group, Badge, RingProgress, SimpleGrid } from '@mantine/core';
import { IconCurrencyRupee, IconTrendingUp, IconUsers, IconReceipt } from '@tabler/icons-react';
import { MoneyDisplay } from '@/components/display/MoneyDisplay';
import type { Partner } from '../types';

interface PartnerCommissionCardProps {
  partner: Partner;
}

export function PartnerCommissionCard({ partner }: PartnerCommissionCardProps) {
  const referralCount = partner.referredCustomersCount || 0;
  const totalCommission = partner.totalCommissionAmount || 0;
  const averageCommission = referralCount > 0 ? totalCommission / referralCount : 0;

  // Mock data for demonstration - in real app, this would come from API
  const commissionStats = {
    pending: 45000,
    paid: totalCommission - 45000,
    thisMonth: 25000,
    lastMonth: 18000,
  };

  const paidPercentage = totalCommission > 0 
    ? Math.round((commissionStats.paid / totalCommission) * 100)
    : 0;

  return (
    <Card withBorder>
      <Stack gap="lg">
        <Group gap="xs">
          <IconCurrencyRupee size={20} />
          <Text fw={600}>Commission Overview</Text>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Card withBorder p="sm">
            <Stack gap="xs">
              <Group gap="xs">
                <IconCurrencyRupee size={16} color="gray" />
                <Text size="sm" c="dimmed">Total Earned</Text>
              </Group>
              <MoneyDisplay 
                amount={totalCommission} 
                currencyCode={partner.currencyCode || 'INR'}
                size="lg"
                fw={600}
                color="green"
              />
            </Stack>
          </Card>

          <Card withBorder p="sm">
            <Stack gap="xs">
              <Group gap="xs">
                <IconUsers size={16} color="gray" />
                <Text size="sm" c="dimmed">Referrals</Text>
              </Group>
              <Text size="lg" fw={600}>
                {referralCount}
              </Text>
            </Stack>
          </Card>

          <Card withBorder p="sm">
            <Stack gap="xs">
              <Group gap="xs">
                <IconTrendingUp size={16} color="gray" />
                <Text size="sm" c="dimmed">Avg. Commission</Text>
              </Group>
              <MoneyDisplay 
                amount={averageCommission} 
                currencyCode={partner.currencyCode || 'INR'}
                size="lg"
                fw={600}
              />
            </Stack>
          </Card>

          <Card withBorder p="sm">
            <Stack gap="xs">
              <Group gap="xs">
                <IconReceipt size={16} color="gray" />
                <Text size="sm" c="dimmed">Pending</Text>
              </Group>
              <MoneyDisplay 
                amount={commissionStats.pending} 
                currencyCode={partner.currencyCode || 'INR'}
                size="lg"
                fw={600}
                color="orange"
              />
            </Stack>
          </Card>
        </SimpleGrid>

        {totalCommission > 0 && (
          <Group gap="xl">
            <RingProgress
              size={120}
              thickness={12}
              sections={[
                { value: paidPercentage, color: 'green' },
                { value: 100 - paidPercentage, color: 'orange' },
              ]}
              label={
                <Stack gap={0} align="center">
                  <Text fw={700} size="lg">{paidPercentage}%</Text>
                  <Text c="dimmed" size="xs">Paid</Text>
                </Stack>
              }
            />
            
            <Stack gap="sm">
              <Group gap="xs">
                <Badge size="xs" color="green" variant="dot" />
                <Text size="sm">
                  Paid: <MoneyDisplay 
                    amount={commissionStats.paid} 
                    currencyCode={partner.currencyCode || 'INR'}
                    inline 
                  />
                </Text>
              </Group>
              <Group gap="xs">
                <Badge size="xs" color="orange" variant="dot" />
                <Text size="sm">
                  Pending: <MoneyDisplay 
                    amount={commissionStats.pending} 
                    currencyCode={partner.currencyCode || 'INR'}
                    inline 
                  />
                </Text>
              </Group>
            </Stack>
          </Group>
        )}

        <Group gap="xl">
          <div>
            <Text size="xs" c="dimmed">This Month</Text>
            <MoneyDisplay 
              amount={commissionStats.thisMonth} 
              currencyCode={partner.currencyCode || 'INR'}
              fw={500}
            />
          </div>
          <div>
            <Text size="xs" c="dimmed">Last Month</Text>
            <MoneyDisplay 
              amount={commissionStats.lastMonth} 
              currencyCode={partner.currencyCode || 'INR'}
              fw={500}
            />
          </div>
          <Badge 
            variant="light" 
            color={commissionStats.thisMonth > commissionStats.lastMonth ? 'green' : 'red'}
          >
            {commissionStats.thisMonth > commissionStats.lastMonth ? '+' : '-'}
            {Math.abs(Math.round(((commissionStats.thisMonth - commissionStats.lastMonth) / commissionStats.lastMonth) * 100))}%
          </Badge>
        </Group>
      </Stack>
    </Card>
  );
}