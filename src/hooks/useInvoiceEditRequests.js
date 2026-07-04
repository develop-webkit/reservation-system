import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveInvoiceEditRequest,
  createInvoiceEditRequest,
  getInvoiceEditRequests,
  rejectInvoiceEditRequest,
} from '../api/services/invoiceEditRequests.js';

const QUERY_KEY = ['invoice-edit-requests'];

export function useInvoiceEditRequests(options = {}) {
  return useQuery({ queryKey: QUERY_KEY, queryFn: getInvoiceEditRequests, ...options });
}

export function useCreateInvoiceEditRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInvoiceEditRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useApproveInvoiceEditRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNotes }) => approveInvoiceEditRequest(id, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useRejectInvoiceEditRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNotes }) => rejectInvoiceEditRequest(id, adminNotes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
