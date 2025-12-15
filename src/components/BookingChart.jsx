// src/components/BookingChart.jsx (CORE LOGIC)

import React, { useState, useCallback, useEffect } from 'react';
import { roomsData, bookingsData as initialBookingsData } from '../data/mockData';
import { generateDateRange } from '../utils/dateUtils';
import { Card, Typography, Tooltip, notification, theme } from 'antd';
import moment from 'moment';
import BookingFormDrawer from './BookingFormDrawer'; 

// NOTE: CSS import is handled in the global index.css due to Vite configuration issues.
// import './BookingChart.css'; 

const { Text, Title } = Typography; 

// --- Configuration ---
const CHART_VISIBLE_DAYS = 30; 
// Hardcoded to match mock data range for visualization (Dec 13)
const START_DATE = '2025-12-13'; 
const PIXELS_PER_DAY = 40; // Must match the fixed width in the global CSS

const STATUS_COLORS = {
    'CONFIRMED': '#1890ff', 
    'CHECKED_IN': '#52c41a', 
    'PENDING': '#faad14', 
    'CHECKED_OUT': '#bfbfbf', 
};

// --- CORE COMPONENT ---
const CoreBookingChart = () => {
    // State to hold and update the visible bookings data
    const [bookingsData, setBookingsData] = useState(initialBookingsData);
    const [dateRange] = useState(generateDateRange(START_DATE, CHART_VISIBLE_DAYS));
    
    // Form Drawer State (New Booking)
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [formInitialData, setFormInitialData] = useState({});
    
    // Drag & Drop State
    const [draggingBookingId, setDraggingBookingId] = useState(null);

    // Resizing State
    const [isResizing, setIsResizing] = useState(false);
    const [resizingBookingId, setResizingBookingId] = useState(null);
    const [initialMouseX, setInitialMouseX] = useState(0);
    const [initialDuration, setInitialDuration] = useState(0);

    // --- UTILITY FUNCTIONS ---
    
    const getBookingDuration = useCallback((checkIn, checkOut) => {
        const start = moment(checkIn);
        const end = moment(checkOut);
        return end.diff(start, 'days'); 
    }, []);
    
    const getBookingOffset = useCallback((checkIn) => {
        const chartStart = moment(dateRange[0]);
        const bookingStart = moment(checkIn);
        const offset = bookingStart.diff(chartStart, 'days');
        return offset > 0 ? offset : 0; 
    }, [dateRange]);

    const findBookingForRoom = useCallback((roomId) => {
        return bookingsData.filter(b => b.roomId === roomId);
    }, [bookingsData]);


    // --- FORM HANDLERS (New Booking Creation) ---
    
    const handleNewBookingClick = (room, date) => {
        if (isResizing || draggingBookingId) return;
        setFormInitialData({
            roomId: room.id,
            roomName: room.name,
            checkIn: date,
            checkOut: moment(date).add(3, 'days').format('YYYY-MM-DD'), 
        });
        setIsDrawerVisible(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerVisible(false);
        setFormInitialData({});
    };


    // --- DRAG & DROP HANDLERS (Moving Bookings) ---
    
    const handleDragStart = (e, bookingId) => {
        if (isResizing) return; 
        setDraggingBookingId(bookingId);
        e.dataTransfer.setData("bookingId", bookingId);
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.style.opacity = '0.4';
    };

    const handleDragEnd = (e) => {
        setDraggingBookingId(null);
        e.currentTarget.style.opacity = '1';
    };

    const handleDragOver = (e) => {
        e.preventDefault(); 
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, targetRoomId, targetDate) => {
        e.preventDefault();
        const droppedBookingId = e.dataTransfer.getData("bookingId");
        
        if (!droppedBookingId) return;

        const bookingToMove = bookingsData.find(b => b.id === droppedBookingId);
        if (!bookingToMove) return;

        const duration = getBookingDuration(bookingToMove.checkIn, bookingToMove.checkOut);
        const newCheckInDate = targetDate;
        const newCheckOutDate = moment(newCheckInDate).add(duration, 'days').format('YYYY-MM-DD');

        // Availability Check
        const isConflict = bookingsData.some(b => 
            b.roomId === targetRoomId &&
            b.id !== droppedBookingId && 
            moment(newCheckInDate).isBefore(moment(b.checkOut)) &&
            moment(newCheckOutDate).isAfter(moment(b.checkIn))
        );

        if (isConflict) {
            notification.error({
                message: 'Move Failed',
                description: `Room ${targetRoomId} is not available for that date range.`,
                placement: 'topRight',
            });
            return;
        }

        // Update State
        const updatedBookings = bookingsData.map(b => {
            if (b.id === droppedBookingId) {
                return { ...b, roomId: targetRoomId, checkIn: newCheckInDate, checkOut: newCheckOutDate };
            }
            return b;
        });

        setBookingsData(updatedBookings);
        
        notification.success({
            message: 'Booking Moved',
            description: `Booking ${droppedBookingId} successfully moved.`,
            placement: 'topRight',
        });
    };

    // --- RESIZING HANDLERS ---
    
    const handleResizeMouseDown = (e, bookingId) => {
        e.stopPropagation(); // Prevent drag start
        setIsResizing(true);
        setResizingBookingId(bookingId);
        setInitialMouseX(e.clientX);
        
        const booking = bookingsData.find(b => b.id === bookingId);
        if (booking) {
            setInitialDuration(getBookingDuration(booking.checkIn, booking.checkOut));
        }
    };

    const handleResizeMouseUp = useCallback(() => {
        if (!isResizing) return;
        
        const booking = bookingsData.find(b => b.id === resizingBookingId);
        if (booking) {
            notification.info({
                message: 'Booking Resized',
                description: `Duration updated to ${getBookingDuration(booking.checkIn, booking.checkOut)} nights.`,
                placement: 'topRight',
            });
        }

        setIsResizing(false);
        setResizingBookingId(null);

    }, [isResizing, resizingBookingId, bookingsData, getBookingDuration]);

    const handleResizeMouseMove = useCallback((e) => {
        if (!isResizing || !resizingBookingId) return;

        const deltaX = e.clientX - initialMouseX;
        const dayChange = Math.round(deltaX / PIXELS_PER_DAY);
        const newDuration = Math.max(1, initialDuration + dayChange);

        setBookingsData(prevBookings => {
            return prevBookings.map(b => {
                if (b.id === resizingBookingId) {
                    const newCheckOut = moment(b.checkIn).add(newDuration, 'days').format('YYYY-MM-DD');
                    
                    // Conflict Check: Check against the next booking in the same room
                    const roomBookings = findBookingForRoom(b.roomId);
                    const nextBooking = roomBookings
                        .filter(item => 
                            moment(item.checkIn).isAfter(moment(b.checkIn)) && 
                            item.id !== resizingBookingId 
                        )
                        .sort((a, b) => moment(a.checkIn).unix() - moment(b.checkIn).unix())[0];
                    
                    if (nextBooking && moment(newCheckOut).isAfter(moment(nextBooking.checkIn))) {
                        const maxCheckOut = moment(nextBooking.checkIn).format('YYYY-MM-DD');
                        
                        if (moment(b.checkOut).format('YYYY-MM-DD') !== maxCheckOut) {
                             notification.warning({
                                message: 'Resizing Limit',
                                description: 'Cannot resize past an existing reservation.',
                                duration: 1,
                                placement: 'topRight'
                            });
                        }
                        return { ...b, checkOut: maxCheckOut };
                    }

                    return { ...b, checkOut: newCheckOut };
                }
                return b;
            });
        });

    }, [isResizing, resizingBookingId, initialMouseX, initialDuration, findBookingForRoom, getBookingDuration]);

    // --- EFFECT: Attach global mouse move/up listeners for resizing ---
    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleResizeMouseMove);
            window.addEventListener('mouseup', handleResizeMouseUp);
        } else {
            window.removeEventListener('mousemove', handleResizeMouseMove);
            window.removeEventListener('mouseup', handleResizeMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleResizeMouseMove);
            window.removeEventListener('mouseup', handleResizeMouseUp);
        };
    }, [isResizing, handleResizeMouseMove, handleResizeMouseUp]);


    // --- RENDER FUNCTIONS ---

    // Renders the header row with dates
    const renderDateHeader = () => (
        <div className="chart-header">
            <div className="room-label header-cell">Room / Date</div>
            <div className="date-cell-container"> 
                {dateRange.map(date => {
                    const dayName = moment(date).format('ddd'); 
                    const dayNum = moment(date).format('D'); 
                    const isToday = date === moment().format('YYYY-MM-DD');

                    return (
                        <div key={date} className={`date-cell header-cell ${isToday ? 'is-today' : ''}`}>
                            <Text strong style={{ color:'#000', display: 'block', fontSize: '10px' }}>{dayName}</Text>
                            <Text strong style={{ color:'#000', display: 'block' }}>{dayNum}</Text>
                        </div>
                    );
                })}
            </div>
        </div>
    );
    
    // Renders a single room row and all its bookings (Uses chart-row-grid)
    const renderRoomRow = (room) => {
        const roomBookings = findBookingForRoom(room.id);

        return (
            <div key={room.id} className="chart-row-grid">
                <div className="room-label-col">
                    <Text strong style={{ color: '#000' }}>{room.name}</Text>
                    <Text type="secondary" style={{ color: '#000', display: 'block', fontSize: '10px' }}>{room.type}</Text>
                </div>
                
                <div className="reservation-grid-area">
                    {/* Render the clickable daily cells (drop targets) */}
                    {dateRange.map(date => (
                        <div 
                            key={`${room.id}-${date}`} 
                            className="daily-cell"
                            onClick={() => handleNewBookingClick(room, date)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, room.id, date)}
                        >
                            {/* Empty cells */}
                        </div>
                    ))}
                    
                    {/* Render existing bookings */}
                    {roomBookings.map(booking => {
                        const duration = getBookingDuration(booking.checkIn, booking.checkOut);
                        const offset = getBookingOffset(booking.checkIn);
                        
                        if (offset < CHART_VISIBLE_DAYS && duration + offset > 0) {
                            return (
                                <Tooltip 
                                    key={booking.id} 
                                    title={`${booking.guestName} (${moment(booking.checkIn).format('MMM D')} - ${moment(booking.checkOut).format('MMM D')})`}
                                >
                                    <div
                                        className={`booking-item ${isResizing && booking.id === resizingBookingId ? 'is-resizing' : ''}`}
                                        style={{
                                            gridColumnStart: offset + 1, 
                                            gridColumnEnd: offset + 1 + duration, 
                                            backgroundColor: STATUS_COLORS[booking.status] || '#364d79',
                                        }}
                                        draggable="true" 
                                        onDragStart={(e) => handleDragStart(e, booking.id)}
                                        onDragEnd={handleDragEnd}
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            // TODO: Open form for edit existing booking
                                        }}
                                    >
                                        <Text ellipsis style={{ color: '#fff', fontSize: '12px' }}>
                                            {booking.guestName}
                                        </Text>
                                        
                                        {/* RESIZER HANDLE */}
                                        <div 
                                            className="resizer-handle" 
                                            onMouseDown={(e) => handleResizeMouseDown(e, booking.id)}
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
        <>
            <Card 
                title={<Title level={4} style={{ margin: 0, color: '#141414' }}>Booking Chart View</Title>}
                bordered={false}
                style={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    overflowX: 'auto', 
                    minWidth: '1000px' 
                }}
                bodyStyle={{ padding: 0 }}
            >
                <div className="booking-chart-container">
                    {renderDateHeader()}
                    {roomsData.map(room => renderRoomRow(room))}
                </div>
            </Card>
            
            <BookingFormDrawer
                visible={isDrawerVisible}
                onClose={handleDrawerClose}
                initialData={formInitialData}
            />
        </>
    );
};

export default CoreBookingChart;