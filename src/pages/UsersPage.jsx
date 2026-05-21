import React, { useState, useMemo } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, Switch, Tag, Space,
  Typography, Card, message, Tooltip, Divider,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, LinkOutlined,
} from '@ant-design/icons';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import { useClients } from '../hooks/useClients';

const { Title, Text } = Typography;

const ROLE_OPTIONS = [
  { value: 'portal_user', label: 'Portal User (Limited Access)' },
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
  role: 'portal_user',
  clientNumber: 'CL-ADMIN',
  linkedClientNo: null,
  canRequestBookings: true,
};

const UsersPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

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
    form.setFieldsValue(DEFAULT_FORM);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      fullName: user.fullName || '',
      email: user.email || '',
      username: user.username || '',
      password: '',
      role: user.role || 'portal_user',
      clientNumber: user.clientNumber || 'CL-ADMIN',
      linkedClientNo: user.linkedClientNo || null,
      canRequestBookings: user.canRequestBookings !== false,
    });
    setModalOpen(true);
  };

  const handleSubmit = (values) => {
    const payload = { ...values };
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
        onSuccess: () => { message.success('User created'); setModalOpen(false); },
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
      title: 'Can Request Bookings',
      dataIndex: 'canRequestBookings',
      key: 'canRequestBookings',
      render: (val) =>
        val !== false ? (
          <Tag color="green">Yes</Tag>
        ) : (
          <Tag color="default">No</Tag>
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

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Users</Title>
          <Text type="secondary">
            Manage portal users with limited access. Portal users can request bookings from available slots.
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
          initialValues={DEFAULT_FORM}
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Full name is required' }]}
          >
            <Input placeholder="Hamza Ali" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Enter a valid email' }]}
          >
            <Input placeholder="hamza@example.com" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Username is required' }]}
          >
            <Input placeholder="hamza.ali" />
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

          <Divider orientation="left" plain style={{ fontSize: 12, color: '#8c8c8c' }}>
            Client Linking
          </Divider>

          <Form.Item
            label="Link to Client Record"
            name="linkedClientNo"
            tooltip="Select the client record this user represents. They will only see their own reservations."
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

          <Form.Item
            label="Can Submit Booking Requests"
            name="canRequestBookings"
            valuePropName="checked"
            tooltip='When enabled, this user sees a "Request for Booking" button instead of a normal Save button.'
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
