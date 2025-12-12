// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // <-- New Import

// Define the structure of the store
const useAuthStore = create(
    // 1. Wrap the state definition with the persist middleware
    persist(
        // 2. Define the initial state and actions
        (set) => ({
            isAuthenticated: false,
            user: null, // We can store user details here later

            // Action to handle successful login
            login: (userData = { username: 'HGManager' }) => set({ 
                isAuthenticated: true, 
                user: userData 
            }),

            // Action to handle logout
            logout: () => set({ 
                isAuthenticated: false, 
                user: null 
            }),
        }),
        // 3. Define the persist configuration
        {
            name: 'rms-auth-storage', // Key used in localStorage
            getStorage: () => localStorage, // Specify localStorage as the storage medium
        }
    )
);

export default useAuthStore;