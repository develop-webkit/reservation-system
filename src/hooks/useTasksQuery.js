import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api/services/tasks.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useTasksQuery() {
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: getTasks,
  });
}
