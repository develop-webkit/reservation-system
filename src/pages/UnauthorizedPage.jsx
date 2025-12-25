import React from 'react';
import { Card, Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh'
        }}>
            <Card style={{ maxWidth: 600, width: '100%' }}>
                <Result
                    status="403"
                    title="403"
                    icon={<LockOutlined style={{ fontSize: 72, color: '#ff4d4f' }} />}
                    subTitle="Sorry, you don't have permission to access this page."
                    extra={[
                        <Button type="primary" key="dashboard" onClick={() => navigate('/')}>
                            Back to Dashboard
                        </Button>,
                        <Button key="logout" onClick={() => navigate('/login')}>
                            Switch Account
                        </Button>
                    ]}
                />
            </Card>
        </div>
    );
};

export default UnauthorizedPage;
