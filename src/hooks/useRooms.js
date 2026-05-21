import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import roomsApi from '../api/services/rooms';

/**
 * Query keys for rooms
 */
export const roomKeys = {
    all: ['rooms'],
    lists: () => [...roomKeys.all, 'list'],
    list: (filters) => [...roomKeys.lists(), filters],
    details: () => [...roomKeys.all, 'detail'],
    detail: (id) => [...roomKeys.details(), id],
};

/**
 * Hook to fetch all rooms
 * @param {Object} filters - Optional filters
 * @returns {QueryResult}
 */
export const useRooms = (filters = {}) => {
    return useQuery({
        queryKey: roomKeys.list(filters),
        queryFn: () => roomsApi.getAll(filters),
        staleTime: 1000 * 60 * 10, // 10 minutes - rooms change less frequently
    });
};

/**
 * Hook to fetch single room
 * @param {string} id - Room ID
 * @returns {QueryResult}
 */
export const useRoom = (id) => {
    return useQuery({
        queryKey: roomKeys.detail(id),
        queryFn: () => roomsApi.getById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10,
    });
};

/**
 * Hook to update room status
 * @returns {MutationResult}
 */
export const useUpdateRoomStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }) => roomsApi.updateStatus(id, status),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(roomKeys.detail(variables.id), data);
            queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['bookings', 'chart'] });
        },
    });
};

/**
 * Hook to set a room as Out Of Service or Out Of Order
 * @returns {MutationResult}
 */
export const useUpdateRoomServiceStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, type, description }) =>
            roomsApi.updateServiceStatus(id, type, description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['bookings', 'chart'] });
        },
    });
};
