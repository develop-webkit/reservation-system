import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role ?? null);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Redirect portal users away from admin-only root paths
  if (role === 'portal_user' && location.pathname === '/') {
    return <Navigate to="/portal/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
