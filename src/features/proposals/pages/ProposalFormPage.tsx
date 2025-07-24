import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, Stepper, Group, Button, Paper, Stack, LoadingOverlay, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconArrowLeft, IconSend } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useGetProposal } from '../api/useGetProposal';
import { useCreateProposal } from '../api/useCreateProposal';
import { useUpdateProposal } from '../api/useUpdateProposal';
import { TargetSelectionStep } from '../components/steps/TargetSelectionStep';
import { ProposalDetailsStep } from '../components/steps/ProposalDetailsStep';
import { ServiceSelectionStep } from '../components/steps/ServiceSelectionStep';
import { TermsAndBillingStep } from '../components/steps/TermsAndBillingStep';
import { ReviewAndSubmitStep } from '../components/steps/ReviewAndSubmitStep';
import type { ServiceItemLineItem } from '@/types/service-item';
import type { Proposal, ProposalTarget } from '../types';
import type { CurrencyCode } from '@/types/common';
import { toCurrencyCode } from '@/types/common';

interface ProposalFormValues {
  // Target selection
  proposal_target: ProposalTarget;
  customer?: any;
  customer_id?: number;
  partner?: any;
  partner_id?: number;
  
  // Basic info
  proposal_name?: string;
  proposal_date: Date;
  valid_until: Date;
  currency_code: CurrencyCode;
  
  // Team
  assigned_to?: number[];
  next_follow_up_date?: Date;
  
  // Content
  service_items: ServiceItemLineItem[];
  terms_and_conditions?: string;
  additional_clauses?: string;
  notes?: string;
  
  // Calculated
  total_amount?: number;
}

