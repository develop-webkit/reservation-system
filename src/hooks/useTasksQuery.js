import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bulkUpdateTasks, getTasks } from '../api/services/tasks.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useTasksQuery() {
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: getTasks,
  });
}

export function useBulkUpdateTasks(onSuccess) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, updates }) => bulkUpdateTasks(ids, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms });
      queryClient.invalidateQueries({ queryKey: ['housekeeping'] });
      onSuccess?.();
    },
  });
}
