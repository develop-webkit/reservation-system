import { useQuery } from '@tanstack/react-query';
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
