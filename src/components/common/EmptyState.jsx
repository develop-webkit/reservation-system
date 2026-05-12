import { Empty } from 'antd';

function EmptyState({ description }) {
  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />;
}

export default EmptyState;
