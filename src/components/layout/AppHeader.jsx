import { Avatar, Button, Layout, Space, Tag, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout as logoutApi } from '../../api/services/auth.js';
import useAuthStore, {
  selectCurrentClient,
  selectCurrentUser,
} from '../../store/authStore.js';

function AppHeader() {
  const navigate = useNavigate();
  const user = useAuthStore(selectCurrentUser);
  const client = useAuthStore(selectCurrentClient);
  const clearAuth = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <Layout.Header className="app-header">
      <div>
        <Typography.Title level={4} className="header-title">
          MMV Operations Console
        </Typography.Title>
        <Typography.Text type="secondary">
          Tenant-aware reservation, booking, and housekeeping workflows
        </Typography.Text>
      </div>
      <Space size="middle">
        <Tag color="cyan">{client?.clientNo || 'No Client'}</Tag>
        <Space>
          <Avatar>{(user?.username || 'U').slice(0, 1).toUpperCase()}</Avatar>
          <div className="header-user">
            <Typography.Text strong>{user?.fullName || user?.username}</Typography.Text>
            <Typography.Text type="secondary">{user?.role || 'guest'}</Typography.Text>
          </div>
        </Space>
        <Button icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </Space>
    </Layout.Header>
  );
}

export default AppHeader;
