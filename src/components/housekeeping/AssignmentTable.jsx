import { Button, Table } from 'antd';
import StatusTag from '../common/StatusTag.jsx';
import { formatDateTime } from '../../utils/format.js';

function AssignmentTable({ data, loading, onComplete, selectedRowKeys, onSelectionChange }) {
  const rowSelection = onSelectionChange
    ? {
        selectedRowKeys,
        onChange: onSelectionChange,
      }
    : undefined;

  const columns = [
    { title: 'Task', dataIndex: 'type', key: 'type' },
    {
      title: 'Room',
      key: 'room',
      render: (_, record) => record.room?.name || '-',
    },
    {
      title: 'Housekeeper',
      key: 'housekeeper',
      render: (_, record) => record.assignedTo?.fullName || record.assignedTo?.username || '-',
    },
    {
      title: 'Completed At',
      key: 'completedAt',
      render: (_, record) => formatDateTime(record.completedAt),
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
        <Button onClick={() => onComplete(record)} disabled={record.status === 'Completed'}>
          Mark complete
        </Button>
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

export default AssignmentTable;
