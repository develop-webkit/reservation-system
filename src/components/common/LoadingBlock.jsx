import { Card, Skeleton } from 'antd';

function LoadingBlock({ rows = 6 }) {
  return (
    <Card>
      <Skeleton active paragraph={{ rows }} />
    </Card>
  );
}

export default LoadingBlock;
