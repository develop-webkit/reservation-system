// src/components/AntdSidebar.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Input, Tag } from 'antd';
import { navConfig } from '../data/navConfig';
import {
    HomeOutlined,
    SettingOutlined,
    SearchOutlined,
    CalendarOutlined,
    DollarOutlined,
    UserOutlined,
    TeamOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import useAuthStore from '../store/authStore';
import { PERMISSIONS } from '../constants/permissions';
import { ROLES, ROLE_NAMES, ROLE_COLORS } from '../constants/roles';

// Roles that have full admin privileges
const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.MANAGER];

const { SubMenu } = Menu;

// Helper function to create AntD Menu items
const getItem = (label, key, icon, children, type) => {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
};

// Helper function to map navConfig to AntD Menu items
const mapNavToAntd = (navItems) => {
    return navItems.map(item => {

        let iconComponent = null;

        if (typeof item.icon === 'string') {
            const iconName = item.icon.toLowerCase();

            if (iconName.includes('house') || iconName.includes('dashboard')) {
                iconComponent = <HomeOutlined />;
            } else if (iconName.includes('calendar') || iconName.includes('chart')) {
                iconComponent = <CalendarOutlined />;
            } else if (iconName.includes('reservations') || iconName.includes('booking')) {
                iconComponent = <DollarOutlined />;
            } else if (iconName.includes('user') || iconName.includes('admin')) {
                iconComponent = <UserOutlined />;
            } else {
                iconComponent = <SettingOutlined />;
            }
        }

        if (item.children) {
            return getItem(
                item.name,
                item.name,
                iconComponent,
                mapNavToAntd(item.children)
            );
        } else {
            return getItem(item.name, item.path, iconComponent);
        }
    });
};

const AntdSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, role, hasPermission } = useAuthStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [openKeys, setOpenKeys] = useState([]);

    // Role-based menu configuration
    const roleBasedNav = useMemo(() => {
        const baseNav = [...navConfig];

        // Add User Management submenu based on role
        const userManagementMenu = {
            name: 'User Management',
            icon: 'user',
            children: []
        };

        // Admin sees both Employee and Customer management
        if (ADMIN_ROLES.includes(role)) {
            userManagementMenu.children.push(
                {
                    name: 'Employees',
                    path: '/users/employees',
                    icon: 'team'
                },
                {
                    name: 'Customers',
                    path: '/users/customers',
                    icon: 'user'
                }
            );
        }

        // Employee sees only Customer management
        else if (role === ROLES.EMPLOYEE) {
            userManagementMenu.children.push({
                name: 'Customers',
                path: '/users/customers',
                icon: 'user'
            });
        }

        // Customer sees only their profile
        else if (role === ROLES.CUSTOMER) {
            return [
                {
                    name: 'Dashboard',
                    path: '/',
                    icon: 'house'
                },
                {
                    name: 'My Profile',
                    path: '/users/profile',
                    icon: 'user'
                },
                {
                    name: 'My Bookings',
                    path: '/my-bookings',
                    icon: 'calendar'
                }
            ];
        }

        // Add User Management menu if it has children
        if (userManagementMenu.children.length > 0) {
            baseNav.push(userManagementMenu);
        }

        // Filter base navigation based on permissions
        const filteredNav = baseNav.filter(item => {
            // Dashboard is available to all
            if (item.name === 'Dashboard') return true;

            // Charts submenu - only Admin
            if (item.name === 'Charts') {
                return hasPermission(PERMISSIONS.ACCESS_BOOKING_CHART);
            }

            // Reservations - only Admin
            if (item.name === 'Reservations') {
                return hasPermission(PERMISSIONS.VIEW_ALL_RESERVATIONS);
            }

            // User Management - already filtered above
            if (item.name === 'User Management') return true;

            return true;
        });

        return filteredNav;
    }, [role, hasPermission]);

    // Filtering Logic with search
    const filteredNav = useMemo(() => {
        if (!searchTerm) {
            return roleBasedNav;
        }

        const lowerCaseSearch = searchTerm.toLowerCase();

        return roleBasedNav
            .map(item => {
                const parentMatch = item.name.toLowerCase().includes(lowerCaseSearch);
                let matchingChildren = [];

                if (item.children) {
                    matchingChildren = item.children.filter(child =>
                        child.name.toLowerCase().includes(lowerCaseSearch)
                    );
                }

                if (parentMatch || matchingChildren.length > 0) {
                    const childrenToShow = searchTerm ? matchingChildren : item.children;
                    return { ...item, children: childrenToShow };
                }
                return null;
            })
            .filter(item => item !== null);
    }, [searchTerm, roleBasedNav]);

    // Menu Control Handlers
    const handleMenuClick = ({ key }) => {
        if (key.startsWith('/')) {
            navigate(key);
        }
    };

    const handleOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

        const rootSubKeys = roleBasedNav.map(item => item.name);

        if (rootSubKeys.includes(latestOpenKey)) {
            setOpenKeys([latestOpenKey]);
        } else {
            setOpenKeys(keys);
        }
    };

    // Effect: Determine initially active menu item
    useEffect(() => {
        const path = location.pathname;

        const activeParent = roleBasedNav.find(item =>
            item.children && item.children.some(child => path.startsWith(child.path) && path !== child.path)
        );

        if (activeParent) {
            setOpenKeys([activeParent.name]);
        }

    }, [location.pathname, roleBasedNav]);

    // Effect: Auto-expand when searching
    useEffect(() => {
        if (searchTerm) {
            const allParentKeys = filteredNav
                .filter(item => item.children && item.children.length > 0)
                .map(item => item.name);
            setOpenKeys(allParentKeys);
        }
    }, [searchTerm, filteredNav]);

    const antdMenuItems = mapNavToAntd(filteredNav);
    const selectedKeys = [location.pathname];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div className="antd-sidebar-logo" style={{ textAlign: 'center' }}>
                <h1 style={{ color: 'white', fontSize: '24px', margin: 0, padding: '16px 0' }}>RMS</h1>
            </div>

            {/* Search Input */}
            <div style={{ padding: '10px 16px' }}>
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Menu search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderRadius: '4px' }}
                />
            </div>

            {/* Navigation Menu */}
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onClick={handleMenuClick}
                onOpenChange={handleOpenChange}
                items={antdMenuItems}
                style={{ flexGrow: 1, borderRight: 0 }}
            />

            {/* Footer with User Info */}
            <div style={{ padding: '16px', color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>RMS Billing</p>
                <div style={{ marginTop: '8px' }}>
                    User: {user?.name || 'Unknown'}<br />
                    {role && (
                        <Tag color={ROLE_COLORS[role]} style={{ marginTop: '4px', fontSize: '10px' }}>
                            {ROLE_NAMES[role]}
                        </Tag>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AntdSidebar;