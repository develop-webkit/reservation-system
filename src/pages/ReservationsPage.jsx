import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { createReservation, deleteReservation, updateReservation } from '../api/services/reservations.js';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import ReservationFilters from '../components/reservations/ReservationFilters.jsx';
import ReservationFormDrawer from '../components/reservations/ReservationFormDrawer.jsx';
import ReservationTable from '../components/reservations/ReservationTable.jsx';
import { queryKeys } from '../constants/queryKeys.js';
import { useAppMutation } from '../hooks/useAppMutation.js';
import { useClientsQuery } from '../hooks/useClientsQuery.js';
import { useCompaniesQuery } from '../hooks/useCompaniesQuery.js';
import { useReservationsQuery } from '../hooks/useReservationsQuery.js';
import { useRoomsQuery } from '../hooks/useRoomsQuery.js';

function ReservationsPage() {
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: undefined,
    clientId: undefined,
    range: null,
  });

  const reservationsQuery = useReservationsQuery({
    status: filters.status,
    clientId: filters.clientId,
  });
  const clientsQuery = useClientsQuery({});
  const roomsQuery = useRoomsQuery();
  const companiesQuery = useCompaniesQuery();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.reservations });
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
    // Invalidate all booking chart queries (they use dynamic params so invalidate by prefix)
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
  const deleteMutation = useAppMutation({
    mutationFn: deleteReservation,
    successMessage: 'Reservation deleted successfully.',
    onSuccess: invalidateAll,
  });

  const filteredReservations = useMemo(() => {
    const source = reservationsQuery.data || [];

    return source.filter((item) => {
      const searchValue = filters.search.trim().toLowerCase();
      const textMatch =
        !searchValue ||
        item.guestName?.toLowerCase().includes(searchValue) ||
        item.resNo?.toLowerCase().includes(searchValue);
      const rangeMatch =
        !filters.range ||
        !filters.range[0] ||
        (dayjs(item.checkIn).isAfter(filters.range[0].startOf('day')) &&
          dayjs(item.checkOut).isBefore(filters.range[1].endOf('day')));

      return textMatch && rangeMatch;
    });
  }, [filters, reservationsQuery.data]);

  const handleSubmit = async (values) => {
    const editingId = editingReservation?._id || editingReservation?.id;
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, payload: values });
      return;
    }

    await createMutation.mutateAsync(values);
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Reservations"
        subtitle="Create, edit, and track reservation records while the backend synchronizes bookings and accounting."
        actionLabel="New reservation"
        onActionClick={() => {
          setEditingReservation(null);
          setDrawerOpen(true);
        }}
      />
      <SectionCard title="Reservation filters">
        <ReservationFilters
          filters={filters}
          onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
          clients={clientsQuery.data}
        />
      </SectionCard>
      <SectionCard title="Reservation list">
        <ReservationTable
          data={filteredReservations}
          loading={reservationsQuery.isLoading}
          onEdit={(record) => {
            setEditingReservation(record);
            setDrawerOpen(true);
          }}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </SectionCard>
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
        clients={clientsQuery.data}
        companies={companiesQuery.data}
      />
    </div>
  );
}

export default ReservationsPage;
