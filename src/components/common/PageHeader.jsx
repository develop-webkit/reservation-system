import { Button, Space, Typography } from 'antd';

function PageHeader({ title, subtitle, actionLabel, onActionClick, extra }) {
  return (
    <div className="page-header">
      <div>
        <Typography.Title level={2} className="page-title">
          {title}
        </Typography.Title>
        <Typography.Paragraph className="page-subtitle">
          {subtitle}
        </Typography.Paragraph>
      </div>
      <Space>
        {extra}
        {actionLabel ? (
          <Button type="primary" onClick={onActionClick}>
            {actionLabel}
          </Button>
        ) : null}
      </Space>
    </div>
  );
}

export default PageHeader;
