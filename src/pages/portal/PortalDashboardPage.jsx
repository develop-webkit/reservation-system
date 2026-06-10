import { Alert, Card, Col, Row, Spin, Statistic, Typography } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import useAuthStore from '../../store/authStore.js';
import { usePortalDashboard } from '../../hooks/usePortalDashboard.js';

const { Title, Text } = Typography;

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <Statistic
      title={title}
      value={value ?? 0}
      prefix={icon}
      valueStyle={{ color }}
    />
  </Card>
);

function PortalDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading, error } = usePortalDashboard();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message="Failed to load dashboard stats" showIcon />;
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Welcome, {user?.fullName || user?.username}
        </Title>
        <Text type="secondary">
          Company booking summary for {user?.linkedClientNo}
        </Text>
      </div>

      <Title level={5} style={{ marginBottom: 12 }}>Reservations</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <StatCard
            title="Active Reservations"
            value={stats?.activeReservations}
            icon={<HomeOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={6}>
          <StatCard
            title="Upcoming Check-ins (7 days)"
            value={stats?.upcomingCheckIns}
            icon={<LoginOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={6}>
          <StatCard
            title="Upcoming Check-outs (7 days)"
            value={stats?.upcomingCheckOuts}
            icon={<LogoutOutlined />}
            color="#fa8c16"
          />
        </Col>
        <Col xs={24} sm={6}>
          <StatCard
            title="Available Rooms"
            value={stats?.availableRooms}
            icon={<AppstoreOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      <Title level={5} style={{ marginBottom: 12 }}>Booking Requests</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <StatCard
            title="Pending"
            value={stats?.bookingRequests?.pending}
            icon={<ClockCircleOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title="Approved"
            value={stats?.bookingRequests?.approved}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title="Rejected"
            value={stats?.bookingRequests?.rejected}
            icon={<CloseCircleOutlined />}
            color="#f5222d"
          />
        </Col>
      </Row>
    </div>
  );
}

export default PortalDashboardPage;
