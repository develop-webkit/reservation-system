import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API_CONFIG from '../api/config';
import apiClient from '../api/client';

export const useGroups = () => {
    return useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.GROUPS);
            return response.data;
        },
    });
};

export const useCreateGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post(API_CONFIG.ENDPOINTS.GROUPS, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};

export const useUpdateGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.GROUPS}/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};
