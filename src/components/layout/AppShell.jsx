import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader.jsx';
import AppSidebar from './AppSidebar.jsx';

function AppShell() {
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
