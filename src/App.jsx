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
import CleanScreen from './pages/CleanScreen';
import HousekeepingRoster from './pages/HousekeepingRoster';

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
                  <Route path="/housekeeping/clean-screen" element={<CleanScreen />} />
                  <Route path="/housekeeping/roster" element={<HousekeepingRoster />} />
                  <Route path="/charts/bookingchart" element={<BookingChart />} />
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