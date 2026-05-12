import { Card, Statistic } from 'antd';

function StatCard({ title, value, prefix, suffix, color }) {
  return (
    <Card className="stat-card">
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ color }}
      />
    </Card>
  );
}

export default StatCard;
