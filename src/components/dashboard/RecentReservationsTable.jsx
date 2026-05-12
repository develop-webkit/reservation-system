import { Table } from 'antd';
import StatusTag from '../common/StatusTag.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

function RecentReservationsTable({ data, loading }) {
  const columns = [
    { title: 'Reservation', dataIndex: 'resNo', key: 'resNo', render: (value) => value || '-' },
    { title: 'Guest', dataIndex: 'guestName', key: 'guestName' },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: (value) => formatDate(value),
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
      key: 'checkOut',
      render: (value) => formatDate(value),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (value) => formatCurrency(value),
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
      scroll={{ x: 900 }}
    />
  );
}

export default RecentReservationsTable;
