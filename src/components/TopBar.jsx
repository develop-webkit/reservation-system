// src/components/TopBar.jsx
import React from 'react';

const TopBar = () => {
    return (
        <nav className="topbar">
            <div className="d-flex align-items-center justify-content-between w-100">
                {/* Left side Icons */}
                <div className="d-flex icon-group">
                    <i className="bi bi-question-circle-fill me-3"></i>
                    {/* Add more icons here based on your image */}
                    <i className="bi bi-list-nested me-3"></i>
                    <i className="bi bi-receipt me-3"></i>
                    {/* ... other icons */}
                </div>

                {/* Right side Search and User */}
                <div className="d-flex align-items-center">
                    <div className="input-group input-group-sm me-3">
                        <input type="text" className="form-control" placeholder="Reservation Search..." />
                        <span className="input-group-text"><i className="bi bi-search"></i></span>
                    </div>
                    <i className="bi bi-bell-fill me-3"></i>
                    <i className="bi bi-person-circle fs-4"></i>
                </div>
            </div>
        </nav>
    );
};

export default TopBar;