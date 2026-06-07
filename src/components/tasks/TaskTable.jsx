import { Button, Space, Table } from 'antd';
import StatusTag from '../common/StatusTag.jsx';

function TaskTable({ data, loading, onEdit, selectedRowKeys, onSelectionChange }) {
  const rowSelection = onSelectionChange
    ? {
        selectedRowKeys,
        onChange: onSelectionChange,
      }
    : undefined;

  const columns = [
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Room',
      key: 'room',
      render: (_, record) => record.room?.name || '-',
    },
    {
      title: 'Assigned To',
      key: 'assignedTo',
      render: (_, record) => record.assignedTo?.fullName || record.assignedTo?.username || '-',
    },
    {
      title: 'Time Required',
      dataIndex: 'timeRequired',
      key: 'timeRequired',
      render: (value) => (value ? `${value} mins` : '-'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Edit</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey={(record) => record._id}
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      loading={loading}
    />
  );
}

export default TaskTable;