export function ProposalFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;
  const proposalId = parseInt(id || '0');
  const duplicateFromId = location.state?.duplicateFrom;
  
  const [active, setActive] = useState(0);
  
  const { data: existingProposal, isLoading: isLoadingProposal } = useGetProposal(proposalId);
  const { data: duplicateProposal, isLoading: isLoadingDuplicate } = useGetProposal(duplicateFromId);
  const createProposalMutation = useCreateProposal();
  const updateProposalMutation = useUpdateProposal();

  const form = useForm<ProposalFormValues>({
    initialValues: {
      proposal_target: 'customer',
      customer: undefined,
      customer_id: undefined,
      partner: undefined,
      partner_id: undefined,
      proposal_name: '',
      proposal_date: new Date(),
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      currency_code: 'INR',
      assigned_to: [],
      service_items: [],
      terms_and_conditions: `Standard terms and conditions apply.

1. Payment Terms: 50% advance, 50% on completion
2. Service delivery as per agreed timeline
3. Additional services will be charged separately
4. All applicable taxes extra as per actuals
5. Validity of this proposal is 30 days from the date of issue`,
      notes: '',
    },
    validate: {
      customer_id: (value, values) => {
        if (values.proposal_target === 'customer' && !value) {
          return 'Customer is required';
        }
        return null;
      },
      partner_id: (value, values) => {
        if (values.proposal_target === 'partner' && !value) {
          return 'Partner is required';
        }
        return null;
      },
      proposal_name: (value) => !value || value.trim() === '' ? 'Proposal name is required' : null,
      service_items: (value) => value.length === 0 ? 'At least one service item is required' : null,
      proposal_date: (value) => !value ? 'Proposal date is required' : null,
      valid_until: (value, values) => {
        if (!value) return 'Valid until date is required';
        if (values.proposal_date && new Date(value) <= new Date(values.proposal_date)) {
          return 'Valid until date must be after proposal date';
        }
        return null;
      },
    }
  });

  // Load existing proposal data
  useEffect(() => {
    if (existingProposal && isEditMode) {
      form.setValues({
        proposal_target: existingProposal.proposal_target || 'customer',
        customer: existingProposal.customer,
        customer_id: existingProposal.customer_id,
        partner: existingProposal.partner,
        partner_id: existingProposal.partner_id,
        proposal_name: existingProposal.proposal_number || '',
        proposal_date: existingProposal.proposal_date ? new Date(existingProposal.proposal_date) : new Date(),
        valid_until: existingProposal.valid_until ? new Date(existingProposal.valid_until) : new Date(),
        currency_code: toCurrencyCode(existingProposal.currency_code),
        service_items: existingProposal.service_items || [],
        notes: existingProposal.notes || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingProposal, isEditMode]); // form excluded to prevent infinite loops

  // Load duplicate proposal data
  useEffect(() => {
    if (duplicateProposal && duplicateFromId) {
      form.setValues({
        proposal_target: duplicateProposal.proposal_target || 'customer',
        customer: duplicateProposal.customer,
        customer_id: duplicateProposal.customer_id,
        partner: duplicateProposal.partner,
        partner_id: duplicateProposal.partner_id,
        proposal_name: `Copy of ${duplicateProposal.proposal_number || 'Proposal'}`,
        proposal_date: new Date(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        currency_code: toCurrencyCode(duplicateProposal.currency_code),
        service_items: duplicateProposal.service_items || [],
        notes: duplicateProposal.notes || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duplicateProposal, duplicateFromId]); // form excluded to prevent infinite loops

  const handleSubmit = form.onSubmit((values) => {
    const proposalData: Partial<Proposal> = {
      proposal_target: values.proposal_target,
      customer_id: values.proposal_target === 'customer' ? values.customer_id : undefined,
      partner_id: values.proposal_target === 'partner' ? values.partner_id : undefined,
      proposal_date: values.proposal_date,
      valid_until: values.valid_until,
      total_amount: values.service_items.reduce((sum, item) => sum + item.negotiated_price, 0),
      currency_code: values.currency_code,
      notes: values.notes,
      service_items: values.service_items,
      clauses: values.additional_clauses ? [{
        id: 1,
        proposal_id: proposalId || 0,
        title: 'Additional Clauses',
        content: values.additional_clauses,
        sequence: 1
      }] : []
    };

    if (isEditMode) {
      updateProposalMutation.mutate(
        { id: proposalId, data: proposalData },
        {
          onSuccess: () => {
            notifications.show({
              title: 'Success',
              message: 'Proposal updated successfully',
              color: 'green',
            });
            navigate(`/proposals/${proposalId}`);
          }
        }
      );
    } else {
      createProposalMutation.mutate(proposalData, {
        onSuccess: (newProposal: any) => {
          notifications.show({
            title: 'Success',
            message: 'Proposal created successfully',
            color: 'green',
          });
          navigate(`/proposals/${newProposal.id}`);
        }
      });
    }
  });

  const isLoading = isLoadingProposal || isLoadingDuplicate || createProposalMutation.isPending || updateProposalMutation.isPending;

  const steps = [
    { label: 'Target Selection', description: 'Choose recipient' },
    { label: 'Proposal Details', description: 'Basic information' },
    { label: 'Service Items', description: 'Add services' },
    { label: 'Terms & Conditions', description: 'Payment terms' },
    { label: 'Review', description: 'Review and submit' }
  ];

  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        <Group justify="space-between">
          <Title order={2}>{isEditMode ? 'Edit Proposal' : 'Create New Proposal'}</Title>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate('/proposals')}
          >
            Back to Proposals
          </Button>
        </Group>

        <Paper withBorder p="xl">
          <Stack gap="xl">
            <Stepper active={active} onStepClick={setActive}>
              {steps.map((step, index) => (
                <Stepper.Step
                  key={index}
                  label={step.label}
                  description={step.description}
                  allowStepSelect={active > index}
                />
              ))}
              <Stepper.Completed>
                Completed! Review your proposal and submit.
              </Stepper.Completed>
            </Stepper>

            {/* Step Content */}
            <div style={{ minHeight: 400 }}>
              {active === 0 && <TargetSelectionStep form={form} />}
              {active === 1 && <ProposalDetailsStep form={form} />}
              {active === 2 && <ServiceSelectionStep form={form} />}
              {active === 3 && <TermsAndBillingStep form={form} />}
              {active === 4 && <ReviewAndSubmitStep form={form} />}
            </div>

            {/* Navigation */}
            <Group justify="space-between">
              <Button
                variant="default"
                onClick={() => setActive((current) => (current > 0 ? current - 1 : current))}
                disabled={active === 0}
              >
                Back
              </Button>

              <Group>
                {active < steps.length - 1 && (
                  <Button
                    onClick={() => setActive((current) => (current < steps.length ? current + 1 : current))}
                    disabled={active === steps.length - 1}
                  >
                    Next
                  </Button>
                )}

                {active === steps.length - 1 && (
                  <Button
                    onClick={() => handleSubmit()}
                    loading={isLoading}
                    leftSection={<IconSend size={16} />}
                  >
                    {isEditMode ? 'Update Proposal' : 'Create Proposal'}
                  </Button>
                )}
              </Group>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}