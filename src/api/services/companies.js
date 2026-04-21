import apiClient from '../client';
import API_CONFIG from '../config';

const companiesApi = {
    getAll: async (params = {}) => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.COMPANIES, { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.COMPANIES}/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.COMPANIES, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.patch(`${API_CONFIG.ENDPOINTS.COMPANIES}/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.COMPANIES}/${id}`);
        return response.data;
    }
};

export default companiesApi;
