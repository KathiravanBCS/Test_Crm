import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Title, Paper, Breadcrumbs, Alert, LoadingOverlay } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { BreadcrumbLink } from '@/components/navigation/BreadcrumbLink';
import { EngagementLetterForm } from '../components/EngagementLetterForm';
import { useCreateEngagementLetter } from '../api/useCreateEngagementLetter';
import { useGetProposal } from '@/features/proposals/api/useGetProposal';
import type { EngagementLetterFormData } from '../types';

export function EngagementLetterNewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get('proposalId');
  
  const { data: proposal, isLoading: proposalLoading } = useGetProposal(proposalId ? parseInt(proposalId) : undefined);
  const createMutation = useCreateEngagementLetter();

  const handleSubmit = (data: EngagementLetterFormData) => {
    createMutation.mutate(data, {
      onSuccess: (result) => {
        navigate(`/engagement-letters/${result.id}`);
      },
    });
  };

  const initialData: Partial<EngagementLetterFormData> = proposal
    ? {
        engagementTarget: proposal.proposal_target || 'customer',
        proposalId: proposal.id,
        customerId: proposal.proposal_target === 'customer' 
          ? (proposal.customer_id || proposal.customerId || 0) 
          : 0,
        partnerId: proposal.partner_id || proposal.partnerId,
        currencyCode: proposal.currency_code || proposal.currencyCode || 'INR',
        engagementLetterTitle: `Engagement Letter - ${proposal.proposalTitle || proposal.proposal_number}`,
        termsAndConditions: proposal.termsAndConditions,
        timelines: proposal.timelines,
        selectedServiceItems: [],
      }
    : {
        engagementTarget: 'customer',
      };

  if (proposalLoading) {
    return (
      <Container size="xl">
        <Paper shadow="sm" p="md" radius="md" pos="relative" style={{ minHeight: 400 }}>
          <LoadingOverlay visible />
        </Paper>
      </Container>
    );
  }

  if (proposalId && !proposal) {
    return (
      <Container size="xl">
        <Alert icon={<IconAlertCircle />} color="red" title="Proposal not found">
          The specified proposal could not be loaded. Please check the proposal ID.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Breadcrumbs mb="md">
        <BreadcrumbLink to="/">Home</BreadcrumbLink>
        <BreadcrumbLink to="/engagement-letters">Engagement Letters</BreadcrumbLink>
        <span>New</span>
      </Breadcrumbs>

      <Title order={2} mb="lg">
        Create Engagement Letter
      </Title>

      <Paper shadow="sm" p="md" radius="md">
        <EngagementLetterForm
          initialData={initialData}
          proposal={proposal}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          mode="create"
        />
      </Paper>
    </Container>
  );
}