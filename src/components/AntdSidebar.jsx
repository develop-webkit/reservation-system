// src/components/AntdSidebar.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Input } from 'antd'; 
import { navConfig } from '../data/navConfig'; 
import { 
    HomeOutlined, 
    SettingOutlined, 
    SearchOutlined, 
    CalendarOutlined, // Added more icons for better mapping
    DollarOutlined, 
    UserOutlined 
} from '@ant-design/icons'; 

const { SubMenu } = Menu;

// --- Helper function to create AntD Menu items from navConfig ---
const getItem = (label, key, icon, children, type) => {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
};

// --- Helper function to map navConfig to AntD Menu items ---
const mapNavToAntd = (navItems) => {
    return navItems.map(item => {
        
        let iconComponent = null; // Default to null (no icon)
        
        // FIX: Ensure item.icon is a string before calling .includes()
        if (typeof item.icon === 'string') {
            // Determine the icon based on the mock Bootstrap icon names
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
                // Default icon for unmatched items
                iconComponent = <SettingOutlined />; 
            }
        }

        if (item.children) {
            // This is a collapsible group (SubMenu)
            return getItem(
                item.name, 
                item.name, // Use name as the unique key for the group
                iconComponent, 
                mapNavToAntd(item.children) // Recursively map children
            );
        } else {
            // This is a simple link (MenuItem)
            // Use item.path as the key for navigation
            return getItem(item.name, item.path, iconComponent);
        }
    });
};


const AntdSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // State for Search and Menu Expansion
    const [searchTerm, setSearchTerm] = useState(''); 
    const [openKeys, setOpenKeys] = useState([]); 

    // --- 1. Filtering Logic ---
    const filteredNav = useMemo(() => {
        if (!searchTerm) {
            return navConfig; 
        }

        const lowerCaseSearch = searchTerm.toLowerCase();

        return navConfig
            .map(item => {
                const parentMatch = item.name.toLowerCase().includes(lowerCaseSearch);
                let matchingChildren = [];

                if (item.children) {
                    matchingChildren = item.children.filter(child => 
                        child.name.toLowerCase().includes(lowerCaseSearch)
                    );
                }

                // Include item if parent or any children match
                if (parentMatch || matchingChildren.length > 0) {
                    // If searching, only show children that match the filter
                    const childrenToShow = searchTerm ? matchingChildren : item.children;
                    return { ...item, children: childrenToShow };
                }
                return null;
            })
            .filter(item => item !== null);
    }, [searchTerm]);

    // --- 2. Menu Control Handlers ---

    // Handles clicking a menu item (navigates to the path)
    const handleMenuClick = ({ key }) => {
        // AntD key is the path defined in mapNavToAntd
        if (key.startsWith('/')) {
            navigate(key);
        }
    };
    
    // Handles opening/closing SubMenus (accordion style)
    const handleOpenChange = (keys) => {
        // Enforce single open SubMenu (accordion behavior)
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        
        const rootSubKeys = navConfig.map(item => item.name);
        
        if (rootSubKeys.includes(latestOpenKey)) {
            // If the latest key is a root key, keep only that one open
            setOpenKeys([latestOpenKey]);
        } else {
            // If it's a nested key or closing, use the default AntD behavior
            setOpenKeys(keys);
        }
    };
    
    // --- 3. Effect for Active/Search State ---
    
    // Effect: Determine the initially active menu item and its parent group
    useEffect(() => {
        const path = location.pathname;

        // Find the active parent group name
        const activeParent = navConfig.find(item => 
            item.children && item.children.some(child => path.startsWith(child.path) && path !== child.path)
        );
        
        if (activeParent) {
            setOpenKeys([activeParent.name]);
        }
        
    }, [location.pathname]); 

    // Effect: Auto-expand all matching groups when search is active
    useEffect(() => {
        if (searchTerm) {
            // Get all parent group names from the filtered list that have children
            const allParentKeys = filteredNav
                .filter(item => item.children && item.children.length > 0)
                .map(item => item.name);
            setOpenKeys(allParentKeys); 
        }
    }, [searchTerm, filteredNav]);


    // Map the filtered configuration to the final AntD Menu structure
    const antdMenuItems = mapNavToAntd(filteredNav);

    // Determine the currently selected key (which path matches the URL)
    const selectedKeys = [location.pathname];
    
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. Header (Logo/Title) */}
            <div className="antd-sidebar-logo" style={{ textAlign: 'center' }}>
                <h1 style={{ color: 'white', fontSize: '24px', margin: 0, padding: '16px 0' }}>RMS</h1>
            </div>
            
            {/* 2. Search Input */}
            <div style={{ padding: '10px 16px' }}>
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Menu search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderRadius: '4px' }}
                />
            </div>
            
            {/* 3. Navigation Menu */}
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

            {/* 4. Footer */}
            <div style={{ padding: '16px', color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.7rem' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>RMS Billing</p>
                Mount Morgan Space Solutions<br/>
                RMS Client No: 22063<br/>
                User: HGManager<br/>
                <span style={{ color: '#52c41a' }}>Live</span>
            </div>
        </div>
    );
};

export default AntdSidebar;