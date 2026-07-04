import { Button, Space, Table, Tag } from 'antd';
import { FolderOpenOutlined, SolutionOutlined } from '@ant-design/icons';
import { formatDate } from '../../utils/format.js';

function InvoiceHistoryTable({
  data,
  loading,
  onOpen,
  isManager = false,
  pendingInvoiceIds = new Set(),
  onRequestEdit,
  requestingEdit = false,
}) {
  const columns = [
    { title: 'Invoice No', dataIndex: 'invoiceNo', key: 'invoiceNo' },
    { title: 'Billed To', dataIndex: 'billedTo', key: 'billedTo', render: (v) => v || '-' },
    { title: 'Client Name', dataIndex: 'clientName', key: 'clientName', render: (v) => v || '-' },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (v) => formatDate(v),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (v) => `$${Number(v || 0).toFixed(2)}`,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy) => createdBy?.fullName || createdBy?.username || '-',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.canEdit ? 'green' : 'default'}>
          {record.canEdit ? 'Editable' : 'Locked'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const showRequestEdit = isManager && !record.canEdit;
        const isPending = pendingInvoiceIds.has(record._id);
        return (
          <Space.Compact>
            <Button icon={<FolderOpenOutlined />} onClick={() => onOpen(record)}>
              Open
            </Button>
            {showRequestEdit && (
              <Button
                icon={<SolutionOutlined />}
                disabled={isPending}
                loading={requestingEdit}
                onClick={() => onRequestEdit?.(record)}
              >
                {isPending ? 'Pending Approval' : 'Request Edit Access'}
              </Button>
            )}
          </Space.Compact>
        );
      },
    },
  ];

  return (
    <Table
      rowKey={(record) => record._id}
      columns={columns}
      dataSource={data}
      loading={loading}
      locale={{ emptyText: 'No saved invoices yet.' }}
    />
  );
}

export default InvoiceHistoryTable;
