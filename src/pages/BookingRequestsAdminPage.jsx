import { useState } from 'react';
import { Alert, Button, Input, Modal, Space, Table, Tag, Tooltip, Typography, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  useApproveBookingRequest,
  useBookingRequests,
  useRejectBookingRequest,
} from '../hooks/useBookingRequests.js';

const { Title, Text } = Typography;

const STATUS_COLOR = {
  Pending: 'orange',
  Approved: 'green',
  Rejected: 'red',
  Cancelled: 'default',
};

function BookingRequestsAdminPage() {
  const [actionModal, setActionModal] = useState({ open: false, type: null, record: null });
  const [adminNotes, setAdminNotes] = useState('');

  const { data: requestsRaw, isLoading, error } = useBookingRequests();
  const approve = useApproveBookingRequest();
  const reject = useRejectBookingRequest();

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
          message.success(type === 'approve' ? 'Request approved' : 'Request rejected');
          setActionModal({ open: false, type: null, record: null });
        },
        onError: (err) => message.error(err.response?.data?.message || 'Failed'),
      },
    );
  };

  const columns = [
    {
      title: 'Client',
      dataIndex: 'linkedClientNo',
      key: 'linkedClientNo',
      width: 130,
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    { title: 'Staff / Traveller', dataIndex: 'staffName', key: 'staffName' },
    {
      title: 'Check-in',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: (v) => (v ? dayjs(v).format('DD MMM YYYY') : '—'),
      width: 130,
    },
    {
      title: 'Check-out',
      dataIndex: 'checkOut',
      key: 'checkOut',
      render: (v) => (v ? dayjs(v).format('DD MMM YYYY') : '—'),
      width: 130,
    },
    {
      title: 'Room Preference',
      dataIndex: 'roomPreference',
      key: 'roomPreference',
      render: (v) => v || '—',
    },
    { title: 'Guests', dataIndex: 'numberOfGuests', key: 'numberOfGuests', width: 70 },
    {
      title: 'Special Requirements',
      dataIndex: 'specialRequirements',
      key: 'specialRequirements',
      render: (v) => v ? <Tooltip title={v}><Text ellipsis style={{ maxWidth: 180 }}>{v}</Text></Tooltip> : '—',
      width: 180,
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
      render: (v) => (v ? dayjs(v).format('DD MMM YYYY') : '—'),
      width: 130,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
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
      <Title level={3} style={{ margin: 0, marginBottom: 4 }}>Booking Requests</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
        Review and approve booking requests submitted by corporate clients
      </Text>

      {error && <Alert type="error" message="Failed to load requests" showIcon style={{ marginBottom: 16 }} />}

      <Table
        columns={columns}
        dataSource={requests}
        rowKey={(r) => r._id || r.id}
        loading={isLoading}
        pagination={{ pageSize: 20 }}
        locale={{ emptyText: 'No booking requests.' }}
        size="small"
        scroll={{ x: 1200 }}
      />

      <Modal
        title={actionModal.type === 'approve' ? 'Approve Request' : 'Reject Request'}
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
              Request for <strong>{actionModal.record.staffName}</strong> —{' '}
              {dayjs(actionModal.record.checkIn).format('DD MMM')} to{' '}
              {dayjs(actionModal.record.checkOut).format('DD MMM YYYY')}
            </Text>
          )}
        </div>
        <Input.TextArea
          rows={3}
          placeholder="Add a note for the client (optional)"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default BookingRequestsAdminPage;
