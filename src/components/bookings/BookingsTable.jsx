import { Button, Space, Table } from 'antd';
import StatusTag from '../common/StatusTag.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

function BookingsTable({ data, loading, onStatusClick }) {
  const columns = [
    {
      title: 'Guest',
      dataIndex: 'guestName',
      key: 'guestName',
    },
    {
      title: 'Room',
      key: 'room',
      render: (_, record) => record.room?.name || '-',
    },
    {
      title: 'Stay',
      key: 'stay',
      render: (_, record) => `${formatDate(record.startDate)} - ${formatDate(record.endDate)}`,
    },
    {
      title: 'Client',
      key: 'client',
      render: (_, record) => record.client?.clientName || record.clientNumber || '-',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Voucher Amount',
      dataIndex: 'voucherAmount',
      key: 'voucherAmount',
      render: (value) => formatCurrency(value),
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
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button onClick={() => onStatusClick(record)}>Change status</Button>
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
      scroll={{ x: 1200 }}
    />
  );
}

export default BookingsTable;
