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
    { 
        id: '1', 
        roomId: '1', 
        guestName: 'Lewis T', 
        checkIn: '2025-12-14', 
        checkOut: '2025-12-18', 
        status: 'CHECKED_IN',
        masterResNo: '2',
        reservationNo: '455',
        groupName: 'Heritage Minerals',
        clientName: 'Lewis T',
        arriveTime: '02:00 PM',
        departTime: '10:00 AM',
        people: '1A 0C 0I',
        bkgSource: 'Contracted with Meals',
        tariffType: 'Occupied Room Rate PRPN',
        balance: 'XXXX',
        caravanSalesSlide: 'None',
        company: 'Heritage Minerals',
        isFixed: false
    },
    { 
        id: '2', 
        roomId: '3', 
        guestName: 'Chan', 
        checkIn: '2025-12-14', 
        checkOut: '2025-12-16', 
        status: 'BLOCKED',
        masterResNo: '3',
        reservationNo: '456',
        groupName: 'Mining Corp',
        clientName: 'Chan',
        arriveTime: '01:00 PM',
        departTime: '10:00 AM',
        people: '1A 0C 0I',
        bkgSource: 'Direct',
        tariffType: 'Standard Rate',
        balance: '0.00',
        caravanSalesSlide: 'None',
        company: 'Mining Corp',
        isFixed: true
    },
    { 
        id: '3', 
        roomId: '5', 
        guestName: 'Williams M', 
        checkIn: '2025-12-14', 
        checkOut: '2025-12-19', 
        status: 'PENDING',
        masterResNo: '4',
        reservationNo: '457',
        groupName: 'Construction Ltd',
        clientName: 'Williams M',
        arriveTime: '03:00 PM',
        departTime: '11:00 AM',
        people: '2A 0C 0I',
        bkgSource: 'Online',
        tariffType: 'Corporate Rate',
        balance: '150.00',
        caravanSalesSlide: 'None',
        company: 'Construction Ltd',
        isFixed: false
    },
    { 
        id: '4', 
        roomId: '10', 
        guestName: 'Dos Santos', 
        checkIn: '2025-12-15', 
        checkOut: '2025-12-25', 
        status: 'CONFIRMED',
        masterResNo: '5',
        reservationNo: '458',
        groupName: 'Engineering Co',
        clientName: 'Dos Santos',
        arriveTime: '12:00 PM',
        departTime: '10:00 AM',
        people: '1A 0C 0I',
        bkgSource: 'Email',
        tariffType: 'Long Stay',
        balance: '0.00',
        caravanSalesSlide: 'None',
        company: 'Engineering Co',
        isFixed: true
    },
    { 
        id: '5', 
        roomId: '11', 
        guestName: 'HILLIER', 
        checkIn: '2025-12-15', 
        checkOut: '2025-12-23', 
        status: 'CONFIRMED',
        masterResNo: '6',
        reservationNo: '459',
        groupName: 'Logistics Inc',
        clientName: 'HILLIER',
        arriveTime: '02:00 PM',
        departTime: '10:00 AM',
        people: '1A 0C 0I',
        bkgSource: 'Phone',
        tariffType: 'Standard Rate',
        balance: '0.00',
        caravanSalesSlide: 'None',
        company: 'Logistics Inc',
        isFixed: false
    },
    { 
        id: '6', 
        roomId: '6', 
        guestName: 'Burns', 
        checkIn: '2025-12-16', 
        checkOut: '2025-12-20', 
        status: 'PENDING',
        masterResNo: '7',
        reservationNo: '460',
        groupName: 'Energy Solutions',
        clientName: 'Burns',
        arriveTime: '04:00 PM',
        departTime: '10:00 AM',
        people: '1A 0C 0I',
        bkgSource: 'Contracted',
        tariffType: 'Corporate Rate',
        balance: '50.00',
        caravanSalesSlide: 'None',
        company: 'Energy Solutions',
        isFixed: false
    },
    { 
        id: '7', 
        roomId: '8', 
        guestName: 'Wells', 
        checkIn: '2025-12-18', 
        checkOut: '2025-12-22', 
        status: 'CONFIRMED',
        masterResNo: '8',
        reservationNo: '461',
        groupName: 'Tech Systems',
        clientName: 'Wells',
        arriveTime: '02:00 PM',
        departTime: '10:00 AM',
        people: '1A 0C 0I',
        bkgSource: 'Direct',
        tariffType: 'Standard Rate',
        balance: '0.00',
        caravanSalesSlide: 'None',
        company: 'Tech Systems',
        isFixed: false
    }
];