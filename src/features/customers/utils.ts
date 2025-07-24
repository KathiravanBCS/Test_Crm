import { Customer } from '@/types/customer';
import { CustomerType } from '@/types/common';

export const getCustomerTypeLabel = (type: CustomerType): string => {
  switch (type) {
    case 'direct':
      return 'Direct Customer';
    case 'partner_referred':
      return 'Partner Referred';
    case 'partner_managed':
      return 'Partner Managed';
    default:
      return type;
  }
};

export const getCustomerTypeColor = (type: CustomerType): string => {
  switch (type) {
    case 'direct':
      return 'blue';
    case 'partner_referred':
      return 'green';
    case 'partner_managed':
      return 'orange';
    default:
      return 'gray';
  }
};

export const getCustomerTypeDescription = (type: CustomerType): string => {
  switch (type) {
    case 'direct':
      return 'Customer directly engaged with VSTN';
    case 'partner_referred':
      return 'Customer referred by a partner, invoiced by VSTN';
    case 'partner_managed':
      return 'Customer managed by partner, partner invoices the customer';
    default:
      return '';
  }
};

export const isPartnerRequired = (type: CustomerType): boolean => {
  return type === 'partner_referred' || type === 'partner_managed';
};

export const canDeleteCustomer = (customer: Customer): boolean => {
  // Cannot delete if customer has active proposals or engagements
  const hasActiveProposals = customer.proposals?.some(p => 
    ['Draft', 'Submitted', 'Under Review', 'Negotiation'].includes(p.statusId.toString())
  );
  
  const hasActiveEngagements = customer.engagementLetters?.some(e => 
    e.statusId === 15 // Active status
  );
  
  return !hasActiveProposals && !hasActiveEngagements;
};