import { DatePicker, Input, Select, Switch } from 'antd';
import FilterBar, { FilterBarItem } from '../common/FilterBar.jsx';
import { bookingStatuses } from '../../constants/statuses.js';

function BookingsFilters({ filters, onChange, rooms }) {
  return (
    <FilterBar>
      <FilterBarItem>
        <Input
          placeholder="Search guest"
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
        />
      </FilterBarItem>
      <FilterBarItem>
        <Select
          allowClear
          placeholder="Status"
          value={filters.status}
          onChange={(value) => onChange('status', value)}
          options={bookingStatuses.map((status) => ({ label: status, value: status }))}
        />
      </FilterBarItem>
      <FilterBarItem>
        <Select
          allowClear
          showSearch
          placeholder="Room"
          value={filters.roomId}
          onChange={(value) => onChange('roomId', value)}
          options={(rooms || []).map((room) => ({ label: room.name, value: room._id }))}
        />
      </FilterBarItem>
      <FilterBarItem>
        <DatePicker.RangePicker
          className="full-width"
          value={filters.range}
          onChange={(value) => onChange('range', value)}
        />
      </FilterBarItem>
      <FilterBarItem span={4}>
        <div className="switch-field">
          <span>Show canceled</span>
          <Switch
            checked={filters.showCanceled}
            onChange={(value) => onChange('showCanceled', value)}
          />
        </div>
      </FilterBarItem>
      <FilterBarItem span={4}>
        <div className="switch-field">
          <span>Show parked</span>
          <Switch
            checked={filters.showParked}
            onChange={(value) => onChange('showParked', value)}
          />
        </div>
      </FilterBarItem>
    </FilterBar>
  );
}

export default BookingsFilters;
