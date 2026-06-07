import { DatePicker, Select } from 'antd';
import FilterBar, { FilterBarItem } from '../common/FilterBar.jsx';

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Assigned', value: 'Assigned' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Incomplete', value: 'Incomplete' },
  { label: 'Canceled', value: 'Canceled' },
];

function HousekeepingFilters({
  date,
  housekeeperId,
  statusFilter,
  users,
  onDateChange,
  onHousekeeperChange,
  onStatusChange,
}) {
  return (
    <FilterBar>
      <FilterBarItem>
        <DatePicker className="full-width" value={date} onChange={onDateChange} />
      </FilterBarItem>
      <FilterBarItem>
        <Select
          allowClear
          showSearch
          placeholder="Housekeeper"
          value={housekeeperId}
          onChange={onHousekeeperChange}
          options={(users || []).map((user) => ({
            label: user.fullName || user.username,
            value: user._id,
          }))}
        />
      </FilterBarItem>
      <FilterBarItem>
        <Select
          allowClear
          placeholder="Status"
          value={statusFilter}
          onChange={onStatusChange}
          options={STATUS_OPTIONS}
        />
      </FilterBarItem>
    </FilterBar>
  );
}

export default HousekeepingFilters;
