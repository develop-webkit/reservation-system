import { useMemo, useState } from 'react';
import { Alert, Card, Col, Input, Row, Spin, Tag, Tooltip, Typography } from 'antd';
import { AppstoreOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons';
import { useRoomsQuery } from '../../hooks/useRoomsQuery.js';

const { Title, Text } = Typography;

const TYPE_COLORS = {
  Standard: 'blue',
  Deluxe: 'purple',
  Suite: 'gold',
  Family: 'green',
  Twin: 'cyan',
};

function RoomCard({ room }) {
  const featureList = Array.isArray(room.features)
    ? room.features
    : typeof room.features === 'string'
    ? room.features.split(',').map((f) => f.trim()).filter(Boolean)
    : [];

  return (
    <Card size="small" style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <Text strong style={{ fontSize: 15 }}>{room.name || room.roomNo || 'Room'}</Text>
        {room.type && (
          <Tag color={TYPE_COLORS[room.type] || 'default'}>{room.type}</Tag>
        )}
      </div>

      {room.capacity && (
        <div style={{ marginBottom: 6, color: '#595959' }}>
          <TeamOutlined style={{ marginRight: 6 }} />
          <Text type="secondary">Capacity: </Text>
          <Text>{room.capacity} guest{room.capacity !== 1 ? 's' : ''}</Text>
        </div>
      )}

      {room.area && (
        <div style={{ marginBottom: 6, color: '#595959' }}>
          <Text type="secondary">Area: </Text>
          <Text>{room.area}</Text>
        </div>
      )}

      {featureList.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {featureList.map((f) => (
            <Tag key={f} style={{ marginBottom: 4 }}>{f}</Tag>
          ))}
        </div>
      )}
    </Card>
  );
}

function PortalRoomAvailabilityPage() {
  const [search, setSearch] = useState('');
  const { data: roomsRaw, isLoading, error } = useRoomsQuery();

  const rooms = useMemo(() => {
    const list = Array.isArray(roomsRaw) ? roomsRaw : (roomsRaw?.data || []);
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (r) =>
        r.name?.toLowerCase().includes(term) ||
        r.roomNo?.toLowerCase().includes(term) ||
        r.type?.toLowerCase().includes(term) ||
        r.area?.toLowerCase().includes(term),
    );
  }, [roomsRaw, search]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message="Failed to load room information" showIcon style={{ margin: 24 }} />;
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0, marginBottom: 4 }}>
          <AppstoreOutlined style={{ marginRight: 8 }} />
          Room Availability
        </Title>
        <Text type="secondary">
          Browse available room categories, capacity, and features.
        </Text>
      </div>

      <Input
        placeholder="Search by room name, type, or area"
        prefix={<SearchOutlined />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        style={{ maxWidth: 320, marginBottom: 20 }}
      />

      {rooms.length === 0 ? (
        <Alert type="info" message="No rooms match your search." showIcon />
      ) : (
        <Row gutter={[16, 16]}>
          {rooms.map((room) => (
            <Col key={room._id || room.id} xs={24} sm={12} md={8} lg={6}>
              <RoomCard room={room} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default PortalRoomAvailabilityPage;
