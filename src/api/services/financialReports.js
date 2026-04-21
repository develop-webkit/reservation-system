import apiClient from '../client';
import API_CONFIG from '../config';

const financialReportsApi = {
    getReservations: async (filters = {}) => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.RESERVATIONS, {
            params: filters,
        });
        return response.data;
    },

    getAccounting: async (filters = {}) => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.ACCOUNTING, {
            params: filters,
        });
        return response.data;
    },

    getBookings: async (filters = {}) => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.BOOKINGS, {
            params: filters,
        });
        return response.data;
    },

    getRooms: async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.ROOMS);
        return response.data;
    },
};

export default financialReportsApi;
