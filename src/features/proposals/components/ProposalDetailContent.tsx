import { Stack, Card, Group, Text, Button, Divider, SimpleGrid } from '@mantine/core';
import { IconCalendar, IconCurrencyRupee, IconFileText, IconUser, IconBuildingBank } from '@tabler/icons-react';
import { InfoField } from '@/components/display/InfoField';
import { StatusBadge } from '@/components/display/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { useGetBranches } from '@/lib/hooks/useGetBranches';
import type { Proposal } from '../types';

interface ProposalDetailContentProps {
  proposalId: number;
  proposal?: Proposal;
}

// Mock data for now - replace with API call
const mockProposal: Proposal = {
  id: 1,
  proposal_target: 'customer',
  customer_id: 1,
  customer: {
    id: 1,
    customerCode: 'CUST-001',
    customerName: 'ABC Corporation',
    customerType: 'direct',
    currencyCode: 'INR',
    email: 'contact@abc.com',
    phone: '+91 98765 43210',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  status_id: 2,
  status: {
    id: 2,
    context: 'PROPOSAL',
    status_code: 'submitted',
    status_name: 'Submitted',
    sequence: 20,
    is_final: false
  },
  proposal_number: 'PROP-2024-001',
  proposal_date: new Date('2024-01-15'),
  valid_until: new Date('2024-02-14'),
  total_amount: 500000,
  currency_code: 'INR',
  notes: 'Initial proposal for annual audit services',
  created_at: new Date('2024-01-15'),
  updated_at: new Date('2024-01-15'),
};

export function ProposalDetailContent({ proposal: propFromProps }: ProposalDetailContentProps) {
  // Use proposal from props if provided, otherwise use mock data
  const proposal = propFromProps || mockProposal;
  const { data: branches = [] } = useGetBranches();
  
  const branchId = proposal.customer?.vstnBranchId;
  const branch = branches.find(b => b.id === branchId);

  return (
    <Stack gap="md">
      {/* Status and Basic Info */}
      <Card withBorder>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text fw={600}>Status</Text>
            <StatusBadge status={{
              statusCode: proposal.status!.status_code,
              statusName: proposal.status!.status_name
            }} />
          </Group>
          <Divider />
          <SimpleGrid cols={2} spacing="sm">
            <InfoField 
              label="Proposal Date" 
              value={formatDate(proposal.proposal_date!)}
              icon={<IconCalendar size={16} />}
            />
            <InfoField 
              label="Valid Until" 
              value={formatDate(proposal.valid_until!)}
              icon={<IconCalendar size={16} />}
            />
            <InfoField 
              label="Total Value" 
              value={`₹${(proposal.total_amount || 0).toLocaleString('en-IN')}`}
              icon={<IconCurrencyRupee size={16} />}
            />
            <InfoField 
              label="Currency" 
              value={proposal.currency_code || 'INR'}
            />
          </SimpleGrid>
        </Stack>
      </Card>

      {/* Customer/Partner Info */}
      <Card withBorder>
        <Stack gap="sm">
          <Text fw={600}>
            {proposal.proposal_target === 'partner' ? 'Partner Details' : 'Customer Details'}
          </Text>
          <Divider />
          <SimpleGrid cols={1} spacing="sm">
            <InfoField 
              label="Name" 
              value={proposal.proposal_target === 'partner' 
                ? proposal.partner?.partnerName 
                : proposal.customer?.customerName}
              icon={<IconUser size={16} />}
            />
            <InfoField 
              label={proposal.proposal_target === 'partner' ? 'Partner Code' : 'Type'} 
              value={proposal.proposal_target === 'partner'
                ? proposal.partner?.partnerCode
                : proposal.customer?.customerType.replace('_', ' ') || ''}
            />
            <InfoField 
              label="Branch" 
              value={branch?.branchName || '—'}
              icon={<IconBuildingBank size={16} />}
            />
            {proposal.proposal_target === 'partner' ? (
              <>
                <InfoField 
                  label="Commission Type" 
                  value={proposal.partner?.commissionType} 
                />
                <InfoField 
                  label="Commission Rate" 
                  value={proposal.partner?.commissionRate ? `${proposal.partner.commissionRate}%` : '—'} 
                />
              </>
            ) : (
              <>
                <InfoField label="Email" value={proposal.customer?.email} />
                <InfoField label="Phone" value={proposal.customer?.phone} />
              </>
            )}
          </SimpleGrid>
        </Stack>
      </Card>

      {/* Notes */}
      {proposal.notes && (
        <Card withBorder>
          <Stack gap="sm">
            <Text fw={600}>Notes</Text>
            <Divider />
            <Text size="sm">{proposal.notes}</Text>
          </Stack>
        </Card>
      )}

      {/* Actions */}
      <Group>
        <Button 
          variant="default" 
          size="sm"
          leftSection={<IconFileText size={16} />}
        >
          View Full Details
        </Button>
      </Group>
    </Stack>
  );
}