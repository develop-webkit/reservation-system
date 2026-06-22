// src/components/BookingChart.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Tooltip, Popover, Card, Spin, Alert, message, Modal, Input, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useBookingChart, useUpdateBookingChart } from '../hooks/useBookings';
import { useRooms, useUpdateRoomServiceStatus, useUpdateRoomStatus, useRemoveRoomServiceEntry } from '../hooks/useRooms';
import { rooms as roomsFromData } from '../data/rooms';


const { Text } = Typography;

const STATUS_COLORS = {
    'Unconfirmed': '#faad14',      // Orange/Yellow
    'Confirmed': '#52c41a',        // Green
    'Arrived': '#1890ff',          // Blue
    'Checked In': '#1890ff',       // Blue
    'Pre Check In': '#13c2c2',     // Cyan
    'Departed': '#eb2f96',         // Pink
    'Checked Out': '#eb2f96',      // Pink
    'Canceled': '#d9d9d9',         // Grey - cancelled
    'Cancelled': '#d9d9d9',        // Grey - cancelled
    'Requested': '#8c8c8c',        // Grey - requested to admin
    'Out of Order': '#722ed1',     // Purple
    'Out of Service': '#003a8c',   // Dark Blue
};

const ROOM_STATUS_COLORS = {
    'CLEAN': '#52c41a', // Green
    'DIRTY': '#f5222d', // Red
    'INSPECT': '#faad14', // Occupied/Inspect (Orange)
    'OOO': '#722ed1',   // Out of Order (Purple)
};

