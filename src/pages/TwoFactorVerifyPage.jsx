import { App, Button, Card, Form, Input, Typography } from 'antd';
import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verify2FALogin } from '../api/services/auth.js';
import useAuthStore from '../store/authStore.js';
import { getErrorMessage } from '../api/utils.js';

const { Title, Text, Paragraph } = Typography;

function TwoFactorVerifyPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const loginStore = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const pendingToken = location.state?.pendingToken;
  const from = location.state?.from;

  if (!pendingToken) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleSubmit = async ({ token }) => {
    setLoading(true);
    try {
      const response = await verify2FALogin(pendingToken, token);
      loginStore(response);
      message.success('Welcome back.');
      const redirect = from?.pathname || '/dashboard';
      navigate(redirect, { replace: true });
    } catch (error) {
      message.error(getErrorMessage(error, 'Invalid or expired code. Please try again.'));
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background" />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 24 }}>
        <Card style={{ width: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', borderRadius: 12 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <SafetyCertificateOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 12 }} />
            <Title level={4} style={{ margin: 0 }}>Two-Factor Authentication</Title>
            <Paragraph type="secondary" style={{ marginTop: 8 }}>
              Enter the 6-digit code from your authenticator app to continue.
            </Paragraph>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
            <Form.Item
              name="token"
              rules={[
                { required: true, message: 'Please enter your 6-digit code' },
                { len: 6, message: 'Code must be exactly 6 digits' },
                { pattern: /^\d+$/, message: 'Code must contain only digits' },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                placeholder="000000"
                maxLength={6}
                size="large"
                style={{ textAlign: 'center', fontSize: 20, letterSpacing: 8 }}
                autoFocus
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Verify & Sign In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Code not working?{' '}
            </Text>
            <Button
              type="link"
              size="small"
              style={{ padding: 0, fontSize: 12 }}
              onClick={() => navigate('/login')}
            >
              Go back to login
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default TwoFactorVerifyPage;
