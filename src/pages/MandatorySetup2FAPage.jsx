import { Alert, App, Button, Card, Form, Input, Typography } from 'antd';
import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as logoutApi, setup2FA, verifySetup2FA } from '../api/services/auth.js';
import useAuthStore, { selectCurrentUser, selectIs2FAEnabled } from '../store/authStore.js';

const { Title, Text, Paragraph } = Typography;

function MandatorySetup2FAPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const currentUser = useAuthStore(selectCurrentUser);
  const currentClient = useAuthStore((s) => s.client);
  const currentExpiresIn = useAuthStore((s) => s.expiresIn);
  const is2FAEnabled = useAuthStore(selectIs2FAEnabled);
  const setLogin = useAuthStore((state) => state.login);
  const clearAuth = useAuthStore((state) => state.logout);
  const [setupData, setSetupData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (is2FAEnabled || currentUser?.role === 'admin') {
      navigate('/', { replace: true });
      return;
    }
    let cancelled = false;
    setup2FA()
      .then((data) => { if (!cancelled) setSetupData(data); })
      .catch(() => { if (!cancelled) message.error('Failed to start 2FA setup. Please refresh and try again.'); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = async ({ token }) => {
    setLoading(true);
    try {
      await verifySetup2FA(setupData.secret, token);
      setLogin({
        user: { ...currentUser, is_2fa_enabled: true },
        client: currentClient,
        expiresIn: currentExpiresIn,
      });
      message.success('Two-factor authentication enabled.');
      navigate('/', { replace: true });
    } catch (error) {
      message.error(error.response?.data?.message || 'Invalid code. Please try again.');
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <div className="login-page">
      <div className="login-background" />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 24 }}>
        <Card style={{ width: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', borderRadius: 12 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <SafetyCertificateOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 12 }} />
            <Title level={4} style={{ margin: 0 }}>Set Up Two-Factor Authentication</Title>
            <Paragraph type="secondary" style={{ marginTop: 8 }}>
              Two-factor authentication is required on your account before you can continue.
            </Paragraph>
          </div>

          {setupData ? (
            <>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>
                Scan this QR code with your authenticator app
              </Text>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <img
                  src={setupData.qrCodeDataUrl}
                  alt="2FA QR Code"
                  style={{ width: 180, height: 180, border: '1px solid #d9d9d9', borderRadius: 4 }}
                />
              </div>
              <Alert
                type="info"
                showIcon
                style={{ marginBottom: 12 }}
                message="Can't scan the QR code?"
                description={
                  <span>
                    Enter this key manually:{' '}
                    <Text code copyable style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {setupData.secret}
                    </Text>
                  </span>
                }
              />
              <Form form={form} layout="vertical" onFinish={handleConfirm} autoComplete="off">
                <Form.Item
                  name="token"
                  label="6-digit code from your authenticator app"
                  rules={[
                    { required: true, message: 'Required' },
                    { len: 6, message: 'Code must be exactly 6 digits' },
                    { pattern: /^\d+$/, message: 'Digits only' },
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
                  <Button type="primary" htmlType="submit" loading={loading} block size="large">
                    Activate & Continue
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Text type="secondary">Preparing setup…</Text>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button type="link" size="small" style={{ fontSize: 12 }} onClick={handleLogout}>
              Log out instead
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default MandatorySetup2FAPage;
