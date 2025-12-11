// src/components/Modal.jsx
import React from 'react';

// This component uses Bootstrap classes for appearance
const Modal = ({ isOpen, title, onClose, children, size = 'lg', isFullWidth = false }) => {
    
    // We use a CSS class for visibility instead of mounting/unmounting the element
    const modalClass = isOpen ? 'modal fade show d-block' : 'modal fade';
    
    const dialogClass = isFullWidth 
        ? 'modal-dialog modal-fullscreen' 
        : `modal-dialog modal-${size}`;
    
    if (!isOpen) return null; // Only render when open

    return (
        <>
            {/* The Modal Backdrop */}
            <div className="modal-backdrop fade show"></div> 

            {/* The Modal */}
            <div 
                className={modalClass} 
                tabIndex="-1" 
                role="dialog" 
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Darkened background
                onClick={onClose} // Close on backdrop click
            >
                <div 
                    className={dialogClass} 
                    role="document" 
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
                        
                        {/* Optional Modal Footer (Can be added here if needed for consistent buttons) */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;