import { App, Button, Card, Form, Input, Typography } from 'antd';
import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/services/auth.js';
import { getErrorMessage } from '../api/utils.js';

const { Title, Paragraph } = Typography;

const PASSWORD_RULES = [
  { required: true, message: 'Please enter a new password' },
  { min: 8, message: 'Password must be at least 8 characters' },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
    message: 'Password must contain an uppercase letter, a lowercase letter, a number, and a special character',
  },
];

function ResetPasswordPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const token = searchParams.get('token');

  if (!token) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleSubmit = async ({ newPassword }) => {
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      message.success('Password reset successfully. Please log in.');
      navigate('/login', { replace: true });
    } catch (error) {
      message.error(getErrorMessage(error, 'Invalid or expired reset link. Please request a new one.'));
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
            <Title level={4} style={{ margin: 0 }}>Reset Password</Title>
            <Paragraph type="secondary" style={{ marginTop: 8 }}>
              Choose a new password for your account.
            </Paragraph>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
            <Form.Item label="New Password" name="newPassword" rules={PASSWORD_RULES}>
              <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" size="large" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" size="large" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
