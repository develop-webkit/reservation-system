import { Alert, Button, Divider, Form, Input, Space, Spin, Switch, Typography, message } from 'antd';
import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { disable2FA, setup2FA, verifySetup2FA } from '../../api/services/auth.js';
import { useCreateTwoFactorRequest, useTwoFactorRequests } from '../../hooks/useTwoFactorRequests.js';

const { Text, Paragraph } = Typography;

function TwoFactorSetupSection({ is2FAEnabled, onStatusChange, canDisable = true }) {
  const [setting, setSetting] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [disableForm] = Form.useForm();
  const [setupForm] = Form.useForm();

  // Only fetch when this account actually needs the request-to-admin escape hatch
  // (2FA on, but this role can't self-disable it).
  const needsResetRequest = is2FAEnabled && !canDisable;
  const { data: myRequestsRaw } = useTwoFactorRequests({ enabled: needsResetRequest });
  const myRequests = Array.isArray(myRequestsRaw) ? myRequestsRaw : (myRequestsRaw?.data || []);
  const pendingRequest = myRequests.find((r) => r.status === 'Pending');
  const createResetRequest = useCreateTwoFactorRequest();

  const handleRequestReset = () => {
    createResetRequest.mutate(undefined, {
      onSuccess: () => message.success('Reset request submitted. An admin will review it shortly.'),
      onError: (err) => message.error(err.response?.data?.message || 'Failed to submit request.'),
    });
  };

  const handleToggle = async (enabled) => {
    if (enabled) {
      setSetting(true);
      try {
        const data = await setup2FA();
        setSetupData(data);
      } catch {
        message.error('Failed to start 2FA setup. Please try again.');
      } finally {
        setSetting(false);
      }
    } else {
      setSetupData(null);
    }
  };

  const handleConfirmSetup = async ({ token }) => {
    setSetting(true);
    try {
      await verifySetup2FA(setupData.secret, token);
      message.success('Two-factor authentication enabled successfully.');
      setSetupData(null);
      setupForm.resetFields();
      onStatusChange(true);
    } catch (err) {
      message.error(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setSetting(false);
    }
  };

  const handleDisable = async ({ token }) => {
    setSetting(true);
    try {
      await disable2FA(token);
      message.success('Two-factor authentication disabled.');
      disableForm.resetFields();
      onStatusChange(false);
    } catch (err) {
      message.error(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setSetting(false);
    }
  };

  return (
    <div>
      <Divider />
      <div style={{ marginBottom: 16 }}>
        <Space align="center" style={{ marginBottom: 4 }}>
          <SafetyCertificateOutlined style={{ color: '#1890ff', fontSize: 16 }} />
          <Text strong style={{ fontSize: 14 }}>Two-Factor Authentication (2FA)</Text>
          <Switch
            checked={is2FAEnabled}
            onChange={handleToggle}
            loading={setting && !setupData}
            disabled={is2FAEnabled && !canDisable}
            checkedChildren="On"
            unCheckedChildren="Off"
          />
        </Space>
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {is2FAEnabled
              ? canDisable
                ? 'Your account is protected with 2FA. You will need your authenticator app to log in.'
                : 'Two-factor authentication is required on your account. Submit a request below if you need it reset.'
              : 'Add an extra layer of security. Works with Google Authenticator, Microsoft Authenticator, or Authy.'}
          </Text>
        </div>
        {needsResetRequest && (
          pendingRequest ? (
            <Text type="warning" style={{ fontSize: 12, display: 'block', marginTop: 6 }}>
              Reset request submitted — waiting on admin review.
            </Text>
          ) : (
            <Button
              size="small"
              style={{ marginTop: 8 }}
              loading={createResetRequest.isPending}
              onClick={handleRequestReset}
            >
              Request Reset from Admin
            </Button>
          )
        )}
      </div>

      {setupData && !is2FAEnabled && (
        <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, padding: 16, marginTop: 12 }}>
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

          <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 12 }}>
            After scanning, enter the 6-digit code from your app below to confirm setup.
          </Paragraph>

          <Form form={setupForm} layout="inline" onFinish={handleConfirmSetup}>
            <Form.Item
              name="token"
              rules={[
                { required: true, message: 'Required' },
                { len: 6, message: '6 digits' },
                { pattern: /^\d+$/, message: 'Digits only' },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                placeholder="6-digit code"
                maxLength={6}
                style={{ width: 160, letterSpacing: 4, textAlign: 'center' }}
                autoFocus
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={setting}>
                Activate 2FA
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={() => { setSetupData(null); setupForm.resetFields(); }}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}

      {is2FAEnabled && canDisable && (
        <div style={{ background: '#fff7e6', border: '1px solid #ffd591', borderRadius: 8, padding: 16, marginTop: 12 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Disable Two-Factor Authentication</Text>
          <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 12 }}>
            Enter your current authenticator code to confirm you still have access before disabling.
          </Paragraph>
          <Form form={disableForm} layout="inline" onFinish={handleDisable}>
            <Form.Item
              name="token"
              rules={[
                { required: true, message: 'Required' },
                { len: 6, message: '6 digits' },
                { pattern: /^\d+$/, message: 'Digits only' },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                placeholder="6-digit code"
                maxLength={6}
                style={{ width: 160, letterSpacing: 4, textAlign: 'center' }}
              />
            </Form.Item>
            <Form.Item>
              <Button danger htmlType="submit" loading={setting}>
                Disable 2FA
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}

export default TwoFactorSetupSection;
