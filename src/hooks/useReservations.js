import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import reservationsApi from '../api/services/reservations';

/**
 * Query keys for reservations
 */
export const reservationKeys = {
    all: ['reservations'],
    lists: () => [...reservationKeys.all, 'list'],
    list: (filters) => [...reservationKeys.lists(), filters],
    details: () => [...reservationKeys.all, 'detail'],
    detail: (id) => [...reservationKeys.details(), id],
};

/**
 * Hook to fetch all reservations
 * @param {Object} filters - Optional filters
 * @returns {QueryResult}
 */
export const useReservations = (filters = {}) => {
    return useQuery({
        queryKey: reservationKeys.list(filters),
        queryFn: () => reservationsApi.getAll(filters),
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Hook to fetch single reservation
 * @param {number|string} id - Reservation ID
 * @returns {QueryResult}
 */
export const useReservation = (id) => {
    return useQuery({
        queryKey: reservationKeys.detail(id),
        queryFn: () => reservationsApi.getById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Hook to create new reservation
 * @returns {MutationResult}
 */
export const useCreateReservation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (reservationData) => reservationsApi.create(reservationData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
        },
    });
};

/**
 * Hook to update reservation
 * @returns {MutationResult}
 */
export const useUpdateReservation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }) => reservationsApi.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(reservationKeys.detail(variables.id), data);
            queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
        },
    });
};

/**
 * Hook to delete reservation
 * @returns {MutationResult}
 */
export const useDeleteReservation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id) => reservationsApi.delete(id),
        onSuccess: (data, id) => {
            queryClient.removeQueries({ queryKey: reservationKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
        },
    });
};
