// src/pages/BookingChart.jsx
import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import CoreBookingChart from '../components/BookingChart';
import BookingChartHeader from '../components/BookingChartHeader';
import { useChartOptions } from '../hooks/useChartOptions';
import { useBookingChart } from '../hooks/useBookings';
import { downloadCsv } from '../utils/exportCsv.js';
import useAuthStore from '../store/authStore.js';

const AREA_HEIGHT_MAP = { Small: 30, Medium: 42, Large: 54 };

const EXPORT_COLUMNS = [
    'room', 'wing', 'guestName', 'masterResNo', 'resNo', 'company',
    'checkIn', 'checkOut', 'nights', 'status', 'adults', 'tariffType',
    'voucherNo', 'bkgSource',
];

const EXPORT_HEADERS = {
    room: 'Room',
    wing: 'Wing',
    guestName: 'Guest Name',
    masterResNo: 'Master Res No',
    resNo: 'Res No',
    company: 'Company / Group',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    nights: 'Nights',
    status: 'Status',
    adults: 'Adults',
    tariffType: 'Tariff Type',
    voucherNo: 'Voucher No',
    bkgSource: 'Booking Type',
};

function applyChartFilters(bookings, rooms, filters) {
    const roomMap = Object.fromEntries(rooms.map(r => [r._id || r.id || r.name, r]));

    return bookings.filter(booking => {
        const room = roomMap[booking.roomId];

        // Area filter (row-level: matches room name)
        if (filters.area) {
            const roomName = room?.name || booking.roomId || '';
            if (!roomName.toLowerCase().includes(filters.area.toLowerCase())) return false;
        }

        // Surname filter
        if (filters.surname) {
            const guestName = booking.clientName || booking.guestName || '';
            if (!guestName.toLowerCase().includes(filters.surname.toLowerCase())) return false;
        }

        // Status filter
        if (filters.status?.length > 0) {
            if (!filters.status.includes(booking.status)) return false;
        }

        // Tariff type filter
        if (filters.tariffType?.length > 0) {
            if (!filters.tariffType.includes(booking.tariffType)) return false;
        }

        return true;
    });
}

function buildExportRows(bookings, rooms) {
    const roomMap = Object.fromEntries(rooms.map(r => [r._id || r.id || r.name, r]));

    return bookings.map(b => {
        const room = roomMap[b.roomId];
        const checkIn = b.checkIn || b.startDate;
        const checkOut = b.checkOut || b.endDate;
        const nights = checkIn && checkOut
            ? dayjs(checkOut).diff(dayjs(checkIn), 'day')
            : '-';

        return {
            room: room?.name || b.roomId || '-',
            wing: room?.category || '-',
            guestName: b.clientName || b.guestName || '-',
            masterResNo: b.masterResNo || '-',
            resNo: b.resNo || b.reservationNo || '-',
            company: b.company || b.groupName || '-',
            checkIn: checkIn ? dayjs(checkIn).format('DD MMM YYYY') : '-',
            checkOut: checkOut ? dayjs(checkOut).format('DD MMM YYYY') : '-',
            nights,
            status: b.status || '-',
            adults: b.people || b.adults || '-',
            tariffType: b.tariffType || '-',
            voucherNo: b.voucherNo || '-',
            bkgSource: b.bkgSource || '-',
        };
    });
}

const BookingChartPage = () => {
    const isPortalUser = useAuthStore((s) => s.user?.role === 'portal_user');
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [collapsedCategories, setCollapsedCategories] = useState(new Set());
    const { options, saveOptions, restoreDefaults } = useChartOptions();

    const visibleDays = parseInt(options.dayView, 10) || 30;
    const rowHeight = AREA_HEIGHT_MAP[options.areaHeight] || 30;

    const [filters, setFilters] = useState({
        surname: '',
        status: [],
        tariffType: [],
        area: '',
    });

    // Shared with CoreBookingChart — React Query returns cached data so no double fetch
    const chartQuery = useBookingChart({
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(startDate).add(visibleDays, 'days').format('YYYY-MM-DD'),
    });

    const handleExport = () => {
        const bookings = chartQuery.data?.bookings || [];
        const rooms = chartQuery.data?.rooms?.map(r => ({ ...r, id: r._id || r.id })) || [];
        const filtered = applyChartFilters(bookings, rooms, filters);
        const rows = buildExportRows(filtered, rooms);

        const endDate = dayjs(startDate).add(visibleDays - 1, 'days').format('DD-MMM-YYYY');
        const from = dayjs(startDate).format('DD-MMM-YYYY');
        const filename = `Bookings_${from}_to_${endDate}`;
        downloadCsv(rows, EXPORT_COLUMNS, EXPORT_HEADERS, filename);
    };

    const toggleCategory = (category) => {
        setCollapsedCategories(prev => {
            const next = new Set(prev);
            if (next.has(category)) next.delete(category);
            else next.add(category);
            return next;
        });
    };

    const handleExpandAll = () => setCollapsedCategories(new Set());

    const handleCollapseAll = () => {
        const allCategories = new Set(
            (chartQuery.data?.rooms || []).map(r => r.category || 'Uncategorized')
        );
        setCollapsedCategories(allCategories);
    };

    return (
        <div>
            <BookingChartHeader
                currentStart={startDate}
                visibleDays={visibleDays}
                onDateChange={setStartDate}
                onDaysSelect={(v) => saveOptions({ ...options, dayView: String(v) })}
                onExpandAll={handleExpandAll}
                onCollapseAll={handleCollapseAll}
                filters={filters}
                onFiltersChange={setFilters}
                chartOptions={options}
                onChartOptionsSave={saveOptions}
                onChartOptionsRestore={restoreDefaults}
                onExport={isPortalUser ? undefined : handleExport}
                isPortalUser={isPortalUser}
            />
            <CoreBookingChart
                startDate={startDate}
                visibleDays={visibleDays}
                rowHeight={rowHeight}
                collapsedCategories={collapsedCategories}
                onToggleCategory={toggleCategory}
                filters={filters}
                chartOptions={options}
                isPortalUser={isPortalUser}
            />
        </div>
    );
};

export default BookingChartPage;
