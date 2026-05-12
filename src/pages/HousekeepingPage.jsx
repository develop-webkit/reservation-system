import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { allocateHousekeeping, completeHousekeepingTask } from '../api/services/housekeeping.js';
import AllocateDrawer from '../components/housekeeping/AllocateDrawer.jsx';
import AssignmentTable from '../components/housekeeping/AssignmentTable.jsx';
import HousekeepingFilters from '../components/housekeeping/HousekeepingFilters.jsx';
import RosterList from '../components/housekeeping/RosterList.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import { queryKeys } from '../constants/queryKeys.js';
import { useAppMutation } from '../hooks/useAppMutation.js';
import { useHousekeepingAssignmentsQuery } from '../hooks/useHousekeepingAssignmentsQuery.js';
import { useHousekeepingRosterQuery } from '../hooks/useHousekeepingRosterQuery.js';
import { useRoomsQuery } from '../hooks/useRoomsQuery.js';
import { useTasksQuery } from '../hooks/useTasksQuery.js';
import { useUsersQuery } from '../hooks/useUsersQuery.js';

function HousekeepingPage() {
  const queryClient = useQueryClient();
  const [allocateOpen, setAllocateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [housekeeperId, setHousekeeperId] = useState(undefined);
  const usersQuery = useUsersQuery({});
  const roomsQuery = useRoomsQuery();
  const tasksQuery = useTasksQuery();
  const rosterQuery = useHousekeepingRosterQuery(selectedDate.format('YYYY-MM-DD'));
  const assignmentsQuery = useHousekeepingAssignmentsQuery({
    date: selectedDate.format('YYYY-MM-DD'),
    housekeeperId,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['housekeeping'] });
    queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    queryClient.invalidateQueries({ queryKey: queryKeys.rooms });
  };

  const allocateMutation = useAppMutation({
    mutationFn: (payload) =>
      allocateHousekeeping({
        ...payload,
        date: payload.date.format('YYYY-MM-DD'),
      }),
    successMessage: 'Housekeeping allocated successfully.',
    onSuccess: () => {
      refresh();
      setAllocateOpen(false);
    },
  });

  const completeMutation = useAppMutation({
    mutationFn: ({ id }) => completeHousekeepingTask(id, { status: 'Completed' }),
    successMessage: 'Task marked complete and room status refreshed.',
    onSuccess: refresh,
  });

  return (
    <div className="page-stack">
      <PageHeader
        title="Housekeeping"
        subtitle="Review dirty-room work, allocate tasks to housekeepers, and complete cleaning tasks directly from the operational flow."
        actionLabel="Allocate tasks"
        onActionClick={() => setAllocateOpen(true)}
      />
      <SectionCard title="Assignment filters">
        <HousekeepingFilters
          date={selectedDate}
          housekeeperId={housekeeperId}
          users={usersQuery.data}
          onDateChange={(value) => setSelectedDate(value || dayjs())}
          onHousekeeperChange={setHousekeeperId}
        />
      </SectionCard>
      <SectionCard title="Roster view">
        <RosterList data={rosterQuery.data} loading={rosterQuery.isLoading} />
      </SectionCard>
      <SectionCard title="Allocated assignments">
        <AssignmentTable
          data={assignmentsQuery.data || []}
          loading={assignmentsQuery.isLoading}
          onComplete={(record) => completeMutation.mutate({ id: record._id })}
        />
      </SectionCard>
      <AllocateDrawer
        open={allocateOpen}
        onClose={() => setAllocateOpen(false)}
        onSubmit={(values) => allocateMutation.mutate(values)}
        loading={allocateMutation.isPending}
        users={usersQuery.data}
        rooms={roomsQuery.data}
        tasks={tasksQuery.data}
      />
    </div>
  );
}

export default HousekeepingPage;
