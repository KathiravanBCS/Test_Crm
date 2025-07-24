import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Paper, Breadcrumbs, Skeleton, Alert } from '@mantine/core';
import { BreadcrumbLink } from '@/components/navigation/BreadcrumbLink';
import { IconAlertCircle } from '@tabler/icons-react';
import { EngagementLetterForm } from '../components/EngagementLetterForm';
import { useGetEngagementLetter } from '../api/useGetEngagementLetter';
import { useUpdateEngagementLetter } from '../api/useUpdateEngagementLetter';
import { useGetProposal } from '@/features/proposals/api/useGetProposal';
import type { EngagementLetterFormData, SelectedServiceItem } from '../types';

export function EngagementLetterEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const engagementLetterId = id ? parseInt(id) : undefined;

  const { data: engagementLetter, isLoading, error } = useGetEngagementLetter(engagementLetterId);
  const { data: proposal } = useGetProposal(engagementLetter?.proposalId);
  const updateMutation = useUpdateEngagementLetter();

  const handleSubmit = (data: EngagementLetterFormData) => {
    if (!engagementLetterId) return;

    updateMutation.mutate(
      { id: engagementLetterId, data },
      {
        onSuccess: () => {
          navigate(`/engagement-letters/${engagementLetterId}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container size="xl">
        <Skeleton height={50} mb="md" />
        <Skeleton height={30} width={200} mb="lg" />
        <Paper shadow="sm" p="md" radius="md">
          <Skeleton height={400} />
        </Paper>
      </Container>
    );
  }

  if (error || !engagementLetter) {
    return (
      <Container size="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          mb="lg"
        >
          Failed to load engagement letter details
        </Alert>
      </Container>
    );
  }

  // Determine engagement target based on proposal
  const engagementTarget = proposal?.proposal_target || 
    (engagementLetter.partnerId && !engagementLetter.customerId ? 'partner' : 'customer');

  const initialData: EngagementLetterFormData = {
    engagementTarget,
    proposalId: engagementLetter.proposalId,
    customerId: engagementLetter.customerId,
    partnerId: engagementLetter.partnerId,
    targetCustomerId: engagementTarget === 'partner' ? engagementLetter.customerId : undefined,
    engagementLetterTitle: engagementLetter.engagementLetterTitle,
    engagementLetterDescription: engagementLetter.engagementLetterDescription,
    currencyCode: engagementLetter.currencyCode,
    engagementResourceId: engagementLetter.engagementResourceId,
    scopeOfWork: engagementLetter.scopeOfWork,
    deliverables: engagementLetter.deliverables,
    timelines: engagementLetter.timelines,
    paymentTerms: engagementLetter.paymentTerms,
    specialConditions: engagementLetter.specialConditions,
    termsAndConditions: engagementLetter.termsAndConditions,
    paymentRequiredPercentageBeforeWorkStart:
      engagementLetter.paymentRequiredPercentageBeforeWorkStart || 0,
    selectedServiceItems: (engagementLetter.serviceItems || []).map(
      (item): SelectedServiceItem => ({
        proposalServiceItemId: item.proposalServiceItemId || 0,
        serviceName: item.serviceName,
        serviceDescription: item.serviceDescription,
        serviceRate: item.serviceRate,
        originalRate: item.serviceRate,
      })
    ),
  };

  return (
    <Container size="xl">
      <Breadcrumbs mb="md">
        <BreadcrumbLink to="/">Home</BreadcrumbLink>
        <BreadcrumbLink to="/engagement-letters">Engagement Letters</BreadcrumbLink>
        <span>Edit</span>
      </Breadcrumbs>

      <Title order={2} mb="lg">
        Edit Engagement Letter: {engagementLetter.engagementLetterCode}
      </Title>

      <Paper shadow="sm" p="md" radius="md">
        <EngagementLetterForm
          initialData={initialData}
          engagementLetter={engagementLetter}
          proposal={proposal}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          mode="edit"
        />
      </Paper>
    </Container>
  );
}