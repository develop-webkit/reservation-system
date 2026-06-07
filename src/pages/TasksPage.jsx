import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { createTask, updateTask } from '../api/services/tasks.js';
import AvailableTaskTable from '../components/tasks/AvailableTaskTable.jsx';
import TaskFormDrawer from '../components/tasks/TaskFormDrawer.jsx';
import TaskTable from '../components/tasks/TaskTable.jsx';
import BulkActionBar from '../components/common/BulkActionBar.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import { queryKeys } from '../constants/queryKeys.js';
import { useAppMutation } from '../hooks/useAppMutation.js';
import { useAvailableTasksQuery } from '../hooks/useAvailableTasksQuery.js';
import { useRoomsQuery } from '../hooks/useRoomsQuery.js';
import { useTasksQuery, useBulkUpdateTasks } from '../hooks/useTasksQuery.js';
import { useUsersQuery } from '../hooks/useUsersQuery.js';

function TasksPage() {
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const tasksQuery = useTasksQuery();
  const availableQuery = useAvailableTasksQuery({});
  const roomsQuery = useRoomsQuery();
  const usersQuery = useUsersQuery({});

  const clearSelection = () => setSelectedRowKeys([]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
  };

  const bulkMutation = useBulkUpdateTasks(clearSelection);

  const createMutation = useAppMutation({
    mutationFn: createTask,
    successMessage: 'Task created successfully.',
    onSuccess: () => {
      refresh();
      setDrawerOpen(false);
    },
  });

  const updateMutation = useAppMutation({
    mutationFn: ({ id, payload }) => updateTask(id, payload),
    successMessage: 'Task updated successfully.',
    onSuccess: () => {
      refresh();
      setDrawerOpen(false);
      setEditingTask(null);
    },
  });

  const handleSubmit = async (values) => {
    if (editingTask?._id) {
      await updateMutation.mutateAsync({ id: editingTask._id, payload: values });
      return;
    }
    await createMutation.mutateAsync(values);
  };

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

  return (
    <div className="page-stack">
      <PageHeader
        title="Tasks"
        subtitle="Manage standalone operational work and track available housekeeping items from the backend task system."
        actionLabel="Create task"
        onActionClick={() => {
          setEditingTask(null);
          setDrawerOpen(true);
        }}
      />
      <SectionCard title="All tasks">
        <BulkActionBar
          selectedCount={selectedRowKeys.length}
          onClear={clearSelection}
          onMarkCompleted={() => handleBulkUpdate({ status: 'Completed' })}
          onChangeStatus={(status) => handleBulkUpdate({ status })}
          onAssignStaff={(assignedTo) => handleBulkUpdate({ assignedTo })}
          users={usersQuery.data}
          loading={bulkMutation.isPending}
        />
        <TaskTable
          data={tasksQuery.data || []}
          loading={tasksQuery.isLoading}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          onEdit={(record) => {
            setEditingTask(record);
            setDrawerOpen(true);
          }}
        />
      </SectionCard>
      <SectionCard title="Available tasks">
        <AvailableTaskTable data={availableQuery.data || []} loading={availableQuery.isLoading} />
      </SectionCard>
      <TaskFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        rooms={roomsQuery.data}
        users={usersQuery.data}
        initialValues={editingTask}
      />
    </div>
  );
}

export default TasksPage;
