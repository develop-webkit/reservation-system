import { Button, Input, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

const EMPTY_MEMBER = { name: '', phone: '', email: '' };

function MembersEditor({ members, onChange }) {
  const add = () => onChange([...members, { ...EMPTY_MEMBER }]);

  const update = (index, field, value) => {
    const updated = members.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    onChange(updated);
  };

  const remove = (index) => onChange(members.filter((_, i) => i !== index));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text strong style={{ fontSize: 13 }}>Members</Text>
        <Button size="small" icon={<PlusOutlined />} onClick={add}>Add Member</Button>
      </div>

      {members.length === 0 && (
        <Text type="secondary" style={{ fontSize: 12 }}>
          No members yet. Click &quot;Add Member&quot; to add your first group member.
        </Text>
      )}

      {members.map((member, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: 8,
            marginBottom: 8,
            alignItems: 'center',
          }}
        >
          <Input
            placeholder="Full name *"
            value={member.name}
            onChange={(e) => update(index, 'name', e.target.value)}
            size="small"
          />
          <Input
            placeholder="Phone"
            value={member.phone}
            onChange={(e) => update(index, 'phone', e.target.value)}
            size="small"
          />
          <Input
            placeholder="Email"
            value={member.email}
            onChange={(e) => update(index, 'email', e.target.value)}
            size="small"
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => remove(index)}
          />
        </div>
      ))}
    </div>
  );
}

export default MembersEditor;
