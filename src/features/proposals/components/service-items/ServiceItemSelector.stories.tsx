import type { Meta, StoryObj } from '@storybook/react';
import { ServiceItemSelector } from './ServiceItemSelector';
import type { ServiceItem, ServiceItemLineItem } from '@/types/service-item';

const meta: Meta<typeof ServiceItemSelector> = {
  title: 'Proposals/ServiceItemSelector',
  component: ServiceItemSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockServices: ServiceItem[] = [
  {
    id: 1,
    code: 'TP-001',
    name: 'Transfer Pricing Documentation',
    description: 'Comprehensive transfer pricing documentation and analysis',
    default_price: 150000,
    currency_code: 'INR',
    category: 'transfer_pricing',
    is_active: true,
    has_sub_items: true,
  },
  {
    id: 2,
    code: 'TP-002',
    name: 'Benchmarking Analysis',
    description: 'Industry benchmarking and comparability analysis',
    default_price: 75000,
    currency_code: 'INR',
    category: 'transfer_pricing',
    is_active: true,
    has_sub_items: false,
  },
  {
    id: 3,
    code: 'AUD-001',
    name: 'Statutory Audit',
    description: 'Annual statutory audit services',
    default_price: 200000,
    currency_code: 'INR',
    category: 'audit',
    is_active: true,
    has_sub_items: true,
  },
  {
    id: 4,
    code: 'TAX-001',
    name: 'Tax Advisory',
    description: 'Corporate tax planning and advisory services',
    default_price: 100000,
    currency_code: 'INR',
    category: 'tax',
    is_active: true,
    has_sub_items: false,
  },
];

const mockSelectedItems: ServiceItemLineItem[] = [
  {
    id: 'item-1',
    service_item_id: 1,
    service_item_name: 'Transfer Pricing Documentation',
    service_item_code: 'TP-001',
    description: 'Custom description for this engagement',
    original_price: 150000,
    negotiated_price: 135000,
    currency_code: 'INR',
    price_source: 'partner',
  },
  {
    id: 'item-2',
    service_item_id: 2,
    service_item_name: 'Benchmarking Analysis',
    service_item_code: 'TP-002',
    original_price: 75000,
    negotiated_price: 67500,
    currency_code: 'INR',
    price_source: 'partner',
  },
];

export const Default: Story = {
  args: {
    availableItems: mockServices,
    selectedItems: mockSelectedItems,
    partnerDiscount: 10,
    onAddItem: (item: ServiceItem) => console.log('Add item:', item),
    onUpdateItem: (id: string, updates: Partial<ServiceItemLineItem>) => console.log('Update item:', id, updates),
    onRemoveItem: (id: string) => console.log('Remove item:', id),
    calculateEffectivePrice: (basePrice: number) => basePrice * 0.9,
    allowPriceOverride: true,
  },
};

export const WithPartnerDiscount: Story = {
  args: {
    availableItems: mockServices,
    selectedItems: mockSelectedItems,
    partnerDiscount: 15,
    onAddItem: (item: ServiceItem) => console.log('Add item:', item),
    onUpdateItem: (id: string, updates: Partial<ServiceItemLineItem>) => console.log('Update item:', id, updates),
    onRemoveItem: (id: string) => console.log('Remove item:', id),
    calculateEffectivePrice: (basePrice: number) => basePrice * 0.85,
    allowPriceOverride: true,
  },
};

export const ReadOnly: Story = {
  args: {
    availableItems: mockServices,
    selectedItems: mockSelectedItems,
    partnerDiscount: 10,
    onAddItem: (item: ServiceItem) => console.log('Add item:', item),
    onUpdateItem: (id: string, updates: Partial<ServiceItemLineItem>) => console.log('Update item:', id, updates),
    onRemoveItem: (id: string) => console.log('Remove item:', id),
    calculateEffectivePrice: (basePrice: number) => basePrice * 0.9,
    allowPriceOverride: false,
    readOnly: true,
  },
};

export const NoPriceOverride: Story = {
  args: {
    availableItems: mockServices,
    selectedItems: mockSelectedItems,
    partnerDiscount: 10,
    onAddItem: (item: ServiceItem) => console.log('Add item:', item),
    onUpdateItem: (id: string, updates: Partial<ServiceItemLineItem>) => console.log('Update item:', id, updates),
    onRemoveItem: (id: string) => console.log('Remove item:', id),
    calculateEffectivePrice: (basePrice: number) => basePrice * 0.9,
    allowPriceOverride: false,
  },
};

export const EmptyState: Story = {
  args: {
    availableItems: [],
    selectedItems: [],
    partnerDiscount: 0,
    onAddItem: (item: ServiceItem) => console.log('Add item:', item),
    onUpdateItem: (id: string, updates: Partial<ServiceItemLineItem>) => console.log('Update item:', id, updates),
    onRemoveItem: (id: string) => console.log('Remove item:', id),
    calculateEffectivePrice: (basePrice: number) => basePrice,
    allowPriceOverride: true,
  },
};