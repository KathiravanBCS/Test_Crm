import { useQuery } from '@tanstack/react-query';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  isBaseCurrency: boolean;
}

// Mock data for now
const mockCurrencies: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', isBaseCurrency: true },
  { code: 'USD', name: 'United States Dollar', symbol: '$', isBaseCurrency: false },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', isBaseCurrency: false },
];

export function useGetCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockCurrencies;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - currencies don't change often
  });
}