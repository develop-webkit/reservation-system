import { Button, Select, Space, Typography } from 'antd';

const TASK_STATUS_OPTIONS = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Assigned', value: 'Assigned' },
  { label: 'Incomplete', value: 'Incomplete' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Canceled', value: 'Canceled' },
];

function BulkActionBar({
  selectedCount,
  onClear,
  onMarkCompleted,
  onChangeStatus,
  onAssignStaff,
  users,
  loading,
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="bulk-action-bar">
      <Space>
        <Typography.Text strong>{selectedCount} selected</Typography.Text>
        <Button size="small" type="link" onClick={onClear}>
          Clear
        </Button>
      </Space>
      <Space>
        <Button
          type="primary"
          size="small"
          loading={loading}
          onClick={onMarkCompleted}
        >
          Mark Completed
        </Button>
        <Select
          size="small"
          placeholder="Change status"
          style={{ width: 150 }}
          value={null}
          onChange={(val) => onChangeStatus(val)}
          options={TASK_STATUS_OPTIONS}
          disabled={loading}
        />
        {onAssignStaff && users?.length > 0 && (
          <Select
            size="small"
            placeholder="Assign staff"
            style={{ width: 160 }}
            value={null}
            showSearch
            optionFilterProp="label"
            onChange={(val) => onAssignStaff(val)}
            options={(users || []).map((u) => ({
              label: u.fullName || u.username,
              value: u._id,
            }))}
            disabled={loading}
          />
        )}
      </Space>
    </div>
  );
}

export default BulkActionBar;
