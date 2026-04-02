import apiClient from '../client';
import API_CONFIG from '../config';

const authApi = {
    /**
     * Login with credentials
     * @param {Object} credentials - { clientNumber, username, password }
     */
    login: async (credentials) => {
        const response = await apiClient.post(`${API_CONFIG.ENDPOINTS.AUTH}/login`, credentials);
        return response.data;
    },

    /**
     * Request password reset via email
     * @param {Object} data - { email }
     */
    forgotPassword: async (data) => {
        const response = await apiClient.post(`${API_CONFIG.ENDPOINTS.AUTH}/forgot-password`, data);
        return response.data;
    },

    /**
     * Reset password with reset token
     * @param {Object} data - { token, password }
     */
    resetPassword: async (data) => {
        const response = await apiClient.post(`${API_CONFIG.ENDPOINTS.AUTH}/reset-password`, data);
        return response.data;
    },

    /**
     * Logout (clear token)
     */
    logout: async () => {
        const response = await apiClient.post(`${API_CONFIG.ENDPOINTS.AUTH}/logout`);
        return response.data;
    }
};

export default authApi;
