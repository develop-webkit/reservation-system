import { useState } from 'react';
import { Button, Col, Input, Row, Tag, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCreateClientStaff } from '../../hooks/useClientStaff.js';

const { Text } = Typography;

const EMPTY_MEMBER_FORM = { fullName: '', jobTitle: '', phone: '', email: '' };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function MembersEditor({ members, onChange, linkedClientNo }) {
  const [newMember, setNewMember] = useState(EMPTY_MEMBER_FORM);
  const createStaff = useCreateClientStaff();

  const noClientSelected = !linkedClientNo;

  const handleFieldChange = (field) => (e) => {
    setNewMember((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddMember = () => {
    const fullName = newMember.fullName.trim();
    if (!fullName) {
      message.error('Member name is required.');
      return;
    }
    if (newMember.email.trim() && !EMAIL_REGEX.test(newMember.email.trim())) {
      message.error('Please enter a valid email address.');
      return;
    }

    const payload = {
      fullName,
      linkedClientNo,
      ...(newMember.jobTitle.trim() && { jobTitle: newMember.jobTitle.trim() }),
      ...(newMember.phone.trim() && { phone: newMember.phone.trim() }),
      ...(newMember.email.trim() && { email: newMember.email.trim() }),
    };

    createStaff.mutate(payload, {
      onSuccess: (createdStaff) => {
        onChange([...members, createdStaff]);
        setNewMember(EMPTY_MEMBER_FORM);
        message.success(`${fullName} added to group`);
      },
      onError: (err) => message.error(err.response?.data?.message || 'Failed to add member'),
    });
  };

  const handleRemove = (staffId) => {
    onChange(members.filter((m) => m._id?.toString() !== staffId));
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ fontSize: 13 }}>Members</Text>
      </div>

      {noClientSelected ? (
        <Text type="secondary" style={{ fontSize: 12 }}>
          Select a client first to add members.
        </Text>
      ) : (
        <Row gutter={8} style={{ marginBottom: 12 }}>
          <Col span={7}>
            <Input
              placeholder="Full name *"
              value={newMember.fullName}
              onChange={handleFieldChange('fullName')}
              onPressEnter={handleAddMember}
            />
          </Col>
          <Col span={5}>
            <Input
              placeholder="Job title"
              value={newMember.jobTitle}
              onChange={handleFieldChange('jobTitle')}
              onPressEnter={handleAddMember}
            />
          </Col>
          <Col span={5}>
            <Input
              placeholder="Phone"
              value={newMember.phone}
              onChange={handleFieldChange('phone')}
              onPressEnter={handleAddMember}
            />
          </Col>
          <Col span={5}>
            <Input
              placeholder="Email"
              value={newMember.email}
              onChange={handleFieldChange('email')}
              onPressEnter={handleAddMember}
            />
          </Col>
          <Col span={2}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddMember}
              loading={createStaff.isPending}
              disabled={createStaff.isPending}
              block
            />
          </Col>
        </Row>
      )}

      {members.length === 0 ? (
        <Text type="secondary" style={{ fontSize: 12 }}>
          No members yet. Add a member above.
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
