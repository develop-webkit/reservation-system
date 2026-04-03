import { roomsData, bookingsData } from '../data/mockData';
import API_CONFIG from './config';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for mock data (simulates database)
let mockRooms = [...roomsData];
let mockBookings = [...bookingsData];
let mockReservations = [];
let mockUsers = [
    { _id: '1', fullName: 'Admin User', username: 'admin', email: 'admin@hotel.com', phone: '1234567890', clientNumber: 'ADM001', role: 'admin' },
    { _id: '2', fullName: 'John Customer', username: 'john', email: 'john@example.com', phone: '1234567891', clientNumber: 'CUS001', role: 'user' },
];

// Helper to generate IDs
let nextBookingId = Math.max(...mockBookings.map(b => b.id), 0) + 1;
let nextReservationId = 1;
let nextUserId = 3;

/**
 * Mock API implementation
 * This simulates real API behavior with CRUD operations
 */
export const mockApi = {
    // ========== BOOKINGS ==========
    bookings: {
        getAll: async (filters = {}) => {
            await delay(API_CONFIG.MOCK_DELAY);
            
            let result = [...mockBookings];
            
            // Apply filters if provided
            if (filters.roomId) {
                result = result.filter(b => b.roomId === filters.roomId);
            }
            if (filters.status) {
                result = result.filter(b => b.status === filters.status);
            }
            if (filters.checkIn) {
                result = result.filter(b => b.checkIn >= filters.checkIn);
            }
            if (filters.checkOut) {
                result = result.filter(b => b.checkOut <= filters.checkOut);
            }
            
            return { data: result, total: result.length };
        },
        
        getById: async (id) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const booking = mockBookings.find(b => b.id === id);
            if (!booking) {
                throw new Error('Booking not found');
            }
            return { data: booking };
        },
        
        create: async (bookingData) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const newBooking = {
                ...bookingData,
                id: nextBookingId++,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            mockBookings.push(newBooking);
            return { data: newBooking };
        },
        
        update: async (id, bookingData) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const index = mockBookings.findIndex(b => b.id === id);
            if (index === -1) {
                throw new Error('Booking not found');
            }
            mockBookings[index] = {
                ...mockBookings[index],
                ...bookingData,
                updatedAt: new Date().toISOString(),
            };
            return { data: mockBookings[index] };
        },
        
        delete: async (id) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const index = mockBookings.findIndex(b => b.id === id);
            if (index === -1) {
                throw new Error('Booking not found');
            }
            const deleted = mockBookings.splice(index, 1)[0];
            return { data: deleted };
        },
    },
    
    // ========== ROOMS ==========
    rooms: {
        getAll: async (filters = {}) => {
            await delay(API_CONFIG.MOCK_DELAY);
            
            let result = [...mockRooms];
            
            // Apply filters
            if (filters.category) {
                result = result.filter(r => r.category === filters.category);
            }
            if (filters.status) {
                result = result.filter(r => r.status === filters.status);
            }
            
            return { data: result, total: result.length };
        },
        
        getById: async (id) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const room = mockRooms.find(r => r.id === id);
            if (!room) {
                throw new Error('Room not found');
            }
            return { data: room };
        },
        
        updateStatus: async (id, status) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const index = mockRooms.findIndex(r => r.id === id);
            if (index === -1) {
                throw new Error('Room not found');
            }
            mockRooms[index] = {
                ...mockRooms[index],
                status,
                updatedAt: new Date().toISOString(),
            };
            return { data: mockRooms[index] };
        },
    },
    
    // ========== RESERVATIONS ==========
    reservations: {
        getAll: async (filters = {}) => {
            await delay(API_CONFIG.MOCK_DELAY);
            
            let result = [...mockReservations];
            
            // Apply filters
            if (filters.status) {
                result = result.filter(r => r.status === filters.status);
            }
            if (filters.clientId) {
                result = result.filter(r => r.clientId === filters.clientId);
            }
            
            return { data: result, total: result.length };
        },
        
        getById: async (id) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const reservation = mockReservations.find(r => r.id === id);
            if (!reservation) {
                throw new Error('Reservation not found');
            }
            return { data: reservation };
        },
        
        create: async (reservationData) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const newReservation = {
                ...reservationData,
                id: nextReservationId++,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            mockReservations.push(newReservation);
            return { data: newReservation };
        },
        
        update: async (id, reservationData) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const index = mockReservations.findIndex(r => r.id === id);
            if (index === -1) {
                throw new Error('Reservation not found');
            }
            mockReservations[index] = {
                ...mockReservations[index],
                ...reservationData,
                updatedAt: new Date().toISOString(),
            };
            return { data: mockReservations[index] };
        },
        
        delete: async (id) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const index = mockReservations.findIndex(r => r.id === id);
            if (index === -1) {
                throw new Error('Reservation not found');
            }
            const deleted = mockReservations.splice(index, 1)[0];
            return { data: deleted };
        },
    },

    // ========== USERS ==========
    users: {
        getAll: async (filters = {}) => {
            await delay(API_CONFIG.MOCK_DELAY);

            let result = [...mockUsers];

            // Apply filters
            if (filters.role) {
                result = result.filter(u => u.role === filters.role);
            }

            return result;
        },

        getById: async (id) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const user = mockUsers.find(u => u._id === id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        },

        create: async (userData) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const newUser = {
                ...userData,
                _id: String(nextUserId++),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            mockUsers.push(newUser);
            console.log('[MockAPI] User created:', newUser);
            return newUser;
        },

        update: async (id, userData) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const index = mockUsers.findIndex(u => u._id === id);
            if (index === -1) {
                throw new Error('User not found');
            }
            mockUsers[index] = {
                ...mockUsers[index],
                ...userData,
                updatedAt: new Date().toISOString(),
            };
            return mockUsers[index];
        },

        delete: async (id) => {
            await delay(API_CONFIG.MOCK_DELAY);
            const index = mockUsers.findIndex(u => u._id === id);
            if (index === -1) {
                throw new Error('User not found');
            }
            const deleted = mockUsers.splice(index, 1)[0];
            return deleted;
        },
    },
};

export default mockApi;
