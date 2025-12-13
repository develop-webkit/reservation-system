// src/data/mockData.js

// --- 1. Unit/Room Definitions (Y-Axis of the Booking Chart) ---
// These define the available rooms and their types.
export const roomsData = [
    { id: 'R001', name: 'Deluxe King', type: 'KING' },
    { id: 'R002', name: 'Deluxe Queen', type: 'QUEEN' },
    { id: 'R003', name: 'Standard Twin', type: 'TWIN' },
    { id: 'R004', name: 'Executive Suite', type: 'SUITE' },
    { id: 'R005', name: 'Standard King', type: 'KING' },
    { id: 'R006', name: 'Deluxe King A', type: 'KING' },
    { id: 'R007', name: 'Standard Twin B', type: 'TWIN' },
    { id: 'R008', name: 'Executive Suite C', type: 'SUITE' },
    // A complex, real-world RMS would have many more fields (e.g., floor, status, amenities)
];

// --- 2. Reservation/Booking Definitions (Events on the Chart) ---
// These define the actual bookings. Dates are represented as YYYY-MM-DD strings.
export const bookingsData = [
    {
        id: 'B001',
        roomId: 'R001',
        guestName: 'Smith, J.',
        checkIn: '2025-12-15', // Stays 15th, 16th, 17th
        checkOut: '2025-12-18',
        status: 'CONFIRMED', // Color code will depend on status
        rate: 150.00,
    },
    {
        id: 'B002',
        roomId: 'R004',
        guestName: 'Johnson, P.',
        checkIn: '2025-12-14', // Stays 14th, 15th
        checkOut: '2025-12-16',
        status: 'CHECKED_IN',
        rate: 220.00,
    },
    {
        id: 'B003',
        roomId: 'R001',
        guestName: 'Williams, A.',
        checkIn: '2025-12-20',
        checkOut: '2025-12-23',
        status: 'PENDING',
        rate: 140.00,
    },
    {
        id: 'B004',
        roomId: 'R005',
        guestName: 'Brown, T.',
        checkIn: '2025-12-16',
        checkOut: '2025-12-19',
        status: 'CONFIRMED',
        rate: 160.00,
    },
    {
        id: 'B005',
        roomId: 'R008',
        guestName: 'Davis, R.',
        checkIn: '2025-12-17',
        checkOut: '2025-12-21',
        status: 'CHECKED_OUT', // Checked out bookings are usually shown for a short period
        rate: 300.00,
    },
];