
import dayjs from 'dayjs';

// Define Master Reservations (The "Accounts")
const masters = [
    {
        id: 'M_HM', resNo: 'M-1000', masterResNo: null, guestId: 'MGR_HM', roomId: null,
        groupName: 'Heritage Minerals', clientName: 'Thomas Lewis (Fin Manager)', people: '0', 
        tariffType: 'Corporate', balance: '0.00', company: 'Heritage Minerals',
        arriveTime: null, departTime: null,
        checkIn: '2025-11-01', checkOut: '2026-11-01', nights: 365,
        status: 'Active', bkgSource: 'Corp', isFixed: true,
        createDate: '2025-10-01', createdBy: 'Admin', confirmedDate: '2025-10-01', confirmedBy: 'Admin',
        adults: 0, lastModified: '2025-12-01', totalTariff: '150000.00', baseTariff: '150.00',
        accountNo: 'ACC-HM-001', accomm: 'Multiple', ar: 'Current', activeAccounts: true,
        guestPrefix: 'G_HM_'
    },
    {
        id: 'M_MMH', resNo: 'M-2000', masterResNo: null, guestId: 'MGR_MMH', roomId: null,
        groupName: 'Mt Morgan Hospital', clientName: 'Dr. Sarah Bennett', people: '0',
        tariffType: 'Gov', balance: '1200.00', company: 'Mt Morgan Hospital',
        arriveTime: null, departTime: null,
        checkIn: '2025-11-01', checkOut: '2026-06-30', nights: 240,
        status: 'Active', bkgSource: 'Gov', isFixed: true,
        createDate: '2025-10-15', createdBy: 'Admin', confirmedDate: '2025-10-15', confirmedBy: 'Admin',
        adults: 0, lastModified: '2025-12-05', totalTariff: '50000.00', baseTariff: '140.00',
        accountNo: 'ACC-MMH-022', accomm: 'Ensuite', ar: 'Current', activeAccounts: true,
        guestPrefix: 'G_MMH_'
    },
    {
        id: 'M_QPS', resNo: 'M-3000', masterResNo: null, guestId: 'MGR_QPS', roomId: null,
        groupName: 'QPS', clientName: 'Sgt. Peter Rowe', people: '0',
        tariffType: 'Gov', balance: '0.00', company: 'QPS Mount Morgan',
        arriveTime: null, departTime: null,
        checkIn: '2025-12-01', checkOut: '2026-02-28', nights: 90,
        status: 'Active', bkgSource: 'Gov', isFixed: true,
        createDate: '2025-11-20', createdBy: 'Sales', confirmedDate: '2025-11-20', confirmedBy: 'Sales',
        adults: 0, lastModified: '2025-12-10', totalTariff: '25000.00', baseTariff: '145.00',
        accountNo: 'ACC-QPS-550', accomm: 'Single', ar: 'Current', activeAccounts: true,
        guestPrefix: 'G_QPS_'
    },
    {
        id: 'M_MMAV', resNo: 'M-4000', masterResNo: null, guestId: 'MGR_MMAV', roomId: null,
        groupName: 'MMAV', clientName: 'Ops Manager (MMAV)', people: '0',
        tariffType: 'Contract', balance: '5000.00', company: 'MMAV',
        arriveTime: null, departTime: null,
        checkIn: '2025-10-01', checkOut: '2026-10-01', nights: 365,
        status: 'Active', bkgSource: 'Contract', isFixed: true,
        createDate: '2025-09-01', createdBy: 'Manager', confirmedDate: '2025-09-01', confirmedBy: 'Manager',
        adults: 0, lastModified: '2025-12-28', totalTariff: '200000.00', baseTariff: '160.00',
        accountNo: 'ACC-MMAV-900', accomm: 'Multiple', ar: 'Overdue', activeAccounts: true,
        guestPrefix: 'G_MMAV_'
    }
];

