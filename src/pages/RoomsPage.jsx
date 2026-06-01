import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createRoom, deleteRoom, updateRoom } from '../api/services/rooms.js';
import RoomFilters from '../components/rooms/RoomFilters.jsx';
import RoomFormDrawer from '../components/rooms/RoomFormDrawer.jsx';
import RoomsTable from '../components/rooms/RoomsTable.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import { queryKeys } from '../constants/queryKeys.js';
import { useAppMutation } from '../hooks/useAppMutation.js';
import { useRoomsQuery } from '../hooks/useRoomsQuery.js';

const DEFAULT_FILTERS = { search: '', type: undefined, cleanStatus: undefined, serviceStatus: undefined };

function RoomsPage() {
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const roomsQuery = useRoomsQuery();

  const invalidateRooms = () => queryClient.invalidateQueries({ queryKey: queryKeys.rooms });

  const createMutation = useAppMutation({
    mutationFn: createRoom,
    successMessage: 'Room created successfully.',
    onSuccess: () => {
      invalidateRooms();
      setDrawerOpen(false);
    },
  });

  const updateMutation = useAppMutation({
    mutationFn: ({ id, payload }) => updateRoom(id, payload),
    successMessage: 'Room updated successfully.',
    onSuccess: () => {
      invalidateRooms();
      setDrawerOpen(false);
      setEditingRoom(null);
    },
  });

  const deleteMutation = useAppMutation({
    mutationFn: deleteRoom,
    successMessage: 'Room deleted successfully.',
    onSuccess: invalidateRooms,
  });

  const filteredRooms = useMemo(() => {
    const rooms = roomsQuery.data || [];
    const search = filters.search.trim().toLowerCase();

    return rooms.filter((room) => {
      if (search) {
        const nameMatch = room.name?.toLowerCase().includes(search);
        const categoryMatch = room.category?.toLowerCase().includes(search);
        if (!nameMatch && !categoryMatch) return false;
      }

      if (filters.type && room.type !== filters.type) return false;

      if (filters.cleanStatus && (room.status || 'Clean') !== filters.cleanStatus) return false;

      if (filters.serviceStatus) {
        if (filters.serviceStatus === 'out_of_order' && !room.outOfOrder) return false;
        if (filters.serviceStatus === 'out_of_service' && !room.outOfService) return false;
        if (filters.serviceStatus === 'active' && (room.outOfOrder || room.outOfService)) return false;
      }

      return true;
    });
  }, [roomsQuery.data, filters]);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (values) => {
    if (editingRoom?._id) {
      await updateMutation.mutateAsync({ id: editingRoom._id, payload: values });
      return;
    }
    await createMutation.mutateAsync(values);
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Rooms"
        subtitle="Manage room inventory, types, occupancy limits, clean status, and service flags."
        actionLabel="New room"
        onActionClick={() => {
          setEditingRoom(null);
          setDrawerOpen(true);
        }}
      />
      <SectionCard title="Filters">
        <RoomFilters filters={filters} onChange={handleFilterChange} />
      </SectionCard>
      <SectionCard title="Room list">
        <RoomsTable
          data={filteredRooms}
          loading={roomsQuery.isLoading}
          onEdit={(record) => {
            setEditingRoom(record);
            setDrawerOpen(true);
          }}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </SectionCard>
      <RoomFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingRoom(null);
        }}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        initialValues={editingRoom}
      />
    </div>
  );
}

export default RoomsPage;
