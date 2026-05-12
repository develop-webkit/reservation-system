import { Typography } from 'antd';

function AppLogo() {
  return (
    <div className="app-logo">
      <div className="app-logo-mark">R</div>
      <div>
        <Typography.Title level={4} className="app-logo-title">
          RMS Frontdesk
        </Typography.Title>
        <Typography.Text type="secondary">
          Bookings and guest operations
        </Typography.Text>
      </div>
    </div>
  );
}

export default AppLogo;
