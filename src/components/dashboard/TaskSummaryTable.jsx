import { Table } from 'antd';
import StatusTag from '../common/StatusTag.jsx';

function TaskSummaryTable({ data, loading }) {
  const columns = [
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Room',
      key: 'room',
      render: (_, record) => record.room?.name || record.roomId?.name || '-',
    },
    {
      title: 'Assigned To',
      key: 'assignedTo',
      render: (_, record) => record.assignedTo?.fullName || record.assignedTo?.username || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => <StatusTag value={value} />,
    },
  ];

  return (
    <Table
      rowKey={(record) => record._id}
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      scroll={{ x: 720 }}
    />
  );
}

export default TaskSummaryTable;
