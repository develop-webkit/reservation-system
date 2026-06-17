import React, { useState, useMemo } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, Tag, Space,
  Typography, Card, message, Tooltip, Alert,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, LinkOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { Navigate } from 'react-router-dom';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import { useClients } from '../hooks/useClients';
import useAuthStore, { selectCurrentUser, selectIs2FAEnabled } from '../store/authStore';
import TwoFactorSetupSection from '../components/auth/TwoFactorSetupSection.jsx';

const { Title, Text } = Typography;

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'housekeeper', label: 'Housekeeper' },
  { value: 'manager', label: 'Manager' },
];

const ROLE_COLORS = {
  admin: 'red',
  manager: 'orange',
  portal_user: 'blue',
  user: 'green',
  housekeeper: 'cyan',
};

const DEFAULT_FORM = {
  fullName: '',
  email: '',
  username: '',
  password: '',
  role: 'user',
  linkedClientNo: null,
};

const UsersPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const currentUser = useAuthStore(selectCurrentUser);
  const currentClient = useAuthStore((s) => s.client);
  const currentExpiresIn = useAuthStore((s) => s.expiresIn);
  const is2FAEnabled = useAuthStore(selectIs2FAEnabled);
  const setLogin = useAuthStore((state) => state.login);
  const isAdmin = currentUser?.role === 'admin';
  const [editingUserId, setEditingUserId] = useState(null);

  const { data: usersRaw, isLoading } = useUsers();
  const { data: clientsRaw } = useClients();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const users = useMemo(() => {
    if (!usersRaw) return [];
    return Array.isArray(usersRaw) ? usersRaw : (usersRaw.data || []);
  }, [usersRaw]);

  const clients = useMemo(() => {
    if (!clientsRaw) return [];
    return Array.isArray(clientsRaw) ? clientsRaw : (clientsRaw.data || []);
  }, [clientsRaw]);

  const openCreate = () => {
    setEditingUser(null);
    form.setFieldsValue({
      ...DEFAULT_FORM,
      // Non-admins are always scoped to their own client — pre-fill and lock it.
      linkedClientNo: isAdmin ? null : (currentUser?.clientNumber || null),
    });
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setEditingUserId(user._id || user.id);
    form.setFieldsValue({
      fullName: user.fullName || '',
      email: user.email || '',
      username: user.username || '',
      password: '',
      role: user.role || 'user',
      linkedClientNo: user.linkedClientNo || null,
    });
    setModalOpen(true);
  };

  const handleSubmit = (values) => {
    // Admin picks the client freely. Non-admin is always locked to their own client number.
    const resolvedClientNo = isAdmin ? values.linkedClientNo : (currentUser?.clientNumber || values.linkedClientNo);
    const payload = { ...values, linkedClientNo: resolvedClientNo, clientNumber: resolvedClientNo };
    if (!payload.password) delete payload.password;

    if (editingUser) {
      updateUser.mutate(
        { id: editingUser._id || editingUser.id, userData: payload },
        {
          onSuccess: () => { message.success('User updated'); setModalOpen(false); },
          onError: (err) => message.error(err.response?.data?.message || 'Failed to update user'),
        },
      );
    } else {
      createUser.mutate(payload, {
        onSuccess: () => {
          setModalOpen(false);
          Modal.info({
            title: 'User Created Successfully',
            icon: <LoginOutlined />,
            width: 460,
            content: (
              <div style={{ marginTop: 8 }}>
                <p style={{ marginBottom: 12, color: '#595959' }}>
                  Share these login credentials with the new user. They must enter the
                  exact <strong>MMV Client No</strong> shown below at the login screen.
                </p>
                <div style={{ background: '#f5f5f5', borderRadius: 6, padding: '12px 16px', lineHeight: 2 }}>
                  <div>
                    <Text type="secondary">MMV Client No:</Text>{' '}
                    <Text strong copyable style={{ fontFamily: 'monospace' }}>{payload.clientNumber}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Username:</Text>{' '}
                    <Text strong copyable style={{ fontFamily: 'monospace' }}>{payload.username}</Text>
                  </div>
                </div>
              </div>
            ),
            okText: 'Done',
          });
        },
        onError: (err) => message.error(err.response?.data?.message || 'Failed to create user'),
      });
    }
  };

  const handleDelete = (user) => {
    Modal.confirm({
      title: 'Delete User',
      content: `Are you sure you want to delete "${user.fullName || user.username}"? This cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () =>
        deleteUser.mutate(user._id || user.id, {
          onSuccess: () => message.success('User deleted'),
          onError: (err) => message.error(err.response?.data?.message || 'Failed to delete user'),
        }),
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name, record) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <Text strong>{name || record.username}</Text>
        </Space>
      ),
    },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={ROLE_COLORS[role] || 'default'}>
          {(role || '').replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Login Client No',
      dataIndex: 'clientNumber',
      key: 'clientNumber',
      render: (clientNumber) => (
        <Tooltip title="Enter this as 'MMV Client No' at the login screen">
          <Tag color="geekblue" style={{ fontFamily: 'monospace' }}>
            {clientNumber || '—'}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Linked Client',
      dataIndex: 'linkedClientNo',
      key: 'linkedClientNo',
      render: (clientNo) =>
        clientNo ? (
          <Tooltip title="This user is linked to a client record">
            <Tag icon={<LinkOutlined />} color="blue">{clientNo}</Tag>
          </Tooltip>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  const isSaving = createUser.isPending || updateUser.isPending;

  const isManager = currentUser?.role === 'manager';

  // Only admin and manager can access this page.
  if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'manager') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Users</Title>
          <Text type="secondary">
            Manage system users. Each user must be linked to a client record — that client number is used to log in.
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New User
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey={(r) => r._id || r.id}
          loading={isLoading}
          pagination={{ pageSize: 15 }}
          locale={{ emptyText: 'No users yet. Click "New User" to create one.' }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'New User'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingUser ? 'Update' : 'Create'}
        confirmLoading={isSaving}
        width={560}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          validateTrigger={[]}
          initialValues={DEFAULT_FORM}
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Full name is required' }]}
          >
            <Input placeholder="e.g. John Smith" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Enter a valid email' }]}
          >
            <Input placeholder="e.g. john.smith@company.com" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Username is required' }]}
          >
            <Input placeholder="e.g. john.smith" />
          </Form.Item>

          <Form.Item
            label={editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
            name="password"
            rules={editingUser ? [] : [{ required: true, min: 6, message: 'Minimum 6 characters' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Select options={ROLE_OPTIONS} />
          </Form.Item>

          {isAdmin ? (
            <>
              <Form.Item
                label="Link to Client Record"
                name="linkedClientNo"
                tooltip="The user's login client number is taken directly from this field."
                rules={[{ required: true, message: 'A linked client is required — it becomes the login client number.' }]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Select a client to link"
                  optionFilterProp="label"
                  options={clients.map((c) => ({
                    value: c.clientNo,
                    label: `${c.clientNo} — ${c.clientName || c.given || 'Client'}`,
                  }))}
                />
              </Form.Item>

              <Form.Item noStyle shouldUpdate={(prev, curr) => prev.linkedClientNo !== curr.linkedClientNo}>
                {({ getFieldValue }) => {
                  const linkedClientNo = getFieldValue('linkedClientNo');
                  if (!linkedClientNo) {
                    return (
                      <Alert
                        type="warning"
                        showIcon
                        style={{ marginTop: -8, marginBottom: 16 }}
                        message="Select a client above to assign the login client number."
                      />
                    );
                  }
                  return (
                    <Alert
                      type="info"
                      showIcon
                      style={{ marginTop: -8, marginBottom: 16 }}
                      message={
                        <span>
                          Login client number:{' '}
                          <Text strong copyable style={{ fontFamily: 'monospace' }}>{linkedClientNo}</Text>
                        </span>
                      }
                      description="This is the 'MMV Client No' the user must enter at the login screen."
                    />
                  );
                }}
              </Form.Item>
            </>
          ) : (
            <>
              {/* Hidden field keeps the value in form state; it was pre-filled in openCreate */}
              <Form.Item name="linkedClientNo" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                message={
                  <span>
                    Login client number:{' '}
                    <Text strong copyable style={{ fontFamily: 'monospace' }}>
                      {currentUser?.clientNumber}
                    </Text>
                  </span>
                }
                description="Users you create are automatically assigned to your client account."
              />
            </>
          )}

          {editingUser && editingUserId === (currentUser?._id || currentUser?.id) && (
            <TwoFactorSetupSection
              is2FAEnabled={is2FAEnabled}
              onStatusChange={(enabled) => {
                setLogin({
                  user: { ...currentUser, is_2fa_enabled: enabled },
                  client: currentClient,
                  expiresIn: currentExpiresIn,
                });
              }}
            />
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
