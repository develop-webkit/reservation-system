import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clientGroupsApi from '../api/services/clientGroups.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useClientGroups() {
  return useQuery({
    queryKey: queryKeys.clientGroups,
    queryFn: clientGroupsApi.getAll,
  });
}

export function useCreateClientGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientGroupsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.clientGroups }),
  });
}

export function useUpdateClientGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => clientGroupsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.clientGroups }),
  });
}

export function useDeleteClientGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => clientGroupsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.clientGroups }),
  });
}

export function useSearchGroupMembers(q, clientNo) {
  return useQuery({
    queryKey: [...queryKeys.clientGroups, 'members', q, clientNo],
    queryFn: () => clientGroupsApi.searchMembers(q, clientNo),
    enabled: Boolean(q && q.trim().length >= 1),
  });
}
