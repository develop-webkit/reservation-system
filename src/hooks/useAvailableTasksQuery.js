import { useQuery } from '@tanstack/react-query';
import { getAvailableTasks } from '../api/services/tasks.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useAvailableTasksQuery(filters) {
  return useQuery({
    queryKey: queryKeys.availableTasks(filters),
    queryFn: () => getAvailableTasks(filters),
  });
}
