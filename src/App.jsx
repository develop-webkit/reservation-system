// src/App.jsx (UPDATED)
import React from 'react'; // Removed useState
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import AntdSidebar from './components/AntdSidebar';
import AntdTopBar from './components/AntdTopBar';
import useAuthStore from './store/authStore'; // <-- NEW IMPORT: Zustand Store

// Import all pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import BookingChart from './pages/BookingChart';
import ReservationsListPage from './pages/ReservationsListPage';

const { Header, Sider, Content } = Layout;

function App() {
  // --- NEW: Use Zustand for persistent auth state and actions ---
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const logout = useAuthStore(state => state.logout);
  // We no longer need the local `isAuthenticated` state or `handleLogin`/`handleLogout` functions here.
  // We rename the logout function for clarity in the TopBar prop.
  const handleLogout = logout;
  // -----------------------------------------------------------

  const MainLayout = ({ children }) => (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark">
        <AntdSidebar />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: '#fff', height: 50, lineHeight: '50px' }}>
          {/* Pass the Zustand logout action */}
          <AntdTopBar onLogout={handleLogout} />
        </Header>

        <Content style={{ margin: '16px', overflow: 'initial', background: '#f0f2f5' }}>
          <div style={{ padding: 10, minHeight: 'calc(100vh - 82px)', background: '#fff' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );

  return (
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
  );
}

export default App;