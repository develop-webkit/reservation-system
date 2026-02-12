import apiClient from '../client';
import mockApi from '../mockApi';
import API_CONFIG from '../config';

/**
 * Bookings API Service
 * Automatically switches between mock and real API based on configuration
 */

const bookingsApi = {
    /**
     * Get all bookings with optional filters
     * @param {Object} filters - { roomId, status, checkIn, checkOut }
     * @returns {Promise<{data: Array, total: number}>}
     */
    getAll: async (filters = {}) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.bookings.getAll(filters);
        }
        
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.BOOKINGS, {
            params: filters,
        });
        return response.data;
    },
    
    /**
     * Get booking chart data
     * @param {Object} params - { startDate, endDate }
     * @returns {Promise<Array>}
     */
    getChart: async (params = {}) => {
         const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.BOOKINGS}/chart`, {
             params: params
         });
         return response.data;
    },

    /**
     * Update booking chart (drag and drop)
     * @param {Object} data - { bookingId, roomId, checkIn, checkOut }
     * @returns {Promise<{data: Object}>}
     */
    updateChart: async (data) => {
        const response = await apiClient.patch(`${API_CONFIG.ENDPOINTS.BOOKINGS}/chart`, data);
        return response.data;
    },

    /**
     * Get single booking by ID
     * @param {number|string} id - Booking ID
     * @returns {Promise<{data: Object}>}
     */
    getById: async (id) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.bookings.getById(id);
        }
        
        const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}`);
        return response.data;
    },
    
    /**
     * Get booking status
     * @param {number|string} id 
     * @returns {Promise<{status: string}>}
     */
    getStatus: async (id) => {
        const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}/status`);
        return response.data;
    },

    /**
     * Update booking status
     * @param {number|string} id 
     * @param {string} status 
     * @returns {Promise<{data: Object}>}
     */
    updateStatus: async (id, status) => {
        const response = await apiClient.patch(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}/status`, { status });
        return response.data;
    },

    /**
     * Create new booking
     * @param {Object} bookingData - Booking data
     * @returns {Promise<{data: Object}>}
     */
    create: async (bookingData) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.bookings.create(bookingData);
        }
        
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.BOOKINGS, bookingData);
        return response.data;
    },
    
    /**
     * Update existing booking
     * @param {number|string} id - Booking ID
     * @param {Object} bookingData - Updated booking data
     * @returns {Promise<{data: Object}>}
     */
    update: async (id, bookingData) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.bookings.update(id, bookingData);
        }
        
        const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}`, bookingData);
        return response.data;
    },
    
    /**
     * Delete booking
     * @param {number|string} id - Booking ID
     * @returns {Promise<{data: Object}>}
     */
    delete: async (id) => {
        if (API_CONFIG.USE_MOCK_API) {
            return mockApi.bookings.delete(id);
        }
        
        const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}`);
        return response.data;
    },
};

export default bookingsApi;
