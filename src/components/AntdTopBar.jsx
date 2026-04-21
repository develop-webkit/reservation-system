// src/components/AntdTopBar.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Input, Space, Badge, Dropdown, theme, Typography, Tag, Avatar } from 'antd';
import { SearchOutlined, BellOutlined, MessageOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import UserDetailsModal from './UserDetailsModal';
import useAuthStore from '../store/authStore';
import { ROLE_NAMES, ROLE_COLORS } from '../constants/roles';

const { Text } = Typography;
const { useToken } = theme;

const AntdTopBar = ({ onLogout }) => {
    const location = useLocation(); 
    const { token } = useToken();
    const { user, role } = useAuthStore();

    const [isUserDetailsVisible, setIsUserDetailsVisible] = useState(false);

    const isReservationScreen = location.pathname.startsWith('/reservations') || location.pathname.startsWith('/reservation');

    const items = [
        {
            key: 'user_details',
            label: 'User Details',
            onClick: () => setIsUserDetailsVisible(true),
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
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
            padding: `0 ${token.paddingMD}px`,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            background: '#fff',
        }}>

            {/* Left Side: Contextual Info and Help Icons */}
            <Space size="middle">
                <QuestionCircleOutlined style={{ fontSize: '18px', cursor: 'pointer', color: token.colorTextSecondary }} />
                <MessageOutlined style={{ fontSize: '18px', cursor: 'pointer', color: token.colorTextSecondary }} />

                {isReservationScreen && (
                    <Badge count={356} showZero color={token.colorPrimary} >
                        <Text style={{ marginLeft: token.marginXS }}>Reservation</Text>
                    </Badge>
                )}
            </Space>

            {/* Right Side: Search, Notifications, and User */}
            <Space size="middle">
                <Input
                    placeholder="Reservation Search..."
                    prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />}
                    style={{ width: 200, borderRadius: '4px' }}
                    size="small"
                />

                <Badge dot>
                    <BellOutlined style={{ fontSize: '18px', cursor: 'pointer', color: token.colorTextSecondary }} />
                </Badge>

                {/* User Info with Role Badge */}
                <Dropdown
                    menu={{ items }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: ROLE_COLORS[role] }} />
                        <Space orientation="vertical" size={0}>
                            <Text strong style={{ fontSize: '12px' }}>{user?.name || 'User'}</Text>
                            {role && (
                                <Tag color={ROLE_COLORS[role]} style={{ fontSize: '10px', padding: '0 4px', margin: 0 }}>
                                    {ROLE_NAMES[role]}
                                </Tag>
                            )}
                        </Space>
                    </div>
                </Dropdown>
            </Space>

            <UserDetailsModal visible={isUserDetailsVisible} onClose={() => setIsUserDetailsVisible(false)} />
        </div>
    );
};

export default AntdTopBar;