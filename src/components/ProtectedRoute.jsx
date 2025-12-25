import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Alert, Card } from 'antd';

/**
 * ProtectedRoute component to restrict access based on permissions
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.permission - Required permission to access route
 * @param {string} props.redirectTo - Path to redirect if unauthorized (default: /unauthorized)
 */
const ProtectedRoute = ({ children, permission, redirectTo = '/unauthorized' }) => {
    const { isAuthenticated, canAccessRoute } = useAuthStore();

    // Check authentication
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check permission if specified
    if (permission && !canAccessRoute(permission)) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default ProtectedRoute;
