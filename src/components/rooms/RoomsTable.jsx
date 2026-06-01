import { Button, Popconfirm, Space, Table, Tag } from 'antd';

const CLEAN_STATUS_COLOR = {
  Clean: 'green',
  Dirty: 'red',
  Inspect: 'orange',
};

function RoomsTable({ data, loading, onEdit, onDelete }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (value) => value || '-',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (value) => value || '-',
    },
    {
      title: 'Clean Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => (
        <Tag color={CLEAN_STATUS_COLOR[value] || 'default'}>{value || 'Clean'}</Tag>
      ),
    },
    {
      title: 'Max Occ.',
      dataIndex: 'maxOccupancy',
      key: 'maxOccupancy',
      render: (value) => value ?? 2,
    },
    {
      title: 'Service',
      key: 'service',
      render: (_, record) => {
        if (record.outOfOrder) return <Tag color="red">Out of Order</Tag>;
        if (record.outOfService) return <Tag color="orange">Out of Service</Tag>;
        return <Tag color="green">Active</Tag>;
      },
    },
    {
      title: 'Sort',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      render: (value) => value ?? '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete room?"
            description="This will permanently remove the room."
            onConfirm={() => onDelete(record._id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey={(record) => record._id}
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{ x: 900 }}
    />
  );
}

export default RoomsTable;
