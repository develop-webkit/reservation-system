// src/components/chart/RoomRow.jsx
import React from 'react';

// Accept the new onContextMenu handler
const RoomRow = ({ room, chartDays, ROOM_COL_WIDTH, onMouseEnter, onMouseLeave, onContextMenu }) => {
    
    // ... existing CSS variables definition ...

    const reservationBars = room.reservations.map(res => {
        // ... calculation logic ...

        return (
            <div 
                key={res.id}
                className={`reservation-bar ${res.color} text-white small text-truncate px-1`}
                style={{ 
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
            style={{ gridTemplateColumns: `...` }} 
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