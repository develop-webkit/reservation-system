import dayjs from 'dayjs';

/**
 * Dashboard API Service - Uses real data from Bookings, Reservations, and Rooms
 * No mock data - derives everything from actual system data
 */

/**
 * Calculate dashboard statistics from bookings and rooms data
 */
export const fetchQuickCounts = async (bookingsData, roomsData) => {
    try {
        if (!bookingsData || !roomsData) {
            throw new Error('Missing required data');
        }

        const today = dayjs().format('YYYY-MM-DD');
        const totalRooms = roomsData.length;

        // Count occupied rooms (active bookings for today)
        const activeBookingsToday = bookingsData.filter(booking => {
            try {
                const startDate = dayjs(booking.startDate).format('YYYY-MM-DD');
                const endDate = dayjs(booking.endDate).format('YYYY-MM-DD');
                return startDate <= today && endDate > today && booking.status !== 'Canceled';
            } catch (e) {
                return false;
            }
        });

        const roomsOccupied = activeBookingsToday.length;
        const roomsAvailable = totalRooms - roomsOccupied;

        // Count arrivals today
        const arrivalsToday = bookingsData.filter(booking => {
            try {
                const startDate = dayjs(booking.startDate).format('YYYY-MM-DD');
                return startDate === today && booking.status !== 'Canceled';
            } catch (e) {
                return false;
            }
        }).length;

        // Count departures today
        const departuresToday = bookingsData.filter(booking => {
            try {
                const endDate = dayjs(booking.endDate).format('YYYY-MM-DD');
                return endDate === today && booking.status !== 'Canceled';
            } catch (e) {
                return false;
            }
        }).length;

        return {
            roomsOccupied,
            roomsAvailable,
            arrivalsToday,
            departuresToday
        };
    } catch (error) {
        console.error('Error calculating quick counts:', error);
        throw error;
    }
};

/**
 * Calculate financial summary from bookings and reservations
 */
export const fetchFinancialSummary = async (bookingsData, reservationsData) => {
    try {
        if (!bookingsData || !reservationsData) {
            throw new Error('Missing required data');
        }

        const today = dayjs();
        const monthStart = today.startOf('month');

        // Today's revenue from completed/active bookings
        const todaysRevenue = bookingsData
            .filter(booking => {
                const bookingDate = dayjs(booking.startDate).startOf('day');
                return bookingDate.isSame(today, 'day') && booking.status !== 'Canceled';
            })
            .reduce((sum, booking) => sum + (booking.rate || 0), 0);

        // Month-to-date revenue
        const monthToDateRevenue = bookingsData
            .filter(booking => {
                try {
                    const bookingDate = dayjs(booking.startDate);
                    return bookingDate &&
                        bookingDate.isSameOrAfter(monthStart) &&
                        bookingDate.isSameOrBefore(today) &&
                        booking.status !== 'Canceled';
                } catch (e) {
                    return false;
                }
            })
            .reduce((sum, booking) => sum + (booking.rate || 0), 0);

        // Pending payments from unpaid reservations
        const pendingPayments = reservationsData
            .filter(res => res.balance && res.balance > 0)
            .reduce((sum, res) => sum + (res.balance || 0), 0);

        // Average room rate from active bookings
        const activeBookings = bookingsData.filter(b => b.status !== 'Canceled' && b.rate);
        const averageRoomRate = activeBookings.length > 0
            ? activeBookings.reduce((sum, b) => sum + b.rate, 0) / activeBookings.length
            : 0;

        return {
            todaysRevenue,
            monthToDateRevenue,
            pendingPayments,
            averageRoomRate
        };
    } catch (error) {
        console.error('Error calculating financial summary:', error);
        throw error;
    }
};

/**
 * Get today's activity feed from bookings
 */
