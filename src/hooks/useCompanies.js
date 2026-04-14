import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import API_CONFIG from '../api/config';

export const useCompanies = () => {
    return useQuery({
        queryKey: ['companies'],
        queryFn: async () => {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.COMPANIES);
            return response.data;
        },
    });
};

export const useCreateCompany = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post(API_CONFIG.ENDPOINTS.COMPANIES, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });
};

export const useUpdateCompany = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await apiClient.patch(`${API_CONFIG.ENDPOINTS.COMPANIES}/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });
};

export const useDeleteCompany = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.COMPANIES}/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });
};
