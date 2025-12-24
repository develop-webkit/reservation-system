// src/components/BookingChart.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { roomsData, bookingsData as initialBookingsData } from '../data/mockData';
import { Typography, Tooltip, Popover, Card } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;

const STATUS_COLORS = {
    'PENDING': '#faad14',      // Unconfirmed (Orange)
    'CONFIRMED': '#52c41a',    // Confirmed (Green)
    'CHECKED_IN': '#1890ff',   // Arrived (Blue)
    'PRE_CHECK_IN': '#13c2c2', // Pre Check In (Cyan)
    'CHECKED_OUT': '#eb2f96',  // Departed (Pink)
    'BLOCKED': '#722ed1',      // Out of Order (Purple)
};

const ROOM_STATUS_COLORS = {
    'CLEAN': '#52c41a', // Green
    'DIRTY': '#f5222d', // Red
    'INSPECT': '#faad14', // Occupied/Inspect (Orange)
    'OOO': '#722ed1',   // Out of Order (Purple)
};

const CoreBookingChart = ({ startDate, visibleDays = 30, collapsedCategories, onToggleCategory, propertyName = "Mount Morgan Space Solutions" }) => {
    const [bookingsData] = useState(initialBookingsData);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

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


    // Group rooms by category
    const { topLevelRooms, groupedRooms } = useMemo(() => {
        const top = [];
        const groups = {};

        roomsData.forEach(room => {
            if (!room.category) {
                top.push(room);
            } else {
                if (!groups[room.category]) groups[room.category] = [];
                groups[room.category].push(room);
            }
        });
        return { topLevelRooms: top, groupedRooms: groups };
    }, []);

    // Helper to render a single room row
    const renderRoomRow = (room) => {
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
                        <Text>{room.status ? room.status.charAt(0) + room.status.slice(1).toLowerCase() : 'Unknown'}</Text>
                    </div>
                </div>
            </div>
        );

        return (
            <div key={room.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', height: '30px', borderBottom: '1px solid #f0f0f0' }}>
                <Popover content={RoomInfoContent} trigger="hover" placement="rightTop" overlayInnerStyle={{ padding: '12px 16px' }}>
                    <div style={{ padding: '0 12px', borderRight: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', cursor: 'pointer' }}>
                        <Text strong style={{ fontSize: '12px' }}>{room.name}</Text>
                        {room.status && (
                            <Tooltip title={room.status}>
                                <div style={{
                                    width: '11px', height: '11px', borderRadius: '50%',
                                    backgroundColor: ROOM_STATUS_COLORS[room.status] || '#d9d9d9',
                                    flexShrink: 0
                                }} />
                            </Tooltip>
                        )}
                    </div>
                </Popover>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${visibleDays}, 1fr)`, position: 'relative' }}>
                    {dateRange.map((date, idx) => (
                        <div key={date} style={{ borderRight: '1px solid #f0f0f0', gridColumn: idx + 1, gridRow: 1 }} />
                    ))}
                    {bookingsData.filter(b => b.roomId === room.id).map(booking => {
                        const pos = getGridPosition(booking.checkIn, booking.checkOut);
                        if (!pos.isVisible) return null;

                        const ReservationInfoContent = (
                            <div style={{ width: '350px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                                <div style={{
                                    backgroundColor: '#2c3e50',
                                    color: '#fff',
                                    padding: '12px 16px',
                                    margin: '-12px -16px 12px -16px',
                                    borderRadius: '4px 4px 0 0'
                                }}>
                                    <Text strong style={{ color: '#fff', fontSize: '16px' }}>Reservation No: {booking.reservationNo || 'N/A'}</Text>
                                </div>
                                <div style={{ padding: '0 8px' }}>
                                    {[
                                        { label: 'Master Res No', value: booking.masterResNo },
                                        { label: 'Reservation No', value: booking.reservationNo },
                                        { label: 'Groupname', value: booking.groupName },
                                        { label: 'Client Name', value: booking.clientName },
                                        { label: 'Arrive', value: `${dayjs(booking.checkIn).format('ddd DD MMM YYYY')} ${booking.arriveTime || ''}` },
                                        { label: 'Depart', value: `${dayjs(booking.checkOut).format('ddd DD MMM YYYY')} ${booking.departTime || ''}` },
                                        { label: 'Property', value: propertyName },
                                        { label: 'Room Type', value: room.category },
                                        { label: 'Area', value: room.name },
                                        { label: 'Status', value: booking.status ? booking.status.charAt(0) + booking.status.slice(1).toLowerCase() : 'Unknown' },
                                        { label: 'People', value: booking.people },
                                        { label: 'Bkg Source', value: booking.bkgSource },
                                        { label: 'Tariff Type', value: booking.tariffType },
                                        { label: 'Balance Owing', value: booking.balance },
                                        { label: 'Caravan Sales Slide', value: booking.caravanSalesSlide },
                                        { label: 'Company', value: booking.company },
                                        { label: 'Fixed', value: booking.isFixed ? 'Yes' : 'No' }
                                    ].map((item, index) => (
                                        <div key={index} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '8px', alignItems: 'baseline', marginBottom: '4px' }}>
                                            <Text strong style={{ textAlign: 'right', fontSize: '12px' }}>{item.label}</Text>
                                            <Text style={{ fontSize: '12px' }}>{item.value || '-'}</Text>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );

                        return (
                            <Popover key={booking.id} content={ReservationInfoContent} trigger="hover" placement="rightTop" overlayInnerStyle={{ padding: '12px 16px' }}>
                                <div style={{
                                    gridColumnStart: Math.max(1, pos.start),
                                    gridColumnEnd: Math.min(visibleDays + 1, pos.end),
                                    gridRow: 1, zIndex: 2, alignSelf: 'center', height: '22px', backgroundColor: STATUS_COLORS[booking.status] || '#1890ff',
                                    borderRadius: '4px', margin: '0 2px', display: 'flex', alignItems: 'center', color: '#fff', padding: '0 4px', overflow: 'hidden', cursor: 'pointer'
                                }}>
                                    <Text ellipsis style={{ color: '#fff', fontSize: '10px' }}>{booking.guestName}</Text>
                                </div>
                            </Popover>
                        );
                    })}
                </div>
            </div>
        );
    };



    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleMenuItemClick = (action) => {
        console.log(`Context menu action: ${action}`);
        handleCloseContextMenu();
    };

    // ... (rest of your existing logic)

    return (
        <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ borderRadius: '8px', overflow: 'hidden' }} onClick={handleCloseContextMenu}>
            <div
                style={{ width: '100%', overflowX: 'hidden' }}
                onContextMenu={handleContextMenu}
            >
                {/* Header Row */}
                {/* ... existing header code ... */}
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', backgroundColor: '#fff', borderBottom: '2px solid #f0f0f0' }}>
                    <div style={{ padding: '12px', fontWeight: 'bold', borderRight: '1px solid #f0f0f0' }}>Room</div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${visibleDays}, 1fr)` }}>
                        {dateRange.map(date => (
                            <div key={date} style={{ borderRight: '1px solid #f0f0f0', textAlign: 'center', padding: '6px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Text strong style={{ fontSize: '14px', lineHeight: 1 }}>{dayjs(date).format('D')}</Text>
                                <Text strong style={{ display: 'block', color: '#8c8c8c', fontSize: '10px', marginTop: '2px' }}>{dayjs(date).format('ddd').toUpperCase()}</Text>
                            </div>
                        ))}
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
                    <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleMenuItemClick('add_reservation')}>Add Reservation</div>
                    <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleMenuItemClick('quick_quote')}>Quick Quote</div>
                    <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleMenuItemClick('add_out_of_order')}>Add Out of Order</div>
                    <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleMenuItemClick('add_out_of_service')}>Add Out Of Service</div>
                    <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '4px 0' }} />
                    <div className="context-menu-item" style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }} onClick={handleCloseContextMenu}>Close Menu</div>
                </div>
            )}
        </Card>
    );
};

export default CoreBookingChart;