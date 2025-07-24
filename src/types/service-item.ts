// Service Item types for Proposals, Engagement Letters, and Engagements
import type { CurrencyCode } from './common';

export interface MasterService {
  id: number;
  name: string;
  description?: string;
  default_rate: number;
  category: string;
  is_active: boolean;
}

export interface ServiceItem {
  id: number;
  code: string;                          // e.g., 'TP-001'
  name: string;                          // e.g., 'Transfer Pricing Documentation'
  description?: string;
  default_price: number;
  currency_code: CurrencyCode;
  category: 'tax' | 'compliance' | 'audit' | 'transfer_pricing' | 'advisory' | 'other';
  is_active: boolean;
  has_sub_items: boolean;                // Indicates if item has sub-items
  parent_id?: number;                    // For sub-items, references parent
  master_service_id?: number;            // Reference to master_service table
}

export interface ServiceItemWithSubItems extends ServiceItem {
  sub_items?: ServiceItem[];             // Child service items
}

// Used in forms when selecting/managing service items
export interface ServiceItemLineItem {
  id: string;                            // Client-side generated ID
  service_item_id: number;               // Reference to ServiceItem
  service_item_name: string;             // Denormalized for performance
  service_item_code: string;             // Denormalized for performance
  description?: string;                  // Custom description for this instance
  original_price: number;                // From ServiceItem
  negotiated_price: number;              // After discounts/negotiations
  currency_code: CurrencyCode;
  price_source: 'default' | 'partner' | 'custom';
  partner_id?: number;                   // If partner discount applied
  sub_items?: ServiceItemLineItem[];     // Selected sub-items for packages
  
  // Added in engagement letter
  final_price?: number;
  exchange_rate_to_inr?: number;
  exchange_rate_date?: Date;
  price_inr?: number;
  
  // Added in engagement
  assigned_to?: number;                  // Employee ID
  status_id?: number;                    // From master_status
  delivery_notes?: string;
}

// For API responses
export interface ProposalServiceItem {
  id: number;
  name: string;
  description?: string;
}

export interface EngagementLetterServiceItem {
  id: number;
  master_service_id?: number;
  name: string;
  description?: string;
  amount: number;
  currency_code: CurrencyCode;
  exchange_rate_to_inr?: number;
  exchange_rate_date?: Date;
  amount_inr?: number;
}

// Filters for service catalog
export interface ServiceItemFilters {
  search?: string;
  is_active?: boolean;
  category?: ServiceItem['category'];
  parent_only?: boolean;                 // Show only parent items (not sub-items)
}

// Partner pricing
export interface PartnerCommission {
  id: number;
  partner_id: number;
  default_commission_percentage: number;
  is_active: boolean;
}