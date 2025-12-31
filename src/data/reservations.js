// src/data/reservations.js

export const reservations = [
    { 
        id: '1', 
        resNo: '455', 
        masterResNo: '2', 
        guestId: '101', 
        companyId: 'C001', 
        roomId: '1', 
        checkIn: '2025-12-14', 
        checkOut: '2025-12-18', 
        nights: 4,
        status: 'Checked In',
        bkgSource: 'Contracted with Meals',
        voucherNo: 'V-1001',
        createDate: '2025-11-01',
        createdBy: 'Super Admin',
        confirmedDate: '2025-11-05',
        confirmedBy: 'Super Admin',
        cancelledDate: null,
        cancelledBy: null
    },
    {
        id: 'RND1',
        resNo: '900',
        masterResNo: '900',
        guestId: '102',
        companyId: null,
        roomId: 'S01',
        checkIn: '2025-12-01',
        checkOut: '2026-01-10',
        nights: 40,
        status: 'Checked In',
        bkgSource: 'Staff',
        voucherNo: '',
        createDate: '2025-10-15',
        createdBy: 'John Employee',
        confirmedDate: '2025-10-16',
        confirmedBy: 'Super Admin',
        cancelledDate: null,
        cancelledBy: null
    },
    // Add more mock reservations as needed to match mockData.js if required for charts
];
