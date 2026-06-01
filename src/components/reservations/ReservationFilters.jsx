import { DatePicker, Input, Select } from 'antd';
import FilterBar, { FilterBarItem } from '../common/FilterBar.jsx';
import { STATUS_OPTIONS } from '../../data/options.js';

function ReservationFilters({ filters, onChange, clients }) {
  return (
    <FilterBar>
      <FilterBarItem>
        <Input
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
          placeholder="Search guest or reservation no"
        />
      </FilterBarItem>
      <FilterBarItem>
        <Select
          allowClear
          placeholder="Filter by status"
          value={filters.status}
          onChange={(value) => onChange('status', value)}
          options={STATUS_OPTIONS.map((status) => ({ label: status, value: status }))}
        />
      </FilterBarItem>
      <FilterBarItem>
        <Select
          allowClear
          showSearch
          placeholder="Filter by client"
          value={filters.clientId}
          onChange={(value) => onChange('clientId', value)}
          options={(clients || []).map((client) => ({
            label: `${client.clientNo} - ${client.clientName || client.given || 'Client'}`,
            value: client._id,
          }))}
        />
      </FilterBarItem>
      <FilterBarItem>
        <DatePicker.RangePicker
          value={filters.range}
          onChange={(value) => onChange('range', value)}
          className="full-width"
        />
      </FilterBarItem>
    </FilterBar>
  );
}

export default ReservationFilters;
