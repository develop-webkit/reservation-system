import { Button, Popconfirm, Space, Table } from 'antd';
import StatusTag from '../common/StatusTag.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

function ReservationTable({ data, loading, onEdit, onDelete }) {
  const columns = [
    { title: 'Res No', dataIndex: 'resNo', key: 'resNo', render: (value) => value || '-' },
    { title: 'Guest', dataIndex: 'clientName', key: 'clientName', render: (value) => value || '-' },
    { title: 'Group', dataIndex: 'groupName', key: 'groupName', render: (value) => value || '-' },
    {
      title: 'Room',
      key: 'room',
      render: (_, record) => record.roomId || '-',
    },
    {
      title: 'Client',
      key: 'client',
      render: (_, record) => record.billingClientNumber || '-',
    },
    {
      title: 'Stay',
      key: 'stay',
      render: (_, record) => `${formatDate(record.checkIn)} - ${formatDate(record.checkOut)}`,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Voucher',
      key: 'voucher',
      render: (_, record) => record.voucherNo || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete reservation?"
            description="This will remove the linked automated flow."
            onConfirm={() => onDelete(record._id || record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey={(record) => record.id || record._id}
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{ x: 1300 }}
    />
  );
}

export default ReservationTable;
