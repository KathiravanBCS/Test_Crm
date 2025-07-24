import { faker } from '@faker-js/faker';
import type { Proposal, ProposalStatus } from '@/features/proposals/types';
import type { ServiceItemLineItem } from '@/types/service-item';
import { masterStatuses, masterServices } from './master';
import { mockCustomers } from './customers';
import { mockEmployees } from './employees';

export function generateProposal(id: number, forceApproved: boolean = false): Proposal {
  const proposalTarget = faker.helpers.arrayElement(['customer', 'partner'] as const);
  const customer = proposalTarget === 'customer' ? faker.helpers.arrayElement(mockCustomers) : undefined;
  
  // Force approved status for some proposals
  const proposalStatuses = masterStatuses.filter(s => s.context === 'PROPOSAL');
  const approvedStatus = proposalStatuses.find(s => s.statusCode === 'approved');
  const status = forceApproved && approvedStatus 
    ? approvedStatus 
    : faker.helpers.arrayElement(proposalStatuses);
  
  const currency = faker.helpers.arrayElement(['INR', 'USD', 'AED'] as const);
  
  const serviceItems = generateServiceItems();
  const totalAmount = serviceItems.reduce((sum, item) => sum + item.negotiated_price, 0);
  
  return {
    id,
    proposal_target: proposalTarget,
    customer_id: customer?.id,
    partner_id: proposalTarget === 'partner' ? faker.helpers.arrayElement([101, 102, 103, 105, 106, 107, 109, 110]) : undefined,
    status_id: status.id,
    proposal_number: `PROP-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`,
    proposalTitle: `${proposalTarget === 'partner' ? 'Partner' : 'Customer'} Proposal - ${faker.company.catchPhrase()}`,
    proposal_date: faker.date.past({ years: 1 }),
    valid_until: faker.date.future({ years: 0.25 }),
    total_amount: totalAmount,
    currency_code: currency,
    notes: faker.helpers.maybe(() => faker.lorem.paragraph()),
    created_at: faker.date.past({ years: 1 }),
    updated_at: faker.date.recent({ days: 30 }),
    created_by: faker.helpers.arrayElement(mockEmployees).id,
    
    // Relations
    customer,
    status: {
      id: status.id,
      context: status.context,
      status_code: status.statusCode,
      status_name: status.statusName,
      sequence: status.sequence || 0,
      is_final: status.isFinal || false
    } as ProposalStatus,
    service_items: serviceItems,
  };
}

function generateServiceItems(): ServiceItemLineItem[] {
  const items: ServiceItemLineItem[] = [];
  const services = masterServices.filter(s => s.isActive);
  const itemCount = faker.number.int({ min: 2, max: 6 });
  
  for (let i = 0; i < itemCount; i++) {
    const service = faker.helpers.arrayElement(services);
    const originalPrice = faker.number.int({ min: 50000, max: 500000 });
    const discount = faker.number.int({ min: 0, max: 20 });
    
    items.push({
      id: `item-${i + 1}`,
      service_item_id: service.id,
      service_item_name: service.name,
      service_item_code: `SVC-${String(service.id).padStart(3, '0')}`,
      description: service.description || faker.lorem.sentence(),
      original_price: originalPrice,
      negotiated_price: originalPrice * (1 - discount / 100),
      currency_code: 'INR',
      price_source: discount > 0 ? 'partner' : 'default',
    });
  }
  
  return items;
}

// Generate mock proposals with more approved ones
export const mockProposals: Proposal[] = Array.from({ length: 30 }, (_, i) => {
  // Make proposals 1-15 approved (50% of total)
  const forceApproved = i < 15;
  return generateProposal(i + 1, forceApproved);
});