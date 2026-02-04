import apiClient from '../client';
import API_CONFIG from '../config';

const authApi = {
    login: async (credentials) => {
        const response = await apiClient.post(`${API_CONFIG.ENDPOINTS.AUTH}/login`, credentials);
        return response.data;
    },
    // Add other auth methods if needed (logout, register, etc.)
};

export default authApi;
