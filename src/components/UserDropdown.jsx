// src/components/UserDropdown.jsx
import React, { useState } from 'react';
import { useModal } from '../contexts/ModalContext'; 
import { Dropdown, Space, Typography, Menu, Layout, Input } from 'antd'; // Ant Design components
import { 
    UserOutlined, 
    HomeOutlined, 
    LockOutlined, 
    LogoutOutlined,
    SettingOutlined // For the tab icons
} from '@ant-design/icons'; 

const { Text } = Typography;
const { Sider } = Layout;

// --- Mock Component for User Details (Small Modal) ---

const UserProfileDetails = ({ user }) => (
    <div style={{ padding: 15 }}>
        <Typography.Title level={4}>User Details for {user.username}</Typography.Title>
        <p>This is where detailed user information (Contact, Roles, Security) would be displayed.</p>
        <Text>IP Address: {user.ip}</Text><br/>
        <Text>Client No: {user.clientNo}</Text>
    </div>
);


// --- Mock Component for Full-Screen Tabbed Admin Modal ---

const UserProfileAdminContent = ({ user }) => {
    // State to track which tab is currently active
    const [activeKey, setActiveKey] = useState('profiles'); 
    
    // Define the tab options
    const tabList = [
        { key: 'details', label: 'User Details' },
        { key: 'profiles', label: 'Profiles' },
        { key: 'devices', label: 'Trusted Devices' },
        { key: 'audit', label: 'Audit Trail' },
    ];
    
    // Function to render content based on the active tab
    const renderContent = () => {
        switch (activeKey) {
            case 'profiles':
                return (
                    <>
                        <Typography.Title level={5}>Security Profile</Typography.Title>
                        {/* Mock Table using AntD-like structure, replicating the image */}
                        <table className="antd-table-mock" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f0f0f0' }}>
                            <thead>
                                <tr style={{ background: '#fafafa', textAlign: 'left' }}>
                                    <th style={{ padding: 8 }}>Security Profile</th>
                                    <th style={{ padding: 8 }}>Properties</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
                                    <td style={{ padding: 8 }}>Admin Super+</td>
                                    <td style={{ padding: 8 }}>Mount Morgan Space Solutions</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: 8 }}>Manager</td>
                                    <td style={{ padding: 8 }}>Mount Morgan Space Solutions</td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                );
            case 'details':
                return <UserProfileDetails user={user} />;
            default:
                return <p>Content for {activeKey} goes here.</p>;
        }
    };

    return (
        // Uses AntD Layout components for the split-panel view
        <Layout style={{ flexDirection: 'row', height: 'calc(100vh - 120px)' }}> 
            
            {/* Left Sidebar Menu */}
            <Sider width={200} style={{ background: '#f0f2f5', borderRight: '1px solid #e8e8e8' }}>
                <div style={{ padding: 16 }}>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>Find...</Text>
                    <Input placeholder="Search..." size="small" style={{ marginBottom: 16 }} />
                </div>
                
                <Menu
                    mode="inline"
                    selectedKeys={[activeKey]}
                    onSelect={({ key }) => setActiveKey(key)}
                    style={{ background: '#f0f2f5', borderRight: 'none', height: '100%' }}
                    items={tabList.map(item => ({ key: item.key, label: item.label, icon: <SettingOutlined /> }))}
                />
            </Sider>
            
            {/* Right Content */}
            <Layout.Content style={{ padding: 24, background: '#fff', flexGrow: 1 }}>
                {renderContent()}
            </Layout.Content>
        </Layout>
    );
};


// --- Main Dropdown Component ---

const UserDropdown = ({ onLogout }) => {
    const { openModal } = useModal();
    
    // Mock User Data 
    const mockUser = {
        username: 'HGManager',
        client: 'Mount Morgan Space Solutions',
        clientNo: 22063,
        property: 'Mount Morgan Space Solutions',
    };

    // --- Action Handlers ---

    const handleOpenUserDetails = () => {
        openModal(
            `User Details for ${mockUser.username}`, 
            <UserProfileDetails user={mockUser} />,
            { size: 'md' }
        );
    };

    const handleOpenUserProfile = () => {
        openModal(
            `Edit - ${mockUser.username}`, 
            <UserProfileAdminContent user={mockUser} />, 
            { isFullWidth: true }
        );
    };
    
    // --- Custom Dropdown Menu Render Function (Replaces Bootstrap Menu) ---
    const renderDropdownMenu = () => (
        <div style={{ width: 280, borderRadius: 4, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            
            {/* Custom Header Section (Dark Blue - Matches the image) */}
            <div style={{ background: '#0b1a2d', color: 'white', padding: '16px' }}>
                <Space direction="vertical" size={2}>
                    <Text strong style={{ color: 'white', fontSize: '1rem' }}>
                        {mockUser.username} <UserOutlined style={{ marginLeft: 4 }} />
                    </Text>
                    <Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                        IP Address: {mockUser.ip}
                    </Text>
                    <Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                        {mockUser.client} (MMV Client No: {mockUser.clientNo})
                    </Text>
                </Space>
            </div>

            {/* Ant Design Menu for the clickable items */}
            <Menu 
                items={[
                    { 
                        key: 'details', 
                        label: 'User Details', 
                        icon: <HomeOutlined />, 
                        onClick: handleOpenUserDetails 
                    },
                    { 
                        key: 'profile', 
                        label: 'User Profile', 
                        icon: <LockOutlined />, 
                        onClick: handleOpenUserProfile 
                    },
                    { 
                        type: 'divider' 
                    },
                    { 
                        key: 'logout', 
                        label: 'Logout', 
                        icon: <LogoutOutlined />, 
                        danger: true, 
                        onClick: onLogout 
                    },
                ]} 
            />
        </div>
    );

    return (
        <Dropdown 
            // AntD's way to render custom content inside the dropdown popover
            overlay={renderDropdownMenu} 
            trigger={['click']} 
            placement="bottomRight"
            arrow 
        >
            {/* The trigger element in the TopBar */}
            <div style={{ cursor: 'pointer' }}>
                <UserOutlined style={{ fontSize: '20px' }} />
            </div>
        </Dropdown>
    );
};

export default UserDropdown;