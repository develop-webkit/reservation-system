import { Button, Table } from 'antd';
import { formatCurrency } from '../../utils/format.js';

function ClientsTable({ data, loading, onEdit }) {
  const columns = [
    { title: 'Client No', dataIndex: 'clientNo', key: 'clientNo' },
    { title: 'Name', dataIndex: 'clientName', key: 'clientName', render: (value) => value || '-' },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (value) => value || '-' },
    { title: 'Mobile', dataIndex: 'mobile', key: 'mobile', render: (value) => value || '-' },
    { title: 'Type', dataIndex: 'clientType', key: 'clientType', render: (value) => value || '-' },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => <Button onClick={() => onEdit(record)}>Edit</Button>,
    },
  ];

  return <Table rowKey={(record) => record._id} columns={columns} dataSource={data} loading={loading} />;
}

export default ClientsTable;
