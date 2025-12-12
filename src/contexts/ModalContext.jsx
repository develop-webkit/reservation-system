// src/contexts/ModalContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
// 🚨 FIX: Import the Modal component from its location
import Modal from '../components/Modal'; 

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        content: null,
        options: {} // size, isFullWidth, etc.
    });

    const openModal = useCallback((title, content, options = {}) => {
        setModal({
            isOpen: true,
            title,
            content,
            options: { size: 'lg', isFullWidth: false, ...options }
        });
    }, []);

    const closeModal = useCallback(() => {
        setModal(prev => ({ ...prev, isOpen: false }));
        // Optional: clear content after animation finishes if you use CSS transitions
        // setTimeout(() => setModal(prev => ({ ...prev, content: null })), 300); 
    }, []);

    const value = {
        openModal,
        closeModal,
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
            <Modal // This now refers to the imported Modal component
                isOpen={modal.isOpen}
                title={modal.title}
                onClose={closeModal}
                size={modal.options.size}
                isFullWidth={modal.options.isFullWidth}
            >
                {modal.content}
            </Modal>
        </ModalContext.Provider>
    );
};