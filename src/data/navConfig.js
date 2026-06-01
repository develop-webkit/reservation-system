// src/data/navConfig.js

export const navConfig = [
    { name: 'Dashboard', icon: 'bi-grid-fill', path: '/' },
    {
        name: 'Charts',
        icon: 'bi-bar-chart-line-fill',
        path: '/charts',
        children: [
            { name: 'Booking Chart', path: '/charts/bookingchart' },
            { name: 'To Do Chart', path: '/charts/todo' },
        ]
    },
    {
        name: 'Reservations',
        icon: 'bi-calendar-check-fill',
        path: '/reservations',
        children: [
            { name: 'Reservations List', path: '/reservations/list' },
            { name: 'Bookings by Date', path: '/reservations/by-date' },
            { name: 'Search Booking', path: '/reservations/search' },
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
    {
        name: 'Reports',
        icon: 'bi-file-earmark-bar-graph-fill',
        path: '/reports',
        children: [
            { name: 'Financial Reports', path: '/reports/financial' },
            { name: 'Guest Debtors', path: '/reports/debtors' },
        ]
    },
    { name: 'Rooms', icon: 'bi-door-open-fill', path: '/rooms' },
    { name: 'Asset Maintenance', icon: 'bi-tools', path: '/asset-maintenance' },
];