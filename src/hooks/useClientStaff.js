import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createClientStaff,
  deactivateClientStaff,
  deleteClientStaff,
  getClientStaff,
  updateClientStaff,
} from '../api/services/clientStaff.js';

const QUERY_KEY = ['client-staff'];

export function useClientStaff(linkedClientNo) {
  return useQuery({
    queryKey: [...QUERY_KEY, linkedClientNo ?? null],
    queryFn: () => getClientStaff(linkedClientNo),
  });
}

export function useCreateClientStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClientStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateClientStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateClientStaff(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeactivateClientStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateClientStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteClientStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClientStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
