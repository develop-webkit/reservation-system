import { useMemo, useState } from 'react';
import {
  Alert, Button, DatePicker, Form, Input, InputNumber, Modal,
  Select, Space, Table, Tag, Typography, message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  useBookingRequests,
  useCancelBookingRequest,
  useCreateBookingRequest,
} from '../../hooks/useBookingRequests.js';
import { useClientStaff } from '../../hooks/useClientStaff.js';

const { Title, Text } = Typography;

const STATUS_COLOR = {
  Pending: 'orange',
  Approved: 'green',
  Rejected: 'red',
  Cancelled: 'default',
};

function PortalBookingRequestPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: requestsRaw, isLoading, error } = useBookingRequests();
  const { data: staffRaw } = useClientStaff();
  const createRequest = useCreateBookingRequest();
  const cancelRequest = useCancelBookingRequest();

  const requests = Array.isArray(requestsRaw) ? requestsRaw : (requestsRaw?.data || []);
  const staff = useMemo(() => {
    const raw = Array.isArray(staffRaw) ? staffRaw : (staffRaw?.data || []);
    return raw.filter((s) => s.isActive !== false);
  }, [staffRaw]);

  const handleSubmit = (values) => {
    const payload = {
      staffName: values.staffName,
      staffId: values.staffId || undefined,
      checkIn: values.dates[0].format('YYYY-MM-DD'),
      checkOut: values.dates[1].format('YYYY-MM-DD'),
      roomPreference: values.roomPreference || undefined,
      numberOfGuests: values.numberOfGuests || 1,
      specialRequirements: values.specialRequirements || undefined,
    };
    createRequest.mutate(payload, {
      onSuccess: () => {
        message.success('Booking request submitted successfully');
        setModalOpen(false);
        form.resetFields();
      },
      onError: (err) => message.error(err.response?.data?.message || 'Failed to submit request'),
    });
  };

  const onStaffSelect = (staffId) => {
    const selected = staff.find((s) => s._id === staffId || s.id === staffId);
    if (selected) form.setFieldValue('staffName', selected.fullName);
  };

  const columns = [
    {
      title: 'Staff Name',
      dataIndex: 'staffName',
      key: 'staffName',
      render: (name) => <Text strong>{name}</Text>,
    },
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
    { title: 'Room Preference', dataIndex: 'roomPreference', key: 'roomPreference', width: 150 },
    { title: 'Guests', dataIndex: 'numberOfGuests', key: 'numberOfGuests', width: 70 },
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const id = record._id || record.id;
        if (record.status !== 'Pending') return null;
        return (
          <Button
            size="small"
            danger
            onClick={() =>
              cancelRequest.mutate(id, {
                onSuccess: () => message.success('Request cancelled'),
                onError: (err) => message.error(err.response?.data?.message || 'Failed'),
              })
            }
          >
            Cancel
          </Button>
        );
      },
      width: 90,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, marginBottom: 4 }}>Booking Requests</Title>
          <Text type="secondary">
            Submit booking requests for your staff. Admin will review and approve.
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          New Request
        </Button>
      </div>

      {error && <Alert type="error" message="Failed to load requests" showIcon style={{ marginBottom: 16 }} />}

      <Table
        columns={columns}
        dataSource={requests}
        rowKey={(r) => r._id || r.id}
        loading={isLoading}
        pagination={{ pageSize: 15 }}
        locale={{ emptyText: 'No booking requests yet.' }}
        size="small"
      />

      <Modal
        title="New Booking Request"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={() => form.submit()}
        okText="Submit Request"
        confirmLoading={createRequest.isPending}
        width={540}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {staff.length > 0 && (
            <Form.Item label="Select Staff Member" name="staffId">
              <Select
                allowClear
                showSearch
                placeholder="Choose from your staff list"
                optionFilterProp="label"
                onChange={onStaffSelect}
                options={staff.map((s) => ({
                  value: s._id || s.id,
                  label: `${s.fullName}${s.jobTitle ? ` — ${s.jobTitle}` : ''}`,
                }))}
              />
            </Form.Item>
          )}
          <Form.Item
            label="Guest / Traveller Name"
            name="staffName"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="Full name of the traveller" />
          </Form.Item>
          <Form.Item
            label="Check-in & Check-out Dates"
            name="dates"
            rules={[{ required: true, message: 'Dates are required' }]}
          >
            <DatePicker.RangePicker style={{ width: '100%' }} disabledDate={(d) => d.isBefore(dayjs(), 'day')} />
          </Form.Item>
          <Form.Item label="Room Preference" name="roomPreference">
            <Input placeholder="e.g. Benjamin Block, Single Room..." />
          </Form.Item>
          <Form.Item label="Number of Guests" name="numberOfGuests" initialValue={1}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Special Requirements" name="specialRequirements">
            <Input.TextArea rows={3} placeholder="Dietary requirements, accessibility, preferences..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PortalBookingRequestPage;