export const fetchActivityFeed = async (bookingsData) => {
    try {
        if (!bookingsData) {
            throw new Error('Missing bookings data');
        }

        const today = dayjs().format('YYYY-MM-DD');
        const activities = [];

        // Arrivals today
        bookingsData.forEach(booking => {
            try {
                const startDate = dayjs(booking.startDate).format('YYYY-MM-DD');
                if (startDate === today && booking.status !== 'Canceled') {
                    activities.push({
                        id: `arrival-${booking._id}`,
                        type: 'Arrival',
                        guest: booking.guestName || booking.clientName || 'Guest',
                        time: dayjs(booking.startDate).format('h:mm A'),
                        room: booking.roomId || '',
                        notes: '',
                        timestamp: dayjs(booking.startDate)
                    });
                }

                // Departures today
                const endDate = dayjs(booking.endDate).format('YYYY-MM-DD');
                if (endDate === today && booking.status !== 'Canceled') {
                    activities.push({
                        id: `departure-${booking._id}`,
                        type: 'Departure',
                        guest: booking.guestName || booking.clientName || 'Guest',
                        time: dayjs(booking.endDate).format('h:mm A'),
                        room: booking.roomId || '',
                        notes: '',
                        timestamp: dayjs(booking.endDate)
                    });
                }
            } catch (e) {
                // Skip this booking if date parsing fails
            }
        });

        // Sort by timestamp, most recent first
        return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
    } catch (error) {
        console.error('Error fetching activity feed:', error);
        throw error;
    }
};

/**
 * Get room cleaning tasks and housekeeping needs from room status
 */
export const fetchUpcomingTasks = async (roomsData, bookingsData) => {
    try {
        if (!roomsData) {
            throw new Error('Missing rooms data');
        }

        const tasks = [];
        const today = dayjs();

        // Get rooms needing cleaning based on status
        roomsData.forEach(room => {
            // Dirty rooms (not Clean or Clean & Inspected)
            if (room.status === 'Dirty' || room.status === 'Occupied') {
                tasks.push({
                    id: `clean-${room._id}`,
                    task: `Clean Room ${room.name}`,
                    dueTime: 'ASAP',
                    priority: 'high',
                    type: 'housekeeping'
                });
            }

            // Out of order rooms
            if (room.status === 'OutOfOrder') {
                tasks.push({
                    id: `repair-${room._id}`,
                    task: `Maintenance Required - Room ${room.name}`,
                    dueTime: 'Pending',
                    priority: 'high',
                    type: 'maintenance'
                });
            }
        });

        // Check for departures today that will need immediate cleaning
        if (bookingsData) {
            const todayStr = today.format('YYYY-MM-DD');
            bookingsData.forEach(booking => {
                try {
                    const endDate = dayjs(booking.endDate).format('YYYY-MM-DD');
                    if (endDate === todayStr && booking.status !== 'Canceled') {
                        tasks.push({
                            id: `turnover-${booking._id}`,
                            task: `Room Turnover - ${booking.roomId || 'TBA'}`,
                            dueTime: '11:00 AM',
                            priority: 'high',
                            type: 'housekeeping'
                        });
                    }
                } catch (e) {
                    // Skip this booking if date parsing fails
                }
            });
        }

        return tasks.slice(0, 10); // Return top 10 tasks
    } catch (error) {
        console.error('Error fetching upcoming tasks:', error);
        throw error;
    }
};

/**
 * Calculate occupancy trend from bookings history
 */
export const fetchOccupancyChart = async (bookingsData, roomsData) => {
    try {
        if (!bookingsData || !roomsData) {
            throw new Error('Missing required data');
        }

        const totalRooms = roomsData.length;
        const occupancyData = [];
        const today = dayjs();

        // Calculate occupancy for last 6 months
        for (let i = 5; i >= 0; i--) {
            const month = today.clone().subtract(i, 'month');
            const monthStart = month.startOf('month');
            const monthEnd = month.endOf('month');

            // Count room-nights occupied in this month
            let occupiedRoomNights = 0;
            let totalRoomNights = 0;

            for (let day = monthStart.clone(); day.isSameOrBefore(monthEnd); day.add(1, 'day')) {
                totalRoomNights += totalRooms;

                const dayStr = day.format('YYYY-MM-DD');
                bookingsData.forEach(booking => {
                    try {
                        const startDate = dayjs(booking.startDate).format('YYYY-MM-DD');
                        const endDate = dayjs(booking.endDate).format('YYYY-MM-DD');
                        if (startDate <= dayStr && endDate > dayStr && booking.status !== 'Canceled') {
                            occupiedRoomNights++;
                        }
                    } catch (e) {
                        // Skip this booking if date parsing fails
                    }
                });
            }

            const occupancyPercent = totalRoomNights > 0
                ? Math.round((occupiedRoomNights / totalRoomNights) * 100)
                : 0;

            occupancyData.push({
                month: month.format('MMM YYYY'),
                occupancy: occupancyPercent,
                capacity: 100
            });
        }

        return occupancyData;
    } catch (error) {
        console.error('Error calculating occupancy chart:', error);
        throw error;
    }
};