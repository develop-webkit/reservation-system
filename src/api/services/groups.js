import apiClient from '../client';
import API_CONFIG from '../config';

const groupsApi = {
    getAll: async (params = {}) => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.GROUPS, { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.GROUPS}/${id}`);
        return response.data;
    },
    getSiblings: async (id) => {
        const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.GROUPS}/${id}/siblings`);
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.GROUPS, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.GROUPS}/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.GROUPS}/${id}`);
        return response.data;
    }
};

export default groupsApi;
