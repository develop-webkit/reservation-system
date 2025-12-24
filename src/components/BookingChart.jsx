// src/components/BookingChart.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { roomsData, bookingsData as initialBookingsData } from '../data/mockData';
import { Card, Typography, Tooltip } from 'antd';
import dayjs from 'dayjs';
import BookingFormDrawer from './BookingFormDrawer';

const { Text } = Typography;

const STATUS_COLORS = {
    'CONFIRMED': '#1890ff',
    'CHECKED_IN': '#52c41a',
    'PENDING': '#faad14',
    'CHECKED_OUT': '#bfbfbf',
};

const CoreBookingChart = ({ startDate, visibleDays = 30, collapsedCategories, onToggleCategory }) => {
    const [bookingsData] = useState(initialBookingsData);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [formInitialData, setFormInitialData] = useState({});

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

    const handleCellClick = (room, date) => {
        setFormInitialData({
            roomId: room.id,
            roomName: room.name,
            checkIn: date,
            checkOut: dayjs(date).add(1, 'days').format('YYYY-MM-DD'),
        });
        setIsDrawerVisible(true);
    };



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
    const renderRoomRow = (room) => (
        <div key={room.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', height: '52px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ padding: '5px 12px', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff' }}>
                <Text strong style={{ fontSize: '12px' }}>{room.name}</Text>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${visibleDays}, 1fr)`, position: 'relative' }}>
                {dateRange.map((date, idx) => (
                    <div key={date} onClick={() => handleCellClick(room, date)} style={{ borderRight: '1px solid #f0f0f0', gridColumn: idx + 1, gridRow: 1, cursor: 'pointer' }} />
                ))}
                {bookingsData.filter(b => b.roomId === room.id).map(booking => {
                    const pos = getGridPosition(booking.checkIn, booking.checkOut);
                    if (!pos.isVisible) return null;
                    return (
                        <Tooltip key={booking.id} title={booking.guestName}>
                            <div style={{
                                gridColumnStart: Math.max(1, pos.start),
                                gridColumnEnd: Math.min(visibleDays + 1, pos.end),
                                gridRow: 1, zIndex: 2, alignSelf: 'center', height: '34px', backgroundColor: STATUS_COLORS[booking.status] || '#1890ff',
                                borderRadius: '4px', margin: '0 2px', display: 'flex', alignItems: 'center', color: '#fff', padding: '0 8px', overflow: 'hidden'
                            }}>
                                <Text ellipsis style={{ color: '#fff', fontSize: '11px' }}>{booking.guestName}</Text>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );

    return (
        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ width: '100%', overflowX: 'hidden' }}>
                {/* Header Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', backgroundColor: '#fff', borderBottom: '2px solid #f0f0f0' }}>
                    <div style={{ padding: '12px', fontWeight: 'bold', borderRight: '1px solid #f0f0f0' }}>Room</div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${visibleDays}, 1fr)` }}>
                        {dateRange.map(date => (
                            <div key={date} style={{ borderRight: '1px solid #f0f0f0', textAlign: 'center', padding: '6px 0' }}>
                                <Text strong style={{ display: 'block', color: '#8c8c8c', fontSize: '10px' }}>{dayjs(date).format('ddd').toUpperCase()}</Text>
                                <Text strong>{dayjs(date).format('D')}</Text>
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
                            style={{
                                display: 'grid', gridTemplateColumns: '150px 1fr',
                                backgroundColor: '#e6f7ff', borderBottom: '1px solid #d9d9d9', height: '32px', alignItems: 'center'
                            }}
                        >
                            <div
                                onClick={() => onToggleCategory(category)}
                                style={{
                                    padding: '0 12px', borderRight: '1px solid #d9d9d9', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px',
                                    display: 'flex', alignItems: 'center', userSelect: 'none'
                                }}
                            >
                                <span style={{ marginRight: 6 }}>
                                    {collapsedCategories.has(category) ? '+' : '-'}
                                </span>
                                {category}
                            </div>
                            <div style={{ backgroundColor: '#e6f7ff' }}></div>
                        </div>

                        {/* Room Rows - Render only if NOT collapsed */}
                        {!collapsedCategories.has(category) && groupedRooms[category].map(room => renderRoomRow(room))}
                    </React.Fragment>
                ))}
            </div>
            <BookingFormDrawer visible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} initialData={formInitialData} />
        </Card>
    );
};

export default CoreBookingChart;