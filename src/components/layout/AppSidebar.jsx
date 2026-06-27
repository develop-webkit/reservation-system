import { Layout, Menu } from 'antd';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigationItems } from '../../constants/navigation.js';
import useAuthStore from '../../store/authStore.js';
import AppLogo from '../common/AppLogo.jsx';

const CLIENTS_SUBMENU_KEY = 'clients-group';
const CLIENTS_PATHS = ['/clients', '/groups'];

function buildMenuItems(items, role) {
  return items
    .filter((item) => item.roles === null || (role && item.roles.includes(role)))
    .map((item) => {
      const mapped = { key: item.key, icon: <item.icon />, label: item.label };
      if (item.children) {
        mapped.children = buildMenuItems(item.children, role);
        if (mapped.children.length === 0) return null;
      }
      return mapped;
    })
    .filter(Boolean);
}

function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useAuthStore((state) => state.user?.role ?? null);

  const isInClientsGroup = CLIENTS_PATHS.some((p) => location.pathname.startsWith(p));

  const [openKeys, setOpenKeys] = useState(() =>
    isInClientsGroup ? [CLIENTS_SUBMENU_KEY] : [],
  );

  // Auto-open the Clients submenu on transitioning into a /clients or /groups route,
  // without fighting a manual collapse on later re-renders while already inside it.
  // Adjusted during render rather than in an effect to avoid an extra cascading render.
  const [prevIsInClientsGroup, setPrevIsInClientsGroup] = useState(isInClientsGroup);
  if (isInClientsGroup !== prevIsInClientsGroup) {
    setPrevIsInClientsGroup(isInClientsGroup);
    if (isInClientsGroup) {
      setOpenKeys((prev) =>
        prev.includes(CLIENTS_SUBMENU_KEY) ? prev : [...prev, CLIENTS_SUBMENU_KEY],
      );
    }
  }

  const menuItems = useMemo(() => buildMenuItems(navigationItems, role), [role]);

  return (
    <Layout.Sider breakpoint="lg" collapsedWidth="0" width={260} theme="light">
      <div className="sidebar-inner">
        <AppLogo />
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </div>
    </Layout.Sider>
  );
}

export default AppSidebar;
