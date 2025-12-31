// src/data/rooms.js

export const rooms = [
    // Top-level "Special" rows (No category)
    { 
        id: 'SP01', 
        name: 'Special Events', 
        type: 'EVENT', 
        category: null, 
        defaultCleanStatus: 'Clean', 
        maxOccupancy: 0, 
        outOfOrder: false, 
        lastCleanDate: '2025-12-30', 
        daysSinceLastClean: 0 
    },
    { 
        id: 'PK01', 
        name: 'Parked Reservation', 
        type: 'PARKED', 
        category: null, 
        defaultCleanStatus: 'Clean', 
        maxOccupancy: 0, 
        outOfOrder: false, 
        lastCleanDate: '2025-12-30', 
        daysSinceLastClean: 0 
    },
    // Staff Accommodation
    { 
        id: 'S01', 
        name: '01 Manager', 
        type: 'STAFF', 
        category: 'Staff Accommodation', 
        defaultCleanStatus: 'Clean', 
        maxOccupancy: 1, 
        outOfOrder: false, 
        lastCleanDate: '2025-12-28', 
        daysSinceLastClean: 3 
    },
    { 
        id: 'S02', 
        name: '02 Other Staff', 
        type: 'STAFF', 
        category: 'Staff Accommodation', 
        defaultCleanStatus: 'Clean', 
        maxOccupancy: 1, 
        outOfOrder: false, 
        lastCleanDate: '2025-12-29', 
        daysSinceLastClean: 2 
    },

    // Standard Ensuite Benjamin
    { id: 'B01', name: 'B01', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Dirty', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-25', daysSinceLastClean: 6, assignedHousekeeperId: 'HK01' },
    { id: 'B02', name: 'B02', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Dirty', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-26', daysSinceLastClean: 5, assignedHousekeeperId: 'HK01' },
    { id: 'B03', name: 'B03', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'B04', name: 'B04', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'B05', name: 'B05', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'B06', name: 'B06', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Dirty', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-27', daysSinceLastClean: 4 },
    { id: 'B07', name: 'B07', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'B08', name: 'B08', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'B09', name: 'B09', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },

    // Standard Ensuite Shiel
    { id: 'S01_SH', name: 'S01', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'S02_SH', name: 'S02', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Dirty', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-28', daysSinceLastClean: 3, assignedHousekeeperId: 'HK02' },
    { id: 'S03_SH', name: 'S03', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'S04_SH', name: 'S04', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: true, lastCleanDate: '2025-12-20', daysSinceLastClean: 0 }, // Out of order example
    { id: 'S05_SH', name: 'S05', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'S06_SH', name: 'S06', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'S07_SH', name: 'S07', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'S08_SH', name: 'S08', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },

    // Standard Ensuite Wallace
    { id: 'W01', name: 'W01', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Dirty', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-27', daysSinceLastClean: 4, assignedHousekeeperId: 'HK02' },
    { id: 'W02', name: 'W02', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'W03', name: 'W03', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'W04', name: 'W04', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'W05', name: 'W05', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'W06', name: 'W06', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Dirty', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-28', daysSinceLastClean: 3, assignedHousekeeperId: 'HK02' },
    { id: 'W07', name: 'W07', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'W08', name: 'W08', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
];

export const ROOM_TYPE_OPTIONS = [
    "Staff Accommodation", 
    "Standard Ensuite Benjamin", 
    "Standard Ensuite Shiel", 
    "Standard Ensuite Wallace"
];

export const housekeepers = [
    { id: 'HK01', name: 'Hamish', empType: 'Full Time' },
    { id: 'HK02', name: 'Hazel', empType: 'Full Time' },
    { id: 'HK03', name: 'Housekeeper 1', empType: 'Full Time' },
    { id: 'HK04', name: 'Housekeeper 2', empType: 'Full Time' },
    { id: 'HK05', name: 'Jason', empType: 'Full Time' },
];

export const tasks = [
    { id: 'T01', type: 'Pre Arrival Check', roomId: 'B02', assignedTo: null, status: 'Incomplete', timeRequired: 5 },
    { id: 'T02', type: 'Mid Stay Linen Change', roomId: 'S02', assignedTo: null, status: 'Incomplete', timeRequired: 20 },
    { id: 'T03', type: 'Departure', roomId: 'B01', assignedTo: 'HK01', status: 'Incomplete', timeRequired: 30 },
    { id: 'T04', type: 'Departure', roomId: 'B02', assignedTo: 'HK01', status: 'Incomplete', timeRequired: 30 },
    { id: 'T05', type: 'Departure', roomId: 'S02_SH', assignedTo: 'HK02', status: 'Incomplete', timeRequired: 30 },
    { id: 'T06', type: 'Departure', roomId: 'W01', assignedTo: 'HK02', status: 'Incomplete', timeRequired: 30 },
    { id: 'T07', type: 'Departure', roomId: 'W06', assignedTo: 'HK02', status: 'Incomplete', timeRequired: 30 },
    { id: 'T08', type: 'Hold Over Dep Clean', roomId: 'W04', assignedTo: null, status: 'Incomplete', timeRequired: 15 },
];
