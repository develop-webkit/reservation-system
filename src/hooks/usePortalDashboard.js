import { useQuery } from '@tanstack/react-query';
import { getPortalStats } from '../api/services/portal.js';

export function usePortalDashboard() {
  return useQuery({ queryKey: ['portal-stats'], queryFn: getPortalStats });
}
