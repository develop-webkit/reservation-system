import { useState } from 'react';
import {
  Button, Form, Input, Modal, Popconfirm, Space, Switch, Table, Tag, Typography, message,
} from 'antd';
import {
  DeleteOutlined, EditOutlined, PauseCircleOutlined, PlusOutlined, UserOutlined,
} from '@ant-design/icons';
import {
  useClientStaff,
  useCreateClientStaff,
  useDeactivateClientStaff,
  useDeleteClientStaff,
  useUpdateClientStaff,
} from '../../hooks/useClientStaff.js';

const { Title, Text } = Typography;

const DEFAULT_FORM = {
  fullName: '',
  email: '',
  phone: '',
  passportNumber: '',
  nationality: '',
  jobTitle: '',
  notes: '',
};

function PortalStaffPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const { data: staffRaw, isLoading } = useClientStaff();
  const createStaff = useCreateClientStaff();
  const updateStaff = useUpdateClientStaff();
  const deactivateStaff = useDeactivateClientStaff();
  const deleteStaff = useDeleteClientStaff();

  const staff = Array.isArray(staffRaw) ? staffRaw : (staffRaw?.data || []);

  const openCreate = () => {
    setEditing(null);
    form.setFieldsValue(DEFAULT_FORM);
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      fullName: record.fullName || '',
      email: record.email || '',
      phone: record.phone || '',
      passportNumber: record.passportNumber || '',
      nationality: record.nationality || '',
      jobTitle: record.jobTitle || '',
      notes: record.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = (values) => {
    if (editing) {
      updateStaff.mutate(
        { id: editing._id || editing.id, data: values },
        {
          onSuccess: () => { message.success('Staff member updated'); setModalOpen(false); },
          onError: (err) => message.error(err.response?.data?.message || 'Failed to update'),
        },
      );
    } else {
      createStaff.mutate(values, {
        onSuccess: () => { message.success('Staff member added'); setModalOpen(false); },
        onError: (err) => message.error(err.response?.data?.message || 'Failed to add'),
      });
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    { title: 'Job Title', dataIndex: 'jobTitle', key: 'jobTitle' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Passport No', dataIndex: 'passportNumber', key: 'passportNumber' },
    { title: 'Nationality', dataIndex: 'nationality', key: 'nationality' },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (v) => <Tag color={v !== false ? 'green' : 'default'}>{v !== false ? 'Active' : 'Inactive'}</Tag>,
      width: 90,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const id = record._id || record.id;
        return (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
            {record.isActive !== false && (
              <Popconfirm
                title="Deactivate this staff member?"
                onConfirm={() =>
                  deactivateStaff.mutate(id, {
                    onSuccess: () => message.success('Staff member deactivated'),
                    onError: (err) => message.error(err.response?.data?.message || 'Failed'),
                  })
                }
              >
                <Button size="small" icon={<PauseCircleOutlined />}>Deactivate</Button>
              </Popconfirm>
            )}
            <Popconfirm
              title="Delete this staff member permanently?"
              okType="danger"
              onConfirm={() =>
                deleteStaff.mutate(id, {
                  onSuccess: () => message.success('Staff member removed'),
                  onError: (err) => message.error(err.response?.data?.message || 'Failed'),
                })
              }
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const isSaving = createStaff.isPending || updateStaff.isPending;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, marginBottom: 4 }}>Staff Management</Title>
          <Text type="secondary">Add and manage your company's traveller profiles</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add Staff
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={staff}
        rowKey={(r) => r._id || r.id}
        loading={isLoading}
        pagination={{ pageSize: 15 }}
        locale={{ emptyText: 'No staff members yet.' }}
        size="small"
      />

      <Modal
        title={editing ? 'Edit Staff Member' : 'Add Staff Member'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText={editing ? 'Update' : 'Add'}
        confirmLoading={isSaving}
        width={560}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} validateTrigger={[]}>
          <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}>
            <Input placeholder="John Smith" />
          </Form.Item>
          <Form.Item label="Job Title" name="jobTitle">
            <Input placeholder="Engineer" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}>
            <Input placeholder="john@company.com" />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input placeholder="+61 400 000 000" />
          </Form.Item>
          <Form.Item label="Passport Number" name="passportNumber">
            <Input placeholder="A12345678" />
          </Form.Item>
          <Form.Item label="Nationality" name="nationality">
            <Input placeholder="Australian" />
          </Form.Item>
          <Form.Item label="Notes" name="notes">
            <Input.TextArea rows={2} placeholder="Dietary requirements, preferences..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PortalStaffPage;
