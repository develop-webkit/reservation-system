// src/components/chart/ContextMenu.jsx
import React from 'react';

// ContextMenu takes coordinates (x, y) for positioning and the list of actions.
const ContextMenu = ({ x, y, actions, onClose }) => {
    
    // We use inline styles for positioning the menu absolutely in the viewport.
    const menuStyle = {
        position: 'fixed', // Key: Fixes the menu relative to the viewport.
        top: `${y}px`,      // Places the menu vertically at the cursor position.
        left: `${x}px`,     // Places the menu horizontally at the cursor position.
        zIndex: 5500,       // Ensures the menu appears above everything else (Modals are 5000/5100).
    };

    return (
        // The main container with fixed position.
        // We use onBlur and onMouseLeave for redundancy to ensure the menu closes easily.
        <div 
            className="context-menu dropdown-menu show shadow" 
            style={menuStyle} 
            onBlur={onClose}
            onMouseLeave={onClose}
            tabIndex="-1" // Makes the div focusable so onBlur works.
        >
            {/* Map through the array of actions (e.g., 'Add Reservation', 'Quick Quote') */}
            {actions.map((action, index) => (
                <button 
                    key={index}
                    className="dropdown-item" 
                    type="button" 
                    onClick={() => {
                        action.handler(); // Execute the specific function for this action.
                        onClose();        // Immediately close the menu after the click.
                    }}
                >
                    {action.label}
                </button>
            ))}
            
            {/* Separate the 'Close Menu' option with a divider if needed */}
            <hr className="dropdown-divider" />
            <button className="dropdown-item" type="button" onClick={onClose}>
                Close Menu
            </button>
        </div>
    );
};

export default ContextMenu;