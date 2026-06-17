import { Card, Descriptions, Tag, Typography } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import useAuthStore, { selectCurrentClient, selectCurrentUser, selectLinkedClientNo } from '../../store/authStore.js';

const { Title, Text } = Typography;

function PortalClientsPage() {
  const currentUser = useAuthStore(selectCurrentUser);
  const currentClient = useAuthStore(selectCurrentClient);
  const linkedClientNo = useAuthStore(selectLinkedClientNo);

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>My Client Record</Title>
        <Text type="secondary">Your client account details (read-only).</Text>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: '#52c41a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TeamOutlined style={{ fontSize: 28, color: '#fff' }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 18, display: 'block' }}>
              {currentClient?.clientName || linkedClientNo}
            </Text>
            <Tag color="blue">{currentClient?.clientNo || linkedClientNo}</Tag>
          </div>
        </div>

        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Client No">{currentClient?.clientNo || '—'}</Descriptions.Item>
          <Descriptions.Item label="Client Name">{currentClient?.clientName || '—'}</Descriptions.Item>
          <Descriptions.Item label="Linked User">{currentUser?.fullName || currentUser?.username || '—'}</Descriptions.Item>
          <Descriptions.Item label="Your Client No">{linkedClientNo || '—'}</Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 16, padding: '10px 12px', background: '#f6ffed', borderRadius: 6, border: '1px solid #b7eb8f' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            This is a read-only view of your client record. To update client details, contact your administrator.
          </Text>
        </div>
      </Card>
    </div>
  );
}

export default PortalClientsPage;
