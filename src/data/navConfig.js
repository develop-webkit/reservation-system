// src/data/navConfig.js

export const navConfig = [
    { name: 'Dashboard', icon: 'bi-grid-fill', path: '/' },
    { 
        name: 'Charts', 
        icon: 'bi-bar-chart-line-fill', 
        path: '/charts', 
        children: [
            { name: 'Availability Chart', path: '/charts/availability' },
            { name: 'Add On Chart', path: '/charts/addon' },
            { name: 'Booking Chart', path: '/charts/bookingchart' }, // The chart we built
            { name: 'Interactive Map', path: '/charts/map' },
            { name: 'Tariff Manager', path: '/charts/tariff' },
            { name: 'Reservation Position List', path: '/charts/positionlist' },
            { name: 'To Do Chart', path: '/charts/todo' },
        ]
    },
    { 
        name: 'Reservations', 
        icon: 'bi-calendar-check-fill', 
        path: '/reservations',
        children: [
            // Add sub-links for Reservations based on the "Master" view (Master Window on Edit Reservation...)
            { name: 'Reservations List', path: '/reservations/list' },
            { name: 'Search Booking', path: '/reservations/search' },
            // ... more reservation sub-links
        ]
    },
    { name: 'Accounting', icon: 'bi-wallet-fill', path: '/accounting' },
    { 
        name: 'Housekeeping', 
        icon: 'bi-basket-fill', 
        path: '/housekeeping',
        children: [
            { name: 'Clean Screen', path: '/housekeeping/clean-screen' },
            { name: 'Housekeeping Roster', path: '/housekeeping/roster' },
        ]
    },
    { name: 'Reports', icon: 'bi-file-earmark-bar-graph-fill', path: '/reports' },
    { name: 'Asset Maintenance', icon: 'bi-tools', path: '/asset-maintenance' },
    { name: 'Utilities', icon: 'bi-gear-fill', path: '/utilities' },
    { name: 'Sales Lead', icon: 'bi-megaphone-fill', path: '/sales-lead' },
    { name: 'Setup', icon: 'bi-wrench-adjustable', path: '/setup' },
    { name: 'Tools', icon: 'bi-screwdriver', path: '/tools' },
];