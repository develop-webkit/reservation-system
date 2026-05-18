// API Configuration
export const API_CONFIG = {
    // Keep every API client aligned to the active backend.
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api/v1',
    
    // Use mock API - set to false when backend is ready
    USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API !== 'false',
    
    // Simulated network delay for mock API (in ms)
    MOCK_DELAY: 500,
    
    // API endpoints
    ENDPOINTS: {
        BOOKINGS: '/bookings',
        ROOMS: '/rooms',
        RESERVATIONS: '/reservations',
        USERS: '/users',
        USER: '/user',
        AUTH: '/auth',
        GROUPS: '/groups',
        COMPANIES: '/companies',
        CLIENTS: '/clients',
        VOUCHERS: '/vouchers',
        TASKS: '/tasks',
        DASHBOARD_STATS: '/dashboard/stats',
        ACCOUNTING: '/accounting',
    },
    
    // Request timeout
    TIMEOUT: 10000,
};

export default API_CONFIG;
