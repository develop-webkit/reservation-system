import { Table } from 'antd';
import StatusTag from '../common/StatusTag.jsx';

function AvailableTaskTable({ data, loading }) {
  const columns = [
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Room',
      key: 'room',
      render: (_, record) => record.room?.name || '-',
    },
    {
      title: 'Booking',
      key: 'booking',
      render: (_, record) => record.booking?.guestName || '-',
    },
    {
      title: 'Assigned',
      key: 'assigned',
      render: (_, record) => record.assignedTo?.fullName || record.assignedTo?.username || 'Unassigned',
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
    />
  );
}

export default AvailableTaskTable;
