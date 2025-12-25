import apiClient from '../client';
import mockApi from '../mockApi';
import API_CONFIG from '../config';

/**
 * Rooms API Service
 */

const roomsApi = {
    /**
     * Get all rooms with optional filters
     * @param {Object} filters - { category, status }
     * @returns {Promise<{data: Array, total: number}>}
     */
    getAll: async (filters = {}) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.rooms.getAll(filters);
        }
        
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.ROOMS, {
            params: filters,
        });
        return response.data;
    },
    
    /**
     * Get single room by ID
     * @param {string} id - Room ID
     * @returns {Promise<{data: Object}>}
     */
    getById: async (id) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.rooms.getById(id);
        }
        
        const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.ROOMS}/${id}`);
        return response.data;
    },
    
    /**
     * Update room status
     * @param {string} id - Room ID
     * @param {string} status - New status (CLEAN, DIRTY, INSPECT, OOO)
     * @returns {Promise<{data: Object}>}
     */
    updateStatus: async (id, status) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.rooms.updateStatus(id, status);
        }
        
        const response = await apiClient.patch(`${API_CONFIG.ENDPOINTS.ROOMS}/${id}/status`, {
            status,
        });
        return response.data;
    },
};

export default roomsApi;
