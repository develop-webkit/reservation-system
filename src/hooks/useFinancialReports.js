import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import financialReportsApi from '../api/services/financialReports';

dayjs.extend(isoWeek);

const reportKeys = {
    all: ['financial-reports'],
    reservations: (filters) => [...reportKeys.all, 'reservations', filters],
    accounting: (filters) => [...reportKeys.all, 'accounting', filters],
    bookings: (filters) => [...reportKeys.all, 'bookings', filters],
    rooms: () => [...reportKeys.all, 'rooms'],
};

// Fetch all reservations within date range
export const useReportReservations = (filters = {}) => {
    return useQuery({
        queryKey: reportKeys.reservations(filters),
        queryFn: () => financialReportsApi.getReservations(filters),
        staleTime: 1000 * 60 * 5,
    });
};

// Fetch all accounting entries
export const useReportAccounting = (filters = {}) => {
    return useQuery({
        queryKey: reportKeys.accounting(filters),
        queryFn: () => financialReportsApi.getAccounting(filters),
        staleTime: 1000 * 60 * 5,
    });
};

// Fetch all bookings
export const useReportBookings = (filters = {}) => {
    return useQuery({
        queryKey: reportKeys.bookings(filters),
        queryFn: () => financialReportsApi.getBookings(filters),
        staleTime: 1000 * 60 * 5,
    });
};

// Fetch all rooms
export const useReportRooms = () => {
    return useQuery({
        queryKey: reportKeys.rooms(),
        queryFn: () => financialReportsApi.getRooms(),
        staleTime: 1000 * 60 * 10,
    });
};

// Helper: normalize API response to array
const toArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.reservations && Array.isArray(data.reservations)) return data.reservations;
    if (data.bookings && Array.isArray(data.bookings)) return data.bookings;
    if (data.rooms && Array.isArray(data.rooms)) return data.rooms;
    if (data.entries && Array.isArray(data.entries)) return data.entries;
    return [];
};

// Filter reservations by date range on the frontend
const filterByDateRange = (reservations, startDate, endDate) => {
    if (!startDate && !endDate) return reservations;
    return reservations.filter((r) => {
        const checkIn = dayjs(r.checkIn);
        const checkOut = dayjs(r.checkOut);
        if (startDate && checkOut.isBefore(dayjs(startDate), 'day')) return false;
        if (endDate && checkIn.isAfter(dayjs(endDate), 'day')) return false;
        return true;
    });
};

// Revenue Summary: total revenue, bookings count, avg rate, occupancy %, outstanding
export const useRevenueSummary = (reservationsData, roomsData, startDate, endDate) => {
    return useMemo(() => {
        const reservations = filterByDateRange(toArray(reservationsData), startDate, endDate);
        const rooms = toArray(roomsData);

        const totalRevenue = reservations.reduce((sum, r) => sum + (Number(r.totalTariff) || 0), 0);
        const bookingsCount = reservations.length;
        const avgRate = bookingsCount > 0 ? totalRevenue / bookingsCount : 0;
        const outstandingBalances = reservations.reduce((sum, r) => sum + (Number(r.balance) || 0), 0);

        // Occupancy: count room-nights in date range
        const totalRooms = rooms.length || 1;
        const start = startDate ? dayjs(startDate) : dayjs().startOf('month');
        const end = endDate ? dayjs(endDate) : dayjs().endOf('month');
        const totalDays = Math.max(end.diff(start, 'day'), 1);
        const totalRoomNights = totalRooms * totalDays;

        let occupiedNights = 0;
        reservations.forEach((r) => {
            const rStart = dayjs(r.checkIn).isBefore(start) ? start : dayjs(r.checkIn);
            const rEnd = dayjs(r.checkOut).isAfter(end) ? end : dayjs(r.checkOut);
            const nights = Math.max(rEnd.diff(rStart, 'day'), 0);
            occupiedNights += nights;
        });

        const occupancyRate = totalRoomNights > 0
            ? Math.min((occupiedNights / totalRoomNights) * 100, 100)
            : 0;

        return {
            totalRevenue,
            bookingsCount,
            avgRate,
            occupancyRate,
            outstandingBalances,
            totalRoomNights,
            occupiedNights,
        };
    }, [reservationsData, roomsData, startDate, endDate]);
};

