// src/data/mockData.js (UPDATED LAYOUT)

// Room definitions
export const roomsData = [
    // Top-level "Special" rows (No category)
    { id: 'SP01', name: 'Special Events', type: 'EVENT', category: null },
    { id: 'PK01', name: 'Parked Reservation', type: 'PARKED', category: null },

    // Staff Accommodation
    { id: 'S01', name: '01 Manager', type: 'STAFF', category: 'Staff Accommodation', status: 'CLEAN' },
    { id: 'S02', name: '02 Other Staff', type: 'STAFF', category: 'Staff Accommodation', status: 'CLEAN' },

    // Standard Ensuite Benjamin
    { id: 'B01', name: 'B01', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', status: 'CLEAN' },
    { id: 'B02', name: 'B02', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', status: 'DIRTY' },
    { id: 'B03', name: 'B03', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', status: 'DIRTY' },
    { id: 'B04', name: 'B04', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', status: 'INSPECT' },
    { id: 'B05', name: 'B05', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', status: 'CLEAN' },
    { id: 'B06', name: 'B06', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', status: 'CLEAN' },
    { id: 'B07', name: 'B07', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', status: 'DIRTY' },
    { id: 'B08', name: 'B08', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', status: 'CLEAN' },
    { id: 'B09', name: 'B09', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', status: 'CLEAN' },

    // Standard Ensuite Shiel
    { id: 'S01_SH', name: 'S01', type: 'ENSUITE', category: 'Standard Ensuite Shiel', status: 'CLEAN' },
    { id: 'S02_SH', name: 'S02', type: 'ENSUITE', category: 'Standard Ensuite Shiel', status: 'DIRTY' },
    { id: 'S03_SH', name: 'S03', type: 'ENSUITE', category: 'Standard Ensuite Shiel' },
    { id: 'S04_SH', name: 'S04', type: 'ENSUITE', category: 'Standard Ensuite Shiel' },
    { id: 'S05_SH', name: 'S05', type: 'ENSUITE', category: 'Standard Ensuite Shiel' },
    { id: 'S06_SH', name: 'S06', type: 'ENSUITE', category: 'Standard Ensuite Shiel' },
    { id: 'S07_SH', name: 'S07', type: 'ENSUITE', category: 'Standard Ensuite Shiel' },
    { id: 'S08_SH', name: 'S08', type: 'ENSUITE', category: 'Standard Ensuite Shiel' },

    // Standard Ensuite Wallace
    { id: 'W01', name: 'W01', type: 'ENSUITE', category: 'Standard Ensuite Wallace', status: 'DIRTY' },
    { id: 'W02', name: 'W02', type: 'ENSUITE', category: 'Standard Ensuite Wallace', status: 'CLEAN' },
    { id: 'W03', name: 'W03', type: 'ENSUITE', category: 'Standard Ensuite Wallace', status: 'CLEAN' },
    { id: 'W04', name: 'W04', type: 'ENSUITE', category: 'Standard Ensuite Wallace', status: 'CLEAN' },
    { id: 'W05', name: 'W05', type: 'ENSUITE', category: 'Standard Ensuite Wallace', status: 'CLEAN' },
    { id: 'W06', name: 'W06', type: 'ENSUITE', category: 'Standard Ensuite Wallace', status: 'DIRTY' },
    { id: 'W07', name: 'W07', type: 'ENSUITE', category: 'Standard Ensuite Wallace', status: 'CLEAN' },
    { id: 'W08', name: 'W08', type: 'ENSUITE', category: 'Standard Ensuite Wallace', status: 'CLEAN' },
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
    { id: 'BB02', roomId: 'B02', guestName: 'Lewis T', checkIn: '2025-12-16', checkOut: '2025-12-20', status: 'CONFIRMED' },
    { id: 'BB03', roomId: 'B03', guestName: 'Ingram', checkIn: '2025-12-01', checkOut: '2025-12-08', status: 'CONFIRMED' },
    { id: 'BB04', roomId: 'B04', guestName: 'CHAN', checkIn: '2025-12-14', checkOut: '2025-12-18', status: 'BLOCKED' },
    { id: 'BB05', roomId: 'B05', guestName: 'Kelly', checkIn: '2025-12-14', checkOut: '2025-12-16', status: 'BLOCKED' },
    { id: 'BB07', roomId: 'B07', guestName: 'Williams M', checkIn: '2025-12-15', checkOut: '2025-12-22', status: 'CONFIRMED' },
    { id: 'BB08', roomId: 'B08', guestName: 'Burns', checkIn: '2025-12-16', checkOut: '2025-12-25', status: 'CONFIRMED' },

    // Shiel
    { id: 'BSH1', roomId: 'S01_SH', guestName: 'Hillier', checkIn: '2025-11-25', checkOut: '2025-12-03', status: 'CHECKED_IN' },
    { id: 'BSH2', roomId: 'S02_SH', guestName: 'Geoghegan', checkIn: '2025-12-15', checkOut: '2025-12-20', status: 'CONFIRMED' },
    { id: 'BSH8', roomId: 'S08_SH', guestName: 'REID', checkIn: '2025-12-16', checkOut: '2025-12-21', status: 'CONFIRMED' },
];