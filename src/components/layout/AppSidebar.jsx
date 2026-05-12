import { Layout, Menu } from 'antd';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigationItems } from '../../constants/navigation.js';
import AppLogo from '../common/AppLogo.jsx';

function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(
    () =>
      navigationItems.map((item) => ({
        key: item.key,
        icon: <item.icon />,
        label: item.label,
      })),
    [],
  );

  return (
    <Layout.Sider breakpoint="lg" collapsedWidth="0" width={260} theme="light">
      <div className="sidebar-inner">
        <AppLogo />
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </div>
    </Layout.Sider>
  );
}

export default AppSidebar;