// Revenue Trend: group by period (daily/weekly/monthly/yearly)
export const useRevenueTrend = (reservationsData, period, startDate, endDate) => {
    return useMemo(() => {
        const reservations = filterByDateRange(toArray(reservationsData), startDate, endDate);

        const formatMap = {
            daily: 'YYYY-MM-DD',
            weekly: 'YYYY-[W]WW',
            monthly: 'YYYY-MM',
            yearly: 'YYYY',
        };
        const fmt = formatMap[period] || formatMap.monthly;

        const grouped = {};
        reservations.forEach((r) => {
            const key = dayjs(r.checkIn).format(fmt);
            if (!grouped[key]) grouped[key] = { period: key, revenue: 0, count: 0 };
            grouped[key].revenue += Number(r.totalTariff) || 0;
            grouped[key].count += 1;
        });

        return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));
    }, [reservationsData, period, startDate, endDate]);
};

// Revenue By Room
export const useRevenueByRoom = (reservationsData, startDate, endDate) => {
    return useMemo(() => {
        const reservations = filterByDateRange(toArray(reservationsData), startDate, endDate);

        const grouped = {};
        reservations.forEach((r) => {
            const roomName = r.room?.name || r.room?.importId || 'Unknown';
            const roomId = r.room?._id || r.room || 'unknown';
            const key = typeof roomId === 'string' ? roomId : String(roomId);
            if (!grouped[key]) grouped[key] = { room: roomName, revenue: 0, count: 0 };
            grouped[key].revenue += Number(r.totalTariff) || 0;
            grouped[key].count += 1;
        });

        return Object.values(grouped).sort((a, b) => b.revenue - a.revenue);
    }, [reservationsData, startDate, endDate]);
};

// Revenue By Source
export const useRevenueBySource = (reservationsData, startDate, endDate) => {
    return useMemo(() => {
        const reservations = filterByDateRange(toArray(reservationsData), startDate, endDate);

        const grouped = {};
        reservations.forEach((r) => {
            const source = r.bookingSource || 'Direct';
            if (!grouped[source]) grouped[source] = { source, revenue: 0, count: 0 };
            grouped[source].revenue += Number(r.totalTariff) || 0;
            grouped[source].count += 1;
        });

        return Object.values(grouped).sort((a, b) => b.revenue - a.revenue);
    }, [reservationsData, startDate, endDate]);
};

// Guest Payments: join reservations with accounting entries
export const useGuestPayments = (reservationsData, accountingData, startDate, endDate) => {
    return useMemo(() => {
        const reservations = filterByDateRange(toArray(reservationsData), startDate, endDate);
        const entries = toArray(accountingData);

        // Index accounting entries by reservation ID
        const entryMap = {};
        entries.forEach((e) => {
            const resId = e.reservation?._id || e.reservation;
            if (!resId) return;
            const key = String(resId);
            if (!entryMap[key]) entryMap[key] = [];
            entryMap[key].push(e);
        });

        return reservations.map((r) => {
            const resId = String(r._id);
            const resEntries = entryMap[resId] || [];
            const totalPayments = resEntries
                .filter((e) => e.type === 'Payment')
                .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
            const totalInvoiced = resEntries
                .filter((e) => e.type === 'Invoice')
                .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

            return {
                _id: r._id,
                resNo: r.resNo,
                guestName: r.guestName,
                room: r.room?.name || 'N/A',
                checkIn: r.checkIn,
                checkOut: r.checkOut,
                totalTariff: Number(r.totalTariff) || 0,
                totalPayments,
                totalInvoiced,
                balance: Number(r.balance) || 0,
                status: r.status,
                bookingSource: r.bookingSource || 'Direct',
                entries: resEntries,
            };
        });
    }, [reservationsData, accountingData, startDate, endDate]);
};

