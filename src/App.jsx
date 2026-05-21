import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import AccountingPage from './pages/AccountingPage.jsx';
import BookingChartPage from './pages/BookingChart.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import BookingsByDate from './pages/BookingsByDate.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HousekeepingPage from './pages/HousekeepingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ReservationEditPage from './pages/ReservationEditPage.jsx';
import ReservationsListPage from './pages/ReservationsListPage.jsx';
import ReservationsPage from './pages/ReservationsPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import VouchersPage from './pages/VouchersPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
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
          <Route path="/vouchers" element={<VouchersPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
