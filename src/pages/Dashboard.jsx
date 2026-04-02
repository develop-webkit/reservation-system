// src/pages/Dashboard.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    fetchQuickCounts,
    fetchActivityFeed,
    fetchUpcomingTasks,
    fetchOccupancyChart
} from '../api/dashboardApi';
import {
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    Alert,
    Space,
    Flex,
    Tag,
    Progress,
    Divider,
    Empty
} from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    UserAddOutlined,
    CheckOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRooms } from '../hooks/useRooms';
import { useBookings } from '../hooks/useBookings';

const { Title, Text } = Typography;

// --- 1. Quick Counts Widget Component ---
const QuickCounts = ({ bookingsData, roomsData, isLoading }) => {
    const [counts, setCounts] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const calculateCounts = async () => {
            try {
                if (bookingsData && roomsData) {
                    const result = await fetchQuickCounts(bookingsData, roomsData);
                    setCounts(result);
                }
            } catch (err) {
                setError(err);
                console.error('Error calculating counts:', err);
            }
        };
        calculateCounts();
    }, [bookingsData, roomsData]);

    if (isLoading || !counts) return null;
    if (error) return <Alert message="Error loading counts" description={error.message} type="error" showIcon />;

    return (
        <Row gutter={16}>
            <Col span={6}>
                <Card variant="borderless">
                    <Statistic
                        title="Occupied Rooms"
                        value={counts.roomsOccupied}
                        suffix={`/ ${counts.roomsOccupied + counts.roomsAvailable}`}
                        prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card variant="borderless">
                    <Statistic
                        title="Arrivals Today"
                        value={counts.arrivalsToday}
                        styles={{ value: { color: '#3f8600' } }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card variant="borderless">
                    <Statistic
                        title="Departures Today"
                        value={counts.departuresToday}
                        styles={{ value: { color: '#cf1322' } }}
                        prefix={<ArrowDownOutlined />}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card variant="borderless">
                    <Statistic
                        title="Rooms Available"
                        value={counts.roomsAvailable}
                        styles={{ value: { color: '#1890ff' } }}
                        prefix={<UserAddOutlined />}
                    />
                </Card>
            </Col>
        </Row>
    );
};

// --- 3. Recent Activity Feed Component ---
const ActivityFeed = ({ bookingsData, isLoading }) => {
    const [activities, setActivities] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchActivities = async () => {
            try {
                if (bookingsData) {
                    const result = await fetchActivityFeed(bookingsData);
                    setActivities(result);
                }
            } catch (err) {
                setError(err);
                console.error('Error fetching activities:', err);
            }
        };
        fetchActivities();
    }, [bookingsData]);

    if (isLoading || !activities) return null;
    if (error) return <Alert message="Error loading feed" description={error.message} type="error" showIcon />;
    if (activities.length === 0) return <Card title="Today's Activity"><Empty description="No activity today" /></Card>;

    return (
        <Card title="Today's Activity" variant="borderless" style={{ height: '100%' }}>
            <Flex vertical gap="middle">
                {activities.map((item, index) => (
                    <div key={item.id}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Space>
                                <Tag color={item.type === 'Arrival' ? 'green' : 'red'}>
                                    {item.type}
                                </Tag>
                                <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                                    <ClockCircleOutlined /> {item.time}
                                </Text>
                            </Space>
                            <Text>{item.guest} {item.room && <Tag>{item.room}</Tag>}</Text>
                        </Space>
                        {index < activities.length - 1 && <Divider style={{ margin: '12px 0' }} />}
                    </div>
                ))}
            </Flex>
        </Card>
    );
};

// --- 4. Upcoming Tasks Component ---
const UpcomingTasks = ({ roomsData, bookingsData, isLoading }) => {
    const [tasks, setTasks] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchTasks = async () => {
            try {
                if (roomsData) {
                    const result = await fetchUpcomingTasks(roomsData, bookingsData);
                    setTasks(result);
                }
            } catch (err) {
                setError(err);
                console.error('Error fetching tasks:', err);
            }
        };
        fetchTasks();
    }, [roomsData, bookingsData]);

    if (isLoading || !tasks) return null;
    if (error) return <Alert message="Error loading tasks" description={error.message} type="error" showIcon />;
    if (tasks.length === 0) return <Card title="Housekeeping Tasks"><Empty description="No pending tasks" /></Card>;

    return (
        <Card title="Housekeeping Tasks" variant="borderless" style={{ height: '100%' }}>
            <Flex vertical gap="middle">
                {tasks.map((task, index) => (
                    <div key={task.id}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Space>
                                <Tag color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'blue'}>
                                    {task.priority.toUpperCase()}
                                </Tag>
                                <Text strong>{task.task}</Text>
                            </Space>
                            <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                                <ClockCircleOutlined /> {task.dueTime}
                            </Text>
                        </Space>
                        {index < tasks.length - 1 && <Divider style={{ margin: '12px 0' }} />}
                    </div>
                ))}
            </Flex>
        </Card>
    );
};

