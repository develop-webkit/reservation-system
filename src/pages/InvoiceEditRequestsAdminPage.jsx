import { useState } from 'react';
import { Alert, Button, Input, Modal, Space, Table, Tag, Typography, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  useApproveInvoiceEditRequest,
  useInvoiceEditRequests,
  useRejectInvoiceEditRequest,
} from '../hooks/useInvoiceEditRequests.js';

const { Title, Text } = Typography;

const STATUS_COLOR = {
  Pending: 'orange',
  Approved: 'green',
  Rejected: 'red',
};

function InvoiceEditRequestsAdminPage() {
  const [actionModal, setActionModal] = useState({ open: false, type: null, record: null });
  const [adminNotes, setAdminNotes] = useState('');

  const { data: requestsRaw, isLoading, error } = useInvoiceEditRequests();
  const approve = useApproveInvoiceEditRequest();
  const reject = useRejectInvoiceEditRequest();

  const requests = Array.isArray(requestsRaw) ? requestsRaw : (requestsRaw?.data || []);

  const openAction = (type, record) => {
    setAdminNotes('');
    setActionModal({ open: true, type, record });
  };

  const handleConfirm = () => {
    const { type, record } = actionModal;
    const id = record._id || record.id;
    const mutation = type === 'approve' ? approve : reject;
    mutation.mutate(
      { id, adminNotes },
      {
        onSuccess: () => {
          message.success(type === 'approve' ? 'Edit request approved — the manager can now edit this invoice.' : 'Request rejected');
          setActionModal({ open: false, type: null, record: null });
        },
        onError: (err) => message.error(err.response?.data?.message || 'Failed'),
      },
    );
  };

  const columns = [
    { title: 'Invoice No', dataIndex: 'invoiceNo', key: 'invoiceNo' },
    { title: 'Requested By', dataIndex: 'username', key: 'username' },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName', render: (v) => v || '—' },
    {
      title: 'Client No',
      dataIndex: 'clientNumber',
      key: 'clientNumber',
      width: 130,
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={STATUS_COLOR[status] || 'default'}>{status}</Tag>,
      width: 110,
    },
    {
      title: 'Admin Notes',
      dataIndex: 'adminNotes',
      key: 'adminNotes',
      render: (v) => v || '—',
    },
    {
      title: 'Date Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v) => (v ? dayjs(v).format('DD MMM YYYY, h:mm A') : '—'),
      width: 170,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_, record) => {
        if (record.status !== 'Pending') return null;
        return (
          <Space>
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => openAction('approve', record)}
            >
              Approve
            </Button>
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => openAction('reject', record)}
            >
              Reject
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ margin: 0, marginBottom: 4 }}>Invoice Edit Requests</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
        Review and approve requests from Managers to edit an invoice past its 5-day edit window.
      </Text>

      {error && <Alert type="error" message="Failed to load requests" showIcon style={{ marginBottom: 16 }} />}

      <Table
        columns={columns}
        dataSource={requests}
        rowKey={(r) => r._id || r.id}
        loading={isLoading}
        pagination={{ pageSize: 20 }}
        locale={{ emptyText: 'No invoice edit requests.' }}
        size="small"
        scroll={{ x: 900 }}
      />

      <Modal
        title={actionModal.type === 'approve' ? 'Approve Edit Request' : 'Reject Request'}
        open={actionModal.open}
        onCancel={() => setActionModal({ open: false, type: null, record: null })}
        onOk={handleConfirm}
        okText={actionModal.type === 'approve' ? 'Approve' : 'Reject'}
        okButtonProps={{ danger: actionModal.type === 'reject' }}
        confirmLoading={approve.isPending || reject.isPending}
        destroyOnHidden
      >
        <div style={{ marginBottom: 12 }}>
          {actionModal.record && (
            <Text type="secondary">
              {actionModal.type === 'approve' ? (
                <>This will allow <strong>{actionModal.record.username}</strong> to edit invoice <strong>{actionModal.record.invoiceNo}</strong> again.</>
              ) : (
                <>Reject the edit request from <strong>{actionModal.record.username}</strong> for invoice <strong>{actionModal.record.invoiceNo}</strong>?</>
              )}
            </Text>
          )}
        </div>
        <Input.TextArea
          rows={3}
          placeholder="Add a note for the manager (optional)"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default InvoiceEditRequestsAdminPage;
