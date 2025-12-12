// src/components/TopBar.jsx
import React from 'react';
import UserDropdown from './UserDropdown'; // <-- Import the new component
import { useLocation } from 'react-router-dom';

// Assuming handleLogout is passed down from App.jsx
const TopBar = ({ onLogout }) => {
    const location = useLocation();

    // Check if we are on the full Reservation Screen
    const isReservationScreen = location.pathname.startsWith('/reservations') || location.pathname.startsWith('/reservation'); 

    return (
        <nav className="topbar">
            <div className="d-flex align-items-center justify-content-between w-100">
                {/* Left side Icons (can be contextual) */}
                <div className="d-flex icon-group">
                    <i className="bi bi-question-circle-fill me-3"></i>
                    <i className="bi bi-list-nested me-3"></i>
                    {/* Add more icons, e.g., the '356' Res No. badge from the image */}
                    {isReservationScreen && (
                       <span className="badge bg-primary me-3 align-self-center">Reservation: 356</span>
                    )}
                </div>

                {/* Right side Search and User */}
                <div className="d-flex align-items-center">
                    <div className="input-group input-group-sm me-3">
                        <input type="text" className="form-control" placeholder="Reservation Search..." />
                        <span className="input-group-text"><i className="bi bi-search"></i></span>
                    </div>
                    {/* Notification, Chat, Help icons... */}
                    <i className="bi bi-bell-fill me-3"></i>
                    <i className="bi bi-chat-dots-fill me-3"></i>
                    <i className="bi bi-question-circle-fill me-3"></i>
                    
                    {/* Replace the placeholder icon with the UserDropdown */}
                    <UserDropdown onLogout={onLogout} /> 
                </div>
            </div>
        </nav>
    );
};

export default TopBar;