import { useQuery } from '@tanstack/react-query';
import { getRoster } from '../api/services/housekeeping.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useHousekeepingRosterQuery(date) {
  return useQuery({
    queryKey: queryKeys.housekeepingRoster(date),
    queryFn: () => getRoster(date),
    enabled: Boolean(date),
  });
}
