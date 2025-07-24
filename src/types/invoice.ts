import type { BaseEntity } from './common';

export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  issuedTo: string;
  issuedToType: 'customer' | 'partner';
  statusId: number;
  currencyCode: string;
  exchangeRateToInr?: number;
  exchangeRateDate?: Date;
  amountInr?: number;
  notes?: string;
}