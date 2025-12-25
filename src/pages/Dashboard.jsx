// src/pages/Dashboard.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query'; // <-- NEW IMPORT
import {
    fetchQuickCounts,
    fetchActivityFeed,
    fetchOccupancyChart
} from '../api/dashboardApi'; // <-- NEW IMPORT
import {
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    Spin,
    Alert,
    Space,
    Table,
    Flex
} from 'antd'; // Ant Design Components
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    UserAddOutlined,
    CheckOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// --- 1. Quick Counts Widget Component ---
const QuickCounts = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['dashboard', 'quickCounts'],
        queryFn: fetchQuickCounts,
        staleTime: 60000, // Data is fresh for 1 minute
    });

    if (isLoading) return <Spin />;
    if (isError) return <Alert message="Error loading counts" description={error.message} type="error" showIcon />;
    if (!data) return null;

    return (
        <Row gutter={16}>
            <Col span={6}>
                <Card variant="borderless">
                    <Statistic
                        title="Occupied Rooms"
                        value={data.roomsOccupied}
                        suffix={`/ ${data.roomsOccupied + data.roomsAvailable}`}
                        prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card variant="borderless">
                    <Statistic
                        title="Arrivals Today"
                        value={data.arrivalsToday}
                        styles={{ value: { color: '#3f8600' } }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card variant="borderless">
                    <Statistic
                        title="Departures Today"
                        value={data.departuresToday}
                        styles={{ value: { color: '#cf1322' } }}
                        prefix={<ArrowDownOutlined />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card variant="borderless">
                    <Statistic
                        title="Rooms Available"
                        value={data.roomsAvailable}
                        styles={{ value: { color: '#1890ff' } }}
                        prefix={<UserAddOutlined />}
                    />
                </Card>
            </Col>
        </Row>
    );
};

// --- 2. Recent Activity Feed Component ---
const ActivityFeed = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['dashboard', 'activityFeed'],
        queryFn: fetchActivityFeed,
        staleTime: 30000, // Data is fresh for 30 seconds
    });

    if (isLoading) return <Spin />;
    if (isError) return <Alert message="Error loading feed" description={error.message} type="error" showIcon />;
    if (!data || data.length === 0) return <Text type="secondary">No recent activity.</Text>;

    return (
        <Card title="Recent Activity" variant="borderless" style={{ height: '100%' }}>
            <Flex vertical gap="small">
                {data.map((item, index) => (
                    <div key={index} style={{ padding: '12px 0', borderBottom: index < data.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                        <Space>
                            <Text strong>{item.type}</Text>
                            <Text type="secondary" style={{ fontSize: '0.8rem' }}>{item.time}</Text>
                        </Space>
                        <div style={{ marginTop: '4px' }}>
                            <Text>
                                {item.guest} {item.room ? `(${item.room})` : ''}
                                {item.notes && <Text type="warning" style={{ marginLeft: 8 }}>- {item.notes}</Text>}
                            </Text>
                        </div>
                    </div>
                ))}
            </Flex>
        </Card>
    );
};

// --- 3. Occupancy Chart (Mock Table) Component ---
const OccupancyChart = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['dashboard', 'occupancyChart'],
        queryFn: fetchOccupancyChart,
        staleTime: Infinity, // Treat as static historical data
    });

    const columns = [
        { title: 'Month', dataIndex: 'month', key: 'month' },
        { title: 'Occupancy (%)', dataIndex: 'occupancy', key: 'occupancy', sorter: (a, b) => a.occupancy - b.occupancy },
    ];

    if (isLoading) return <Spin />;
    if (isError) return <Alert message="Error loading chart data" description={error.message} type="error" showIcon />;
    if (!data) return null;

    return (
        <Card title="Monthly Occupancy Trend (Mock Data)" variant="borderless" style={{ height: '100%' }}>
            {/* In a real app, this would be a chart library like recharts or Nivo */}
            <Table
                dataSource={data}
                columns={columns}
                pagination={false}
                size="small"
                rowKey="month"
            />
        </Card>
    );
};


// --- Main Dashboard Component ---
const Dashboard = () => {
    return (
        <Space orientation="vertical" size="large" style={{ display: 'flex' }}>

            {/* Row 1: Quick Count Statistics */}
            <QuickCounts />

            <Row gutter={16}>
                {/* Row 2: Recent Activity Feed */}
                <Col span={12}>
                    <ActivityFeed />
                </Col>

                {/* Row 3: Occupancy Chart/Table */}
                <Col span={12}>
                    <OccupancyChart />
                </Col>
            </Row>

            <Title level={4}>Reservation Overview</Title>
            <Text type="secondary">
                This is the central view summarizing key system metrics.
                Data for all widgets is now being fetched and managed by TanStack Query.
            </Text>
        </Space>
    );
};

export default Dashboard;