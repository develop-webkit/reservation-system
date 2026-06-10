import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import AccountingPage from './pages/AccountingPage.jsx';
import BookingChartPage from './pages/BookingChart.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import BookingsByDate from './pages/BookingsByDate.jsx';
import BookingRequestsAdminPage from './pages/BookingRequestsAdminPage.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HousekeepingPage from './pages/HousekeepingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ReservationEditPage from './pages/ReservationEditPage.jsx';
import ReservationsListPage from './pages/ReservationsListPage.jsx';
import ReservationsPage from './pages/ReservationsPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import RoomsPage from './pages/RoomsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import VouchersPage from './pages/VouchersPage.jsx';
import GroupsManagementPage from './pages/GroupsManagementPage.jsx';
import PortalDashboardPage from './pages/portal/PortalDashboardPage.jsx';
import PortalGroupsPage from './pages/portal/PortalGroupsPage.jsx';
import PortalReservationsPage from './pages/portal/PortalReservationsPage.jsx';
import PortalStaffPage from './pages/portal/PortalStaffPage.jsx';
import PortalBookingRequestPage from './pages/portal/PortalBookingRequestPage.jsx';
import PortalRoomAvailabilityPage from './pages/portal/PortalRoomAvailabilityPage.jsx';
import InvoiceGeneratorPage from './pages/InvoiceGeneratorPage.jsx';
import useAuthStore from './store/authStore.js';

function App() {
  const role = useAuthStore((state) => state.user?.role ?? null);
  const defaultRedirect = role === 'portal_user' ? '/portal/dashboard' : '/dashboard';

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to={defaultRedirect} replace />} />
          {/* Admin / Manager routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/reservations/list" element={<ReservationsListPage />} />
          <Route path="/reservations/edit" element={<ReservationEditPage />} />
          <Route path="/reservations/by-date" element={<BookingsByDate />} />
          <Route path="/bookings" element={<BookingChartPage />} />
          <Route path="/bookings/list" element={<BookingsPage />} />
          <Route path="/bookings/chart" element={<BookingChartPage />} />
          <Route path="/charts/bookingchart" element={<BookingChartPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/housekeeping" element={<HousekeepingPage />} />
          <Route path="/accounting" element={<AccountingPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/vouchers" element={<VouchersPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/booking-requests" element={<BookingRequestsAdminPage />} />
          <Route path="/groups" element={<GroupsManagementPage />} />
          <Route path="/invoice-generator" element={<InvoiceGeneratorPage />} />
          {/* Portal user (corporate client) routes */}
          <Route path="/portal/dashboard" element={<PortalDashboardPage />} />
          <Route path="/portal/reservations" element={<PortalReservationsPage />} />
          <Route path="/portal/groups" element={<PortalGroupsPage />} />
          <Route path="/portal/booking-requests" element={<PortalBookingRequestPage />} />
          <Route path="/portal/staff" element={<PortalStaffPage />} />
          <Route path="/portal/rooms" element={<PortalRoomAvailabilityPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
