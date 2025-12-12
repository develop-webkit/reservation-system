// src/pages/BookingChart.jsx
import React, { useState } from 'react';
import { Card } from 'antd'; // <-- NEW IMPORT: Ant Design Card
import { roomTypes, chartDays } from '../data/mockChartData'; 
import ChartHeader from '../components/chart/ChartHeader';
import RoomRow from '../components/chart/RoomRow';
import ReservationTooltip from '../components/chart/ReservationTooltip'; 
import ContextMenu from '../components/chart/ContextMenu'; 
import { useModal } from '../contexts/ModalContext'; 

// Define a constant for the width of the room label column
const ROOM_COL_WIDTH = '220px';

// Mock Component remains the same
const AddReservationForm = () => (
    <div className="p-4">
        <h3>New Reservation</h3>
        <p>This is where the full Add Reservation Screen components will go, opened via the Context Menu.</p>
        <p className="text-muted">Note the final screen will use a full-width, multi-panel layout.</p>
    </div>
);


const BookingChart = () => {
    const { openModal } = useModal(); 
    const [isExpanded, setIsExpanded] = useState(true);
    const [tooltip, setTooltip] = useState({
        isVisible: false,
        x: 0,
        y: 0,
        data: null
    });
    const [contextMenu, setContextMenu] = useState({
        isVisible: false,
        x: 0,
        y: 0,
        contextData: null
    });

    // ... (Tooltip Handlers - handleMouseEnter, handleMouseLeave - remain the same) ...
    const handleMouseEnter = (e, reservation, room) => {
        setTooltip({
            isVisible: true,
            x: e.clientX,
            y: e.clientY,
            data: { reservation, room }
        });
    };

    const handleMouseLeave = () => {
        setTooltip(prev => ({ ...prev, isVisible: false }));
    };

    // --- CONTEXT MENU HANDLERS (Same logic, now drives AntD Dropdown) ---
    const emptyCellActions = [
        { label: 'Add Reservation', handler: () => openModal('Add New Reservation', <AddReservationForm />, { isFullWidth: true }) },
        { label: 'Quick Quote', handler: () => alert('Quick Quote triggered') },
        { label: 'Add Out of Order', handler: () => alert('Out of Order triggered') },
        { label: 'Add Out Of Service', handler: () => alert('Out of Service triggered') },
    ];
    
    const reservationActions = [
        { label: 'View/Edit Reservation', handler: () => console.log('Edit', contextMenu.contextData) },
        { label: 'Change Status', handler: () => alert('Change Status triggered') },
        { label: 'Unpack Reservation', handler: () => alert('Unpack triggered') }, 
    ];
    
    const handleContextMenu = (e, contextType, data) => {
        e.preventDefault(); 
        
        // We close the menu first to force AntD Dropdown to re-render 
        // and reposition the anchor if the coordinates change rapidly.
        if (contextMenu.isVisible) {
            handleCloseContextMenu();
        }

        // Delay setting the new position allows for a cleaner closure animation (if any)
        setTimeout(() => {
             setContextMenu({
                isVisible: true,
                x: e.clientX, 
                y: e.clientY,
                contextData: { type: contextType, data }
            });
        }, 10);
    };

    const handleCloseContextMenu = () => {
        setContextMenu(prev => ({ ...prev, isVisible: false }));
    };
    
    const getCurrentActions = () => {
        if (!contextMenu.contextData) return emptyCellActions; 

        if (contextMenu.contextData.type === 'reservation') {
            return reservationActions;
        } else {
            return emptyCellActions;
        }
    };


    return (
        // Replaced custom div with Ant Design Card for styling
        <Card 
            title="Booking Chart" 
            bordered={false} 
            bodyStyle={{ padding: 0 }} // Remove default AntD card padding for the chart layout
            style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column' 
            }}
        >
            
            {/* The Main Chart Grid Wrapper */}
            <div className="chart-grid-wrapper" 
                 // Ensure handlers close the context menu
                onClick={handleCloseContextMenu} 
                onScroll={handleCloseContextMenu} 
                style={{ overflowY: 'auto', flexGrow: 1 }} // Allow chart content to scroll
            >
                {/* 1. Chart Header (Dates and Toolbar) - We update this next */}
                <ChartHeader 
                    chartDays={chartDays} 
                    ROOM_COL_WIDTH={ROOM_COL_WIDTH} 
                />
                
                {/* 2. Room Rows (The main content area) */}
                <div className="chart-body">
                    {roomTypes.map(roomType => (
                        <React.Fragment key={roomType.id}>
                            {/* Room Type Header (e.g., 'Standard Ensuite Benjamin') */}
                            <div 
                                className="room-type-header"
                                onClick={() => setIsExpanded(!isExpanded)}
                                // This style ensures the header spans across the grid header and the chart area
                                style={{ 
                                    width: `calc(100% + ${ROOM_COL_WIDTH})`, 
                                    padding: '8px 12px',
                                    fontWeight: 'bold',
                                    backgroundColor: '#f5f5f5', // Light gray background
                                    borderBottom: '1px solid #e8e8e8',
                                    cursor: 'pointer'
                                }}
                            >
                                <span className="fw-bold px-2">
                                    {isExpanded ? '▼' : '▶'} {/* AntD icons can replace these later */}
                                    {roomType.name}
                                </span>
                            </div>
                            
                            {/* Individual Room Rows - Rendered conditionally */}
                            {isExpanded && roomType.rooms.map(room => (
                                <RoomRow 
                                    key={room.id}
                                    room={room}
                                    chartDays={chartDays}
                                    ROOM_COL_WIDTH={ROOM_COL_WIDTH}
                                    onMouseEnter={handleMouseEnter} 
                                    onMouseLeave={handleMouseLeave}
                                    onContextMenu={handleContextMenu} 
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* The Context Menu Component - Now uses AntD Dropdown structure */}
            {contextMenu.isVisible && (
                <ContextMenu 
                    x={contextMenu.x}
                    y={contextMenu.y}
                    actions={getCurrentActions()} 
                    onClose={handleCloseContextMenu}
                />
            )}
            
            {/* Reservation Tooltip (Popup on Hover) */}
            {tooltip.isVisible && (
                <ReservationTooltip
                    x={tooltip.x}
                    y={tooltip.y}
                    data={tooltip.data}
                />
            )}
        </Card>
    );
};

export default BookingChart;