import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="The page you requested does not exist in this MMV workspace."
      extra={
        <Button type="primary">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      }
    />
  );
}

export default NotFoundPage;
