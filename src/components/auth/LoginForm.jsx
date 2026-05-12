import { Alert, Button, Card, Checkbox, Form, Input, Space, Typography } from 'antd';
import {
  LockOutlined,
  NumberOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';

function LoginForm({ onSubmit, loading, onForgotPassword, isLocked }) {
  return (
    <Card className="login-card">
      <div className="login-card-header">
        <Typography.Text className="eyebrow">RMS desktop reference</Typography.Text>
        <Typography.Title level={2}>Login to property operations</Typography.Title>
        <Typography.Paragraph>
          Use your client number, username, and password to enter the tenant workspace.
        </Typography.Paragraph>
      </div>

      {isLocked ? (
        <Alert
          type="warning"
          showIcon
          message="Too many failed login attempts. Please wait before trying again."
        />
      ) : null}

      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="RMS Client No"
          name="clientNumber"
          rules={[{ required: true, message: 'Client number is required.' }]}
        >
          <Input prefix={<NumberOutlined />} size="large" placeholder="CL-1001" />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Username is required.' }]}
        >
          <Input prefix={<UserOutlined />} size="large" placeholder="frontdesk" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Password is required.' }]}
        >
          <Input.Password prefix={<LockOutlined />} size="large" placeholder="Password" />
        </Form.Item>
        <div className="login-actions-row">
          <Form.Item name="keepLogged" valuePropName="checked" noStyle>
            <Checkbox>Keep Me Logged In</Checkbox>
          </Form.Item>
          <Button type="link" onClick={onForgotPassword}>
            Forgot your password?
          </Button>
        </div>
        <Button
          icon={<SafetyCertificateOutlined />}
          type="primary"
          size="large"
          htmlType="submit"
          loading={loading}
          block
        >
          Login
        </Button>
      </Form>

      <Space direction="vertical" className="login-footer-note">
        <Typography.Text strong>Reference-aligned details</Typography.Text>
        <Typography.Text type="secondary">
          This login flow follows the RMS desktop pattern while using your backend auth API.
        </Typography.Text>
      </Space>
    </Card>
  );
}

export default LoginForm;
