import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, message } from 'antd';
import dayjs from 'dayjs';
import { allocateHousekeeping, completeHousekeepingTask } from '../api/services/housekeeping.js';
import AllocateDrawer from '../components/housekeeping/AllocateDrawer.jsx';
import AssignmentTable from '../components/housekeeping/AssignmentTable.jsx';
import HousekeepingFilters from '../components/housekeeping/HousekeepingFilters.jsx';
import RosterList from '../components/housekeeping/RosterList.jsx';
import BulkActionBar from '../components/common/BulkActionBar.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import { queryKeys } from '../constants/queryKeys.js';
import { useAppMutation } from '../hooks/useAppMutation.js';
import { useHousekeepingAssignmentsQuery } from '../hooks/useHousekeepingAssignmentsQuery.js';
import { useHousekeepingRosterQuery } from '../hooks/useHousekeepingRosterQuery.js';
import { useRoomsQuery } from '../hooks/useRoomsQuery.js';
import { useTasksQuery, useBulkUpdateTasks } from '../hooks/useTasksQuery.js';
import { useUsersQuery } from '../hooks/useUsersQuery.js';
import { downloadCsv } from '../utils/exportCsv.js';

const EXPORT_COLUMNS = ['date', 'type', 'room', 'housekeeper', 'status', 'completedAt', 'timeRequired'];
const EXPORT_HEADERS = {
  date: 'Date',
  type: 'Task Type',
  room: 'Room',
  housekeeper: 'Assigned To',
  status: 'Status',
  completedAt: 'Completed At',
  timeRequired: 'Est. Time (min)',
};

function buildExportRows(tasks, date) {
  return tasks.map((task) => ({
    date: date,
    type: task.type || '-',
    room: task.room?.name || '-',
    housekeeper: task.assignedTo?.fullName || task.assignedTo?.username || 'Unassigned',
    status: task.status || '-',
    completedAt: task.completedAt ? dayjs(task.completedAt).format('DD MMM YYYY HH:mm') : '-',
    timeRequired: task.timeRequired ?? '-',
  }));
}

function HousekeepingPage() {
  const queryClient = useQueryClient();
  const [allocateOpen, setAllocateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [housekeeperId, setHousekeeperId] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const usersQuery = useUsersQuery({});
  const roomsQuery = useRoomsQuery();
  const tasksQuery = useTasksQuery();
  const rosterQuery = useHousekeepingRosterQuery(selectedDate.format('YYYY-MM-DD'));
  const assignmentsQuery = useHousekeepingAssignmentsQuery({
    date: selectedDate.format('YYYY-MM-DD'),
    housekeeperId,
  });

  const filteredAssignments = useMemo(() => {
    const all = assignmentsQuery.data || [];
    if (!statusFilter) return all;
    return all.filter((task) => task.status === statusFilter);
  }, [assignmentsQuery.data, statusFilter]);

  const clearSelection = () => setSelectedRowKeys([]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['housekeeping'] });
    queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    queryClient.invalidateQueries({ queryKey: queryKeys.rooms });
  };

  const bulkMutation = useBulkUpdateTasks(() => {
    clearSelection();
    refresh();
  });

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

  const handleBulkUpdate = (updates) => {
    if (selectedRowKeys.length === 0) return;
    bulkMutation.mutate(
      { ids: selectedRowKeys, updates },
      {
        onSuccess: () => message.success(`${selectedRowKeys.length} task(s) updated.`),
        onError: () => message.error('Bulk update failed.'),
      },
    );
  };

  const handleExport = () => {
    const rows = buildExportRows(filteredAssignments, selectedDate.format('DD MMM YYYY'));
    const housekeeper = housekeeperId
      ? (usersQuery.data || []).find((u) => u._id === housekeeperId)?.fullName || 'Staff'
      : 'All';
    const status = statusFilter || 'All';
    const filename = `Housekeeping_${selectedDate.format('YYYY-MM-DD')}_${housekeeper}_${status}`;
    downloadCsv(rows, EXPORT_COLUMNS, EXPORT_HEADERS, filename);
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Housekeeping"
        subtitle="Review dirty-room work, allocate tasks to housekeepers, and complete cleaning tasks directly from the operational flow."
        actionLabel="Allocate tasks"
        onActionClick={() => setAllocateOpen(true)}
        extra={
          <Button onClick={handleExport} disabled={filteredAssignments.length === 0}>
            Export CSV
          </Button>
        }
      />
      <SectionCard title="Assignment filters">
        <HousekeepingFilters
          date={selectedDate}
          housekeeperId={housekeeperId}
          statusFilter={statusFilter}
          users={usersQuery.data}
          onDateChange={(value) => setSelectedDate(value || dayjs())}
          onHousekeeperChange={(val) => { setHousekeeperId(val); clearSelection(); }}
          onStatusChange={(val) => { setStatusFilter(val); clearSelection(); }}
        />
      </SectionCard>
      <SectionCard title="Roster view">
        <RosterList data={rosterQuery.data} loading={rosterQuery.isLoading} />
      </SectionCard>
      <SectionCard title="Allocated assignments">
        <BulkActionBar
          selectedCount={selectedRowKeys.length}
          onClear={clearSelection}
          onMarkCompleted={() => handleBulkUpdate({ status: 'Completed' })}
          onChangeStatus={(status) => handleBulkUpdate({ status })}
          onAssignStaff={(assignedTo) => handleBulkUpdate({ assignedTo })}
          users={usersQuery.data}
          loading={bulkMutation.isPending}
        />
        <AssignmentTable
          data={filteredAssignments}
          loading={assignmentsQuery.isLoading}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
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
