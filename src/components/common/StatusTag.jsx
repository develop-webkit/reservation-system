import { Tag } from 'antd';

const colorMap = {
  Confirmed: 'green',
  Unconfirmed: 'gold',
  'Checked In': 'blue',
  'Checked Out': 'purple',
  Canceled: 'red',
  Cancelled: 'red',
  Completed: 'green',
  Incomplete: 'gold',
  'In Progress': 'blue',
  Clean: 'green',
  Dirty: 'red',
  Inspect: 'orange',
  Active: 'green',
  Inactive: 'default',
};

function StatusTag({ value }) {
  return <Tag color={colorMap[value] || 'default'}>{value || 'Unknown'}</Tag>;
}

export default StatusTag;