// --- 5. Occupancy Chart Component ---
const OccupancyChart = ({ bookingsData, roomsData, isLoading }) => {
    const [chartData, setChartData] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const calculateOccupancy = async () => {
            try {
                if (bookingsData && roomsData) {
                    const result = await fetchOccupancyChart(bookingsData, roomsData);
                    setChartData(result);
                }
            } catch (err) {
                setError(err);
                console.error('Error calculating occupancy:', err);
            }
        };
        calculateOccupancy();
    }, [bookingsData, roomsData]);

    if (isLoading || !chartData) return null;
    if (error) return <Alert message="Error loading chart data" description={error.message} type="error" showIcon />;
    if (!chartData || chartData.length === 0) return <Card><Empty description="No occupancy data" /></Card>;

    return (
        <Card title="6-Month Occupancy Trend" variant="borderless" style={{ height: '100%' }}>
            <Flex vertical gap="large">
                {chartData.map((item, index) => (
                    <div key={index}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                                <Text strong>{item.month}</Text>
                                <Text>{item.occupancy}%</Text>
                            </Space>
                            <Progress
                                percent={item.occupancy}
                                strokeColor={item.occupancy >= 90 ? '#52c41a' : item.occupancy >= 75 ? '#1890ff' : '#faad14'}
                                size="small"
                            />
                        </Space>
                    </div>
                ))}
            </Flex>
        </Card>
    );
};

// --- Main Dashboard Component ---
const Dashboard = () => {
    // Fetch real data from the system
    const { data: roomsData, isLoading: roomsLoading } = useRooms();
    const { data: bookingsData, isLoading: bookingsLoading } = useBookings();

    // Normalize data
    const normalizedRooms = React.useMemo(() => {
        if (!roomsData) return [];
        return Array.isArray(roomsData) ? roomsData : (roomsData.data || roomsData.rooms || []);
    }, [roomsData]);

    const normalizedBookings = React.useMemo(() => {
        if (!bookingsData) return [];
        return Array.isArray(bookingsData) ? bookingsData : (bookingsData.data || bookingsData.bookings || []);
    }, [bookingsData]);

    const isLoading = roomsLoading || bookingsLoading;

    return (
        <Space orientation="vertical" size="large" style={{ display: 'flex', padding: '0' }}>
            {/* Header */}
            <div>
                <Title level={2} style={{ margin: '0 0 8px 0' }}>Dashboard</Title>
                <Text type="secondary">Welcome back! Here's an overview of your hotel operations.</Text>
            </div>

            {/* Row 1: Quick Count Statistics */}
            <div>
                <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '12px' }}>Room Status</Text>
                <QuickCounts bookingsData={normalizedBookings} roomsData={normalizedRooms} isLoading={isLoading} />
            </div>

            {/* Row 2: Recent Activity, Tasks, and Room Status */}
            <Row gutter={16}>
                <Col span={8}>
                    <ActivityFeed bookingsData={normalizedBookings} isLoading={isLoading} />
                </Col>
                <Col span={8}>
                    <UpcomingTasks roomsData={normalizedRooms} bookingsData={normalizedBookings} isLoading={isLoading} />
                </Col>
                <Col span={8}>
                    <Card title="Room Status Summary" variant="borderless" style={{ height: '100%' }}>
                        <Flex vertical gap="small">
                            {['Clean', 'Dirty', 'Occupied', 'OutOfOrder'].map(status => {
                                const count = normalizedRooms.filter(r => r.status === status).length;
                                return (
                                    <div key={status}>
                                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                            <Text>{status}</Text>
                                            <Tag color={
                                                status === 'Clean' ? 'green' :
                                                status === 'Dirty' ? 'orange' :
                                                status === 'Occupied' ? 'blue' : 'red'
                                            }>
                                                {count}
                                            </Tag>
                                        </Space>
                                    </div>
                                );
                            })}
                        </Flex>
                    </Card>
                </Col>
            </Row>

            {/* Row 4: Occupancy Trend */}
            <Row gutter={16}>
                <Col span={24}>
                    <OccupancyChart bookingsData={normalizedBookings} roomsData={normalizedRooms} isLoading={isLoading} />
                </Col>
            </Row>
        </Space>
    );
};

export default Dashboard;
