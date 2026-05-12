import { useQuery } from '@tanstack/react-query';
import { getAssignments } from '../api/services/housekeeping.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useHousekeepingAssignmentsQuery(filters) {
  return useQuery({
    queryKey: queryKeys.housekeepingAssignments(
      filters?.date,
      filters?.housekeeperId,
    ),
    queryFn: () => getAssignments(filters),
  });
}
