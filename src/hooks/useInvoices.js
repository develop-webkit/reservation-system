import { useQuery, useQueryClient } from '@tanstack/react-query';
import invoicesApi from '../api/services/invoices.js';
import { useAppMutation } from './useAppMutation.js';

export const invoiceKeys = {
  all: ['invoices'],
  lists: () => [...invoiceKeys.all, 'list'],
  list: (filters) => [...invoiceKeys.lists(), filters],
  details: () => [...invoiceKeys.all, 'detail'],
  detail: (id) => [...invoiceKeys.details(), id],
};

export function useInvoices(filters = {}) {
  return useQuery({
    queryKey: invoiceKeys.list(filters),
    queryFn: () => invoicesApi.getAll(filters),
  });
}

export function useInvoice(id) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => invoicesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useAppMutation({
    mutationFn: invoicesApi.create,
    successMessage: 'Invoice saved successfully.',
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.setQueryData(invoiceKeys.detail(data._id), data);
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useAppMutation({
    mutationFn: ({ id, data }) => invoicesApi.update(id, data),
    successMessage: 'Invoice updated successfully.',
    onSuccess: (data, variables) => {
      queryClient.setQueryData(invoiceKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useAppMutation({
    mutationFn: invoicesApi.delete,
    successMessage: 'Invoice deleted.',
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: invoiceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
}
