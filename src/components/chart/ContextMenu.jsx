// src/components/chart/ContextMenu.jsx
import React from 'react';
import { Menu, Dropdown } from 'antd'; // Ant Design components
import { PlusOutlined, EditOutlined, RetweetOutlined, CloseCircleOutlined } from '@ant-design/icons';

// Mapping icons for clarity, assuming actions have a 'label' property
const getIcon = (label) => {
    if (label.includes('Add')) return <PlusOutlined />;
    if (label.includes('Edit')) return <EditOutlined />;
    if (label.includes('Change Status') || label.includes('Unpack')) return <RetweetOutlined />;
    if (label.includes('Out of')) return <CloseCircleOutlined />;
    return null;
};

const ContextMenu = ({ x, y, actions, onClose }) => {

    // --- Prepare Ant Design Menu Items ---
    const menuItems = actions.map((action, index) => ({
        key: action.label,
        label: action.label,
        icon: getIcon(action.label),
        onClick: (info) => {
            // Execute the action's handler and then close the menu
            action.handler(); 
            onClose();
        },
        // We can use a custom className if we need to style this menu item uniquely
        className: action.label.includes('Add Reservation') ? 'context-menu-primary' : '', 
    }));
    
    // We need a wrapper to anchor the AntD Dropdown at the specific (x, y) coordinates.
    // AntD Dropdown uses a popover model, which is easier to position than custom HTML.
    
    return (
        <Dropdown 
            // The overlay is the Ant Design Menu structure
            menu={{ items: menuItems }}
            // We use custom visible control since we control it via parent state (x, y)
            open={true} 
            // The AntD Dropdown will automatically position itself relative to the wrapper
            placement="bottomLeft" 
            trigger={['contextMenu']} // Use contextMenu trigger
        >
            {/* This invisible div acts as the anchor point for the dropdown. 
                Its position is fixed to the click coordinates (x, y). 
            */}
            <div 
                style={{
                    position: 'fixed',
                    left: x,
                    top: y,
                    zIndex: 1000, // Ensure it's above the chart
                    width: 1, // Minimal size for the anchor
                    height: 1, 
                    pointerEvents: 'none', // Allow clicks to pass through the anchor
                }}
            />
        </Dropdown>
    );
};

export default ContextMenu;