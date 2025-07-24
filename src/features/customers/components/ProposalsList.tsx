import { useNavigate } from 'react-router-dom';
import { Stack, Card, Group, Text, Badge, ActionIcon, Progress } from '@mantine/core';
import { IconExternalLink, IconFileText } from '@tabler/icons-react';
import { EmptyState } from '@/components/display/EmptyState';
import { StatusBadge } from '@/components/display/StatusBadge';
import { MoneyDisplay } from '@/components/display/MoneyDisplay';
import { formatDate } from '@/lib/utils/date';
import { useQuery } from '@tanstack/react-query';

interface ProposalsListProps {
  customerId: number;
}

// Mock data for now
const mockProposals = [
  {
    id: 1,
    proposalName: 'Transfer Pricing Study 2024',
    status: { statusCode: 'draft', statusName: 'Draft', context: 'PROPOSAL' },
    totalAmount: { amount: 500000, currencyCode: 'INR' },
    proposalDate: new Date('2024-01-15'),
    progress: 25,
  },
  {
    id: 2,
    proposalName: 'Benchmarking Analysis Q1',
    status: { statusCode: 'sent', statusName: 'Sent', context: 'PROPOSAL' },
    totalAmount: { amount: 300000, currencyCode: 'INR' },
    proposalDate: new Date('2024-02-01'),
    progress: 50,
  },
];

export function ProposalsList({ customerId }: ProposalsListProps) {
  const navigate = useNavigate();
  
  // TODO: Replace with actual API call
  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['customer', customerId, 'proposals'],
    queryFn: async () => mockProposals,
  });

  if (!isLoading && proposals.length === 0) {
    return (
      <EmptyState
        icon={<IconFileText size={40} />}
        title="No proposals yet"
        description="Create a proposal to start the engagement process"
        height={200}
      />
    );
  }

  return (
    <Stack gap="sm">
      {proposals.map((proposal) => (
        <Card key={proposal.id} withBorder p="sm">
          <Group justify="space-between" align="flex-start">
            <div style={{ flex: 1 }}>
              <Group gap="xs" mb="xs">
                <Text fw={500}>{proposal.proposalName}</Text>
                <StatusBadge status={proposal.status} size="xs" />
              </Group>
              
              <Group gap="md">
                <div>
                  <Text size="xs" c="dimmed">Amount</Text>
                  <MoneyDisplay amount={proposal.totalAmount} size="sm" />
                </div>
                <div>
                  <Text size="xs" c="dimmed">Date</Text>
                  <Text size="sm">{formatDate(proposal.proposalDate)}</Text>
                </div>
              </Group>

              <Progress value={proposal.progress} size="xs" mt="sm" />
            </div>

            <ActionIcon 
              variant="subtle"
              onClick={() => navigate(`/proposals/${proposal.id}`)}
            >
              <IconExternalLink size={16} />
            </ActionIcon>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}