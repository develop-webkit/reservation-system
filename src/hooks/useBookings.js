import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import bookingsApi from '../api/services/bookings';

/**
 * Query keys for bookings
 */
export const bookingKeys = {
    all: ['bookings'],
    lists: () => [...bookingKeys.all, 'list'],
    list: (filters) => [...bookingKeys.lists(), filters],
    details: () => [...bookingKeys.all, 'detail'],
    detail: (id) => [...bookingKeys.details(), id],
    chart: (params) => [...bookingKeys.all, 'chart', params],
};

/**
 * Hook to fetch all bookings
 * @param {Object} filters - Optional filters
 * @returns {QueryResult}
 */
export const useBookings = (filters = {}) => {
    return useQuery({
        queryKey: bookingKeys.list(filters),
        queryFn: () => bookingsApi.getAll(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook to fetch single booking
 * @param {number|string} id - Booking ID
 * @returns {QueryResult}
 */
export const useBooking = (id) => {
    return useQuery({
        queryKey: bookingKeys.detail(id),
        queryFn: () => bookingsApi.getById(id),
        enabled: !!id, // Only fetch if ID exists
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Hook to fetch booking chart data
 * @param {Object} params - { startDate, endDate }
 * @returns {QueryResult}
 */
export const useBookingChart = (params) => {
    return useQuery({
        queryKey: bookingKeys.chart(params),
        queryFn: () => bookingsApi.getChart(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook to create new booking
 * @returns {MutationResult}
 */
export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (bookingData) => bookingsApi.create(bookingData),
        onSuccess: () => {
            // Invalidate and refetch bookings list
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
        },
    });
};

/**
 * Hook to update booking
 * @returns {MutationResult}
 */
export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }) => bookingsApi.update(id, data),
        onSuccess: (data, variables) => {
            // Update the specific booking in cache
            queryClient.setQueryData(bookingKeys.detail(variables.id), data);
            // Invalidate lists to refetch
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
        },
    });
};

/**
 * Hook to update booking via chart (drag/drop)
 * @returns {MutationResult}
 */
export const useUpdateBookingChart = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data) => bookingsApi.updateChart(data),
        onSuccess: () => {
             // Invalidate list and chart queries
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['bookings', 'chart'] });
        },
    });
};

/**
 * Hook to update booking status
 * @returns {MutationResult}
 */
export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, status }) => bookingsApi.updateStatus(id, status),
        onSuccess: (data, variables) => {
             // Invalidate list and chart queries
            queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['bookings', 'chart'] });
        },
    });
};

/**
 * Hook to delete booking
 * @returns {MutationResult}
 */
export const useDeleteBooking = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id) => bookingsApi.delete(id),
        onSuccess: (data, id) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: bookingKeys.detail(id) });
            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
        },
    });
};
