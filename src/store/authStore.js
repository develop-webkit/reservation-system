// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPermissionsForRole } from '../constants/roles';

// Define the structure of the store
const useAuthStore = create(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            role: null,
            permissions: [],

            // Action to handle successful login
            login: (userData) => {
                const permissions = getPermissionsForRole(userData.role);
                set({ 
                    isAuthenticated: true, 
                    user: userData,
                    role: userData.role,
                    permissions,
                });
            },

            // Action to handle logout
            logout: () => {
                localStorage.removeItem('authToken');
                set({ 
                    isAuthenticated: false, 
                    user: null,
                    role: null,
                    permissions: [],
                });
            },
            
            // Check if user has a specific permission
            hasPermission: (permission) => {
                const { permissions } = get();
                return permissions.includes(permission);
            },
            
            // Check if user has a specific role
            hasRole: (role) => {
                const { role: userRole } = get();
                return userRole === role;
            },
            
            // Check if user can access a route
            canAccessRoute: (requiredPermission) => {
                if (!requiredPermission) return true;
                const { permissions } = get();
                return permissions.includes(requiredPermission);
            },
        }),
        {
            name: 'rms-auth-storage',
            getStorage: () => localStorage,
        }
    )
);

export default useAuthStore;
