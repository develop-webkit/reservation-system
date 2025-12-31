// src/data/rooms.js

export const rooms = [
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
    { id: 'B01', name: 'B01', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Dirty', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-25', daysSinceLastClean: 6 },
    { id: 'B02', name: 'B02', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Dirty', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-26', daysSinceLastClean: 5 },
    { id: 'B03', name: 'B03', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'B04', name: 'B04', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'B05', name: 'B05', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'B06', name: 'B06', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Dirty', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-27', daysSinceLastClean: 4 },
    { id: 'B07', name: 'B07', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'B08', name: 'B08', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'B09', name: 'B09', type: 'ENSUITE', category: 'Standard Ensuite Benjamin', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },

    // Standard Ensuite Shiel
    { id: 'S01_SH', name: 'S01', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'S02_SH', name: 'S02', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Dirty', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-28', daysSinceLastClean: 3 },
    { id: 'S03_SH', name: 'S03', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'S04_SH', name: 'S04', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: true, lastCleanDate: '2025-12-20', daysSinceLastClean: 0 }, // Out of order example
    { id: 'S05_SH', name: 'S05', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'S06_SH', name: 'S06', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'S07_SH', name: 'S07', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'S08_SH', name: 'S08', type: 'ENSUITE', category: 'Standard Ensuite Shiel', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },

    // Standard Ensuite Wallace
    { id: 'W01', name: 'W01', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Dirty', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-27', daysSinceLastClean: 4 },
    { id: 'W02', name: 'W02', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'W03', name: 'W03', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'W04', name: 'W04', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'W05', name: 'W05', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'W06', name: 'W06', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Dirty', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-28', daysSinceLastClean: 3 },
    { id: 'W07', name: 'W07', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
    { id: 'W08', name: 'W08', type: 'ENSUITE', category: 'Standard Ensuite Wallace', defaultCleanStatus: 'Clean', maxOccupancy: 2, outOfOrder: false, lastCleanDate: '2025-12-30', daysSinceLastClean: 1 },
];

export const ROOM_TYPE_OPTIONS = [
    "Staff Accommodation", 
    "Standard Ensuite Benjamin", 
    "Standard Ensuite Shiel", 
    "Standard Ensuite Wallace"
];
