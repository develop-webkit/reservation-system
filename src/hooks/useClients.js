import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clientsApi from '../api/services/clients';

export const clientKeys = {
    all: ['clients'],
    lists: () => [...clientKeys.all, 'list'],
    list: (filters) => [...clientKeys.lists(), filters],
    details: () => [...clientKeys.all, 'detail'],
    detail: (id) => [...clientKeys.details(), id],
};

export const useClients = (params = {}) => {
    return useQuery({
        queryKey: clientKeys.list(params),
        queryFn: () => clientsApi.getAll(params),
    });
};

export const useClient = (id) => {
    return useQuery({
        queryKey: clientKeys.detail(id),
        queryFn: () => clientsApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => clientsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
        },
    });
};

export const useUpdateClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => clientsApi.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
            queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) });
        },
    });
};

export const useDeleteClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => clientsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
        },
    });
};
