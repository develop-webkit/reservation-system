// src/pages/BookingChart.jsx
import React, { useState } from 'react';
// Import mock data (assuming these files exist from previous steps)
import { roomTypes, chartDays } from '../data/mockChartData'; 
// Import necessary chart sub-components
import ChartHeader from '../components/chart/ChartHeader';
import RoomRow from '../components/chart/RoomRow';
import ReservationTooltip from '../components/chart/ReservationTooltip'; 
import ContextMenu from '../components/chart/ContextMenu'; 
import { useModal } from '../contexts/ModalContext'; // For opening the Add Reservation modal

// Define a constant for the width of the room label column
const ROOM_COL_WIDTH = '220px';

// --- Mock Component for the Full Add Reservation Screen ---
// This will be replaced by a complex component later, but demonstrates modal usage.
const AddReservationForm = () => (
    <div className="p-4">
        <h3>New Reservation</h3>
        <p>This is where the full Add Reservation Screen components will go, opened via the Context Menu.</p>
        <p className="text-muted">Note the final screen will use a full-width, multi-panel layout.</p>
    </div>
);


const BookingChart = () => {
    // Access the global modal system
    const { openModal } = useModal(); 

    // State 1: Manages the expansion/collapse of room types in the sidebar
    const [isExpanded, setIsExpanded] = useState(true);

    // State 2: Manages the visibility, content, and position of the Reservation Tooltip (on hover)
    const [tooltip, setTooltip] = useState({
        isVisible: false,
        x: 0,
        y: 0,
        data: null
    });

    // State 3: Manages the visibility, position, and items of the Context Menu (on right-click)
    const [contextMenu, setContextMenu] = useState({
        isVisible: false,
        x: 0, // Position X (from cursor)
        y: 0, // Position Y (from cursor)
        contextData: null // Stores info about what was clicked (room or reservation)
    });

    // --- TOOLTIP (HOVER POPUP) HANDLERS ---
    const handleMouseEnter = (e, reservation, room) => {
        setTooltip({
            isVisible: true,
            // Position the tooltip relative to the mouse (e.clientX/Y)
            x: e.clientX,
            y: e.clientY,
            data: { reservation, room }
        });
    };

    const handleMouseLeave = () => {
        setTooltip(prev => ({ ...prev, isVisible: false }));
    };

    // --- CONTEXT MENU (RIGHT-CLICK) HANDLERS ---

    // 1. Define the actions available for an EMPTY CELL click (based on the image)
    const emptyCellActions = [
        { 
            label: 'Add Reservation', 
            // Opens the full-screen reservation form modal
            handler: () => openModal('Add New Reservation', <AddReservationForm />, { isFullWidth: true }) 
        },
        { label: 'Quick Quote', handler: () => alert('Quick Quote triggered') },
        { label: 'Add Out of Order', handler: () => alert('Out of Order triggered') },
        { label: 'Add Out Of Service', handler: () => alert('Out of Service triggered') },
    ];
    
    // 2. Define actions for an EXISTING RESERVATION click
    // The items will dynamically change based on the reservation status/type.
    const reservationActions = [
        { label: 'View/Edit Reservation', handler: () => console.log('Edit', contextMenu.contextData) },
        { label: 'Change Status', handler: () => alert('Change Status triggered') },
        // Action to trigger the "Unpark" modal
        { label: 'Unpack Reservation', handler: () => alert('Unpack triggered') }, 
    ];
    
    // 3. The universal handler for the right-click event
    const handleContextMenu = (e, contextType, data) => {
        e.preventDefault(); // CRITICAL: Stop the browser's native context menu
        
        // Close the menu if it's already open to allow rapid re-opening
        if (contextMenu.isVisible) {
            handleCloseContextMenu();
        }

        // Set the menu state based on the event details
        setContextMenu({
            isVisible: true,
            x: e.clientX, 
            y: e.clientY,
            contextData: { type: contextType, data } // Pass context data (e.g., the room ID or reservation object)
        });
    };

    // 4. Handler to close the menu
    const handleCloseContextMenu = () => {
        setContextMenu(prev => ({ ...prev, isVisible: false }));
    };
    
    // 5. Function to select the correct set of actions based on contextData
    const getCurrentActions = () => {
        if (!contextMenu.contextData) return emptyCellActions; // Default actions

        if (contextMenu.contextData.type === 'reservation') {
            return reservationActions;
        } else {
            return emptyCellActions;
        }
    };


    return (
        <div className="booking-chart-container p-0"> 
            
            {/* The Main Chart Grid Wrapper */}
            <div className="chart-grid-wrapper" 
                 // If the user clicks anywhere in the chart, close the context menu.
                onClick={handleCloseContextMenu} 
                 // If the user scrolls, close the context menu.
                onScroll={handleCloseContextMenu} 
            >
                {/* 1. Chart Header (Dates and Toolbar) */}
                <ChartHeader 
                    chartDays={chartDays} 
                    ROOM_COL_WIDTH={ROOM_COL_WIDTH} 
                    // Add a toolbar handler here if needed
                />
                
                {/* 2. Room Rows (The main content area) */}
                <div className="chart-body">
                    {roomTypes.map(roomType => (
                        <React.Fragment key={roomType.id}>
                            {/* Room Type Header (e.g., 'Standard Ensuite Benjamin') */}
                            <div 
                                className="room-type-header"
                                onClick={() => setIsExpanded(!isExpanded)}
                                style={{ width: `calc(100% + ${ROOM_COL_WIDTH})` }} // Span across the entire width
                            >
                                <span className="fw-bold px-2">
                                    {isExpanded ? <i className="bi bi-chevron-down me-2"></i> : <i className="bi bi-chevron-right me-2"></i>}
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
                                    // Pass tooltip handlers
                                    onMouseEnter={handleMouseEnter} 
                                    onMouseLeave={handleMouseLeave}
                                    // Pass context menu handler
                                    onContextMenu={handleContextMenu} 
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* The Context Menu Component - Renders based on state */}
            {contextMenu.isVisible && (
                <ContextMenu 
                    x={contextMenu.x}
                    y={contextMenu.y}
                    actions={getCurrentActions()} // Dynamic list of actions
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
        </div>
    );
};

export default BookingChart;