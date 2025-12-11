


// src/data/mockChartData.js

// Mock data structure based on the chart image
export const roomTypes = [
    { id: 'STAFF', name: 'Staff Accommodation', rooms: [
        { id: 'MGR', name: '01 Manager', reservations: [
            { id: 9901, client: 'Parked Reservation', start: 24, end: 30, color: 'bg-warning' }
        ]},
        { id: 'OSTF', name: '02 Other Staff', reservations: []}
    ]},
    { id: 'BENJ', name: 'Standard Ensuite Benjamin', rooms: [
        { id: 'B01', name: 'B01', reservations: [
            { id: 1001, client: 'Brady', start: 30, end: 32, color: 'bg-success' }
        ]},
        { id: 'B02', name: 'B02', reservations: [
            { id: 1002, client: 'Lewis T', start: 25, end: 28, color: 'bg-info' },
            { id: 1003, client: 'Ingram', start: 30, end: 34, color: 'bg-success' },
            { id: 1004, client: 'REID', start: 40, end: 42, color: 'bg-success' }
        ]},
        { id: 'B03', name: 'B03', reservations: [
            { id: 1005, client: 'Williams C', start: 33, end: 38, color: 'bg-info' }
        ]},
        { id: 'B04', name: 'B04', reservations: [
            { id: 1006, client: 'OH', start: 25, end: 25, color: 'bg-danger' },
            { id: 1007, client: 'LARWOOD', start: 35, end: 40, color: 'bg-success' }
        ]}
    ]},
    // Add more room types and rooms as needed...
];

// Total days to display (4 weeks)
export const chartDays = 30;