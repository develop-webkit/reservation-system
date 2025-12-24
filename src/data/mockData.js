// src/data/mockData.js (UPDATED LAYOUT)

// Room definitions
export const roomsData = [
    // Top-level "Special" rows (No category)
    { id: 'SP01', name: 'Special Events', type: 'EVENT', category: null },
    { id: 'PK01', name: 'Parked Reservation', type: 'PARKED', category: null },

    // Staff Accommodation
    { id: 'S01', name: '01 Manager', type: 'STAFF', category: 'Staff Accommodation' },
    { id: 'S02', name: '02 Other Staff', type: 'STAFF', category: 'Staff Accommodation' },

    // Standard Ensuite Benjamin
    { id: 'B01', name: 'B01', type: 'ENSUITE', category: 'Standard Ensuite Benjamin' },
    { id: 'B02', name: 'B02', type: 'ENSUITE', category: 'Standard Ensuite Benjamin' },
    { id: 'B03', name: 'B03', type: 'ENSUITE', category: 'Standard Ensuite Benjamin' },
    { id: 'B04', name: 'B04', type: 'ENSUITE', category: 'Standard Ensuite Benjamin' },
    { id: 'B05', name: 'B05', type: 'ENSUITE', category: 'Standard Ensuite Benjamin' },

    // Standard Ensuite Shiel
    { id: 'SH01', name: 'S01', type: 'ENSUITE', category: 'Standard Ensuite Shiel' },
    { id: 'SH02', name: 'S02', type: 'ENSUITE', category: 'Standard Ensuite Shiel' },
    { id: 'SH03', name: 'S03', type: 'ENSUITE', category: 'Standard Ensuite Shiel' },

    // Standard Ensuite Wallace
    { id: 'W01', name: 'S08', type: 'ENSUITE', category: 'Standard Ensuite Wallace' },
];

// Booking definitions
// Note: Dates are centered around 2025-12-13
export const bookingsData = [
    // Special Events
    // ... none for now

    // Parked
    { id: 'BPK1', roomId: 'PK01', guestName: 'Yas (Parked)', checkIn: '2025-11-28', checkOut: '2025-12-19', status: 'PENDING' },
    
    // Staff
    { id: 'BS01', roomId: 'S01', guestName: 'Manager On Duty', checkIn: '2025-11-23', checkOut: '2025-12-10', status: 'CHECKED_IN' },
    { id: 'BS02', roomId: 'S01', guestName: 'Wells', checkIn: '2025-12-16', checkOut: '2025-12-20', status: 'PENDING' },

    // Benjamin
    { id: 'BB01', roomId: 'B01', guestName: 'Brady', checkIn: '2025-12-05', checkOut: '2025-12-15', status: 'CONFIRMED' },
    { id: 'BB02', roomId: 'B02', guestName: 'Lewis T', checkIn: '2025-11-24', checkOut: '2025-11-28', status: 'CHECKED_OUT' },
    { id: 'BB03', roomId: 'B02', guestName: 'Ingram', checkIn: '2025-12-01', checkOut: '2025-12-08', status: 'CONFIRMED' },
    { id: 'BB04', roomId: 'B02', guestName: 'Reid', checkIn: '2025-12-12', checkOut: '2025-12-20', status: 'CONFIRMED' },

    // Shiel
    { id: 'BSH1', roomId: 'SH01', guestName: 'Hillier', checkIn: '2025-11-25', checkOut: '2025-12-03', status: 'CHECKED_IN' },
    { id: 'BSH2', roomId: 'SH02', guestName: 'Geoghegan', checkIn: '2025-12-08', checkOut: '2025-12-14', status: 'CONFIRMED' },
];