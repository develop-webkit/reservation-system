// src/App.jsx (UPDATED)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AntdSidebar from './components/AntdSidebar';
import AntdTopBar from './components/AntdTopBar';
import useAuthStore from './store/authStore';

// Import all pages      
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';  
import Reservations from './pages/Reservations';
import BookingChart from './pages/BookingChart';
import ReservationsListPage from './pages/ReservationsListPage';
import ReservationEditPage from './pages/ReservationEditPage';
import CleanScreen from './pages/CleanScreen';
import HousekeepingRoster from './pages/HousekeepingRoster';
import BookingsByDate from './pages/BookingsByDate';
import UserList from './pages/Users/UserList';
import UserForm from './pages/Users/UserForm';
import ClientList from './pages/Clients/ClientList';
import ClientForm from './pages/Clients/ClientForm';
import UserManagementTabs from './pages/Users/UserManagementTabs';
import FinancialReports from './pages/FinancialReports';
import GuestDebtorsReport from './pages/GuestDebtorsReport';

const { Header, Sider, Content } = Layout;

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetch on window focus
      retry: 1, // Retry failed requests once
      staleTime: 1000 * 60 * 5, // 5 minutes default stale time
    },
  },
});

function App() {
  // --- NEW: Use Zustand for persistent auth state and actions ---
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  // -----------------------------------------------------------

  // MainLayout Component defined outside
  const MainLayout = ({ children }) => {
    const logout = useAuthStore(state => state.logout);
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={250} theme="dark">
          <AntdSidebar />
        </Sider>

        <Layout>
          <Header style={{ padding: 0, background: '#fff', height: 50, lineHeight: '50px' }}>
            <AntdTopBar onLogout={logout} />
          </Header>

          <Content style={{ margin: '16px', overflow: 'initial', background: '#f0f2f5' }}>
            <div style={{ padding: 10, minHeight: 'calc(100vh - 82px)', background: '#fff' }}>
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Login component no longer needs the onLogin prop */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/reservations" element={<Reservations />} />
                  <Route path="/reservations/list" element={<ReservationsListPage />} />
                  <Route path="/reservations/edit" element={<ReservationEditPage />} />
                  <Route path="/reservations/by-date" element={<BookingsByDate />} />
                  <Route path="/housekeeping/clean-screen" element={<CleanScreen />} />
                  <Route path="/housekeeping/roster" element={<HousekeepingRoster />} />
                  <Route path="/charts/bookingchart" element={<BookingChart />} />
                  <Route path="/users/customers" element={<UserList role="customer" />} />
                  <Route path="/users/customers/new" element={<UserForm role="customer" />} />
                  <Route path="/users/customers/:id" element={<UserForm role="customer" />} />
                  <Route path="/users/employees" element={<UserList role="employee" />} />
                  <Route path="/users/employees/new" element={<UserForm role="employee" />} />
                  <Route path="/users/employees/:id" element={<UserForm role="employee" />} />
                  <Route path="/users/management" element={<UserManagementTabs />} />
                  <Route path="/reports/financial" element={<FinancialReports />} />
                  <Route path="/reports/debtors" element={<GuestDebtorsReport />} />
                  <Route path="/clients" element={<ClientList />} />
                  <Route path="/clients/new" element={<ClientForm />} />
                  <Route path="/clients/:id" element={<ClientForm />} />
                  <Route path="*" element={<h1 style={{ textAlign: 'center', marginTop: '50px' }}>404 - Page Not Found</h1>} />
                </Routes>
              </MainLayout>
            ) : (
              // Redirect unauthenticated users to login page
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {/* React Query Devtools - only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;