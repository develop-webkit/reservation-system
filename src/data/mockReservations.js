// src/data/mockReservations.js (Create this file)
export const mockReservations = Array.from({ length: 100 }, (_, i) => ({
    id: 1000 + i,
    guestName: `Guest ${String.fromCharCode(65 + (i % 26))}${i}`,
    roomNumber: (i % 50) + 101,
    checkIn: `2025-12-${(i % 28) + 1}`,
    checkOut: `2025-12-${(i % 28) + 5}`,
    status: ['Confirmed', 'Checked In', 'Canceled', 'Tentative'][i % 4],
    rate: 150.00 + (i % 10),
    source: ['Web', 'Walk-in', 'Booking.com'][i % 3],
}));