// Room List (Extracted from rooms.js + expanded to be safe)
const roomIds = [
    // Benjamin
    'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09',
    // Shiel
    'S01_SH', 'S02_SH', 'S03_SH', 'S04_SH', 'S05_SH', 'S06_SH', 'S07_SH', 'S08_SH',
    // Wallace
    'W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'W07', 'W08',
    // Staff (Optional, maybe skip or include)
    'S01', 'S02'
];

// Determine Reservation Status based on date vs "Today" (Dec 31 2025)
const getStatus = (checkIn, checkOut) => {
    const today = dayjs('2025-12-31');
    const inDate = dayjs(checkIn);
    const outDate = dayjs(checkOut);

    if (outDate.isBefore(today)) return 'Departed';
    if (inDate.isAfter(today)) return 'Confirmed';
    return 'Arrived';
};

// Data Generator Function
const generateSubReservations = () => {
    const subs = [];
    let resCounter = 5000;
    const startDate = dayjs('2025-12-01');
    const endDate = dayjs('2026-01-31');

    roomIds.forEach((roomId, index) => {
        let currentDate = startDate;
        
        // Cycle through masters to distribute rooms
        const master = masters[index % masters.length]; 
        
        while (currentDate.isBefore(endDate)) {
            // Random Duration: 2 to 14 days
            const stayDuration = Math.floor(Math.random() * 12) + 2; 
            const checkOutDate = currentDate.add(stayDuration, 'day');
            
            // Random Gap: 0 or 1 day (rarely 2)
            const gap = Math.random() > 0.8 ? 1 : 0;

            const res = {
                id: `S_${roomId}_${resCounter}`,
                roomId: roomId,
                resNo: `${resCounter}`,
                masterResNo: master.resNo,
                checkIn: currentDate.format('YYYY-MM-DD'),
                checkOut: checkOutDate.format('YYYY-MM-DD'),
                status: getStatus(currentDate, checkOutDate),
                company: master.company,
                guestId: `${master.guestPrefix}${resCounter}`,
                clientName: `${master.company} Emp ${resCounter}`,
                people: '1A',
                tariffType: 'Standard',
                balance: '0.00',
                arriveTime: '14:00',
                departTime: '10:00',
                createDate: '2025-11-01',
                createdBy: 'System',
                confirmedDate: '2025-11-01',
                confirmedBy: 'System',
                adults: 1,
                nights: stayDuration
            };

            subs.push(res);
            resCounter++;

            // Next booking starts after checkout + gap
            currentDate = checkOutDate.add(gap, 'day');
        }
    });
    return subs;
};

const generatedSubs = generateSubReservations();

// Add Static Special Events
const specialEvents = [
    { 
        id: 'SP1', resNo: '9999', masterResNo: 'M-EVT-99', guestId: 'EV01', roomId: 'SP01',
        groupName: 'New Year Bash', clientName: 'New Year Gala', people: '100A', tariffType: 'Function', balance: '0.00', company: 'Hotel Event',
        arriveTime: '18:00', departTime: '02:00',
        checkIn: '2025-12-31', checkOut: '2026-01-01', nights: 1,
        status: 'Confirmed', bkgSource: 'Internal', isFixed: true,
        createDate: '2025-10-01', createdBy: 'Events', confirmedDate: '2025-10-01', confirmedBy: 'Events',
        specialEvent: true, adults: 100
    },
    { 
        id: 'PK1', resNo: '8888', masterResNo: 'M-GRP-88', guestId: 'PK001', roomId: 'PK01',
        groupName: 'Holding', clientName: 'Unassigned Group', people: '10A', tariffType: 'Standard', balance: '0.00', company: 'TBD',
        arriveTime: '14:00', departTime: '10:00',
        checkIn: '2026-01-05', checkOut: '2026-01-10', nights: 5,
        status: 'Unconfirmed', bkgSource: 'Group', isFixed: false,
        createDate: '2025-12-30', createdBy: 'Sales', confirmedDate: null, confirmedBy: null, adults: 10
    }
];

export const reservations = [
    ...masters,
    ...specialEvents,
    ...generatedSubs
];
