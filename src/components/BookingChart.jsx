// src/components/BookingChart.jsx
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { roomsData, bookingsData as initialBookingsData } from '../data/mockData';
import { generateDateRange } from '../utils/dateUtils';
import { Card, Typography, Tooltip } from 'antd';
import moment from 'moment';
import BookingFormDrawer from './BookingFormDrawer';

const { Text } = Typography;

const STATUS_COLORS = {
    'CONFIRMED': '#1890ff',
    'CHECKED_IN': '#52c41a',
    'PENDING': '#faad14',
    'CHECKED_OUT': '#bfbfbf',
};

const CoreBookingChart = ({ startDate, visibleDays = 30 }) => {
    const [bookingsData, setBookingsData] = useState(initialBookingsData);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [formInitialData, setFormInitialData] = useState({});
    
    // Resizing State
    const [isResizing, setIsResizing] = useState(false);
    const [resizingBookingId, setResizingBookingId] = useState(null);
    const [initialMouseX, setInitialMouseX] = useState(0);
    const [initialDuration, setInitialDuration] = useState(0);
    
    // Ref to measure actual width for resizing math
    const gridRef = useRef(null);

    const dateRange = useMemo(() => {
        return generateDateRange(startDate, visibleDays);
    }, [startDate, visibleDays]);

    // --- Dynamic Math for Resizing ---
    const getPixelsPerDay = () => {
        if (!gridRef.current) return 40; 
        // Calculate width of 1 day based on actual screen size
        return gridRef.current.offsetWidth / visibleDays;
    };

    const getBookingDuration = useCallback((checkIn, checkOut) => {
        return moment(checkOut).diff(moment(checkIn), 'days');
    }, []);

    const getBookingOffset = useCallback((checkIn) => {
        const chartStart = moment(dateRange[0]);
        const bookingStart = moment(checkIn);
        return bookingStart.diff(chartStart, 'days');
    }, [dateRange]);

    // --- Handlers ---
    const handleResizeMouseDown = (e, bookingId) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizingBookingId(bookingId);
        setInitialMouseX(e.clientX);
        const booking = bookingsData.find(b => b.id === bookingId);
        if (booking) setInitialDuration(getBookingDuration(booking.checkIn, booking.checkOut));
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const pixelsPerDay = getPixelsPerDay();
            const deltaX = e.clientX - initialMouseX;
            const dayChange = Math.round(deltaX / pixelsPerDay);
            const newDuration = Math.max(1, initialDuration + dayChange);

            setBookingsData(prev => prev.map(b => {
                if (b.id === resizingBookingId) {
                    return { ...b, checkOut: moment(b.checkIn).add(newDuration, 'days').format('YYYY-MM-DD') };
                }
                return b;
            }));
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            setResizingBookingId(null);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, initialMouseX, initialDuration, resizingBookingId]);

    // --- Renderers ---
    const renderDateHeader = () => (
        <div className="chart-header" style={{ 
            display: 'grid', 
            gridTemplateColumns: `150px 1fr`, 
            width: '100%' 
        }}>
            <div className="room-label header-cell" style={{ border: '1px solid #cecece', padding: '8px', fontWeight: 'bold' }}>Room</div>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${visibleDays}, 1fr)`,
                width: '100%'
            }}>
                {dateRange.map(date => (
                    <div key={date} className="date-cell header-cell" style={{ border: '1px solid #cecece', textAlign: 'center', borderLeft: 'none' }}>
                        <Text strong style={{ fontSize: '10px', display: 'block' }}>{moment(date).format('ddd').toUpperCase()}</Text>
                        <Text strong style={{ fontSize: visibleDays > 60 ? '10px' : '14px' }}>{moment(date).format('D')}</Text>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderRoomRow = (room) => {
        const roomBookings = bookingsData.filter(b => b.roomId === room.id);
        return (
            <div key={room.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', height: '50px', borderBottom: '1px solid #cecece' }}>
                <div className="room-label-col" style={{ padding: '5px 10px', borderRight: '1px solid #cecece', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Text strong style={{ fontSize: '12px' }}>{room.name}</Text>
                    <Text type="secondary" style={{ fontSize: '10px' }}>{room.type}</Text>
                </div>
                
                <div 
                    ref={gridRef}
                    className="reservation-grid-area" 
                    style={{ 
                        display: 'grid', 
                        gridTemplateColumns: `repeat(${visibleDays}, 1fr)`, 
                        position: 'relative',
                        width: '100%'
                    }}
                >
                    {dateRange.map(date => (
                        <div key={date} className="daily-cell" style={{ borderRight: '1px solid #f0f0f0', height: '100%' }} />
                    ))}
                    
                    {roomBookings.map(booking => {
                        const duration = getBookingDuration(booking.checkIn, booking.checkOut);
                        const offset = getBookingOffset(booking.checkIn);
                        
                        if (offset + duration > 0 && offset < visibleDays) {
                            return (
                                <Tooltip key={booking.id} title={`${booking.guestName}`}>
                                    <div
                                        className="booking-item"
                                        style={{
                                            position: 'absolute',
                                            left: `${(offset / visibleDays) * 100}%`,
                                            width: `${(duration / visibleDays) * 100}%`,
                                            height: '30px',
                                            backgroundColor: STATUS_COLORS[booking.status] || '#1890ff',
                                            borderRadius: '4px',
                                            zIndex: 5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0 8px',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <Text ellipsis style={{ color: '#fff', fontSize: '11px', fontWeight: 500 }}>
                                            {visibleDays > 60 ? '' : booking.guestName}
                                        </Text>
                                        <div 
                                            className="resizer-handle" 
                                            onMouseDown={(e) => handleResizeMouseDown(e, booking.id)} 
                                            style={{ position: 'absolute', right: 0, width: '8px', height: '100%', cursor: 'ew-resize' }}
                                        />
                                    </div>
                                </Tooltip>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        );
    };

    return (
        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', overflowX: 'hidden' }}>
                {renderDateHeader()}
                {roomsData.map(room => renderRoomRow(room))}
            </div>

            <BookingFormDrawer
                visible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
                initialData={formInitialData}
            />
        </Card>
    );
};

export default CoreBookingChart;