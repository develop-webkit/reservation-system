import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import usersApi from '../api/services/users';

/**
 * Query keys for users
 */
export const userKeys = {
    all: ['users'],
    lists: () => [...userKeys.all, 'list'],
    list: (filters) => [...userKeys.lists(), filters],
    details: () => [...userKeys.all, 'detail'],
    detail: (id) => [...userKeys.details(), id],
};

/**
 * Hook to fetch all users/customers
 */
export const useUsers = () => {
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: usersApi.getAll,
    });
};

/**
 * Hook to fetch a single user/customer
 */
export const useUser = (id) => {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => usersApi.getById(id),
        enabled: !!id,
    });
};

/**
 * Hook to create a user
 */
export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userData) => usersApi.create(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
};

/**
 * Hook to update a user
 */
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, userData }) => usersApi.update(id, userData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
        },
    });
};

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => usersApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
};

/**
 * Hook for a Super Admin to reset (disable) another user's 2FA
 */
export const useResetUser2FA = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => usersApi.resetTwoFactor(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
        },
    });
};
