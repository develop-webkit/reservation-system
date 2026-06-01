import { Input, Select } from 'antd';
import FilterBar, { FilterBarItem } from '../common/FilterBar.jsx';

const ROOM_TYPE_OPTIONS = ['ENSUITE', 'STAFF', 'EVENT', 'STUDIO', 'SUITE', 'STANDARD'].map(
  (t) => ({ label: t, value: t }),
);

const CLEAN_STATUS_OPTIONS = [
  { label: 'Clean', value: 'Clean' },
  { label: 'Dirty', value: 'Dirty' },
  { label: 'Inspect', value: 'Inspect' },
];

const SERVICE_STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Out of Service', value: 'out_of_service' },
  { label: 'Out of Order', value: 'out_of_order' },
];

function RoomFilters({ filters, onChange }) {
  return (
    <FilterBar>
      <FilterBarItem span={6}>
        <Input
          allowClear
          placeholder="Search by name or category"
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
        />
      </FilterBarItem>
      <FilterBarItem span={5}>
        <Select
          allowClear
          placeholder="Filter by type"
          value={filters.type}
          onChange={(value) => onChange('type', value)}
          options={ROOM_TYPE_OPTIONS}
          className="full-width"
        />
      </FilterBarItem>
      <FilterBarItem span={5}>
        <Select
          allowClear
          placeholder="Filter by clean status"
          value={filters.cleanStatus}
          onChange={(value) => onChange('cleanStatus', value)}
          options={CLEAN_STATUS_OPTIONS}
          className="full-width"
        />
      </FilterBarItem>
      <FilterBarItem span={5}>
        <Select
          allowClear
          placeholder="Filter by service status"
          value={filters.serviceStatus}
          onChange={(value) => onChange('serviceStatus', value)}
          options={SERVICE_STATUS_OPTIONS}
          className="full-width"
        />
      </FilterBarItem>
    </FilterBar>
  );
}

export default RoomFilters;
