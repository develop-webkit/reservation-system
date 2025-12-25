import React from 'react';
import useAuthStore from '../store/authStore';

/**
 * PermissionGate component to show/hide UI elements based on permissions
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to conditionally render
 * @param {string} props.permission - Required permission
 * @param {React.ReactNode} props.fallback - Optional component to show if permission denied
 */
const PermissionGate = ({ children, permission, fallback = null }) => {
    const { hasPermission } = useAuthStore();

    if (!permission || hasPermission(permission)) {
        return children;
    }

    return fallback;
};

export default PermissionGate;
