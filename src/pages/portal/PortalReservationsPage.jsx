import { useMemo, useState } from 'react';
import { Alert, Button, Input, Select, Space, Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useReservationsQuery } from '../../hooks/useReservationsQuery.js';
import { STATUS_OPTIONS } from '../../data/options.js';

const { Title, Text } = Typography;

const STATUS_COLOR = {
  Unconfirmed: 'orange',
  Confirmed: 'green',
  'Checked In': 'blue',
  'Checked Out': 'default',
  Departed: 'default',
  Canceled: 'red',
  Cancelled: 'red',
};

function PortalReservationsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);

  const reservationsQuery = useReservationsQuery({ status: statusFilter });

  const filtered = useMemo(() => {
    const source = reservationsQuery.data || [];
    const term = search.trim().toLowerCase();
    return source.filter((item) => {
      if (!term) return true;
      return (
        item.clientName?.toLowerCase().includes(term) ||
        item.resNo?.toLowerCase().includes(term)
      );
    });
  }, [search, statusFilter, reservationsQuery.data]);

  const columns = [
    { title: 'Res No', dataIndex: 'resNo', key: 'resNo', width: 130 },
    { title: 'Guest', dataIndex: 'clientName', key: 'clientName' },
    { title: 'Room', dataIndex: 'roomId', key: 'roomId', width: 100 },
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={STATUS_COLOR[status] || 'default'}>{status || '—'}</Tag>
      ),
      width: 130,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ margin: 0, marginBottom: 4 }}>My Reservations</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
        Reservations made for your company
      </Text>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search guest or reservation no"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 260 }}
          allowClear
        />
        <Select
          allowClear
          placeholder="Filter by status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS.map((s) => ({ label: s, value: s }))}
          style={{ width: 180 }}
        />
      </Space>

      {reservationsQuery.error && (
        <Alert type="error" message="Failed to load reservations" showIcon style={{ marginBottom: 16 }} />
      )}

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey={(r) => r.id || r._id}
        loading={reservationsQuery.isLoading}
        pagination={{ pageSize: 15 }}
        locale={{ emptyText: 'No reservations found.' }}
        size="small"
      />
    </div>
  );
}

export default PortalReservationsPage;
