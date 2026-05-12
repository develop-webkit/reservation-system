import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/services/dashboard.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboardStats,
  });
}
