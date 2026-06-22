import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore, { selectIs2FAEnabled } from '../../store/authStore.js';

const ADMIN_PATHS = [
  '/dashboard',
  '/reservations',
  '/bookings',
  '/charts',
  '/tasks',
  '/housekeeping',
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
  const is2FAEnabled = useAuthStore(selectIs2FAEnabled);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2FA is mandatory for every role except admin — block all other routes until it's set up
  const requires2FASetup = role && role !== 'admin' && !is2FAEnabled;
  if (requires2FASetup && location.pathname !== '/setup-2fa') {
    return <Navigate to="/setup-2fa" replace />;
  }
  if (!requires2FASetup && location.pathname === '/setup-2fa') {
    return <Navigate to="/" replace />;
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