// Guest Debtors: group reservations by guest, aggregate tariff/balance and rooms
export const useGuestDebtors = (reservationsData, accountingData, startDate, endDate) => {
    return useMemo(() => {
        const reservations = filterByDateRange(toArray(reservationsData), startDate, endDate);
        const entries = toArray(accountingData);

        // Index payments per reservation ID
        const paymentsByRes = {};
        entries.forEach((e) => {
            if (e.type !== 'Payment') return;
            const resId = e.reservation?._id || e.reservation;
            if (!resId) return;
            const key = String(resId);
            paymentsByRes[key] = (paymentsByRes[key] || 0) + (Number(e.amount) || 0);
        });

        const grouped = {};
        reservations.forEach((r) => {
            const clientName = (r.clientName || r.guestName || r.createdBy || 'Unknown').trim();
            const createdBy = r.createdBy || '-';
            const key = clientName.toLowerCase();

            if (!grouped[key]) {
                grouped[key] = {
                    clientName,
                    createdBy,
                    clientNo: r.client?.clientNo || r.clientNo || '-',
                    rooms: new Set(),
                    bookingsCount: 0,
                    totalTariff: 0,
                    totalPaid: 0,
                    totalBalance: 0,
                    reservations: [],
                    lastCheckIn: null,
                    sources: new Set(),
                };
            }

            const roomName = r.roomId || r.room?.name || r.room?.importId || 'Unknown';
            grouped[key].rooms.add(roomName);
            grouped[key].bookingsCount += 1;
            grouped[key].totalTariff += Number(r.totalTariff) || 0;
            grouped[key].totalBalance += Number(r.balance) || 0;
            grouped[key].totalPaid += paymentsByRes[String(r._id)] || 0;
            grouped[key].reservations.push(r);
            if (r.bookingSource) grouped[key].sources.add(r.bookingSource);

            const checkIn = r.checkIn ? dayjs(r.checkIn) : null;
            if (checkIn && (!grouped[key].lastCheckIn || checkIn.isAfter(grouped[key].lastCheckIn))) {
                grouped[key].lastCheckIn = checkIn;
            }
        });

        return Object.values(grouped)
            .map((g) => ({
                ...g,
                rooms: Array.from(g.rooms).sort(),
                sources: Array.from(g.sources),
                lastCheckIn: g.lastCheckIn ? g.lastCheckIn.toDate() : null,
            }))
            .sort((a, b) => b.totalBalance - a.totalBalance);
    }, [reservationsData, accountingData, startDate, endDate]);
};

// Expense Summary: filter accounting entries by type
export const useExpenseSummary = (accountingData, startDate, endDate) => {
    return useMemo(() => {
        let entries = toArray(accountingData);

        if (startDate || endDate) {
            entries = entries.filter((e) => {
                const d = dayjs(e.entryDate);
                if (startDate && d.isBefore(dayjs(startDate), 'day')) return false;
                if (endDate && d.isAfter(dayjs(endDate), 'day')) return false;
                return true;
            });
        }

        const byType = {};
        entries.forEach((e) => {
            const type = e.type || 'Other';
            if (!byType[type]) byType[type] = { type, total: 0, count: 0 };
            byType[type].total += Number(e.amount) || 0;
            byType[type].count += 1;
        });

        const totalExpenses = entries
            .filter((e) => e.type !== 'Payment' && e.type !== 'Invoice')
            .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

        // Trend by month
        const monthlyTrend = {};
        entries.forEach((e) => {
            const key = dayjs(e.entryDate).format('YYYY-MM');
            if (!monthlyTrend[key]) monthlyTrend[key] = { period: key, total: 0, count: 0 };
            monthlyTrend[key].total += Number(e.amount) || 0;
            monthlyTrend[key].count += 1;
        });

        return {
            byType: Object.values(byType),
            totalExpenses,
            monthlyTrend: Object.values(monthlyTrend).sort((a, b) => a.period.localeCompare(b.period)),
            entries,
        };
    }, [accountingData, startDate, endDate]);
};
