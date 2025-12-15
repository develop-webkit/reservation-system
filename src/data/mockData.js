// src/data/mockData.js (EXTENDED DATA SET)

// Room definitions (Extended for more visual interest)
export const roomsData = [
    { id: 'R001', name: 'Deluxe King', type: 'KING' },
    { id: 'R002', name: 'Deluxe Queen', type: 'QUEEN' },
    { id: 'R003', name: 'Standard Twin', type: 'TWIN' },
    { id: 'R004', name: 'Executive Suite', type: 'SUITE' },
    { id: 'R005', name: 'Standard King A', type: 'KING' },
    { id: 'R006', name: 'Deluxe King B', type: 'KING' },
    { id: 'R007', name: 'Standard Twin C', type: 'TWIN' },
    { id: 'R008', name: 'Executive Suite D', type: 'SUITE' },
    { id: 'R009', name: 'Family Room 1', type: 'FAMILY' },
    { id: 'R010', name: 'Family Room 2', type: 'FAMILY' },
    { id: 'R011', name: 'Deluxe King C', type: 'KING' },
    { id: 'R012', name: 'Deluxe Queen B', type: 'QUEEN' },
    { id: 'R013', name: 'Standard Twin D', type: 'TWIN' },
    { id: 'R014', name: 'Executive Suite E', type: 'SUITE' },
    { id: 'R015', name: 'Standard King F', type: 'KING' },
];

// Booking definitions (Populated for high occupancy around the chart start date)
// Note: Dates are centered around 2025-12-13, which is the current view date.
export const bookingsData = [
    // --- Room R001 (Deluxe King) ---
    { id: 'B101', roomId: 'R001', guestName: 'J. Smith (Web)', checkIn: '2025-12-14', checkOut: '2025-12-18', status: 'CONFIRMED' },
    { id: 'B102', roomId: 'R001', guestName: 'A. Bell (Walk-in)', checkIn: '2025-12-19', checkOut: '2025-12-25', status: 'CHECKED_IN' },
    
    // --- Room R002 (Deluxe Queen) ---
    { id: 'B201', roomId: 'R002', guestName: 'C. Doe (Expedia)', checkIn: '2025-12-10', checkOut: '2025-12-15', status: 'PENDING' },
    { id: 'B202', roomId: 'R002', guestName: 'D. Ray (Web)', checkIn: '2025-12-16', checkOut: '2025-12-21', status: 'CONFIRMED' },
    { id: 'B203', roomId: 'R002', guestName: 'E. Fox (B.com)', checkIn: '2025-12-22', checkOut: '2025-12-28', status: 'CHECKED_OUT' },

    // --- Room R003 (Standard Twin) ---
    { id: 'B301', roomId: 'R003', guestName: 'F. Hall (Corp)', checkIn: '2025-12-12', checkOut: '2025-12-19', status: 'CHECKED_IN' },
    
    // --- Room R004 (Executive Suite) ---
    { id: 'B401', roomId: 'R004', guestName: 'G. King (VIP)', checkIn: '2025-12-15', checkOut: '2025-12-22', status: 'CONFIRMED' },
    
    // --- Room R005 (Standard King A) ---
    { id: 'B501', roomId: 'R005', guestName: 'H. Lane (Expedia)', checkIn: '2025-12-23', checkOut: '2025-12-29', status: 'PENDING' },
    
    // --- Room R006 (Deluxe King B) ---
    { id: 'B601', roomId: 'R006', guestName: 'I. Moore (Web)', checkIn: '2025-12-10', checkOut: '2025-12-14', status: 'CHECKED_IN' },
    { id: 'B602', roomId: 'R006', guestName: 'J. Neil (B.com)', checkIn: '2025-12-17', checkOut: '2025-12-23', status: 'CONFIRMED' },

    // --- Room R007 (Standard Twin C) ---
    { id: 'B701', roomId: 'R007', guestName: 'K. Oliver (Walk-in)', checkIn: '2025-12-14', checkOut: '2025-12-25', status: 'CONFIRMED' },

    // --- Room R008 (Executive Suite D) ---
    { id: 'B801', roomId: 'R008', guestName: 'L. Paul (Corp)', checkIn: '2025-12-18', checkOut: '2025-12-27', status: 'PENDING' },

    // --- Room R009 (Family Room 1) ---
    { id: 'B901', roomId: 'R009', guestName: 'M. Quinn', checkIn: '2025-12-13', checkOut: '2025-12-20', status: 'CONFIRMED' },

    // --- Room R010 (Family Room 2) ---
    { id: 'B010', roomId: 'R010', guestName: 'N. Riley', checkIn: '2025-12-15', checkOut: '2025-12-19', status: 'CHECKED_IN' },
    { id: 'B011', roomId: 'R010', guestName: 'O. Stone', checkIn: '2025-12-20', checkOut: '2025-12-24', status: 'CONFIRMED' },

    // --- Room R012 (Deluxe Queen B) ---
    { id: 'B012', roomId: 'R012', guestName: 'P. Tate', checkIn: '2025-12-13', checkOut: '2025-12-17', status: 'PENDING' },
    { id: 'B013', roomId: 'R012', guestName: 'Q. Vance', checkIn: '2025-12-18', checkOut: '2025-12-22', status: 'CONFIRMED' },
    { id: 'B014', roomId: 'R012', guestName: 'R. West', checkIn: '2025-12-23', checkOut: '2025-12-27', status: 'CHECKED_IN' },

];