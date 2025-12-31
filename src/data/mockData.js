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
    // Pre-existing manually defined important ones
    { 
        id: '1', roomId: '1', guestName: 'Lewis T', checkIn: '2025-12-14', checkOut: '2025-12-18', status: 'CHECKED_IN',
        masterResNo: '2', reservationNo: '455', groupName: 'Heritage Minerals', clientName: 'Lewis T',
        arriveTime: '02:00 PM', departTime: '10:00 AM', people: '1A 0C 0I', bkgSource: 'Contracted', tariffType: 'Occupied', balance: 'XXXX', isFixed: false
    },
    // Randomly generated data below
    // Staff Rooms
    { id: 'RND1', roomId: 'S01', guestName: 'Manager Permanent', checkIn: '2025-12-01', checkOut: '2026-01-10', status: 'CHECKED_IN', isFixed: true, reservationNo: '900', color: 'gray' },
    { id: 'RND2', roomId: 'S02', guestName: 'Staff Rotate A', checkIn: '2025-12-09', checkOut: '2025-12-15', status: 'CHECKED_OUT', reservationNo: '901' },
    { id: 'RND3', roomId: 'S02', guestName: 'Staff Rotate B', checkIn: '2025-12-16', checkOut: '2025-12-28', status: 'CHECKED_IN', reservationNo: '902' },
    
    // Benjamin Rooms (B01-B09)
    { id: 'RND4', roomId: 'B01', guestName: 'Smith J', checkIn: '2025-12-09', checkOut: '2025-12-13', status: 'CHECKED_OUT', reservationNo: '501' },
    { id: 'RND5', roomId: 'B01', guestName: 'Doe A', checkIn: '2025-12-20', checkOut: '2025-12-26', status: 'CONFIRMED', reservationNo: '502' },
    { id: 'RND6', roomId: 'B01', guestName: 'Late Stay', checkIn: '2025-12-28', checkOut: '2026-01-02', status: 'PENDING', reservationNo: '503' },

    { id: 'RND7', roomId: 'B02', guestName: 'Johnson', checkIn: '2025-12-10', checkOut: '2025-12-15', status: 'CHECKED_OUT', reservationNo: '504' },
    { id: 'RND8', roomId: 'B02', guestName: 'Merry Xmas', checkIn: '2025-12-23', checkOut: '2025-12-27', status: 'CONFIRMED', reservationNo: '505', groupName: 'Holiday' },

    { id: 'RND9', roomId: 'B03', guestName: 'Miner Corp A', checkIn: '2025-12-09', checkOut: '2025-12-30', status: 'CHECKED_IN', reservationNo: '506', groupName: 'Miner Corp' },
    { id: 'RND10', roomId: 'B03', guestName: 'New Year', checkIn: '2025-12-31', checkOut: '2026-01-05', status: 'PENDING', reservationNo: '507' },

    { id: 'RND11', roomId: 'B04', guestName: 'Maintenance', checkIn: '2025-12-09', checkOut: '2025-12-12', status: 'BLOCKED', reservationNo: '508' },
    { id: 'RND12', roomId: 'B04', guestName: 'Short Stay', checkIn: '2025-12-13', checkOut: '2025-12-14', status: 'CONFIRMED', reservationNo: '509' },
    { id: 'RND13', roomId: 'B04', guestName: 'Long Term', checkIn: '2025-12-15', checkOut: '2026-01-05', status: 'CONFIRMED', reservationNo: '510' },

    { id: 'RND14', roomId: 'B05', guestName: 'Guest 1', checkIn: '2025-12-10', checkOut: '2025-12-12', status: 'CHECKED_OUT', reservationNo: '511' },
    { id: 'RND15', roomId: 'B05', guestName: 'Guest 2', checkIn: '2025-12-13', checkOut: '2025-12-18', status: 'CHECKED_IN', reservationNo: '512' },
    { id: 'RND16', roomId: 'B05', guestName: 'Guest 3', checkIn: '2025-12-20', checkOut: '2025-12-28', status: 'CONFIRMED', reservationNo: '513' },

    { id: 'RND17', roomId: 'B06', guestName: 'Empty Gap', checkIn: '2025-12-09', checkOut: '2025-12-11', status: 'CHECKED_OUT', reservationNo: '514' },
    { id: 'RND18', roomId: 'B06', guestName: 'Block Booking', checkIn: '2025-12-18', checkOut: '2025-12-28', status: 'PENDING', reservationNo: '515' },

    { id: 'RND19', roomId: 'B07', guestName: 'Early Bird', checkIn: '2025-12-08', checkOut: '2025-12-14', status: 'CHECKED_OUT', reservationNo: '516' },
    { id: 'RND20', roomId: 'B07', guestName: 'Mid Month', checkIn: '2025-12-15', checkOut: '2025-12-22', status: 'CONFIRMED', reservationNo: '517' },
    { id: 'RND21', roomId: 'B07', guestName: 'Year End', checkIn: '2025-12-26', checkOut: '2026-01-02', status: 'CONFIRMED', reservationNo: '518' },

    { id: 'RND22', roomId: 'B08', guestName: 'Specific', checkIn: '2025-12-11', checkOut: '2025-12-13', status: 'CHECKED_OUT', reservationNo: '519' },
    { id: 'RND23', roomId: 'B08', guestName: 'Request', checkIn: '2025-12-15', checkOut: '2025-12-19', status: 'CONFIRMED', reservationNo: '520' },
    { id: 'RND24', roomId: 'B08', guestName: 'Locked', checkIn: '2025-12-22', checkOut: '2025-12-30', status: 'CONFIRMED', isFixed: true, reservationNo: '521' },

    { id: 'RND25', roomId: 'B09', guestName: 'Overflow', checkIn: '2025-12-09', checkOut: '2025-12-20', status: 'CHECKED_IN', reservationNo: '522' },
    { id: 'RND26', roomId: 'B09', guestName: 'Cleanup', checkIn: '2025-12-22', checkOut: '2025-12-23', status: 'BLOCKED', reservationNo: '523' },

    // Shiel Rooms (S01_SH - S08_SH)
    { id: 'RND27', roomId: 'S01_SH', guestName: 'Delta Team', checkIn: '2025-12-09', checkOut: '2025-12-15', status: 'CHECKED_OUT', groupName: 'Delta' },
    { id: 'RND28', roomId: 'S01_SH', guestName: 'Delta Team', checkIn: '2025-12-16', checkOut: '2025-12-22', status: 'CHECKED_IN', groupName: 'Delta' },
    { id: 'RND29', roomId: 'S01_SH', guestName: 'Delta Team', checkIn: '2025-12-23', checkOut: '2025-12-30', status: 'CONFIRMED', groupName: 'Delta' },

    { id: 'RND30', roomId: 'S02_SH', guestName: 'Echo 1', checkIn: '2025-12-10', checkOut: '2025-12-18', status: 'PENDING', groupName: 'Echo' },
    { id: 'RND31', roomId: 'S02_SH', guestName: 'Echo 2', checkIn: '2025-12-20', checkOut: '2025-12-28', status: 'CONFIRMED', groupName: 'Echo' },

    { id: 'RND32', roomId: 'S03_SH', guestName: 'Solo Traveler', checkIn: '2025-12-12', checkOut: '2025-12-14', status: 'CHECKED_OUT' },
    { id: 'RND33', roomId: 'S03_SH', guestName: 'Couple', checkIn: '2025-12-15', checkOut: '2025-12-25', status: 'CONFIRMED' },

    { id: 'RND34', roomId: 'S04_SH', guestName: 'Repair Work', checkIn: '2025-12-09', checkOut: '2025-12-11', status: 'BLOCKED' },
    { id: 'RND35', roomId: 'S04_SH', guestName: 'Worker A', checkIn: '2025-12-12', checkOut: '2025-12-20', status: 'CHECKED_IN' },

    { id: 'RND36', roomId: 'S05_SH', guestName: 'Worker B', checkIn: '2025-12-09', checkOut: '2025-12-20', status: 'CHECKED_IN' },
    { id: 'RND37', roomId: 'S05_SH', guestName: 'Xmas Break', checkIn: '2025-12-24', checkOut: '2025-12-27', status: 'PENDING' },

    { id: 'RND38', roomId: 'S06_SH', guestName: 'Contractor', checkIn: '2025-12-14', checkOut: '2026-01-04', status: 'CONFIRMED', reservationNo: '601' },

    { id: 'RND39', roomId: 'S07_SH', guestName: 'TBA', checkIn: '2025-12-15', checkOut: '2025-12-17', status: 'PENDING' },
    { id: 'RND40', roomId: 'S07_SH', guestName: 'Confirmed', checkIn: '2025-12-18', checkOut: '2025-12-22', status: 'CONFIRMED' },

    { id: 'RND41', roomId: 'S08_SH', guestName: 'VIP', checkIn: '2025-12-10', checkOut: '2025-12-15', status: 'CHECKED_OUT' },
    { id: 'RND42', roomId: 'S08_SH', guestName: 'VIP Return', checkIn: '2025-12-20', checkOut: '2025-12-26', status: 'CONFIRMED' },

    // Wallace Rooms (W01-W08)
    { id: 'RND43', roomId: 'W01', guestName: 'Group Alpha', checkIn: '2025-12-09', checkOut: '2025-12-12', status: 'CHECKED_OUT', groupName: 'Alpha' },
    { id: 'RND44', roomId: 'W01', guestName: 'Group Alpha', checkIn: '2025-12-13', checkOut: '2025-12-18', status: 'CHECKED_IN', groupName: 'Alpha' },
    { id: 'RND45', roomId: 'W01', guestName: 'Group Alpha', checkIn: '2025-12-20', checkOut: '2025-12-24', status: 'CONFIRMED', groupName: 'Alpha' },

    { id: 'RND46', roomId: 'W02', guestName: 'Group Beta', checkIn: '2025-12-10', checkOut: '2025-12-15', status: 'CHECKED_OUT', groupName: 'Beta' },
    { id: 'RND47', roomId: 'W02', guestName: 'Group Beta', checkIn: '2025-12-16', checkOut: '2025-12-21', status: 'CONFIRMED', groupName: 'Beta' },

    { id: 'RND48', roomId: 'W03', guestName: 'Site Insp', checkIn: '2025-12-11', checkOut: '2025-12-12', status: 'CHECKED_OUT' },
    { id: 'RND49', roomId: 'W03', guestName: 'Audit Team', checkIn: '2025-12-14', checkOut: '2025-12-19', status: 'CHECKED_IN' },

    { id: 'RND50', roomId: 'W04', guestName: 'Manager', checkIn: '2025-12-09', checkOut: '2025-12-25', status: 'CONFIRMED', reservationNo: '701' },
    
    { id: 'RND51', roomId: 'W05', guestName: 'Eng 1', checkIn: '2025-12-12', checkOut: '2025-12-16', status: 'CHECKED_IN' },
    { id: 'RND52', roomId: 'W05', guestName: 'Eng 2', checkIn: '2025-12-17', checkOut: '2025-12-22', status: 'CONFIRMED' },

    { id: 'RND53', roomId: 'W06', guestName: 'Cleaning', checkIn: '2025-12-09', checkOut: '2025-12-10', status: 'BLOCKED' },
    { id: 'RND54', roomId: 'W06', guestName: 'Available', checkIn: '2025-12-12', checkOut: '2025-12-15', status: 'PENDING' },

    { id: 'RND55', roomId: 'W07', guestName: 'Late Arr', checkIn: '2025-12-20', checkOut: '2025-12-25', status: 'PRE_CHECK_IN' },
    
    { id: 'RND56', roomId: 'W08', guestName: 'Testing', checkIn: '2025-12-13', checkOut: '2025-12-15', status: 'CONFIRMED' },
    { id: 'RND57', roomId: 'W08', guestName: 'Dev Team', checkIn: '2025-12-16', checkOut: '2025-12-22', status: 'CONFIRMED' },

    // Parked / Events
    { id: 'RND58', roomId: 'PK01', guestName: 'Waiting List 1', checkIn: '2025-12-10', checkOut: '2025-12-15', status: 'PENDING' },
    { id: 'RND59', roomId: 'SP01', guestName: 'Xmas Party', checkIn: '2025-12-25', checkOut: '2025-12-26', status: 'BLOCKED', groupName: 'Staff' }
].map(b => ({
    ...b,
    // Add default dummy data for the popover fields if not present
    masterResNo: b.masterResNo || Math.floor(Math.random() * 1000).toString(),
    reservationNo: b.reservationNo || Math.floor(Math.random() * 10000).toString(),
    groupName: b.groupName || 'General Public',
    clientName: b.clientName || b.guestName,
    arriveTime: '02:00 PM',
    departTime: '10:00 AM',
    people: '1A 0C 0I',
    bkgSource: 'Direct',
    tariffType: 'Standard',
    balance: '0.00',
    caravanSalesSlide: 'None',
    company: b.company || 'N/A',
    isFixed: b.isFixed || false,
    voucherNo: '',
    createdBy: 'System',
    confirmedBy: 'Reception',
    createDate: '2025-10-01',
    confirmedDate: '2025-10-02'
}));
