import { forwardRef } from 'react';
import { Select, type SelectProps } from '@mantine/core';
import { useGetProposals } from '@/features/proposals/api/useGetProposals';
import type { Proposal } from '@/features/proposals/types';

interface ProposalPickerProps extends Omit<SelectProps, 'data' | 'value' | 'onChange'> {
  value?: number | null;
  onChange?: (value: number | null, proposal?: Proposal) => void;
  filterStatus?: string;
  customerId?: number;
  partnerId?: number;
  proposalTarget?: 'customer' | 'partner';
}

export const ProposalPicker = forwardRef<HTMLInputElement, ProposalPickerProps>(
  ({ value, onChange, filterStatus, customerId, partnerId, proposalTarget, ...props }, ref) => {
    const { data: proposalsData, isLoading } = useGetProposals();
    const proposals = Array.isArray(proposalsData) ? proposalsData : [];

    const options = proposals
      .filter((proposal: Proposal) => {
        if (filterStatus) {
          const statusCode = proposal.status?.status_code?.toLowerCase();
          const filterStatusLower = filterStatus.toLowerCase();
          if (statusCode !== filterStatusLower) return false;
        }
        if (customerId) {
          const propCustomerId = proposal.customer_id || proposal.customerId;
          if (propCustomerId !== customerId) return false;
        }
        if (partnerId) {
          const propPartnerId = proposal.partner_id || proposal.partnerId;
          if (propPartnerId !== partnerId) return false;
        }
        if (proposalTarget) {
          if (proposal.proposal_target !== proposalTarget) return false;
        }
        return true;
      })
      .map((proposal: Proposal) => ({
        value: proposal.id.toString(),
        label: `${proposal.proposal_number || proposal.proposalCode || `PROP-${proposal.id}`} - ${proposal.proposalTitle || proposal.proposal_number || 'Untitled Proposal'}`,
        proposal,
      }));

    const handleChange = (val: string | null) => {
      if (!val) {
        onChange?.(null);
        return;
      }
      const selected = options.find((opt) => opt.value === val);
      onChange?.(parseInt(val), selected?.proposal);
    };

    return (
      <Select
        ref={ref}
        data={options}
        value={value?.toString() || null}
        onChange={handleChange}
        searchable
        disabled={isLoading}
        nothingFoundMessage="No proposals found"
        {...props}
      />
    );
  }
);

ProposalPicker.displayName = 'ProposalPicker';