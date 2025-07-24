import { Stack, Text, SimpleGrid, Paper, Box, Card, Title, ThemeIcon, Group } from '@mantine/core';
import { IconFileText, IconCalendar, IconUser, IconCurrencyRupee } from '@tabler/icons-react';
import { formatDate } from '@/lib/utils/date';
import { ServiceItemsDisplay } from '@/components/ui/ServiceItemsDisplay';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import type { UseFormReturnType } from '@mantine/form';

interface ReviewAndSubmitStepProps {
  form: UseFormReturnType<any>;
}

export function ReviewAndSubmitStep({ form }: ReviewAndSubmitStepProps) {
  const proposal = form.values;

  const calculateTotal = () => {
    return proposal.service_items?.reduce((sum: number, item: any) => sum + item.negotiated_price, 0) || 0;
  };

  return (
    <Stack gap="lg" mt="xl">
      <div>
        <Text size="lg" fw={600} mb="xs">Review Proposal</Text>
        <Text size="sm" c="dimmed">
          Please review all the details before submitting your proposal
        </Text>
      </div>

      {/* Basic Information */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Paper p="md" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500} tt="uppercase">
              {proposal.proposal_target === 'partner' ? 'Partner' : 'Customer'}
            </Text>
            <Box>
              <Text size="sm" c="dimmed">Name</Text>
              <Text size="sm" fw={500}>
                {proposal.proposal_target === 'partner' 
                  ? proposal.partner?.partnerName 
                  : proposal.customer?.name || '—'}
              </Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed">
                {proposal.proposal_target === 'partner' ? 'Partner Code' : 'Type'}
              </Text>
              <Text size="sm" fw={500}>
                {proposal.proposal_target === 'partner'
                  ? proposal.partner?.partnerCode
                  : proposal.customer?.type?.replace('_', ' ') || '—'}
              </Text>
            </Box>
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500} tt="uppercase">Proposal Details</Text>
            <Box>
              <Text size="xs" c="dimmed">Name</Text>
              <Text size="sm" fw={500}>
                {proposal.proposal_name || '—'}
              </Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed">Currency</Text>
              <Text size="sm" fw={500}>
                {proposal.currency_code || 'INR'}
              </Text>
            </Box>
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500} tt="uppercase">Timeline</Text>
            <Box>
              <Text size="xs" c="dimmed">Proposal Date</Text>
              <Text size="sm" fw={500}>
                {formatDate(proposal.proposal_date)}
              </Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed">Valid Until</Text>
              <Text size="sm" fw={500}>
                {formatDate(proposal.valid_until)}
              </Text>
            </Box>
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500} tt="uppercase">Team</Text>
            {proposal.assigned_to && proposal.assigned_to.length > 0 ? (
              <Box>
                <Text size="xs" c="dimmed">Assigned To</Text>
                <Text size="sm" fw={500}>
                  {proposal.assigned_to.length} team member{proposal.assigned_to.length !== 1 ? 's' : ''}
                </Text>
              </Box>
            ) : (
              <Text size="sm" c="dimmed">No team assigned</Text>
            )}
          </Stack>
        </Paper>
      </SimpleGrid>

      {/* Service Items */}
      {proposal.service_items && proposal.service_items.length > 0 && (
        <Card radius="md" withBorder>
          <Group gap="sm" mb="md">
            <ThemeIcon size="md" radius="md" variant="light">
              <IconFileText size={18} />
            </ThemeIcon>
            <Title order={5}>Service Items</Title>
          </Group>
          <ServiceItemsDisplay 
            items={proposal.service_items} 
            currency={proposal.currency_code || 'INR'}
            compact
          />
        </Card>
      )}

      {/* Terms & Conditions */}
      {proposal.terms_and_conditions && (
        <Card radius="md" withBorder>
          <Group gap="sm" mb="md">
            <ThemeIcon size="md" radius="md" variant="light">
              <IconFileText size={18} />
            </ThemeIcon>
            <Title order={5}>Terms & Conditions</Title>
          </Group>
          <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
            {proposal.terms_and_conditions}
          </Text>
        </Card>
      )}

      {/* Additional Clauses */}
      {proposal.additional_clauses && (
        <Card radius="md" withBorder>
          <Group gap="sm" mb="md">
            <ThemeIcon size="md" radius="md" variant="light">
              <IconFileText size={18} />
            </ThemeIcon>
            <Title order={5}>Additional Clauses</Title>
          </Group>
          <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
            {proposal.additional_clauses}
          </Text>
        </Card>
      )}

      {/* Notes */}
      {proposal.notes && (
        <Card radius="md" withBorder>
          <Group gap="sm" mb="md">
            <ThemeIcon size="md" radius="md" variant="light">
              <IconFileText size={18} />
            </ThemeIcon>
            <Title order={5}>Notes</Title>
          </Group>
          <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
            {proposal.notes}
          </Text>
        </Card>
      )}

      {/* Total Summary */}
      <Card radius="md" withBorder>
        <Group justify="space-between" align="center">
          <Text size="lg" fw={600}>Total Proposal Value</Text>
          <MoneyDisplay
            amount={calculateTotal()}
            currency={proposal.currency_code || 'INR'}
            size="xl"
            fw={700}
            c="blue"
          />
        </Group>
      </Card>
    </Stack>
  );
}