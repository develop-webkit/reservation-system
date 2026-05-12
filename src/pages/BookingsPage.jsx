import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { updateBookingStatus } from '../api/services/bookings.js';
import BookingStatusModal from '../components/bookings/BookingStatusModal.jsx';
import BookingsFilters from '../components/bookings/BookingsFilters.jsx';
import BookingsTable from '../components/bookings/BookingsTable.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import { queryKeys } from '../constants/queryKeys.js';
import { useAppMutation } from '../hooks/useAppMutation.js';
import { useBookingsQuery } from '../hooks/useBookingsQuery.js';
import { useRoomsQuery } from '../hooks/useRoomsQuery.js';

function BookingsPage() {
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    roomId: undefined,
    status: undefined,
    range: null,
    showCanceled: false,
    showParked: false,
  });

  const bookingsQuery = useBookingsQuery({
    roomId: filters.roomId,
    status: filters.status,
    showCanceled: filters.showCanceled,
    showParked: filters.showParked,
  });
  const roomsQuery = useRoomsQuery();

  const statusMutation = useAppMutation({
    mutationFn: ({ id, payload }) => updateBookingStatus(id, payload),
    successMessage: 'Booking status updated successfully.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      setSelectedBooking(null);
    },
  });

  const filteredBookings = useMemo(() => {
    return (bookingsQuery.data || []).filter((booking) => {
      const searchValue = filters.search.trim().toLowerCase();
      const searchMatch = !searchValue || booking.guestName?.toLowerCase().includes(searchValue);
      const rangeMatch =
        !filters.range ||
        !filters.range[0] ||
        (dayjs(booking.startDate).isAfter(filters.range[0].startOf('day')) &&
          dayjs(booking.endDate).isBefore(filters.range[1].endOf('day')));

      return searchMatch && rangeMatch;
    });
  }, [bookingsQuery.data, filters]);

  return (
    <div className="page-stack">
      <PageHeader
        title="Bookings"
        subtitle="Use operational booking data for room occupancy, status control, and checkout-driven housekeeping."
      />
      <SectionCard title="Booking filters">
        <BookingsFilters
          filters={filters}
          onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
          rooms={roomsQuery.data}
        />
      </SectionCard>
      <SectionCard title="Booking list">
        <BookingsTable
          data={filteredBookings}
          loading={bookingsQuery.isLoading}
          onStatusClick={setSelectedBooking}
        />
      </SectionCard>
      <BookingStatusModal
        open={Boolean(selectedBooking)}
        booking={selectedBooking}
        onCancel={() => setSelectedBooking(null)}
        onSubmit={(values) =>
          statusMutation.mutateAsync({ id: selectedBooking._id, payload: values })
        }
        loading={statusMutation.isPending}
      />
    </div>
  );
}

export default BookingsPage;
