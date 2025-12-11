// src/components/chart/RoomRow.jsx
import React from 'react';

const RoomRow = ({ room, chartDays, ROOM_COL_WIDTH }) => {

    const reservationBars = room.reservations.map(res => {
        // Calculate the starting column (start - 1 to be 1-indexed for CSS Grid)
        // Span is calculated by end - start + 1
        const startColumn = res.start + 1;
        const span = res.end - res.start + 1;

        return (
            <div 
                key={res.id}
                className={`reservation-bar ${res.color} text-white small text-truncate px-1`}
                style={{ 
                    gridColumn: `${startColumn} / span ${span}`,
                }}
            >
                {res.client}
            </div>
        );
    });

    return (
        <div 
            className="chart-row room-data-row border-bottom"
            style={{ 
                gridTemplateColumns: `${ROOM_COL_WIDTH} repeat(${chartDays}, 1fr)` 
            }}
        >
            <div className="room-name-cell fw-bold small p-2 text-dark">
                {room.name}
            </div>
            
            {reservationBars}
            {/* Context menu trigger (for right-click menu) would be here */}
        </div>
    );
};

export default RoomRow;