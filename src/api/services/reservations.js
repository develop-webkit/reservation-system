import apiClient from '../client';
import mockApi from '../mockApi';
import API_CONFIG from '../config';

/**
 * Reservations API Service
 */

const reservationsApi = {
    /**
     * Get all reservations with optional filters
     * @param {Object} filters - { status, clientId }
     * @returns {Promise<{data: Array, total: number}>}
     */
    getAll: async (filters = {}) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.reservations.getAll(filters);
        }
        
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.RESERVATIONS, {
            params: filters,
        });
        return response.data;
    },
    
    /**
     * Get single reservation by ID
     * @param {number|string} id - Reservation ID
     * @returns {Promise<{data: Object}>}
     */
    getById: async (id) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.reservations.getById(id);
        }
        
        const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.RESERVATIONS}/${id}`);
        return response.data;
    },
    
    /**
     * Create new reservation
     * @param {Object} reservationData - Reservation data
     * @returns {Promise<{data: Object}>}
     */
    create: async (reservationData) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.reservations.create(reservationData);
        }
        
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.RESERVATIONS, reservationData);
        return response.data;
    },
    
    /**
     * Update existing reservation
     * @param {number|string} id - Reservation ID
     * @param {Object} reservationData - Updated reservation data
     * @returns {Promise<{data: Object}>}
     */
    update: async (id, reservationData) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.reservations.update(id, reservationData);
        }
        
        const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.RESERVATIONS}/${id}`, reservationData);
        return response.data;
    },
    
    /**
     * Delete reservation
     * @param {number|string} id - Reservation ID
     * @returns {Promise<{data: Object}>}
     */
    delete: async (id) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.reservations.delete(id);
        }
        
        const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.RESERVATIONS}/${id}`);
        return response.data;
    },
};

export default reservationsApi;
