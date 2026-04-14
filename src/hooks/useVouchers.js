import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API_CONFIG from '../api/config';
import apiClient from '../api/client';

export const useVouchers = () => {
    return useQuery({
        queryKey: ['vouchers'],
        queryFn: async () => {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.VOUCHERS);
            return response.data;
        },
    });
};

export const useCreateVoucher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post(API_CONFIG.ENDPOINTS.VOUCHERS, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vouchers'] });
        },
    });
};

export const useUpdateVoucher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.VOUCHERS}/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vouchers'] });
        },
    });
};
