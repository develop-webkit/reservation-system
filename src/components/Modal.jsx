// src/components/Modal.jsx
import React from 'react';

// This component uses Bootstrap classes for appearance
const Modal = ({ isOpen, title, onClose, children, size = 'lg', isFullWidth = false }) => {
    
    // We use a CSS class for visibility instead of mounting/unmounting the element
    const modalClass = isOpen ? 'modal fade show d-block' : 'modal fade';
    
    const dialogClass = isFullWidth 
        ? 'modal-dialog modal-xl' 
        : `modal-dialog modal-${size}`;
    
    if (!isOpen) return null; // Only render when open

    return (
        <>
            {/* The Modal Backdrop: Needs fixed positioning and high z-index */}
            <div 
                className="modal-backdrop fade show"
                // ADDED CSS: Ensures backdrop covers the entire screen
                style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 1040 }} 
            ></div> 

            {/* The Modal container: Needs fixed positioning and even higher z-index */}
            <div 
                className={modalClass} 
                tabIndex="-1" 
                role="dialog" 
                // CRITICAL ADDITIONS: Position fixed, align to center, and high z-index
                style={{ 
                    position: 'fixed', // Position must be fixed to float
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    zIndex: 1050, // Higher than backdrop
                    overflowX: 'hidden', 
                    overflowY: 'auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)' // Darkened background
                }} 
                onClick={onClose} // Close on backdrop click
            >
                <div 
                    className={dialogClass} 
                    role="document" 
                    // ADDED STYLE: Center the dialog vertically (optional, but standard for modals)
                    style={{ margin: '1.75rem auto' }}
                    onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
                >
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header bg-dark text-white">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
                        </div>
                        
                        {/* Modal Body (Content) */}
                        <div className="modal-body">
                            {children}
                        </div>
                        
                        {/* Optional Modal Footer */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;