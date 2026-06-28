import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveTwoFactorRequest,
  createTwoFactorRequest,
  getTwoFactorRequests,
  rejectTwoFactorRequest,
} from '../api/services/twoFactorRequests.js';

const QUERY_KEY = ['two-factor-requests'];

export function useTwoFactorRequests(options = {}) {
  return useQuery({ queryKey: QUERY_KEY, queryFn: getTwoFactorRequests, ...options });
}

export function useCreateTwoFactorRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTwoFactorRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useApproveTwoFactorRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNotes }) => approveTwoFactorRequest(id, adminNotes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useRejectTwoFactorRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNotes }) => rejectTwoFactorRequest(id, adminNotes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
