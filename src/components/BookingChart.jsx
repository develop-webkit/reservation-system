// src/components/BookingChart.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Tooltip, Popover, Card, Spin, Alert, message } from 'antd';
import dayjs from 'dayjs';
import { useBookingChart, useUpdateBookingChart } from '../hooks/useBookings';
import { useRooms } from '../hooks/useRooms';
//import { useRooms } from '../hooks/useRooms'; // This hook likely needs to be updated or we bypass it for now as requested
import { rooms as roomsFromData } from '../data/rooms';


const { Text } = Typography;

const STATUS_COLORS = {
    'Unconfirmed': '#faad14',      // Orange
    'Confirmed': '#52c41a',        // Green
    'Arrived': '#1890ff',          // Blue
    'Pre Check In': '#13c2c2',     // Cyan
    'Departed': '#eb2f96',         // Pink
    'Out of Order': '#722ed1',     // Purple
};

const ROOM_STATUS_COLORS = {
    'CLEAN': '#52c41a', // Green
    'DIRTY': '#f5222d', // Red
    'INSPECT': '#faad14', // Occupied/Inspect (Orange)
    'OOO': '#722ed1',   // Out of Order (Purple)
};

const CoreBookingChart = ({ startDate, visibleDays = 30, collapsedCategories, onToggleCategory, propertyName = "Mount Morgan Space Solutions", filters = {} }) => {
    // Fetch bookings and rooms using TanStack Query hooks
    // const { data: bookingsResponse, isLoading: bookingsLoading, error: bookingsError } = useBookings(); // Not used directly anymore
    const { isLoading: roomsLoading, error: roomsError } = useRooms();

    const navigate = useNavigate();
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, room: null, date: null, booking: null });
    const [resizeDraft, setResizeDraft] = useState(null);
    const updateBookingChartMutation = useUpdateBookingChart();

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
        if (chartData?.rooms) {
            return chartData.rooms.map(r => ({ ...r, id: r._id || r.id }));
        }
        return roomsFromData;
    }, [chartData]);


    // 1. Generate column dates (Immutable)
    const dateRange = useMemo(() => {
        const dates = [];
        const start = dayjs(startDate).startOf('day');
        for (let i = 0; i < visibleDays; i++) {
            dates.push(start.add(i, 'days').format('YYYY-MM-DD'));
        }
        return dates;
    }, [startDate, visibleDays]);

    const getGridPosition = useCallback((checkIn, checkOut) => {
        const chartStart = dayjs(dateRange[0]);
        const bStart = dayjs(checkIn);
        const bEnd = dayjs(checkOut);
        const startCol = bStart.diff(chartStart, 'days') + 1;
        const duration = bEnd.diff(bStart, 'days');
        return {
            start: startCol,
            end: startCol + duration,
            isVisible: !((startCol + duration) <= 1 || startCol > visibleDays)
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
        const isParkedRow = room.id === 'PK01';
        const rowHeight = isParkedRow ? '60px' : '30px';

        const cleanStatus = room.status || room.defaultCleanStatus || 'Clean';
        const statusColor = room.outOfOrder ? ROOM_STATUS_COLORS['OOO'] : (ROOM_STATUS_COLORS[cleanStatus.toUpperCase()] || ROOM_STATUS_COLORS['CLEAN']);
        const roomStatusText = room.outOfOrder ? 'Out of Order' : cleanStatus;

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

                // Area/Room filter
                if (filters.area) {
                    const roomName = booking.roomId || '';
                    if (!roomName.toLowerCase().includes(filters.area.toLowerCase())) {
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
            <div key={room.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', height: rowHeight, borderBottom: '1px solid #f0f0f0' }}>
                <Popover content={RoomInfoContent} trigger="hover" placement="rightTop" styles={{ content: { padding: '12px 16px' } }}>
                    <div style={{ padding: '0 12px', borderRight: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', cursor: 'pointer' }}>
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
                <div data-booking-grid="true" style={{ display: 'grid', gridTemplateColumns: `repeat(${visibleDays}, 1fr)`, position: 'relative' }}>
                    {dateRange.map((date, idx) => {
                        const dayOfWeek = dayjs(date).day();
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                        return (
                            <div
                                key={date}
                                style={{ borderRight: '1px solid #f0f0f0', gridColumn: idx + 1, gridRow: 1, backgroundColor: isWeekend ? '#FAFAFA' : 'transparent', height: '100%', cursor: 'pointer' }}
                                onContextMenu={(e) => handleContextMenu(e, room, date)}
                            />
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
                                        { label: 'Balance Owing', value: displayBooking.balance },
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
                                    gridColumnEnd: Math.min(visibleDays + 1, pos.end),
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
                                    // Stacking styles
                                    alignSelf: alignProp,
                                    marginTop: isParkedRow ? `${topPosition}px` : 0,
                                    position: isParkedRow ? 'absolute' : 'relative', // Relative in grid usually centers but absolute allows precise stacking if relative container is full height. 
                                    // Actually within grid cell, 'alignSelf: start' + marginTop is easier than absolute if gridRow is correct.
                                    // Let's stick to Grid layout. The parent container is absolute relative to row? No, it's defined as:
                                    // display: 'grid', gridTemplateColumns: `repeat(${visibleDays}, 1fr)`, position: 'relative'
                                    // The bookings are children of this grid.
                                    // If we use absolute, we rely on the parent being relative and covering the whole row area.
                                    // The parent div DOES have position: 'relative'.
                                    // However, the booking divs utilize gridColumnStart/End. 
                                    // If we use absolute, we might lose the grid column width unless we calculate left/width manually.
                                    // Better approach: Keep grid column logic, but use marginTop or transforms for vertical offset.
                                    // If we use position: absolute, we can't easily rely on grid columns.
                                    // But wait! Grid items CAN be position: absolute, but then they position relative to the nearest positioned ancestor (the grid container), NOT the grid tracks.
                                    // Exception: If you specify grid-column/row AND position: absolute, it positions within that grid area! (Verified behavior in modern CSS specs).
                                    // Let's try position: absolute combined with grid properties.
                                    top: isParkedRow ? `${topPosition}px` : 'auto',
                                    width: isParkedRow ? 'calc(100% - 4px)' : 'auto' // absolute items need explicit width if not stretched
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

        console.log('[CONTEXT MENU] Right-click detected:', {
            isBooking: !!booking,
            bookingResNo: booking?.resNo,
            room: room?.name,
            date
        });

        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            room: room || null,
            date: date || null,
            booking: booking || null
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleMenuItemClick = (action) => {
        console.log(`[MENU CLICK] Context menu action: ${action}`, contextMenu);

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
            console.log('[EDIT BOOKING] Opening booking in reservations:', contextMenu.booking);
            // Edit booking - pre-fill the form with booking data
            if (contextMenu.booking) {
                const params = new URLSearchParams();
                const booking = contextMenu.booking;

                // Add reservationId (the MongoDB _id of the Reservation)
                params.set('reservationId', booking.reservationId || '');

                // Pre-fill form fields from booking/reservation data
                params.set('resNo', booking.resNo || '');
                params.set('masterResNo', booking.masterResNo || '');
                params.set('arrive', booking.checkIn || booking.startDate || '');
                params.set('depart', booking.checkOut || booking.endDate || '');
                params.set('area', booking.roomId || contextMenu.room?.name || '');
                params.set('roomType', contextMenu.room?.category || '');
                params.set('clientId', booking.clientId || booking.client || ''); // Pass client ID to auto-select from SmartSearch
                params.set('given', booking.clientName?.split(' ')[0] || '');
                params.set('surname', booking.clientName?.split(' ').slice(1).join(' ') || '');
                params.set('status', booking.status || 'Confirmed');
                params.set('people', booking.people || '1A');
                params.set('company', booking.company || '');
                params.set('bkgSource', booking.bkgSource || '');
                params.set('tariffType', booking.tariffType || 'Corporate');
                params.set('totalTariff', booking.balance || '0.00');
                params.set('fixed', booking.isFixed ? 'Yes' : 'No');
                params.set('groupname', booking.groupName || '');

                console.log('[NAVIGATE] URL:', `/reservations/edit?${params.toString()}`);
                navigate(`/reservations/edit?${params.toString()}`);
            } else {
                console.warn('[EDIT BOOKING] No booking data available');
            }
        } else if (action === 'assign_housekeeping') {
            // Navigate to housekeeping roster with the booking's checkout date pre-filled
            if (contextMenu.booking) {
                const checkoutDate = contextMenu.booking?.checkOut || contextMenu.booking?.endDate;
                const date = checkoutDate ? dayjs(checkoutDate).format('YYYY-MM-DD') : contextMenu.date;
                console.log('[ASSIGN HOUSEKEEPING] Navigating to housekeeping with date:', date);
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
                    {contextMenu.booking ? (
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
                            <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '4px 0' }} />
                            <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={handleCloseContextMenu}>Close Menu</div>
                        </>
                    )}
                </div>
            )}
        </Card>
    );
};

export default CoreBookingChart;
