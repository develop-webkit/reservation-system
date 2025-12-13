// src/components/BookingChart.jsx (CORRECTED & COMPLETE)

import React, { useState } from 'react';
import { roomsData, bookingsData } from '../data/mockData';
import { generateDateRange } from '../utils/dateUtils';
import { Card, Typography, Tooltip } from 'antd';
import moment from 'moment';
import BookingFormDrawer from './BookingFormDrawer'; // New component import
import './BookingChart.css'; 

const { Text, Title } = Typography; 

// --- Configuration ---
const CHART_VISIBLE_DAYS = 30; 
const START_DATE = moment().format('YYYY-MM-DD'); 

const STATUS_COLORS = {
    'CONFIRMED': '#1890ff', // Blue
    'CHECKED_IN': '#52c41a', // Green
    'PENDING': '#faad14', // Yellow/Orange
    'CHECKED_OUT': '#bfbfbf', // Grey
};


const BookingChart = () => {
    // State to hold the current date range displayed
    const [dateRange, setDateRange] = useState(generateDateRange(START_DATE, CHART_VISIBLE_DAYS));
    
    // --- STATE for the Booking Form Drawer ---
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [formInitialData, setFormInitialData] = useState({});
    
    // Function to handle the cell click (Video 8a logic)
    const handleNewBookingClick = (room, date) => {
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

    // --- UTILITY FUNCTIONS ---
    
    const getBookingDuration = (checkIn, checkOut) => {
        const start = moment(checkIn);
        const end = moment(checkOut);
        return end.diff(start, 'days'); 
    };
    
    const getBookingOffset = (checkIn) => {
        const chartStart = moment(dateRange[0]);
        const bookingStart = moment(checkIn);
        const offset = bookingStart.diff(chartStart, 'days');
        return offset > 0 ? offset : 0; 
    };

    const findBookingForRoom = (roomId) => {
        return bookingsData.filter(b => b.roomId === roomId);
    };

    // --- RENDER FUNCTIONS ---

    // Renders the header row with dates
    const renderDateHeader = () => (
        <div className="chart-header">
            {/* Corner Cell (Empty) */}
            <div className="room-label header-cell">Room / Date</div>
            {/* Date Columns */}
            {dateRange.map(date => {
                const dayName = moment(date).format('ddd'); 
                const dayNum = moment(date).format('D'); 
                const isToday = date === moment().format('YYYY-MM-DD');

                return (
                    <div key={date} className={`date-cell header-cell ${isToday ? 'is-today' : ''}`}>
                        <Text strong style={{ display: 'block', fontSize: '10px' }}>{dayName}</Text>
                        <Text strong style={{ display: 'block' }}>{dayNum}</Text>
                    </div>
                );
            })}
        </div>
    );
    
    // Renders a single room row and all its bookings
    const renderRoomRow = (room) => {
        const roomBookings = findBookingForRoom(room.id);

        return (
            <div key={room.id} className="chart-row">
                {/* Room Label Cell (Y-Axis) */}
                <div className="room-label">
                    <Text strong style={{ color: '#fff' }}>{room.name}</Text>
                    <Text type="secondary" style={{ display: 'block', fontSize: '10px' }}>{room.type}</Text>
                </div>
                
                {/* The main booking grid for this room */}
                <div className="booking-grid">
                    {/* Render the clickable daily cells (for new bookings) */}
                    {dateRange.map(date => (
                        <div 
                            key={`${room.id}-${date}`} 
                            className="daily-cell"
                            onClick={() => handleNewBookingClick(room, date)}
                        >
                            {/* Empty cells */}
                        </div>
                    ))}
                    
                    {/* Render existing bookings (placed absolutely over the daily cells) */}
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
                                        className="booking-item"
                                        style={{
                                            gridColumnStart: offset + 1, 
                                            gridColumnEnd: offset + 1 + duration,
                                            backgroundColor: STATUS_COLORS[booking.status] || '#364d79',
                                        }}
                                        onClick={(e) => { e.stopPropagation(); console.log(`Clicked existing booking ${booking.id} to edit.`); }}
                                    >
                                        <Text ellipsis style={{ color: '#fff', fontSize: '12px' }}>
                                            {booking.guestName}
                                        </Text>
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
                title={<Title level={4} style={{ margin: 0, color: '#fff' }}>Booking Chart View</Title>}
                bordered={false}
                style={{ 
                    backgroundColor: '#141414', 
                    borderRadius: '8px', 
                    overflowX: 'auto', 
                    minWidth: '1000px' 
                }}
                bodyStyle={{ padding: 0 }}
            >
                <div className="booking-chart-container">
                    {/* 1. Render the Date Axis Header */}
                    {renderDateHeader()} {/* <-- Now correctly defined */}
                    
                    {/* 2. Render all Room Rows */}
                    {roomsData.map(room => renderRoomRow(room))}
                </div>
            </Card>
            
            {/* The Booking Form Drawer */}
            <BookingFormDrawer
                visible={isDrawerVisible}
                onClose={handleDrawerClose}
                initialData={formInitialData}
            />
        </>
    );
};

export default BookingChart;