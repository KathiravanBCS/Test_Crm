import { Stack, Text, Group, Badge, Divider } from '@mantine/core';
import { InfoField } from '@/components/display/InfoField';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { StatusBadge } from '@/components/display/StatusBadge';
import { useGetEngagementLetter } from '../api/useGetEngagementLetter';
import { useGetBranches } from '@/lib/hooks/useGetBranches';
import { formatDate } from '@/lib/utils/date';

interface EngagementLetterDetailContentProps {
  engagementLetterId: number;
}

export function EngagementLetterDetailContent({ engagementLetterId }: EngagementLetterDetailContentProps) {
  const { data: engagementLetter, isLoading } = useGetEngagementLetter(engagementLetterId);
  const { data: branches = [] } = useGetBranches();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!engagementLetter) {
    return <Text>Engagement letter not found</Text>;
  }

  const totalValue = engagementLetter.serviceItems?.reduce(
    (sum, item) => sum + (item.serviceRate || 0), 
    0
  ) || 0;

  const branch = branches.find(b => b.id === engagementLetter.customer?.vstnBranchId);

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <InfoField label="EL Number" value={`EL-${engagementLetter.id}`} />
        <StatusBadge 
          status={{
            statusCode: engagementLetter.status?.statusCode || 'draft',
            statusName: engagementLetter.status?.statusName || 'Draft'
          }} 
        />
      </Group>

      <Divider />

      <Stack gap="sm">
        <Group gap="xs">
          <Text size="sm" c="dimmed">Engagement Letter For:</Text>
          <Badge color={engagementLetter.proposal?.proposal_target === 'partner' ? 'green' : 'blue'}>
            {engagementLetter.proposal?.proposal_target === 'partner' ? 'Partner' : 'Customer'}
          </Badge>
        </Group>
        
        {engagementLetter.proposal?.proposal_target === 'customer' ? (
          <>
            <InfoField 
              label="Customer" 
              value={engagementLetter.customer?.customerName || 'N/A'} 
            />
            {engagementLetter.partner && (
              <InfoField 
                label="Partner" 
                value={engagementLetter.partner?.partnerName || 'N/A'} 
              />
            )}
          </>
        ) : (
          <>
            <InfoField 
              label="Partner" 
              value={engagementLetter.partner?.partnerName || 'N/A'} 
            />
            <InfoField 
              label="Target Customer" 
              value={engagementLetter.customer?.customerName || 'N/A'} 
            />
          </>
        )}
        
        <InfoField 
          label="Branch" 
          value={branch?.branchName || '—'} 
        />
        <InfoField 
          label="Proposal" 
          value={engagementLetter.proposal?.proposal_number || `PROP-${engagementLetter.proposalId}`} 
        />
        {engagementLetter.approvalDate && (
          <InfoField 
            label="Approval Date" 
            value={formatDate(engagementLetter.approvalDate)} 
          />
        )}
      </Stack>

      <Divider />

      <Stack gap="sm">
        <Text size="sm" fw={500}>Financial Summary</Text>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Total Value</Text>
          <MoneyDisplay amount={totalValue} currency="INR" />
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Service Items</Text>
          <Badge variant="outline" color="gray">
            {engagementLetter.serviceItems?.length || 0} items
          </Badge>
        </Group>
      </Stack>

      {engagementLetter.signOffNotes && (
        <>
          <Divider />
          <Stack gap="xs">
            <Text size="sm" fw={500}>Sign-off Notes</Text>
            <Text size="sm" c="dimmed">{engagementLetter.signOffNotes}</Text>
          </Stack>
        </>
      )}
    </Stack>
  );
}