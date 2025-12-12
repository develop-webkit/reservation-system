// src/components/chart/RoomRow.jsx
import React from 'react';

// Accept the new onContextMenu handler
const RoomRow = ({ room, chartDays, ROOM_COL_WIDTH, onMouseEnter, onMouseLeave, onContextMenu }) => {
    
    // NOTE: For the purpose of this mock, we assume the chart always starts at Day 1.
    // In a real application, you would pass the chart's starting date down as a prop
    // and use a date library (like date-fns or moment) to calculate the diff in days.

    const reservationBars = room.reservations.map(res => {
        
        // --- CRITICAL FIX: RESTORING CALCULATION LOGIC ---
        
        // 1. Calculate Start Column (startDay is a mock property from mockChartData)
        // If the chart always starts at day 1, the reservation's startDay is the grid column.
        const startColumn = res.startDay; 
        
        // 2. Calculate Span (duration)
        // Duration property holds the number of days the reservation spans.
        const span = res.duration;
        
        // 3. Optional: Calculate overlap if a reservation starts before Day 1 or ends after the chart view.
        // We skip complex overlap logic for now, relying on the mock data being clean.
        
        // -------------------------------------------------

        return (
            <div 
                key={res.id}
                className={`reservation-bar ${res.color} text-white small text-truncate px-1`}
                style={{ 
                    // FIX: startColumn and span are now defined. 
                    // gridColumn sets the reservation's position and width on the CSS grid.
                    gridColumn: `${startColumn} / span ${span}`,
                }}
                onMouseEnter={(e) => onMouseEnter(e, res, room)} 
                onMouseLeave={onMouseLeave}
                // CRITICAL: Reservation-specific context menu
                onContextMenu={(e) => onContextMenu(e, 'reservation', res)} 
            >
                {res.client}
            </div>
        );
    });

    return (
        <div 
            className="chart-row-grid"
            // CRITICAL: Room-specific context menu (if right-clicking empty space)
            onContextMenu={(e) => onContextMenu(e, 'room', room)} 
            // FIX: Restore the gridTemplateColumns style. Assuming this component is for a 7-day chart view + Room Column
            style={{ 
                gridTemplateColumns: `${ROOM_COL_WIDTH} repeat(${chartDays}, 1fr)` 
            }}
        >
            {/* 1. Room Label Column */}
            <div className="room-label" style={{ width: ROOM_COL_WIDTH }}>
                <span className="fw-bold">{room.name}</span>
            </div>
            
            {/* 2. Reservation Bars Column */}
            <div className="reservation-track">
                {reservationBars}
            </div>
        </div>
    );
};

export default RoomRow;