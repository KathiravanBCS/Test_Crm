export interface MasterServiceItem {
  id: number;
  name: string;
  description?: string;
  defaultRate?: number;
  category?: string;
  isActive: boolean;
}

export interface MasterStatus {
  id: number;
  context: string;
  statusCode: string;
  statusName: string;
  sequence?: number;
  isFinal: boolean;
  isActive: boolean;
}

export interface MasterCurrency {
  code: string;
  name: string;
  symbol: string;
  isBaseCurrency: boolean;
}