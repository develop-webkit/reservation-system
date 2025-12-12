// src/components/AntdTopBar.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Input, Space, Badge, Dropdown, theme, Typography } from 'antd'; // <-- Ant Design components
import { SearchOutlined, BellOutlined, MessageOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons'; // <-- Ant Design Icons
import UserDropdown from './UserDropdown'; // We will convert this component next

const { Text } = Typography;

// We assume the use of the Ant Design theme for the look and feel
const { useToken } = theme;

// Ant Design TopBar Component
const AntdTopBar = ({ onLogout }) => {
    const location = useLocation();
    // Access Ant Design theme tokens for styling
    const { token } = useToken(); 

    // Check if we are on the full Reservation Screen (for the badge)
    const isReservationScreen = location.pathname.startsWith('/reservations') || location.pathname.startsWith('/reservation'); 

    // --- Dropdown Items (Simplified for initial conversion) ---
    // Note: The UserDropdown component will contain the complex logic later.
    // For now, we define the structure for the AntD Dropdown component.
    const items = [
        {
            key: 'user_details',
            label: 'User Details (To be implemented)',
        },
        {
            key: 'user_profile',
            label: 'User Profile (Full Screen)',
        },
        {
            key: 'logout',
            danger: true,
            label: 'Logout',
            onClick: onLogout,
        },
    ];

    return (
        // The header is controlled by the AntD Layout component in App.jsx.
        // We use flexbox principles to separate the left and right sections.
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
            padding: `0 ${token.paddingMD}px`, // Standard AntD padding
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            background: '#fff',
        }}>
            
            {/* Left Side: Contextual Info and Help Icons */}
            <Space size="middle">
                {/* Help Icon */}
                <QuestionCircleOutlined style={{ fontSize: '18px', cursor: 'pointer', color: token.colorTextSecondary }} />
                
                {/* List Icon (Placeholder for the RMS list/menu icon) */}
                <MessageOutlined style={{ fontSize: '18px', cursor: 'pointer', color: token.colorTextSecondary }} />

                {/* Reservation Badge (Conditional rendering) */}
                {isReservationScreen && (
                    <Badge count={356} showZero color={token.colorPrimary} >
                        <Text style={{ marginLeft: token.marginXS }}>Reservation</Text>
                    </Badge>
                )}
            </Space>

            {/* Right Side: Search, Notifications, and User */}
            <Space size="middle">
                
                {/* Search Input (Replaces Bootstrap input-group) */}
                <Input
                    placeholder="Reservation Search..."
                    prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />}
                    style={{ width: 200, borderRadius: '4px' }}
                    size="small"
                />
                
                {/* Notification Icon (Replaces bell-fill) */}
                <Badge dot>
                    <BellOutlined style={{ fontSize: '18px', cursor: 'pointer', color: token.colorTextSecondary }} />
                </Badge>
                
                {/* User Dropdown (Replaces Bootstrap dropdown structure) */}
                {/* We will use the AntD Dropdown and eventually integrate the complex logic of UserDropdown.jsx here */}
                <Dropdown 
                    menu={{ items }} 
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <div style={{ cursor: 'pointer' }}>
                        <UserOutlined style={{ fontSize: '20px', color: token.colorTextSecondary }} />
                    </div>
                </Dropdown>
            </Space>
        </div>
    );
};

export default AntdTopBar;