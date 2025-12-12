// src/App.jsx 
import React from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd'; 
import AntdSidebar from './components/AntdSidebar';
import AntdTopBar from './components/AntdTopBar';
import useAuthStore from './store/authStore'; 

// Import all pages
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations'; 
import BookingChart from './pages/BookingChart';

const { Header, Sider, Content } = Layout; 

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const handleLogout = useAuthStore(state => state.logout);

  const MainLayout = ({ children }) => (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark">
        <AntdSidebar /> 
      </Sider>
      
      <Layout>
        <Header style={{ padding: 0, background: '#fff', height: 50, lineHeight: '50px' }}>
          <AntdTopBar onLogout={handleLogout} /> 
        </Header>
        
        {/* FIX APPLIED HERE: Margin is set to '0' */}
        <Content style={{ margin: '0', overflow: 'initial', background: '#f0f2f5' }}>
          {/* We may need to adjust padding in the inner div if desired, but 
              setting margin: 0 removes the gap around the content area. */}
          <div style={{ padding: 10, minHeight: 'calc(100vh - 50px)', background: '#fff' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} /> 
      
      <Route 
        path="*" 
        element={
          isAuthenticated ? (
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} /> 
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/charts/bookingchart" element={<BookingChart />} /> 
                <Route path="*" element={<h1 style={{ textAlign: 'center', marginTop: '50px' }}>404 - Page Not Found</h1>} />
              </Routes>
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;