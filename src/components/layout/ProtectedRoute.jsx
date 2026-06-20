import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';

const ADMIN_PATHS = [
  '/dashboard',
  '/reservations',
  '/bookings',
  '/charts',
  '/tasks',
  '/housekeeping',
  '/accounting',
  '/clients',
  '/rooms',
  '/vouchers',
  '/users',
  '/groups',
  '/booking-requests',
  '/invoice-generator',
  '/account',
];

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role ?? null);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Portal users may only access portal routes
  if (role === 'portal_user') {
    const isAdminPath = ADMIN_PATHS.some((p) => location.pathname.startsWith(p));
    if (isAdminPath || location.pathname === '/') {
      return <Navigate to="/portal/dashboard" replace />;
    }
  }

  // Non-portal users are redirected away from portal routes
  if (role && role !== 'portal_user' && location.pathname.startsWith('/portal')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
