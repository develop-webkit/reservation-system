import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Spin } from 'antd';
import AppShell from './components/layout/AppShell.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import useAuthStore from './store/authStore.js';

const BookingChartPage = lazy(() => import('./pages/BookingChart.jsx'));
const BookingsPage = lazy(() => import('./pages/BookingsPage.jsx'));
const BookingsByDate = lazy(() => import('./pages/BookingsByDate.jsx'));
const BookingRequestsAdminPage = lazy(() => import('./pages/BookingRequestsAdminPage.jsx'));
const ClientsPage = lazy(() => import('./pages/ClientsPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const HousekeepingPage = lazy(() => import('./pages/HousekeepingPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const TwoFactorVerifyPage = lazy(() => import('./pages/TwoFactorVerifyPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx'));
const MandatorySetup2FAPage = lazy(() => import('./pages/MandatorySetup2FAPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const ReservationsListPage = lazy(() => import('./pages/ReservationsListPage.jsx'));
const ReservationsPage = lazy(() => import('./pages/ReservationsPage.jsx'));
const TasksPage = lazy(() => import('./pages/TasksPage.jsx'));
const RoomsPage = lazy(() => import('./pages/RoomsPage.jsx'));
const UsersPage = lazy(() => import('./pages/UsersPage.jsx'));
const VouchersPage = lazy(() => import('./pages/VouchersPage.jsx'));
const GroupsManagementPage = lazy(() => import('./pages/GroupsManagementPage.jsx'));
const PortalDashboardPage = lazy(() => import('./pages/portal/PortalDashboardPage.jsx'));
const PortalGroupsPage = lazy(() => import('./pages/portal/PortalGroupsPage.jsx'));
const PortalReservationsPage = lazy(() => import('./pages/portal/PortalReservationsPage.jsx'));
const PortalStaffPage = lazy(() => import('./pages/portal/PortalStaffPage.jsx'));
const PortalBookingRequestPage = lazy(() => import('./pages/portal/PortalBookingRequestPage.jsx'));
const PortalUsersPage = lazy(() => import('./pages/portal/PortalUsersPage.jsx'));
const PortalClientsPage = lazy(() => import('./pages/portal/PortalClientsPage.jsx'));
const InvoiceGeneratorPage = lazy(() => import('./pages/InvoiceGeneratorPage.jsx'));
const InvoiceHistoryPage = lazy(() => import('./pages/InvoiceHistoryPage.jsx'));
const MyAccountPage = lazy(() => import('./pages/MyAccountPage.jsx'));
const TwoFactorRequestsAdminPage = lazy(() => import('./pages/TwoFactorRequestsAdminPage.jsx'));

const PageLoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" />
  </div>
);

function App() {
  const role = useAuthStore((state) => state.user?.role ?? null);
  const defaultRedirect = role === 'portal_user' ? '/portal/dashboard' : '/dashboard';

  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/2fa-verify" element={<TwoFactorVerifyPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/setup-2fa" element={<MandatorySetup2FAPage />} />
          <Route element={<AppShell />}>
            <Route index element={<Navigate to={defaultRedirect} replace />} />
            {/* Admin / Manager routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/reservations/list" element={<ReservationsListPage />} />
            <Route path="/reservations/by-date" element={<BookingsByDate />} />
            <Route path="/bookings" element={<BookingChartPage />} />
            <Route path="/bookings/list" element={<BookingsPage />} />
            <Route path="/bookings/chart" element={<BookingChartPage />} />
            <Route path="/charts/bookingchart" element={<BookingChartPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/housekeeping" element={<HousekeepingPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/vouchers" element={<VouchersPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/booking-requests" element={<BookingRequestsAdminPage />} />
            <Route path="/groups" element={<GroupsManagementPage />} />
            <Route path="/invoice-generator" element={<InvoiceGeneratorPage />} />
            <Route path="/invoice-history" element={<InvoiceHistoryPage />} />
            <Route path="/account" element={<MyAccountPage />} />
            <Route path="/2fa-requests" element={<TwoFactorRequestsAdminPage />} />
            {/* Portal user (corporate client) routes */}
            <Route path="/portal/dashboard" element={<PortalDashboardPage />} />
            <Route path="/portal/reservations" element={<PortalReservationsPage />} />
            <Route path="/portal/reservations/edit" element={<ReservationsListPage />} />
            <Route path="/portal/groups" element={<PortalGroupsPage />} />
            <Route path="/portal/booking-requests" element={<PortalBookingRequestPage />} />
            <Route path="/portal/staff" element={<PortalStaffPage />} />
            <Route path="/portal/users" element={<PortalUsersPage />} />
            <Route path="/portal/clients" element={<PortalClientsPage />} />
            <Route path="/portal/bookings" element={<BookingChartPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
