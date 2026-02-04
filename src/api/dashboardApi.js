import apiClient from './client';
import API_CONFIG from './config';

/**
 * Dashboard API Service
 */

// 1. Get dashboard statistics
export const fetchQuickCounts = async () => {
    try {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD_STATS);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};

// 2. Get recent activity feed (Mock for now if backend doesn't have it)
export const fetchActivityFeed = async () => {
    // Placeholder - waiting for backend endpoint
    return [
        { id: 1, type: 'Arrival', guest: 'J. Mason', time: '10:30 AM', room: '101' },
         // ... rest of mock data or empty
    ];
};

// 3. Get occupancy chart data (Mock for now if backend doesn't have it)
export const fetchOccupancyChart = async () => {
    // Placeholder - waiting for backend endpoint
     return [
        { month: 'Jan', occupancy: 85 },
        // ... rest of mock data
    ];
};