// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navConfig } from '../data/navConfig'; 

const Sidebar = () => {
    const location = useLocation();
    const [openGroup, setOpenGroup] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // <-- New State for Search

    // --- Active Group Logic (Same as before) ---
    useEffect(() => {
        const activeParent = navConfig.find(item => 
            item.children && item.children.some(child => location.pathname.startsWith(child.path))
        );
        if (activeParent) {
            setOpenGroup(activeParent.name);
        }
    }, [location.pathname]);

    const toggleGroup = (name) => {
        setOpenGroup(openGroup === name ? '' : name);
    };
    // ------------------------------------------


    // --- New Filtering Logic ---
    const filteredNav = navConfig
        .map(item => {
            // Check if parent name matches search term
            const parentMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Check if any children match the search term
            let matchingChildren = [];
            if (item.children) {
                matchingChildren = item.children.filter(child => 
                    child.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Only include the item if the parent or at least one child matches
            if (parentMatch || matchingChildren.length > 0) {
                // If there's a search term, only show the matching children
                // otherwise, show all children (default view)
                const childrenToShow = searchTerm ? matchingChildren : item.children;
                
                return { 
                    ...item, 
                    children: childrenToShow 
                };
            }
            return null; // Exclude non-matching parents
        })
        .filter(item => item !== null); // Remove null entries
    // ------------------------------------------

    // When a search is active, automatically expand all matching parents
    useEffect(() => {
        if (searchTerm) {
            // Find the name of the first parent that matches
            const firstMatch = filteredNav.find(item => item.children && item.children.length > 0);
            if (firstMatch) {
                // Auto-open the group of the first matched item
                setOpenGroup(firstMatch.name);
            }
        }
    }, [searchTerm, filteredNav]);


    return (
        <div id="sidebar-wrapper">
            <div className="sidebar-header">
                <h1 className="text-white fs-4 ms-2">RMS</h1>
            </div>

            {/* Menu Search Input - NOW CONNECTED TO STATE */}
            <div className="input-group p-2">
                <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Menu search" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // <-- Update state on change
                />
                <span className="input-group-text bg-white border-0"><i className="bi bi-search"></i></span>
            </div>

            {/* Navigation Links (Uses filteredNav) */}
            <ul className="list-unstyled components">
                {filteredNav.map((item) => ( // <-- Use filteredNav here
                    <li key={item.name} className={location.pathname === item.path ? 'active-link' : ''}>
                        
                        {/* Parent Link or Accordion Trigger */}
                        {item.children ? (
                            <div 
                                className={`sidebar-link d-flex justify-content-between align-items-center ${openGroup === item.name || searchTerm ? 'active-link' : ''}`}
                                onClick={() => toggleGroup(item.name)}
                            >
                                <div>
                                    <i className={`bi ${item.icon} me-2`}></i>
                                    {item.name}
                                </div>
                                {/* Rotate icon only if no search term, or if manually toggled */}
                                <i className={`bi bi-chevron-right chevron-icon ${openGroup === item.name || searchTerm ? 'open' : ''}`}></i>
                            </div>
                        ) : (
                            // Simple Link Item (e.g., Dashboard)
                            <Link to={item.path} className="sidebar-link">
                                <i className={`bi ${item.icon} me-2`}></i>
                                {item.name}
                            </Link>
                        )}
                        
                        {/* Collapsible Child Menu */}
                        {item.children && (
                            <ul className={`collapse list-unstyled sub-menu ${openGroup === item.name || searchTerm ? 'show' : ''}`}>
                                {item.children.map(child => (
                                    <li key={child.name} className={location.pathname === child.path ? 'active-link-sub' : ''}>
                                        <Link to={child.path} className="sidebar-link sub-link">
                                            {child.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}

                {/* ... other sidebar footer items ... */}
                {/* ... (rest of the component) ... */}
            </ul>

            {/* Footer Text */}
            <div className="mt-3">
                <p className="sidebar-footer-group">RMS Billing</p>
                <div className="sidebar-footer text-muted small p-2">
                    Mount Morgan Space Solutions<br/>
                    RMS Client No: 22063<br/>
                    User: HGManager<br/>
                    Live
                </div>
            </div>
        </div>
    );
};

export default Sidebar;