
export const reservations = [
    // --- Dec 31 2025 is "Today" ---

    // 1. Arrived (Checked In) - Currently in house
    { 
        id: '1', resNo: '1001', masterResNo: '1001', guestId: 'G01', roomId: 'S01',
        groupName: 'Staff', clientName: 'Manager John', people: '1A', tariffType: 'Standard', balance: '0.00', company: 'Internal',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2025-12-01', checkOut: '2026-01-30', nights: 60,
        status: 'Arrived', bkgSource: 'Staff', isFixed: true,
        createDate: '2025-11-01', createdBy: 'Admin', confirmedDate: '2025-11-01', confirmedBy: 'Admin'
    },
    { 
        id: '2', resNo: '1002', masterResNo: '1002', guestId: 'G02', roomId: 'B01',
        groupName: 'Mining Co', clientName: 'Smith Team', people: '2A', tariffType: 'Occupied', balance: '500.00', company: 'Mining Co',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2025-12-28', checkOut: '2026-01-02', nights: 5,
        status: 'Arrived', bkgSource: 'Contracted', isFixed: false,
        createDate: '2025-12-10', createdBy: 'Reception', confirmedDate: '2025-12-12', confirmedBy: 'Reception'
    },
    { 
        id: '3', resNo: '1003', masterResNo: '1003', guestId: 'G03', roomId: 'B02',
        groupName: 'Holiday', clientName: 'Family Doe', people: '2A 2C', tariffType: 'Standard', balance: '0.00', company: 'N/A',
        arriveTime: '15:00', departTime: '10:00',
        checkIn: '2025-12-29', checkOut: '2026-01-03', nights: 5,
        status: 'Arrived', bkgSource: 'Online', isFixed: false,
        createDate: '2025-12-05', createdBy: 'System', confirmedDate: '2025-12-05', confirmedBy: 'System'
    },
    { 
        id: '4', resNo: '1004', masterResNo: '1004', guestId: 'G04', roomId: 'W01',
        groupName: 'Tourists', clientName: 'Couple Brown', people: '2A', tariffType: 'Standard', balance: '100.00', company: 'N/A',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2025-12-30', checkOut: '2026-01-01', nights: 2,
        status: 'Arrived', bkgSource: 'Direct', isFixed: false,
        createDate: '2025-12-28', createdBy: 'Front Desk', confirmedDate: '2025-12-28', confirmedBy: 'Front Desk'
    },

    // 2. Confirmed - Coming soon or future
    { 
        id: '5', resNo: '1005', masterResNo: '1005', guestId: 'G05', roomId: 'B03',
        groupName: 'Contractors', clientName: 'BuildCorp A', people: '1A', tariffType: 'Occupied', balance: '200.00', company: 'BuildCorp',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2026-01-02', checkOut: '2026-01-05', nights: 3,
        status: 'Confirmed', bkgSource: 'Contracted', isFixed: true,
        createDate: '2025-12-15', createdBy: 'Manager', confirmedDate: '2025-12-20', confirmedBy: 'Manager'
    },
    { 
        id: '6', resNo: '1006', masterResNo: '1006', guestId: 'G06', roomId: 'W02',
        groupName: 'Events', clientName: 'Event Staff 1', people: '1A', tariffType: 'Standard', balance: '0.00', company: 'Events Inc',
        arriveTime: '12:00', departTime: '12:00',
        checkIn: '2026-01-05', checkOut: '2026-01-08', nights: 3,
        status: 'Confirmed', bkgSource: 'Group', isFixed: true,
        createDate: '2025-11-30', createdBy: 'Sales', confirmedDate: '2025-12-01', confirmedBy: 'Sales'
    },
    { 
        id: '7', resNo: '1007', masterResNo: '1007', guestId: 'G07', roomId: 'S01_SH',
        groupName: 'Mining Co', clientName: 'Shift B', people: '1A', tariffType: 'Occupied', balance: '0.00', company: 'Mining Co',
        arriveTime: '16:00', departTime: '09:00',
        checkIn: '2026-01-03', checkOut: '2026-01-10', nights: 7,
        status: 'Confirmed', bkgSource: 'Contracted', isFixed: false,
        createDate: '2025-12-25', createdBy: 'Reception', confirmedDate: '2025-12-26', confirmedBy: 'Reception'
    },
    { 
        id: '8', resNo: '1008', masterResNo: '1008', guestId: 'G08', roomId: 'B04',
        groupName: 'Regulars', clientName: 'Mrs. Jones', people: '1A', tariffType: 'Standard', balance: '50.00', company: 'N/A',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2026-01-01', checkOut: '2026-01-04', nights: 3,
        status: 'Confirmed', bkgSource: 'Direct', isFixed: false,
        createDate: '2025-12-10', createdBy: 'Front Desk', confirmedDate: '2025-12-12', confirmedBy: 'Front Desk'
    },

    // 3. Unconfirmed - Tentative bookings
    { 
        id: '9', resNo: '1009', masterResNo: '1009', guestId: 'G09', roomId: 'W03',
        groupName: 'Wedding', clientName: 'Guest A', people: '2A', tariffType: 'Standard', balance: '0.00', company: 'N/A',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2026-01-10', checkOut: '2026-01-12', nights: 2,
        status: 'Unconfirmed', bkgSource: 'Online', isFixed: false,
        createDate: '2025-12-29', createdBy: 'System', confirmedDate: null, confirmedBy: null
    },
    { 
        id: '10', resNo: '1010', masterResNo: '1010', guestId: 'G10', roomId: 'B05',
        groupName: 'General', clientName: 'Mr. White', people: '1A', tariffType: 'Standard', balance: '0.00', company: 'N/A',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2026-01-05', checkOut: '2026-01-07', nights: 2,
        status: 'Unconfirmed', bkgSource: 'Direct', isFixed: false,
        createDate: '2025-12-30', createdBy: 'Front Desk', confirmedDate: null, confirmedBy: null
    },

    // 4. Departed (Checked Out) - Past bookings
    { 
        id: '11', resNo: '1011', masterResNo: '1011', guestId: 'G11', roomId: 'B06',
        groupName: 'Xmas', clientName: 'Family Green', people: '2A 1C', tariffType: 'Standard', balance: '0.00', company: 'N/A',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2025-12-24', checkOut: '2025-12-27', nights: 3,
        status: 'Departed', bkgSource: 'Online', isFixed: false,
        createDate: '2025-11-20', createdBy: 'System', confirmedDate: '2025-11-20', confirmedBy: 'System'
    },
    { 
        id: '12', resNo: '1012', masterResNo: '1012', guestId: 'G12', roomId: 'W04',
        groupName: 'Worker', clientName: 'Tech Guy', people: '1A', tariffType: 'Standard', balance: '0.00', company: 'TechFix',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2025-12-20', checkOut: '2025-12-28', nights: 8,
        status: 'Departed', bkgSource: 'Contracted', isFixed: false,
        createDate: '2025-12-01', createdBy: 'Manager', confirmedDate: '2025-12-01', confirmedBy: 'Manager'
    },
    { 
        id: '13', resNo: '1013', masterResNo: '1013', guestId: 'G13', roomId: 'S02',
        groupName: 'Staff', clientName: 'Temp Staff', people: '1A', tariffType: 'Standard', balance: '0.00', company: 'Internal',
        arriveTime: '12:00', departTime: '12:00',
        checkIn: '2025-12-15', checkOut: '2025-12-22', nights: 7,
        status: 'Departed', bkgSource: 'Staff', isFixed: true,
        createDate: '2025-12-01', createdBy: 'HR', confirmedDate: '2025-12-02', confirmedBy: 'HR'
    },
    { 
        id: '14', resNo: '1014', masterResNo: '1014', guestId: 'G14', roomId: 'B01',
        groupName: 'Mining Co', clientName: 'Smith Team prev', people: '1A', tariffType: 'Occupied', balance: '0.00', company: 'Mining Co',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2025-12-20', checkOut: '2025-12-25', nights: 5,
        status: 'Departed', bkgSource: 'Contracted', isFixed: false,
        createDate: '2025-11-10', createdBy: 'Admin', confirmedDate: '2025-11-12', confirmedBy: 'Admin'
    },

    // 5. Pre Check In
    { 
        id: '15', resNo: '1015', masterResNo: '1015', guestId: 'G15', roomId: 'W05',
        groupName: 'Late Checkin', clientName: 'Ms. Late', people: '1A', tariffType: 'Standard', balance: '100.00', company: 'N/A',
        arriveTime: '20:00', departTime: '10:00',
        checkIn: '2025-12-31', checkOut: '2026-01-02', nights: 2,
        status: 'Pre Check In', bkgSource: 'Online', isFixed: true,
        createDate: '2025-12-25', createdBy: 'System', confirmedDate: '2025-12-25', confirmedBy: 'System'
    },

    // 6. Out of Order
    { 
        id: '16', resNo: 'OOO1', masterResNo: '', guestId: '', roomId: 'B09',
        groupName: 'Maintenance', clientName: 'Plumbing Issue', people: '', tariffType: 'N/A', balance: '', company: 'Internal',
        arriveTime: '', departTime: '',
        checkIn: '2025-12-30', checkOut: '2026-01-02', nights: 3,
        status: 'Out of Order', bkgSource: 'Internal', isFixed: true,
        createDate: '2025-12-30', createdBy: 'Maintenance', confirmedDate: '2025-12-30', confirmedBy: 'Maintenance'
    },
    { 
        id: '17', resNo: 'OOO2', masterResNo: '', guestId: '', roomId: 'S04_SH',
        groupName: 'Renovation', clientName: 'Painting', people: '', tariffType: 'N/A', balance: '', company: 'Internal',
        arriveTime: '', departTime: '',
        checkIn: '2026-01-05', checkOut: '2026-01-10', nights: 5,
        status: 'Out of Order', bkgSource: 'Internal', isFixed: true,
        createDate: '2025-12-01', createdBy: 'Ops', confirmedDate: '2025-12-01', confirmedBy: 'Ops'
    },

    // More Randoms to fill up
    { 
        id: '18', resNo: '1018', masterResNo: '1018', guestId: 'G18', roomId: 'B07',
        groupName: 'Public', clientName: 'Walker T', people: '2A', tariffType: 'Standard', balance: '0.00', company: 'N/A',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2025-12-27', checkOut: '2025-12-29', nights: 2,
        status: 'Departed', bkgSource: 'Direct', isFixed: false,
        createDate: '2025-12-20', createdBy: 'Reception', confirmedDate: '2025-12-20', confirmedBy: 'Reception'
    },
    { 
        id: '19', resNo: '1019', masterResNo: '1019', guestId: 'G19', roomId: 'B07',
        groupName: 'Public', clientName: 'Ranger K', people: '1A', tariffType: 'Standard', balance: '50.00', company: 'N/A',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2025-12-29', checkOut: '2026-01-01', nights: 3,
        status: 'Arrived', bkgSource: 'Online', isFixed: false,
        createDate: '2025-12-21', createdBy: 'System', confirmedDate: '2025-12-21', confirmedBy: 'System'
    },
    { 
        id: '20', resNo: '1020', masterResNo: '1020', guestId: 'G20', roomId: 'W06',
        groupName: 'Group A', clientName: 'Member 1', people: '1A', tariffType: 'Standard', balance: '0.00', company: 'Group A',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2025-12-31', checkOut: '2026-01-02', nights: 2,
        status: 'Pre Check In', bkgSource: 'Group', isFixed: true,
        createDate: '2025-11-01', createdBy: 'Sales', confirmedDate: '2025-11-05', confirmedBy: 'Sales'
    },
    { 
        id: '21', resNo: '1021', masterResNo: '1021', guestId: 'G21', roomId: 'S02_SH',
        groupName: 'Staff', clientName: 'Temp 2', people: '1A', tariffType: 'Standard', balance: '0.00', company: 'Internal',
        arriveTime: '12:00', departTime: '12:00',
        checkIn: '2025-12-25', checkOut: '2026-01-05', nights: 11,
        status: 'Arrived', bkgSource: 'Staff', isFixed: true,
        createDate: '2025-12-01', createdBy: 'HR', confirmedDate: '2025-12-01', confirmedBy: 'HR'
    },
    { 
        id: '22', resNo: '1022', masterResNo: '1022', guestId: 'G22', roomId: 'B08',
        groupName: 'Mining Co', clientName: 'Eng 42', people: '1A', tariffType: 'Occupied', balance: '0.00', company: 'Mining Co',
        arriveTime: '16:00', departTime: '08:00',
        checkIn: '2025-12-28', checkOut: '2025-12-30', nights: 2,
        status: 'Departed', bkgSource: 'Contracted', isFixed: false,
        createDate: '2025-12-15', createdBy: 'Admin', confirmedDate: '2025-12-16', confirmedBy: 'Admin'
    },
    { 
        id: '23', resNo: '1023', masterResNo: '1023', guestId: 'G23', roomId: 'B08',
        groupName: 'Solo', clientName: 'Mr. X', people: '1A', tariffType: 'Standard', balance: '0.00', company: 'N/A',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2025-12-30', checkOut: '2026-01-01', nights: 2,
        status: 'Arrived', bkgSource: 'Direct', isFixed: false,
        createDate: '2025-12-28', createdBy: 'Front Desk', confirmedDate: '2025-12-28', confirmedBy: 'Front Desk'
    },
    { 
        id: '24', resNo: '1024', masterResNo: '1024', guestId: 'G24', roomId: 'W07',
        groupName: 'Couple', clientName: 'Newlyweds', people: '2A', tariffType: 'Standard', balance: '200.00', company: 'N/A',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2026-01-02', checkOut: '2026-01-09', nights: 7,
        status: 'Confirmed', bkgSource: 'Online', isFixed: true,
        createDate: '2025-11-20', createdBy: 'System', confirmedDate: '2025-11-20', confirmedBy: 'System'
    },
    { 
        id: '25', resNo: '1025', masterResNo: '1025', guestId: 'G25', roomId: 'W08',
        groupName: 'Public', clientName: 'Guest Z', people: '1A', tariffType: 'Standard', balance: '0.00', company: 'N/A',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2026-01-04', checkOut: '2026-01-06', nights: 2,
        status: 'Unconfirmed', bkgSource: 'Direct', isFixed: false,
        createDate: '2025-12-31', createdBy: 'Front Desk', confirmedDate: null, confirmedBy: null
    }
];
