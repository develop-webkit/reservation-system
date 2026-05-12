import { Button, Table } from 'antd';
import { formatCurrency, formatDate } from '../../utils/format.js';

function AccountingTable({ data, loading, onEdit }) {
  const columns = [
    {
      title: 'Client',
      key: 'clientNumber',
      render: (_, record) => record.clientNumber || record.billingClientNumber || '-',
    },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Reference', dataIndex: 'referenceNo', key: 'referenceNo' },
    { title: 'Voucher Code', dataIndex: 'voucherCode', key: 'voucherCode', render: (value) => value || '-' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Voucher Amount',
      dataIndex: 'voucherAmount',
      key: 'voucherAmount',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => formatDate(value),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => <Button onClick={() => onEdit(record)}>Edit</Button>,
    },
  ];

  return <Table rowKey={(record) => record._id} columns={columns} dataSource={data} loading={loading} />;
}

export default AccountingTable;
