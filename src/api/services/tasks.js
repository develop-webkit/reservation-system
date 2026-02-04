import apiClient from '../client';
import API_CONFIG from '../config';

const tasksApi = {
    getAll: async (params = {}) => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.TASKS, { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.TASKS, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`);
        return response.data;
    }
};

export default tasksApi;
