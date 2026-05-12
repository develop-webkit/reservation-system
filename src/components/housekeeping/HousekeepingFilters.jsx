import { DatePicker, Select } from 'antd';
import FilterBar, { FilterBarItem } from '../common/FilterBar.jsx';

function HousekeepingFilters({ date, housekeeperId, users, onDateChange, onHousekeeperChange }) {
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
    </FilterBar>
  );
}

export default HousekeepingFilters;
