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
import MembersEditor from '../../components/groups/MembersEditor.jsx';
import useAuthStore, { selectCurrentUser, selectLinkedClientNo } from '../../store/authStore.js';

const { Title, Text } = Typography;

function PortalGroupsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [members, setMembers] = useState([]);
  const [form] = Form.useForm();

  const currentUser = useAuthStore(selectCurrentUser);
  const linkedClientNo = useAuthStore(selectLinkedClientNo);

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
    setMembers(record.members || []);
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
    const payload = {
      groupName: values.groupName.trim(),
      companyName: values.companyName.trim(),
      memberIds: members.map((m) => (typeof m === 'string' ? m : m._id)),
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
        rowKey={(m) => m._id || m}
        pagination={false}
        columns={[
          {
            title: 'Name',
            dataIndex: 'fullName',
            render: (name) => (
              <Space size={6}>
                <UserOutlined style={{ color: '#1890ff' }} />
                <Text>{name}</Text>
              </Space>
            ),
          },
          { title: 'Phone', dataIndex: 'phone', render: (v) => v || '—' },
          { title: 'Email', dataIndex: 'email', render: (v) => v || '—' },
          { title: 'Job Title', dataIndex: 'jobTitle', render: (v) => v || '—' },
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
              description="This will remove the group but will not delete the staff members."
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
        <Form form={form} layout="vertical" onFinish={handleSubmit} validateTrigger={[]} style={{ marginTop: 8 }}>
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

          <Form.Item label="Client" style={{ marginBottom: 16 }}>
            <Input
              value={linkedClientNo || currentUser?.clientNumber || ''}
              disabled
              style={{ background: '#f5f5f5', color: '#595959' }}
              suffix={<Tag color="geekblue" style={{ marginRight: -8 }}>{linkedClientNo}</Tag>}
            />
            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
              Groups are automatically linked to your client account.
            </Text>
          </Form.Item>

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
            <MembersEditor
              members={members}
              onChange={setMembers}
              linkedClientNo={linkedClientNo}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default PortalGroupsPage;
