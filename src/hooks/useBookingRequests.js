import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveBookingRequest,
  cancelBookingRequest,
  createBookingRequest,
  getBookingRequests,
  rejectBookingRequest,
} from '../api/services/bookingRequests.js';

const QUERY_KEY = ['booking-requests'];

export function useBookingRequests() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: getBookingRequests });
}

export function useCreateBookingRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBookingRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useApproveBookingRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNotes }) => approveBookingRequest(id, adminNotes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useRejectBookingRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNotes }) => rejectBookingRequest(id, adminNotes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useCancelBookingRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBookingRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
