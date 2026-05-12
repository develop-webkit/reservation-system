import { Card } from 'antd';

function SectionCard({ title, extra, children }) {
  return (
    <Card title={title} extra={extra} className="section-card">
      {children}
    </Card>
  );
}

export default SectionCard;
