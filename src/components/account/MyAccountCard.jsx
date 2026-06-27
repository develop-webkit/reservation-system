import { Alert, Button, Card, Descriptions, Form, Input, Modal, Tag, Typography, message } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import useAuthStore, { selectCurrentUser, selectCurrentClient, selectIs2FAEnabled } from '../../store/authStore.js';
import { useUpdateUser } from '../../hooks/useUsers.js';
import TwoFactorSetupSection from '../auth/TwoFactorSetupSection.jsx';
import { ROLE_COLORS, getRoleLabel } from '../../constants/roleLabels.js';

const { Title, Text } = Typography;

function MyAccountCard({
  title = 'My Account',
  subtitle = 'View your account details and security settings.',
  extraItems = [],
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const currentUser = useAuthStore(selectCurrentUser);
  const currentClient = useAuthStore(selectCurrentClient);
  const currentExpiresIn = useAuthStore((s) => s.expiresIn);
  const is2FAEnabled = useAuthStore(selectIs2FAEnabled);
  const setLogin = useAuthStore((state) => state.login);
  const updateUser = useUpdateUser();

  const openEdit = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleSubmit = ({ password }) => {
    if (!password) {
      message.error('Please enter a new password.');
      return;
    }
    const userId = currentUser?._id || currentUser?.id;
    updateUser.mutate(
      { id: userId, userData: { password } },
      {
        onSuccess: () => { message.success('Password updated successfully.'); setModalOpen(false); },
        onError: (err) => message.error(err.response?.data?.message || 'Failed to update password'),
      },
    );
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>{title}</Title>
          <Text type="secondary">{subtitle}</Text>
        </div>
        <Button icon={<EditOutlined />} onClick={openEdit}>
          Change Password
        </Button>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: '#1890ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <UserOutlined style={{ fontSize: 28, color: '#fff' }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 18, display: 'block' }}>{currentUser?.fullName || currentUser?.username}</Text>
            <Tag color={ROLE_COLORS[currentUser?.role] || 'default'}>
              {getRoleLabel(currentUser?.role).toUpperCase()}
            </Tag>
          </div>
        </div>

        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Full Name">{currentUser?.fullName || '—'}</Descriptions.Item>
          <Descriptions.Item label="Username">{currentUser?.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{currentUser?.email || '—'}</Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={ROLE_COLORS[currentUser?.role] || 'default'}>
              {getRoleLabel(currentUser?.role).toUpperCase()}
            </Tag>
          </Descriptions.Item>
          {extraItems.map((item) => (
            <Descriptions.Item key={item.label} label={item.label}>{item.value || '—'}</Descriptions.Item>
          ))}
        </Descriptions>

        <Alert
          type="info"
          showIcon
          style={{ marginTop: 16 }}
          message="Read-only account details"
          description="Contact your administrator to update your name, username, email, or role."
        />

        <TwoFactorSetupSection
          is2FAEnabled={is2FAEnabled}
          canDisable={currentUser?.role === 'admin'}
          onStatusChange={(enabled) => {
            setLogin({
              user: { ...currentUser, is_2fa_enabled: enabled },
              client: currentClient,
              expiresIn: currentExpiresIn,
            });
          }}
        />
      </Card>

      <Modal
        title="Change Password"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Update Password"
        confirmLoading={updateUser.isPending}
        width={400}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 8 }}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default MyAccountCard;
