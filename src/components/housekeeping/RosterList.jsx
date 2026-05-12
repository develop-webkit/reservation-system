import { List, Tag } from 'antd';

function RosterList({ data, loading }) {
  return (
    <List
      loading={loading}
      dataSource={data || []}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={item.room?.name || item.name || 'Room'}
            description={item.type || item.status || 'Roster item'}
          />
          <Tag color={item.status === 'Dirty' ? 'red' : 'green'}>{item.status || 'Scheduled'}</Tag>
        </List.Item>
      )}
    />
  );
}

export default RosterList;
