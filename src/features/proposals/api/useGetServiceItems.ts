import { useQuery } from '@tanstack/react-query';
import type { ServiceItemWithSubItems, ServiceItemFilters, ServiceItem } from '@/types/service-item';
import { api } from '@/lib/api';

export const useGetServiceItems = (filters?: ServiceItemFilters) => {
  return useQuery<ServiceItemWithSubItems[]>({
    queryKey: ['serviceItems', filters],
    queryFn: () => filters ? api.serviceItems.getWithFilters(filters) : api.serviceItems.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetActiveServiceItems = () => {
  return useQuery<ServiceItemWithSubItems[]>({
    queryKey: ['serviceItems', 'active'],
    queryFn: () => api.serviceItems.getActiveItems(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetServiceItemsByCategory = (category: ServiceItem['category']) => {
  return useQuery<ServiceItemWithSubItems[]>({
    queryKey: ['serviceItems', 'category', category],
    queryFn: () => api.serviceItems.getByCategory(category),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!category,
  });
};