import { useState } from 'react';
import {
  Button, Form, Input, Modal, Popconfirm, Space, Table, Tag, Typography, message,
} from 'antd';
import {
  DeleteOutlined, EditOutlined, PlusOutlined, TeamOutlined, UserOutlined,
} from '@ant-design/icons';
import {
  useClientGroups,
  useCreateClientGroup,
  useDeleteClientGroup,
  useUpdateClientGroup,
} from '../../hooks/useClientGroups.js';

const { Title, Text } = Typography;

const EMPTY_MEMBER = { name: '', phone: '', email: '' };

function MembersEditor({ members, onChange }) {
  const add = () => onChange([...members, { ...EMPTY_MEMBER }]);

  const update = (index, field, value) => {
    const updated = members.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    onChange(updated);
  };

  const remove = (index) => onChange(members.filter((_, i) => i !== index));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text strong style={{ fontSize: 13 }}>Members</Text>
        <Button size="small" icon={<PlusOutlined />} onClick={add}>Add Member</Button>
      </div>

      {members.length === 0 && (
        <Text type="secondary" style={{ fontSize: 12 }}>
          No members yet. Click "Add Member" to add your first group member.
        </Text>
      )}

      {members.map((member, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: 8,
            marginBottom: 8,
            alignItems: 'center',
          }}
        >
          <Input
            placeholder="Full name *"
            value={member.name}
            onChange={(e) => update(index, 'name', e.target.value)}
            size="small"
          />
          <Input
            placeholder="Phone"
            value={member.phone}
            onChange={(e) => update(index, 'phone', e.target.value)}
            size="small"
          />
          <Input
            placeholder="Email"
            value={member.email}
            onChange={(e) => update(index, 'email', e.target.value)}
            size="small"
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => remove(index)}
          />
        </div>
      ))}
    </div>
  );
}

function PortalGroupsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [members, setMembers] = useState([]);
  const [form] = Form.useForm();

  const { data: groupsRaw, isLoading } = useClientGroups();
  const createGroup = useCreateClientGroup();
  const updateGroup = useUpdateClientGroup();
  const deleteGroup = useDeleteClientGroup();

  const groups = Array.isArray(groupsRaw) ? groupsRaw : (groupsRaw?.data || []);

  const openCreate = () => {
    setEditing(null);
    setMembers([]);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setMembers((record.members || []).map((m) => ({ name: m.name, phone: m.phone || '', email: m.email || '' })));
    form.setFieldsValue({ groupName: record.groupName, companyName: record.companyName });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setMembers([]);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    const invalidMembers = members.some((m) => !m.name.trim());
    if (invalidMembers) {
      message.error('All member entries must have a name.');
      return;
    }

    const payload = {
      groupName: values.groupName.trim(),
      companyName: values.companyName.trim(),
      members: members.map((m) => ({ name: m.name.trim(), phone: m.phone.trim(), email: m.email.trim() })),
    };

    if (editing) {
      const id = editing._id || editing.id;
      updateGroup.mutate(
        { id, data: payload },
        {
          onSuccess: () => { message.success('Group updated'); closeModal(); },
          onError: (err) => message.error(err.response?.data?.message || 'Failed to update group'),
        },
      );
    } else {
      createGroup.mutate(payload, {
        onSuccess: () => { message.success('Group created'); closeModal(); },
        onError: (err) => message.error(err.response?.data?.message || 'Failed to create group'),
      });
    }
  };

  const expandedRowRender = (record) => {
    const mems = record.members || [];
    if (mems.length === 0) {
      return <Text type="secondary" style={{ padding: '8px 0', display: 'block' }}>No members in this group.</Text>;
    }
    return (
      <Table
        size="small"
        dataSource={mems}
        rowKey={(m, i) => m._id || i}
        pagination={false}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            render: (name) => (
              <Space size={6}>
                <UserOutlined style={{ color: '#1890ff' }} />
                <Text>{name}</Text>
              </Space>
            ),
          },
          { title: 'Phone', dataIndex: 'phone', render: (v) => v || '—' },
          { title: 'Email', dataIndex: 'email', render: (v) => v || '—' },
        ]}
      />
    );
  };

  const columns = [
    {
      title: 'Group Name',
      dataIndex: 'groupName',
      key: 'groupName',
      render: (name) => (
        <Space>
          <TeamOutlined style={{ color: '#1890ff' }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    { title: 'Company', dataIndex: 'companyName', key: 'companyName' },
    {
      title: 'Members',
      key: 'memberCount',
      render: (_, record) => (
        <Tag color="blue">{(record.members || []).length} members</Tag>
      ),
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const id = record._id || record.id;
        return (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
              Edit
            </Button>
            <Popconfirm
              title="Delete this group?"
              description="All members in this group will be removed."
              okType="danger"
              onConfirm={() =>
                deleteGroup.mutate(id, {
                  onSuccess: () => message.success('Group deleted'),
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

  const isSaving = createGroup.isPending || updateGroup.isPending;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, marginBottom: 4 }}>Group Management</Title>
          <Text type="secondary">
            Organise your staff into groups. Use groups to quickly fill guest details when creating reservations.
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New Group
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={groups}
        rowKey={(r) => r._id || r.id}
        loading={isLoading}
        expandable={{ expandedRowRender }}
        pagination={{ pageSize: 15 }}
        locale={{ emptyText: 'No groups yet. Create your first group to get started.' }}
        size="small"
      />

      <Modal
        title={editing ? 'Edit Group' : 'New Group'}
        open={modalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={editing ? 'Update Group' : 'Create Group'}
        confirmLoading={isSaving}
        width={680}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              label="Group Name"
              name="groupName"
              rules={[{ required: true, message: 'Group name is required' }]}
              style={{ marginBottom: 12 }}
            >
              <Input placeholder="e.g. Maintenance Team" />
            </Form.Item>
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true, message: 'Company name is required' }]}
              style={{ marginBottom: 12 }}
            >
              <Input placeholder="e.g. ABC Mining Pty Ltd" />
            </Form.Item>
          </div>

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
            <MembersEditor members={members} onChange={setMembers} />
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default PortalGroupsPage;
