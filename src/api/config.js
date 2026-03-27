// API Configuration
export const API_CONFIG = {
    // Base URL - will be used when VITE_USE_MOCK_API is false
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    
    // Use mock API - set to false when backend is ready
    USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API !== 'false',
    
    // Simulated network delay for mock API (in ms)
    MOCK_DELAY: 500,
    
    // API endpoints
    ENDPOINTS: {
        BOOKINGS: '/bookings',
        ROOMS: '/rooms',
        RESERVATIONS: '/Reservations', // Note: Case sensitive based on user request
        USERS: '/users',
        USER: '/user',
        AUTH: '/auth',
        GROUPS: '/groups',
        COMPANIES: '/companies',
        CLIENTS: '/clients',
        VOUCHERS: '/vouchers',
        TASKS: '/tasks',
        DASHBOARD_STATS: '/dashboard/stats',
    },
    
    // Request timeout
    TIMEOUT: 10000,
};

export default API_CONFIG;
