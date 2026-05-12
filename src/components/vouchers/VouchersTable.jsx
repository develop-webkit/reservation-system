import { Button, Table } from 'antd';
import StatusTag from '../common/StatusTag.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

function VouchersTable({ data, loading, onEdit }) {
  const columns = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Description', dataIndex: 'description', key: 'description', render: (value) => value || '-' },
    {
      title: 'Credit',
      dataIndex: 'creditAmount',
      key: 'creditAmount',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Expiry',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (value) => formatDate(value),
    },
    {
      title: 'Client',
      key: 'client',
      render: (_, record) => record.client?.clientName || record.managerClientNumber || '-',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => <StatusTag value={record.isActive === false ? 'Inactive' : 'Active'} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => <Button onClick={() => onEdit(record)}>Edit</Button>,
    },
  ];

  return <Table rowKey={(record) => record._id} columns={columns} dataSource={data} loading={loading} />;
}

export default VouchersTable;
