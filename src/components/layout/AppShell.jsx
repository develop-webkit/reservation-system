import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader.jsx';
import AppSidebar from './AppSidebar.jsx';
import useAuthStore from '../../store/authStore.js';
import { useDisableDevTools } from '../../hooks/useDisableDevTools.js';

function AppShell() {
  const role = useAuthStore((state) => state.user?.role ?? null);
  useDisableDevTools(role === 'portal_user');

  return (
    <Layout className="app-shell">
      <AppSidebar />
      <Layout>
        <AppHeader />
        <Layout.Content className="app-content">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default AppShell;
