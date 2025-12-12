// src/components/UserDropdown.jsx
import React, { useState } from 'react';
import { useModal } from '../contexts/ModalContext'; 

// --- 1. Define Tab Content Components ---

// Mock Component for User Details/Profile Modals (unchanged)
const UserProfileDetails = ({ user }) => (
    <div className="p-3">
        <h4>User Details for {user.username}</h4>
        <p>This is where detailed user information (Contact, Roles, Security) would be displayed.</p>
        <p>IP Address: {user.ip}</p>
        <p>Client No: {user.clientNo}</p>
    </div>
);

// Content for the Profiles tab, based on the image
const ProfilesContent = () => (
    <>
        <h5 className="mb-3">Security Profile</h5>
        <table className="table table-sm table-hover">
            <thead>
                <tr>
                    <th>Security Profile</th>
                    <th>Properties</th>
                </tr>
            </thead>
            <tbody>
                <tr className="table-primary">
                    <td>Admin Super+</td>
                    <td>Mount Morgan Space Solutions</td>
                </tr>
                <tr>
                    <td>Manager</td>
                    <td>Mount Morgan Space Solutions</td>
                </tr>
            </tbody>
        </table>
        <div className="text-muted small mt-4">
            User Profile section where Super Admin can add multiple Profiles with Access Limited.
        </div>
    </>
);

// Placeholder Content for other tabs
const GenericTabContent = ({ title }) => (
    <div className="p-3">
        <h4>{title}</h4>
        <p>Content for the {title} section goes here.</p>
    </div>
);


// --- 2. The Main Tabbed Component ---

const UserProfileAdminContent = () => {
    // Define the available tabs, using keys that match the sidebar text
    const tabs = [
        { key: 'details', label: 'User Details', component: <GenericTabContent title="User Details" /> },
        { key: 'profiles', label: 'Profiles', component: <ProfilesContent /> },
        { key: 'devices', label: 'Trusted Devices', component: <GenericTabContent title="Trusted Devices" /> },
        { key: 'audit', label: 'Audit Trail', component: <GenericTabContent title="Audit Trail" /> },
    ];

    // State to track which tab is currently active
    const [activeTab, setActiveTab] = useState('profiles'); // Default to 'Profiles' based on the image

    // Find the component to render based on the active tab key
    const ActiveComponent = tabs.find(t => t.key === activeTab)?.component || <p>Select a view.</p>;

    return (
        <div className="d-flex h-100 user-profile-admin-container">
            {/* Left Sidebar (Navigation) */}
            <div className="p-3 border-end bg-light" style={{ width: '200px' }}>                
                <ul className="list-unstyled small profile-nav">
                    {tabs.map(tab => (
                        <li 
                            key={tab.key}
                            className={`p-2 rounded cursor-pointer ${activeTab === tab.key ? 'bg-primary text-white active-profile-tab' : ''}`}
                            onClick={() => setActiveTab(tab.key)} // Change the active tab
                        >
                            {tab.label}
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Right Content Area (Active Tab View) */}
            <div className="p-3 flex-grow-1">
                {ActiveComponent}
            </div>
        </div>
    );
};


// --- 3. Main UserDropdown Component (Mostly Unchanged) ---

const UserDropdown = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { openModal } = useModal();

    // Mock User Data (unchanged)
    const mockUser = {
        username: 'HGManager',
        client: 'Mount Morgan Space Solutions',
        property: 'Mount Morgan Space Solutions',
    };

    // --- Action Handlers (referencing the new tabbed component) ---

    // handleOpenUserDetails opens a simple, separate modal (unchanged)
    const handleOpenUserDetails = () => {
        setIsOpen(false);
        openModal(
            `User Details for ${mockUser.username}`, 
            <UserProfileDetails user={mockUser} />,
            { size: 'md' }
        );
    };

    // handleOpenUserProfile opens the full-screen tabbed modal
    const handleOpenUserProfile = () => {
        setIsOpen(false);
        openModal(
            `Edit - ${mockUser.username}`, 
            <UserProfileAdminContent />, 
            { isFullWidth: true }
        );
    };
    
    // --- Render Component (unchanged) ---

    return (
        <div className="dropdown user-dropdown">
            <button
                className="btn btn-sm"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <i className="bi bi-person-circle fs-4 text-dark"></i>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="dropdown-menu show" onBlur={() => setIsOpen(false)}>
                    
                    {/* Header Section (Dark Blue) */}
                    <div className="dropdown-header text-white p-3">
                        <div className="fw-bold">{mockUser.username} <i className="bi bi-person-fill ms-1"></i></div>
                    </div>

                    {/* Menu Items */}
                    <button className="dropdown-item" type="button" onClick={handleOpenUserDetails}>
                        User Details
                    </button>
                    <button className="dropdown-item" type="button" onClick={handleOpenUserProfile}>
                        User Profile
                    </button>
                    <button className="dropdown-item" type="button" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;