import { Input, Select } from 'antd';
import FilterBar, { FilterBarItem } from '../common/FilterBar.jsx';

function AccountingFilters({ filters, onChange }) {
  return (
    <FilterBar>
      <FilterBarItem>
        <Input
          placeholder="Client number"
          value={filters.clientNumber}
          onChange={(event) => onChange('clientNumber', event.target.value)}
        />
      </FilterBarItem>
      <FilterBarItem>
        <Input
          placeholder="Voucher code"
          value={filters.voucherCode}
          onChange={(event) => onChange('voucherCode', event.target.value)}
        />
      </FilterBarItem>
      <FilterBarItem>
        <Input
          placeholder="Reference no"
          value={filters.referenceNo}
          onChange={(event) => onChange('referenceNo', event.target.value)}
        />
      </FilterBarItem>
      <FilterBarItem>
        <Select
          allowClear
          placeholder="Has voucher?"
          value={filters.hasVoucher}
          onChange={(value) => onChange('hasVoucher', value)}
          options={[
            { label: 'Voucher-backed entries', value: 'true' },
            { label: 'Non-voucher entries', value: 'false' },
          ]}
        />
      </FilterBarItem>
    </FilterBar>
  );
}

export default AccountingFilters;
