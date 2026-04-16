import apiClient from '../client';
import mockApi from '../mockApi';
import API_CONFIG from '../config';

/**
 * Users/Customers API Service
 */
const usersApi = {
    /**
     * Get all users
     */
    getAll: async (params = {}) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.users.getAll();
        }
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.USER, { params });
        console.log('[UsersAPI] getAll response:', response.data);
        return Array.isArray(response.data) ? response.data : [response.data];
    },

    /**
     * Get user by ID
     */
    getById: async (id) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.users.getById(id);
        }
        const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.USER}/${id}`);
        return response.data;
    },

    /**
     * Create a new user (Admin only)
     */
    create: async (userData) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.users.create(userData);
        }
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.USER, userData);
        return response.data;
    },

    /**
     * Update an existing user
     */
    update: async (id, userData) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.users.update(id, userData);
        }
        const response = await apiClient.patch(`${API_CONFIG.ENDPOINTS.USER}/${id}`, userData);
        return response.data;
    },

    /**
     * Delete a user
     */
    delete: async (id) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.users.delete(id);
        }
        const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.USER}/${id}`);
        return response.data;
    }
};

export default usersApi;
