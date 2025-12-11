// src/pages/BookingChart.jsx
import React, { useState } from 'react';
import { roomTypes, chartDays } from '../data/mockChartData'; // Import mock data
import ChartHeader from '../components/chart/ChartHeader';
import RoomRow from '../components/chart/RoomRow';

// Constants for layout
const ROOM_COL_WIDTH = '200px'; 

const BookingChart = () => {
    const [viewRange, setViewRange] = useState({ startDay: 23, endDay: 53 }); // Dates 23 Nov - 22 Dec
    const [isExpanded, setIsExpanded] = useState(true);

    // Simple function to mock date rendering
    const getDateFromDay = (day) => {
        // Mock logic: Day 1 = Nov 23
        const date = new Date('2025-11-23');
        date.setDate(date.getDate() + day - 1);
        return {
            dayNum: date.getDate(),
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
            dateKey: `${date.getMonth() + 1}/${date.getDate()}`
        };
    };

    const daysArray = Array.from({ length: chartDays }, (_, i) => getDateFromDay(i + 1));

    return (
        <div className="booking-chart-container p-0">
            {/* Header Area with Filters, Dates, and Controls */}
            <ChartHeader 
                daysArray={daysArray} 
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
            />

            {/* The Main Chart Grid */}
            <div className="chart-grid-wrapper">
                {/* 1. Date Header Row */}
                <div className="chart-row chart-date-header" style={{ 
                    gridTemplateColumns: `${ROOM_COL_WIDTH} repeat(${chartDays}, 1fr)` 
                }}>
                    <div className="room-name-cell p-2"></div> {/* Empty corner cell */}
                    {daysArray.map((day) => (
                        <div 
                            key={day.dateKey} 
                            className={`date-cell text-center small ${day.isWeekend ? 'weekend' : ''}`}
                        >
                            <div className="day-num fw-bold">{day.dayNum}</div>
                            <div className="day-name text-muted">{day.dayName}</div>
                        </div>
                    ))}
                </div>

                {/* 2. Room Rows (The Reservation Bars) */}
                <div className="chart-body">
                    {roomTypes.map(roomType => (
                        <React.Fragment key={roomType.id}>
                            {/* Room Type Header Row */}
                            <div className={`room-type-header p-2 border-bottom ${isExpanded ? 'expanded' : 'collapsed'}`} onClick={() => setIsExpanded(!isExpanded)}>
                                <i className={`bi bi-caret-${isExpanded ? 'down' : 'right'}-fill me-2`}></i>
                                {roomType.name}
                            </div>
                            
                            {/* Individual Room Rows */}
                            {isExpanded && roomType.rooms.map(room => (
                                <RoomRow 
                                    key={room.id}
                                    room={room}
                                    chartDays={chartDays}
                                    ROOM_COL_WIDTH={ROOM_COL_WIDTH}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookingChart;