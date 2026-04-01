import apiClient from '../client';
import API_CONFIG from '../config';

/**
 * Bookings API Service
 * Uses real API endpoints from the backend
 */

const bookingsApi = {
    /**
     * Get all bookings with optional filters
     * @param {Object} filters - { roomId, status, checkIn, checkOut, showCanceled, showParked }
     * @returns {Promise<{data: Array, total: number}>}
     */
    getAll: async (filters = {}) => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.BOOKINGS, {
            params: filters,
        });
        return response.data;
    },

    /**
     * Get booking chart data
     * @param {Object} params - { startDate, endDate, showCanceled, showParked }
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
     * @param {string} id - Booking ID
     * @returns {Promise<{data: Object}>}
     */
    getById: async (id) => {
        const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}`);
        return response.data;
    },

    /**
     * Get booking status
     * @param {string} id
     * @returns {Promise<{status: string}>}
     */
    getStatus: async (id) => {
        const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}/status`);
        return response.data;
    },

    /**
     * Update booking status
     * @param {string} id
     * @param {string} status
     * @returns {Promise<{data: Object}>}
     */
    updateStatus: async (id, status) => {
        const response = await apiClient.patch(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}/status`, { status });
        return response.data;
    },

    /**
     * Create new booking
     * @param {Object} bookingData - Booking data (reservationId, roomId, startDate, endDate, etc.)
     * @returns {Promise<{data: Object}>}
     */
    create: async (bookingData) => {
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.BOOKINGS, bookingData);
        return response.data;
    },

    /**
     * Update existing booking
     * @param {string} id - Booking ID
     * @param {Object} bookingData - Updated booking data
     * @returns {Promise<{data: Object}>}
     */
    update: async (id, bookingData) => {
        const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}`, bookingData);
        return response.data;
    },

    /**
     * Delete booking
     * @param {string} id - Booking ID
     * @returns {Promise<{data: Object}>}
     */
    delete: async (id) => {
        const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${id}`);
        return response.data;
    },
};

export default bookingsApi;