const CoreBookingChart = ({ startDate, visibleDays = 30, rowHeight: rowHeightProp, collapsedCategories, onToggleCategory, propertyName = "Mount Morgan Space Solutions", filters = {}, chartOptions = {}, isPortalUser = false }) => {
    const rowHeight = rowHeightProp || 30;
    const { isLoading: roomsLoading, error: roomsError } = useRooms();

    const navigate = useNavigate();
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, room: null, date: null, booking: null, serviceEntry: null });
    const [resizeDraft, setResizeDraft] = useState(null);
    const [serviceModal, setServiceModal] = useState({ visible: false, type: null, roomId: null, description: '', startDate: null, endDate: null });
    const updateBookingChartMutation = useUpdateBookingChart();
    const updateRoomServiceStatusMutation = useUpdateRoomServiceStatus();
    const removeServiceEntryMutation = useRemoveRoomServiceEntry();
    const updateRoomStatusMutation = useUpdateRoomStatus();

    // Fetch chart data with date range
    const { data: chartData, isLoading: chartLoading, error: chartError } = useBookingChart({
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(startDate).add(visibleDays, 'days').format('YYYY-MM-DD')
    });

    // Extract bookings and rooms from the API response object { rooms, bookings }
    const bookingsData = chartData?.bookings || [];

    // Prioritize API rooms, fallback to local data if needed
    // Ensure API rooms have 'id' property mapped from '_id' if missing
    const rooms = useMemo(() => {
        const source = chartData?.rooms
            ? chartData.rooms.map(r => ({ ...r, id: r._id || r.id }))
            : roomsFromData;
        return isPortalUser ? source.filter(r => r.category !== 'Staff Accommodation') : source;
    }, [chartData, isPortalUser]);


    // 1. Generate column dates (Immutable)
    const dateRange = useMemo(() => {
        const dates = [];
        const start = dayjs(startDate).startOf('day');
        for (let i = 0; i < visibleDays; i++) {
            dates.push(start.add(i, 'days').format('YYYY-MM-DD'));
        }
        return dates;
    }, [startDate, visibleDays]);

    // Each visible day is split into 2 sub-columns: AM (left half) and PM (right half).
    // Bookings: bar starts at PM of check-in day, ends at AM of checkout day.
    //   → same-day turnover: departing guest fills AM, arriving guest fills PM on the shared date.
    // Service entries (inclusive=true): full-day coverage — AM of start through PM of end day.
    const getGridPosition = useCallback((checkIn, checkOut, inclusive = false) => {
        const chartStart = dayjs(dateRange[0]).startOf('day');
        const bStart = dayjs(checkIn).startOf('day');
        const bEnd = dayjs(checkOut).startOf('day');
        const startOffset = bStart.diff(chartStart, 'days');
        const endOffset = bEnd.diff(chartStart, 'days');
        const totalSubCols = visibleDays * 2;

        let startSubCol, endSubCol;
        if (inclusive) {
            // Service entries: full day — AM of startDate through PM of endDate
            startSubCol = startOffset * 2 + 1;
            endSubCol = endOffset * 2 + 3;
        } else {
            // Bar starts at PM sub-col of check-in day and ends at the AM sub-col of checkout day.
            // gridColumnEnd at (endOffset*2+2) = the line AFTER AM of checkout day, so PM of checkout is NOT included.
            // This gives: check-in day = right-half coloured, checkout day = left-half coloured, PM free for same-day arrival.
            startSubCol = startOffset * 2 + 2;   // start of PM on check-in day
            endSubCol = endOffset * 2 + 2;        // end of AM on checkout day (PM sub-col excluded)
        }

        return {
            start: startSubCol,
            end: endSubCol,
            isVisible: !(endSubCol <= 1 || startSubCol > totalSubCols),
        };
    }, [dateRange, visibleDays]);

    const getDisplayedBookingDates = useCallback((booking) => {
        if (resizeDraft?.bookingId === booking.id) {
            return {
                checkIn: resizeDraft.startDate,
                checkOut: resizeDraft.endDate,
            };
        }

        return {
            checkIn: booking.checkIn || booking.startDate,
            checkOut: booking.checkOut || booking.endDate,
        };
    }, [resizeDraft]);

    const handleResizeStart = useCallback((event, booking, edge) => {
        event.preventDefault();
        event.stopPropagation();

        const grid = event.currentTarget.closest('[data-booking-grid="true"]');
        if (!grid) {
            return;
        }

        const gridRect = grid.getBoundingClientRect();
        const cellWidth = gridRect.width / visibleDays;
        const originalStart = dayjs(booking.checkIn || booking.startDate).startOf('day');
        const originalEnd = dayjs(booking.checkOut || booking.endDate).startOf('day');
        const originalDraft = {
            bookingId: booking.id,
            startDate: originalStart.format('YYYY-MM-DD'),
            endDate: originalEnd.format('YYYY-MM-DD'),
        };

        let nextStart = originalStart;
        let nextEnd = originalEnd;

        setResizeDraft(originalDraft);

        const handleMouseMove = (moveEvent) => {
            const deltaDays = Math.round((moveEvent.clientX - event.clientX) / cellWidth);

            if (edge === 'start') {
                nextStart = originalStart.add(deltaDays, 'day');
                if (!nextStart.isBefore(originalEnd, 'day')) {
                    nextStart = originalEnd.subtract(1, 'day');
                }
            } else {
                nextEnd = originalEnd.add(deltaDays, 'day');
                if (!nextEnd.isAfter(originalStart, 'day')) {
                    nextEnd = originalStart.add(1, 'day');
                }
            }

            setResizeDraft({
                bookingId: booking.id,
                startDate: nextStart.format('YYYY-MM-DD'),
                endDate: nextEnd.format('YYYY-MM-DD'),
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            const changed =
                !nextStart.isSame(originalStart, 'day') ||
                !nextEnd.isSame(originalEnd, 'day');

            const finalDraft = {
                bookingId: booking.id,
                startDate: nextStart.format('YYYY-MM-DD'),
                endDate: nextEnd.format('YYYY-MM-DD'),
            };

            setResizeDraft(null);

            if (!changed) {
                return;
            }

            updateBookingChartMutation.mutate(
                {
                    id: booking.id,
                    data: {
                        startDate: finalDraft.startDate,
                        endDate: finalDraft.endDate,
                    },
                },
                {
                    onSuccess: () => {
                        message.success('Booking dates updated.');
                    },
                    onError: (error) => {
                        message.error(error.response?.data?.message || 'Failed to update booking dates.');
                    },
                },
            );
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [updateBookingChartMutation, visibleDays]);


    // Group rooms by category
    const { topLevelRooms, groupedRooms } = useMemo(() => {
        const top = [];
        const groups = {};

        rooms.forEach(room => {
            if (!room.category) {
                top.push(room);
            } else {
                if (!groups[room.category]) groups[room.category] = [];
                groups[room.category].push(room);
            }
        });
        return { topLevelRooms: top, groupedRooms: groups };
    }, [rooms]);

    // Loading state
    if (chartLoading || roomsLoading) {
        return (
            <Card style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" spinning={true}>
                    <div style={{ padding: '50px' }}>Loading booking data...</div>
                </Spin>
            </Card>
        );
    }

    // Error state
    if (chartError || roomsError) {
        return (
            <Card>
                <Alert
                    message="Error Loading Data"
                    description={`Failed to load ${chartError ? 'bookings' : 'rooms'}. Please try again.`}
                    type="error"
                    showIcon
                />
            </Card>
        );
    }

    // Helper to render a single room row
    const renderRoomRow = (room) => {
        // Area filter is row-level: hide the entire row if it doesn't match
        if (filters.area && !room.name?.toLowerCase().includes(filters.area.toLowerCase())) {
            return null;
        }

        const isParkedRow = room.id === 'PK01';
        const rowHeightPx = isParkedRow ? `${rowHeight * 2}px` : `${rowHeight}px`;

        const cleanStatus = room.status || room.defaultCleanStatus || 'Clean';
        // Determine status dot from active/future service entries (not expired ones)
        const today = dayjs().startOf('day');
        const upcomingEntries = (room.serviceEntries || []).filter(
            (e) => e.endDate && !dayjs(e.endDate).isBefore(today),
        );
        const hasOOS = upcomingEntries.some((e) => e.type === 'out_of_service');
        const hasOOO = upcomingEntries.some((e) => e.type === 'out_of_order');
        const firstActive = upcomingEntries[0];
        const statusColor = hasOOS
            ? '#003a8c'
            : hasOOO
                ? ROOM_STATUS_COLORS['OOO']
                : (ROOM_STATUS_COLORS[cleanStatus.toUpperCase()] || ROOM_STATUS_COLORS['CLEAN']);
        const roomStatusText = hasOOS
            ? `Out of Service${firstActive?.description ? ': ' + firstActive.description : ''}`
            : hasOOO
                ? `Out of Order${firstActive?.description ? ': ' + firstActive.description : ''}`
                : cleanStatus;

        const RoomInfoContent = (
            <div style={{ width: '300px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                <div style={{
                    backgroundColor: '#2c3e50',
                    color: '#fff',
                    padding: '12px 16px',
                    margin: '-12px -16px 12px -16px',
                    borderRadius: '4px 4px 0 0'
                }}>
                    <Text strong style={{ color: '#fff', fontSize: '16px' }}>Area Information</Text>
                </div>
                <div style={{ padding: '0 8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', alignItems: 'baseline', marginBottom: '8px' }}>
                        <Text strong style={{ textAlign: 'right' }}>Property Name:</Text>
                        <Text>{propertyName}</Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', alignItems: 'baseline', marginBottom: '8px' }}>
                        <Text strong style={{ textAlign: 'right' }}>Room Type:</Text>
                        <Text>{room.category || 'N/A'}</Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', alignItems: 'baseline', marginBottom: '8px' }}>
                        <Text strong style={{ textAlign: 'right' }}>Area:</Text>
                        <Text>{room.name}</Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', alignItems: 'baseline' }}>
                        <Text strong style={{ textAlign: 'right' }}>Clean Status:</Text>
                        <Text>{roomStatusText}</Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', alignItems: 'baseline', marginTop: '4px' }}>
                        <Text strong style={{ textAlign: 'right' }}>Last Clean:</Text>
                        <Text>{room.lastCleanDate}</Text>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', alignItems: 'baseline', marginTop: '4px' }}>
                        <Text strong style={{ textAlign: 'right' }}>Days Since:</Text>
                        <Text>{room.daysSinceLastClean}</Text>
                    </div>
                </div>
            </div>
        );

        // Pre-process bookings for this room to determine vertical stacking for 'Parked' row
        let roomBookings = bookingsData.filter(b => b.roomId === room.id || b.roomId === room.name);

        // Apply filters
        if (filters && Object.keys(filters).length > 0) {
            roomBookings = roomBookings.filter(booking => {
                // Surname filter
                if (filters.surname) {
                    const guestName = booking.clientName || booking.guestName || '';
                    if (!guestName.toLowerCase().includes(filters.surname.toLowerCase())) {
                        return false;
                    }
                }

                // Status filter
                if (filters.status && filters.status.length > 0) {
                    if (!filters.status.includes(booking.status)) {
                        return false;
                    }
                }

                // Tariff Type filter
                if (filters.tariffType && filters.tariffType.length > 0) {
                    if (!filters.tariffType.includes(booking.tariffType)) {
                        return false;
                    }
                }

                return true;
            });
        }

        // Map to store visual properties (like vertical track) for each booking
        const bookingLayout = {};

        if (isParkedRow) {
            // Sort by check-in time to greedy assign tracks
            roomBookings.sort((a, b) => dayjs(a.checkIn || a.startDate).valueOf() - dayjs(b.checkIn || b.startDate).valueOf());

            const tracks = []; // Array of end times for each track

            roomBookings.forEach(booking => {
                const startVal = dayjs(booking.checkIn || booking.startDate).valueOf();
                let assignedTrack = -1;

                // Find the first track where this booking fits
                for (let i = 0; i < tracks.length; i++) {
                    if (tracks[i] <= startVal) {
                        assignedTrack = i;
                        tracks[i] = dayjs(booking.checkOut || booking.endDate).valueOf(); // Update track end time
                        break;
                    }
                }

                // If no track found, create a new one (up to a limit if desired, but flexible here)
                if (assignedTrack === -1) {
                    assignedTrack = tracks.length;
                    tracks.push(dayjs(booking.checkOut || booking.endDate).valueOf());
                }

                bookingLayout[booking.id] = { track: assignedTrack };
            });
        }

        return (
            <div key={room.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', height: rowHeightPx, borderBottom: '1px solid #f0f0f0' }}>
                <Popover content={RoomInfoContent} trigger="hover" placement="rightTop" styles={{ content: { padding: '12px 16px' } }}>
                    <div
                        style={{ padding: '0 12px', borderRight: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', cursor: 'pointer' }}
                        onContextMenu={(e) => handleContextMenu(e, room, null)}
                    >
                        <Text strong style={{ fontSize: '12px' }}>{room.name}</Text>
                        <Tooltip title={roomStatusText}>
                            <div style={{
                                width: '11px', height: '11px', borderRadius: '50%',
                                backgroundColor: statusColor,
                                flexShrink: 0
                            }} />
                        </Tooltip>
                    </div>
                </Popover>
                <div data-booking-grid="true" style={{ display: 'grid', gridTemplateColumns: `repeat(${visibleDays * 2}, 1fr)`, position: 'relative' }}>
                    {dateRange.map((date, idx) => {
                        const dayOfWeek = dayjs(date).day();
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                        return (
                            <div
                                key={date}
                                style={{ borderRight: '1px solid #f0f0f0', gridColumn: `${idx * 2 + 1} / span 2`, gridRow: 1, backgroundColor: isWeekend ? '#FAFAFA' : 'transparent', height: '100%', cursor: 'pointer' }}
                                onContextMenu={(e) => handleContextMenu(e, room, date)}
                            />
                        );
                    })}
                    {/* Service blocks — one bar per entry; right-click to remove */}
                    {(room.serviceEntries || []).map((entry) => {
                        if (!entry.startDate || !entry.endDate) return null;
                        const servicePos = getGridPosition(entry.startDate, entry.endDate, true);
                        if (!servicePos.isVisible) return null;
                        const isOOS = entry.type === 'out_of_service';
                        const serviceColor = isOOS ? '#003a8c' : '#722ed1';
                        const serviceLabel = `${isOOS ? 'Out Of Service' : 'Out Of Order'}${entry.description ? ': ' + entry.description : ''}`;
                        const entryId = entry._id || entry.id;
                        const ServiceBlockContent = (
                            <div style={{ width: 280 }}>
                                <div style={{ backgroundColor: serviceColor, color: '#fff', padding: '10px 14px', margin: '-12px -16px 12px -16px', borderRadius: '4px 4px 0 0' }}>
                                    <Text strong style={{ color: '#fff' }}>{isOOS ? 'Out Of Service' : 'Out Of Order'}</Text>
                                </div>
                                <div style={{ padding: '0 4px' }}>
                                    {[
                                        { label: 'Description', value: entry.description || '-' },
                                        { label: 'From Date', value: dayjs(entry.startDate).format('ddd DD MMM YYYY HH:mm') },
                                        { label: 'To Date', value: dayjs(entry.endDate).format('ddd DD MMM YYYY HH:mm') },
                                        { label: 'Area', value: room.name },
                                        { label: 'Status', value: isOOS ? 'Out Of Service' : 'Out Of Order' },
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 8, marginBottom: 6 }}>
                                            <Text strong style={{ fontSize: 12, textAlign: 'right' }}>{item.label}</Text>
                                            <Text style={{ fontSize: 12 }}>{item.value}</Text>
                                        </div>
                                    ))}
                                    <div style={{ marginTop: 8, fontSize: 11, color: '#888' }}>Right-click to remove this entry</div>
                                </div>
                            </div>
                        );
                        return (
                            <Popover key={entryId} content={ServiceBlockContent} trigger="hover" placement="rightTop" styles={{ content: { padding: '12px 16px' } }}>
                                <div
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setContextMenu({
                                            visible: true,
                                            x: e.pageX, y: e.pageY,
                                            room,
                                            date: null, booking: null,
                                            serviceEntry: { id: entryId, type: entry.type, description: entry.description },
                                        });
                                    }}
                                    style={{
                                        gridColumnStart: Math.max(1, servicePos.start),
                                        gridColumnEnd: Math.min(visibleDays * 2 + 1, servicePos.end),
                                        gridRow: 1,
                                        zIndex: 2,
                                        height: '22px',
                                        backgroundColor: serviceColor,
                                        borderRadius: '4px',
                                        margin: '0 2px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#fff',
                                        padding: '0 8px',
                                        overflow: 'hidden',
                                        cursor: 'context-menu',
                                        alignSelf: 'center',
                                    }}
                                >
                                    <Text ellipsis style={{ color: '#fff', fontSize: '10px', width: '100%', textAlign: 'center' }}>
                                        {serviceLabel}
                                    </Text>
                                </div>
                            </Popover>
                        );
                    })}
                    {roomBookings.map(booking => {
                        const { checkIn, checkOut } = getDisplayedBookingDates(booking);
                        const pos = getGridPosition(checkIn, checkOut);
                        if (!pos.isVisible) return null;

                        // Use the booking object directly as it comes from reservations.js now
                        const displayBooking = { ...booking, checkIn, checkOut };

                        const ReservationInfoContent = (
                            <div style={{ width: '350px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                                <div style={{
                                    backgroundColor: '#2c3e50',
                                    color: '#fff',
                                    padding: '12px 16px',
                                    margin: '-12px -16px 12px -16px',
                                    borderRadius: '4px 4px 0 0'
                                }}>
                                    <Text strong style={{ color: '#fff', fontSize: '16px' }}>Reservation No: {displayBooking.resNo || displayBooking.reservationNo || 'N/A'}</Text>
                                </div>
                                <div style={{ padding: '0 8px' }}>
                                    {[
                                        { label: 'Master Res No', value: displayBooking.masterResNo },
                                        { label: 'Reservation No', value: displayBooking.resNo || displayBooking.reservationNo },
                                        { label: 'Groupname', value: displayBooking.groupName },
                                        { label: 'Client Name', value: displayBooking.clientName || displayBooking.guestName },
                                        { label: 'Arrive', value: `${dayjs(displayBooking.checkIn).format('ddd DD MMM YYYY')} ${displayBooking.arriveTime || ''}` },
                                        { label: 'Depart', value: `${dayjs(displayBooking.checkOut).format('ddd DD MMM YYYY')} ${displayBooking.departTime || ''}` },
                                        { label: 'Property', value: propertyName },
                                        { label: 'Room Type', value: room.category },
                                        { label: 'Area', value: room.name },
                                        { label: 'Status', value: displayBooking.status || 'Unknown' },
                                        { label: 'People', value: displayBooking.people },
                                        { label: 'Bkg Source', value: displayBooking.bkgSource },
                                        { label: 'Tariff Type', value: displayBooking.tariffType },
                                        { label: 'Caravan Sales Slide', value: displayBooking.caravanSalesSlide },
                                        { label: 'Company', value: displayBooking.company },
                                        { label: 'Fixed', value: displayBooking.isFixed ? 'Yes' : 'No' },
                                        // Added fields from reservations.js
                                        { label: 'Voucher No', value: displayBooking.voucherNo },
                                        { label: 'Created By', value: displayBooking.createdBy },
                                        { label: 'Date Made', value: displayBooking.createDate },
                                        { label: 'Confirmed By', value: displayBooking.confirmedBy },
                                        { label: 'Date Confirmed', value: displayBooking.confirmedDate }
                                    ].map((item, index) => (
                                        <div key={index} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '8px', alignItems: 'baseline', marginBottom: '4px' }}>
                                            <Text strong style={{ textAlign: 'right', fontSize: '12px' }}>{item.label}</Text>
                                            <Text style={{ fontSize: '12px' }}>{item.value || '-'}</Text>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );

                        // Dynamic styling for stacked vs normal
                        const trackIndex = isParkedRow && bookingLayout[booking.id] ? bookingLayout[booking.id].track : 0;
                        const topPosition = isParkedRow ? (trackIndex * 26 + 4) : undefined; // 4px padding top, 26px step
                        const alignProp = isParkedRow ? 'start' : 'center'; // use alignSelf 'center' for normal

                        return (
                            <Popover key={booking.id} content={ReservationInfoContent} trigger="hover" placement="rightTop" styles={{ content: { padding: '12px 16px' } }}>
                                <div
                                    onContextMenu={(e) => { e.stopPropagation(); handleContextMenu(e, room, null, booking); }}
                                    style={{
                                    gridColumnStart: Math.max(1, pos.start),
                                    gridColumnEnd: Math.min(visibleDays * 2 + 1, pos.end),
                                    gridRow: 1,
                                    zIndex: 2,
                                    height: '22px',
                                    backgroundColor: STATUS_COLORS[booking.status] || '#1890ff',
                                    borderRadius: '4px',
                                    margin: '0 2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#fff',
                                    padding: '0 4px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    alignSelf: alignProp,
                                    marginTop: isParkedRow ? `${topPosition}px` : 0,
                                    position: isParkedRow ? 'absolute' : 'relative',
                                    top: isParkedRow ? `${topPosition}px` : 'auto',
                                    width: isParkedRow ? 'calc(100% - 4px)' : 'auto'
                                }}>
                                    <div
                                        onMouseDown={(event) => handleResizeStart(event, booking, 'start')}
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: '8px',
                                            cursor: 'ew-resize',
                                            zIndex: 3,
                                        }}
                                    />
                                    <Text ellipsis style={{ color: '#fff', fontSize: '10px', width: '100%', textAlign: 'center', padding: '0 8px' }}>
                                        {booking.clientName}
                                    </Text>
                                    <div
                                        onMouseDown={(event) => handleResizeStart(event, booking, 'end')}
                                        style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: '8px',
                                            cursor: 'ew-resize',
                                            zIndex: 3,
                                        }}
                                    />
                                </div>
                            </Popover>
                        );
                    })}
                </div>
            </div>
        );
    };



    const handleContextMenu = (e, room, date, booking = null) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            room: room || null,
            date: date || null,
            booking: booking || null,
            serviceEntry: null,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false, serviceEntry: null });
    };

    const handleRemoveServiceEntry = () => {
        const roomId = contextMenu.room?._id || contextMenu.room?.id;
        const entryId = contextMenu.serviceEntry?.id;
        if (!roomId || !entryId) return;
        handleCloseContextMenu();
        removeServiceEntryMutation.mutate(
            { roomId, entryId },
            {
                onSuccess: () => message.success('Service entry removed'),
                onError: (err) => message.error(err.response?.data?.message || 'Failed to remove entry'),
            },
        );
    };

    const handleOpenServiceModal = (type) => {
        const room = contextMenu.room;
        const roomId = room?._id || room?.id;
        if (!room || !roomId) { message.error('Please right-click on a room row to use this option'); return; }
        const defaultStart = contextMenu.date ? dayjs(contextMenu.date) : dayjs();
        const defaultEnd = defaultStart.add(1, 'day');
        setServiceModal({ visible: true, type, roomId, description: '', startDate: defaultStart, endDate: defaultEnd });
        handleCloseContextMenu();
    };

    const handleConfirmServiceStatus = () => {
        const { roomId, type, description, startDate, endDate } = serviceModal;
        if (!startDate || !endDate) { message.error('Please select a start and end date'); return; }
        if (!dayjs(endDate).isAfter(dayjs(startDate))) { message.error('End date must be after start date'); return; }
        updateRoomServiceStatusMutation.mutate(
            {
                id: roomId,
                type,
                description,
                startDate: dayjs(startDate).toISOString(),
                endDate: dayjs(endDate).toISOString(),
            },
            {
                onSuccess: () => {
                    message.success(type === 'out_of_service' ? 'Room marked as Out Of Service' : 'Room marked as Out Of Order');
                    setServiceModal({ visible: false, type: null, roomId: null, description: '', startDate: null, endDate: null });
                },
                onError: (err) => {
                    message.error(err.response?.data?.message || 'Failed to update room status');
                },
            }
        );
    };

    const handleChangeRoomStatus = (status) => {
        const roomId = contextMenu.room?._id || contextMenu.room?.id;
        if (!roomId) { message.error('Room ID not found'); return; }
        handleCloseContextMenu();
        updateRoomStatusMutation.mutate(
            { id: roomId, status },
            {
                onSuccess: () => message.success(`Room marked as ${status}`),
                onError: (err) => message.error(err.response?.data?.message || 'Failed to update room status'),
            }
        );
    };

    const handleMenuItemClick = (action) => {
        if (action === 'add_reservation') {
            const params = new URLSearchParams();
            if (contextMenu.date) {
                params.set('arrive', contextMenu.date);
            }
            if (contextMenu.room) {
                params.set('area', contextMenu.room.name);
                params.set('roomType', contextMenu.room.category || '');
            }
            navigate(`/reservations/list?${params.toString()}`);
        } else if (action === 'edit_booking') {
            if (contextMenu.booking) {
                const booking = contextMenu.booking;
                const params = new URLSearchParams();

                // reservationId drives edit mode in ReservationsListPage
                if (booking.reservationId) params.set('reservationId', booking.reservationId);

                // Pre-fill all form fields
                if (booking.resNo) params.set('resNo', booking.resNo);
                if (booking.masterResNo) params.set('masterResNo', booking.masterResNo);
                params.set('arrive', booking.checkIn || booking.startDate || '');
                params.set('depart', booking.checkOut || booking.endDate || '');
                params.set('area', booking.roomId || contextMenu.room?.name || '');
                params.set('roomType', contextMenu.room?.category || '');
                if (booking.clientId || booking.client) params.set('clientId', booking.clientId || booking.client);
                params.set('given', booking.clientName?.split(' ')[0] || '');
                params.set('surname', booking.clientName?.split(' ').slice(1).join(' ') || '');
                params.set('status', booking.status || 'Confirmed');
                params.set('company', booking.company || '');
                params.set('bkgSource', booking.bkgSource || '');
                params.set('tariffType', booking.tariffType || 'Corporate');
                params.set('totalTariff', booking.balance || '0.00');
                params.set('fixed', booking.isFixed ? 'Yes' : 'No');
                params.set('groupname', booking.groupName || '');

                navigate(`/reservations/list?${params.toString()}`);
            }
        } else if (action === 'assign_housekeeping') {
            // Navigate to housekeeping roster with the booking's checkout date pre-filled
            if (contextMenu.booking) {
                const checkoutDate = contextMenu.booking?.checkOut || contextMenu.booking?.endDate;
                const date = checkoutDate ? dayjs(checkoutDate).format('YYYY-MM-DD') : contextMenu.date;
                navigate(`/housekeeping?date=${date}`);
            }
        }
        handleCloseContextMenu();
    };

    // ... (rest of your existing logic)

    return (
        <Card variant="borderless" styles={{ body: { padding: 0 } }} style={{ borderRadius: '8px', overflow: 'hidden' }} onClick={handleCloseContextMenu}>
            <div
                style={{ width: '100%', overflowX: 'hidden' }}
                onContextMenu={(e) => handleContextMenu(e)}
            >
                {/* Header Row */}
                {/* ... existing header code ... */}
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', backgroundColor: '#fff', borderBottom: '2px solid #f0f0f0' }}>
                    <div style={{ padding: '12px', fontWeight: 'bold', borderRight: '1px solid #f0f0f0' }}>Room</div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${visibleDays}, 1fr)` }}>
                        {dateRange.map(date => {
                            const dayOfWeek = dayjs(date).day();
                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                            return (
                                <div key={date} style={{ borderRight: '1px solid #f0f0f0', textAlign: 'center', padding: '6px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: isWeekend ? '#FAFAFA' : 'transparent' }}>
                                    <Text strong style={{ fontSize: '14px', lineHeight: 1 }}>{dayjs(date).format('D')}</Text>
                                    <Text strong style={{ display: 'block', color: '#8c8c8c', fontSize: '10px', marginTop: '2px' }}>{dayjs(date).format('ddd').toUpperCase()}</Text>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 1. Top Level Rooms (Uncategorized) */}
                {topLevelRooms.map(room => renderRoomRow(room))}

                {/* 2. Categories and Rooms */}
                {Object.keys(groupedRooms).map(category => (
                    <React.Fragment key={category}>
                        {/* Category Header */}
                        <div
                            onClick={() => onToggleCategory(category)}
                            style={{
                                display: 'flex', alignItems: 'center',
                                backgroundColor: '#f0f0f0', borderBottom: '1px solid #d9d9d9', height: '32px',
                                padding: '0 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', userSelect: 'none'
                            }}
                        >
                            <span style={{ marginRight: 6 }}>
                                {collapsedCategories.has(category) ? '+' : '-'}
                            </span>
                            {category}
                        </div>

                        {/* Room Rows - Render only if NOT collapsed */}
                        {!collapsedCategories.has(category) && groupedRooms[category].map(room => renderRoomRow(room))}
                    </React.Fragment>
                ))}
            </div>

            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    style={{
                        position: 'absolute',
                        top: contextMenu.y - 120, // Adjust for offset relative to viewport vs localized container if needed, but pageX/Y usually needs portal. For simplicity inside relative container we might need adjustment.
                        left: contextMenu.x - 300,
                        // Using fixed position for overlay is safer to avoid clipping
                    }}
                >
                    {/* Actually, best to put it in a fixed overlay or portal. Or use fixed positioning. */}
                </div>
            )}
            {contextMenu.visible && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        backgroundColor: '#fff',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        borderRadius: '4px',
                        minWidth: '160px',
                        padding: '4px 0'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {contextMenu.serviceEntry ? (
                        <>
                            <div style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 'bold', backgroundColor: '#f5f5f5', borderBottom: '1px solid #f0f0f0' }}>
                                {contextMenu.serviceEntry.type === 'out_of_service' ? 'Out Of Service' : 'Out Of Order'}
                                {contextMenu.serviceEntry.description ? `: ${contextMenu.serviceEntry.description}` : ''}
                            </div>
                            <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleMenuItemClick('add_reservation')}>
                                Add Reservation
                            </div>
                            <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '4px 0' }} />
                            <div
                                className="context-menu-item"
                                style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px', color: '#cf1322' }}
                                onClick={handleRemoveServiceEntry}
                            >
                                Remove this entry
                            </div>
                            <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '4px 0' }} />
                            <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={handleCloseContextMenu}>Close Menu</div>
                        </>
                    ) : contextMenu.booking ? (
                        <>
                            <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                ✎ Edit {contextMenu.booking.resNo || 'Booking'}
                            </div>
                            <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleMenuItemClick('edit_booking')}>
                                Open in Reservations
                            </div>
                            <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleMenuItemClick('assign_housekeeping')}>
                                Assign Housekeeping Task
                            </div>
                            <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '4px 0' }} />
                            <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={handleCloseContextMenu}>Close Menu</div>
                        </>
                    ) : (
                        <>
                            <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleMenuItemClick('add_reservation')}>Add Reservation</div>
                            {contextMenu.room && (
                                <>
                                    {!isPortalUser && (
                                        <>
                                            <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '4px 0' }} />
                                            <div
                                                className="context-menu-item"
                                                style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px', color: '#003a8c', fontWeight: 500 }}
                                                onClick={() => handleOpenServiceModal('out_of_service')}
                                            >
                                                Out Of Service
                                            </div>
                                            <div
                                                className="context-menu-item"
                                                style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px', color: '#722ed1', fontWeight: 500 }}
                                                onClick={() => handleOpenServiceModal('out_of_order')}
                                            >
                                                Out Of Order
                                            </div>
                                        </>
                                    )}
                                    <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '4px 0' }} />
                                    <div style={{ padding: '4px 16px', fontSize: '11px', color: '#8c8c8c', fontWeight: 600, letterSpacing: '0.5px' }}>
                                        CHANGE ROOM STATUS
                                    </div>
                                    {[
                                        { label: 'Clean', color: '#52c41a' },
                                        { label: 'Dirty', color: '#f5222d' },
                                        { label: 'Inspect', color: '#fa8c16' },
                                    ].map(({ label, color }) => (
                                        <div
                                            key={label}
                                            className="context-menu-item"
                                            style={{ padding: '6px 24px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 8 }}
                                            onClick={() => handleChangeRoomStatus(label)}
                                        >
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, display: 'inline-block', flexShrink: 0 }} />
                                            {label}
                                        </div>
                                    ))}
                                </>
                            )}
                            <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '4px 0' }} />
                            <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={handleCloseContextMenu}>Close Menu</div>
                        </>
                    )}
                </div>
            )}

            {/* Out Of Service / Out Of Order description modal */}
            <Modal
                title={serviceModal.type === 'out_of_service' ? 'Mark Room as Out Of Service' : 'Mark Room as Out Of Order'}
                open={serviceModal.visible}
                onOk={handleConfirmServiceStatus}
                onCancel={() => setServiceModal({ visible: false, type: null, roomId: null, description: '', startDate: null, endDate: null })}
                confirmLoading={updateRoomServiceStatusMutation.isPending}
                okText="Confirm"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                        <label style={{ fontSize: 13, color: '#595959', display: 'block', marginBottom: 4 }}>Description</label>
                        <Input.TextArea
                            rows={2}
                            placeholder="e.g. Mattress Clean, Maintenance Required..."
                            value={serviceModal.description}
                            onChange={(e) => setServiceModal(prev => ({ ...prev, description: e.target.value }))}
                            maxLength={200}
                            showCount
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div>
                            <label style={{ fontSize: 13, color: '#595959', display: 'block', marginBottom: 4 }}>From Date</label>
                            <DatePicker
                                style={{ width: '100%' }}
                                showTime
                                format="DD MMM YYYY HH:mm"
                                value={serviceModal.startDate}
                                onChange={(date) => setServiceModal(prev => ({ ...prev, startDate: date }))}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 13, color: '#595959', display: 'block', marginBottom: 4 }}>To Date</label>
                            <DatePicker
                                style={{ width: '100%' }}
                                showTime
                                format="DD MMM YYYY HH:mm"
                                value={serviceModal.endDate}
                                disabledDate={(d) => serviceModal.startDate && d.isBefore(serviceModal.startDate, 'day')}
                                onChange={(date) => setServiceModal(prev => ({ ...prev, endDate: date }))}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

export default CoreBookingChart;
