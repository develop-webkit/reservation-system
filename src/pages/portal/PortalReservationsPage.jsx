import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Input, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, StopOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { createReservation, updateReservation } from '../../api/services/reservations.js';
import { useReservationsQuery } from '../../hooks/useReservationsQuery.js';
import { useRoomsQuery } from '../../hooks/useRoomsQuery.js';
import { useClientsQuery } from '../../hooks/useClientsQuery.js';
import { useCompaniesQuery } from '../../hooks/useCompaniesQuery.js';
import { useAppMutation } from '../../hooks/useAppMutation.js';
import { queryKeys } from '../../constants/queryKeys.js';
import { STATUS_OPTIONS } from '../../data/options.js';
import ReservationFormDrawer from '../../components/reservations/ReservationFormDrawer.jsx';

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
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [groupFilter, setGroupFilter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  const reservationsQuery = useReservationsQuery({ status: statusFilter });
  const roomsQuery = useRoomsQuery();
  const clientsQuery = useClientsQuery({});
  const companiesQuery = useCompaniesQuery();

  // Booking Chart's "Add Reservation" / "Open in Reservations" context-menu actions land
  // here (rather than the admin-only /reservations/list) carrying these query params.
  // Resolved once their backing query data has loaded, then the drawer opens pre-filled.
  // Uses React's "adjust state during render" pattern instead of an effect for the state
  // update itself (only the URL cleanup below is a real effect), matching the approach
  // already established in BookingChartHeader.jsx / AppSidebar.jsx for this lint rule.
  const reservationIdParam = searchParams.get('reservationId');
  const arriveParam = searchParams.get('arrive');
  const areaParam = searchParams.get('area');
  const chartParamsKey = (reservationIdParam || arriveParam || areaParam)
    ? `${reservationIdParam || ''}|${arriveParam || ''}|${areaParam || ''}`
    : null;
  const [processedChartParamsKey, setProcessedChartParamsKey] = useState(null);

  if (chartParamsKey && chartParamsKey !== processedChartParamsKey) {
    const stillLoading = reservationIdParam ? reservationsQuery.isLoading : roomsQuery.isLoading;
    if (!stillLoading) {
      setProcessedChartParamsKey(chartParamsKey);

      if (reservationIdParam) {
        const match = (reservationsQuery.data || []).find(
          (r) => r.id === reservationIdParam || r._id === reservationIdParam,
        );
        if (match) {
          setEditingReservation(match);
          setDrawerOpen(true);
        }
      } else {
        const matchedRoom = (roomsQuery.data || []).find((r) => r.name === areaParam);
        const checkIn = arriveParam ? dayjs(arriveParam).hour(15).minute(0).second(0) : undefined;
        setEditingReservation({
          room: matchedRoom?._id,
          checkIn,
          checkOut: checkIn ? checkIn.add(1, 'day').hour(6).minute(0).second(0) : undefined,
        });
        setDrawerOpen(true);
      }
    }
  }

  useEffect(() => {
    if (!processedChartParamsKey) return;
    setSearchParams({}, { replace: true });
  }, [processedChartParamsKey, setSearchParams]);

  const clients = useMemo(() => {
    const raw = clientsQuery.data;
    if (!raw) return [];
    return Array.isArray(raw) ? raw : (raw.data || []);
  }, [clientsQuery.data]);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.reservations });
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
    queryClient.invalidateQueries({ queryKey: ['bookings', 'chart'] });
    queryClient.invalidateQueries({ queryKey: ['booking-chart'] });
  };

  const createMutation = useAppMutation({
    mutationFn: createReservation,
    successMessage: 'Reservation created successfully.',
    onSuccess: () => {
      invalidateAll();
      setDrawerOpen(false);
    },
  });

  const updateMutation = useAppMutation({
    mutationFn: ({ id, payload }) => updateReservation(id, payload),
    successMessage: 'Reservation updated successfully.',
    onSuccess: () => {
      invalidateAll();
      setDrawerOpen(false);
      setEditingReservation(null);
    },
  });

  const cancelMutation = useAppMutation({
    mutationFn: (id) => updateReservation(id, { status: 'Canceled' }),
    successMessage: 'Reservation cancelled.',
    onSuccess: invalidateAll,
  });

  const filtered = useMemo(() => {
    const source = reservationsQuery.data || [];
    const term = search.trim().toLowerCase();
    const groupTerm = groupFilter.trim().toLowerCase();
    return source.filter((item) => {
      const textMatch =
        !term ||
        item.clientName?.toLowerCase().includes(term) ||
        item.guestName?.toLowerCase().includes(term) ||
        item.resNo?.toLowerCase().includes(term);
      const groupMatch =
        !groupTerm || item.groupName?.toLowerCase().includes(groupTerm);
      return textMatch && groupMatch;
    });
  }, [search, groupFilter, reservationsQuery.data]);

  const handleSubmit = async (values) => {
    const editingId = editingReservation?._id || editingReservation?.id;
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, payload: values });
      return;
    }
    await createMutation.mutateAsync(values);
  };

  const columns = [
    { title: 'Res No', dataIndex: 'resNo', key: 'resNo', width: 130, render: (v) => v || '-' },
    { title: 'Guest', dataIndex: 'clientName', key: 'clientName', render: (v) => v || '-' },
    { title: 'Group', dataIndex: 'groupName', key: 'groupName', render: (v) => v || '-' },
    { title: 'Room', dataIndex: 'roomId', key: 'roomId', width: 100, render: (v) => v || '-' },
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
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_, record) => {
        const isCanceled = record.status?.toLowerCase().includes('cancel');
        return (
          <Space size="small">
            <Button
              size="small"
              disabled={isCanceled}
              onClick={() => {
                setEditingReservation(record);
                setDrawerOpen(true);
              }}
            >
              Edit
            </Button>
            {!isCanceled && (
              <Popconfirm
                title="Cancel this reservation?"
                description="This will mark the reservation as Cancelled."
                okText="Yes, Cancel"
                okType="danger"
                onConfirm={() => cancelMutation.mutate(record.id || record._id)}
              >
                <Button size="small" danger icon={<StopOutlined />} loading={cancelMutation.isPending}>
                  Cancel
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0, marginBottom: 4 }}>My Reservations</Title>
          <Text type="secondary" style={{ display: 'block' }}>
            Reservations made for your company
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingReservation(null);
            setDrawerOpen(true);
          }}
        >
          New Reservation
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search guest or reservation no"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
          allowClear
        />
        <Input
          placeholder="Filter by group name"
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          style={{ width: 200 }}
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
        scroll={{ x: 900 }}
      />

      <ReservationFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingReservation(null);
        }}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        initialValues={editingReservation}
        rooms={roomsQuery.data}
        clients={clients}
        companies={companiesQuery.data}
        isPortalUser
      />
    </div>
  );
}

export default PortalReservationsPage;
