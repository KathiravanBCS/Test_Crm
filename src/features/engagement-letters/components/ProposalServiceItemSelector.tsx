import type { SelectedServiceItem } from '../types';
import type { ProposalServiceItem } from '@/features/proposals/types';
import type { ServiceItemLineItem } from '@/types/service-item';
import { ServiceItemSelector } from './ServiceItemSelector';

interface ProposalServiceItemSelectorProps {
  proposalServiceItems: (ProposalServiceItem | ServiceItemLineItem)[];
  selectedItems: SelectedServiceItem[];
  onSelectionChange: (items: SelectedServiceItem[]) => void;
  currencyCode?: string;
}

export function ProposalServiceItemSelector({
  proposalServiceItems,
  selectedItems,
  onSelectionChange,
  currencyCode = 'INR',
}: ProposalServiceItemSelectorProps) {
  return (
    <ServiceItemSelector
      proposalServiceItems={proposalServiceItems}
      selectedItems={selectedItems}
      onSelectionChange={onSelectionChange}
      currencyCode={currencyCode}
    />
  );
}