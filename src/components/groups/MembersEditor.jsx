import { Select, Tag, Typography } from 'antd';
import { useClientStaff } from '../../hooks/useClientStaff.js';

const { Text } = Typography;

function MembersEditor({ members, onChange, linkedClientNo }) {
  const { data: staffRaw } = useClientStaff(linkedClientNo);
  const allStaff = Array.isArray(staffRaw) ? staffRaw : (staffRaw?.data || []);

  const selectedIds = new Set(members.map((m) => m._id?.toString()));

  const handleSelect = (staffId) => {
    const staff = allStaff.find((s) => s._id?.toString() === staffId);
    if (!staff || selectedIds.has(staffId)) return;
    onChange([...members, staff]);
  };

  const handleRemove = (staffId) => {
    onChange(members.filter((m) => m._id?.toString() !== staffId));
  };

  const selectOptions = allStaff
    .filter((s) => s.isActive !== false && !selectedIds.has(s._id?.toString()))
    .map((s) => ({
      value: s._id?.toString(),
      label: s.jobTitle ? `${s.fullName} — ${s.jobTitle}` : s.fullName,
    }));

  const isEmpty = !linkedClientNo && allStaff.length === 0;

  return (
    <div>
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong style={{ fontSize: 13 }}>Members</Text>
      </div>

      <Select
        showSearch
        allowClear
        placeholder={isEmpty ? 'Select a client first to see staff members' : 'Search and add staff members...'}
        style={{ width: '100%', marginBottom: 12 }}
        options={selectOptions}
        filterOption={(input, option) =>
          (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
        }
        onSelect={handleSelect}
        value={null}
        disabled={isEmpty}
        notFoundContent={allStaff.length === 0 ? 'No staff members found' : 'No matching staff'}
      />

      {members.length === 0 ? (
        <Text type="secondary" style={{ fontSize: 12 }}>
          No members yet. Search and select staff members above.
        </Text>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {members.map((m) => (
            <Tag
              key={m._id?.toString()}
              closable
              onClose={() => handleRemove(m._id?.toString())}
              style={{ marginBottom: 4, padding: '2px 8px' }}
            >
              {m.fullName}
              {m.jobTitle && (
                <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                  ({m.jobTitle})
                </Text>
              )}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
}

export default MembersEditor;
