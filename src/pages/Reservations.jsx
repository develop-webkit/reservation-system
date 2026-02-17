// src/pages/Reservations.jsx
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query'; // <-- NEW IMPORT
import { fetchReservations } from '../api/reservationApi'; // <-- NEW IMPORT
import {
    Table,
    Card,
    Tag,
    Space,
    Input,
    Button,
    Spin,
    Alert,
    Typography
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// --- Helper to style status tags ---
const getStatusTag = (status) => {
    let color;
    switch (status) {
        case 'Confirmed':
            color = 'green';
            break;
        case 'Arrived':
            color = 'blue';
            break;
        case 'Departed':
            color = 'magenta';
            break;
        case 'Unconfirmed':
            color = 'gold';
            break;
        case 'Pre Check In':
            color = 'cyan';
            break;
        case 'Out of Order':
            color = 'purple';
            break;
        default:
            color = 'default';
    }
    return <Tag color={color}>{status ? status.toUpperCase() : 'UNKNOWN'}</Tag>;
};


const Reservations = () => {
    // --- State for Table Parameters (Drives TanStack Query Key) ---
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [sorter, setSorter] = useState({});
    const [filters, setFilters] = useState({});

    // Convert sorter state for the API function call
    const queryParams = useMemo(() => ({
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
        sortBy: sorter.field || 'id',
        sortOrder: sorter.order || 'ascend',
        filters: filters,
    }), [pagination, sorter, filters]);

    // --- TanStack Query Hook for Fetching Data ---
    const {
        data: response,
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['reservations', queryParams], // Query key changes when params change
        queryFn: () => fetchReservations(queryParams),
        staleTime: 60000, // Data is considered fresh for 1 minute
        keepPreviousData: true, // Keep old data visible during refetches
    });

    // --- Table Change Handler (Updates State -> Reruns Query) ---
    const handleTableChange = (newPagination, newFilters, newSorter) => {
        // Update pagination
        setPagination(newPagination);

        // Update sorter state
        setSorter({
            field: newSorter.field,
            order: newSorter.order, // 'ascend' or 'descend'
        });

        // Update filters state
        setFilters(newFilters);
    };

    // --- Table Column Definitions ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: true, width: 80 },
        { title: 'Guest Name', dataIndex: 'guestName', key: 'guestName', sorter: true },
        {
            title: 'Room',
            key: 'room',
            sorter: true,
            width: 100,
            render: (_, record) => {
                // Handle room object or roomId
                if (record.room && typeof record.room === 'object') {
                    return record.room.name || record.room.id || record.room._id || 'N/A';
                }
                return record.roomNumber || record.roomId || record.room || 'N/A';
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: getStatusTag,
            filters: [ // Mock filters for AntD Table
                { text: 'Confirmed', value: 'Confirmed' },
                { text: 'Arrived', value: 'Arrived' },
                { text: 'Unconfirmed', value: 'Unconfirmed' },
                { text: 'Departed', value: 'Departed' },
            ],
            filterMultiple: false,
            width: 130
        },
        { title: 'Check In', dataIndex: 'checkIn', key: 'checkIn', sorter: true, width: 120 },
        { title: 'Check Out', dataIndex: 'checkOut', key: 'checkOut', sorter: true, width: 120 },
        { title: 'Rate', dataIndex: 'rate', key: 'rate', sorter: true, render: (rate) => `$${rate.toFixed(2)}`, width: 100 },
        { title: 'Source', dataIndex: 'source', key: 'source', sorter: true },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Button size="small" type="link">View</Button>
            ),
            width: 80
        },
    ];

    return (
        <Space direction="vertical" style={{ width: '100%', display: 'flex' }}>
            <Title level={3}>Reservation List</Title>

            <Card
                title={
                    <Space>
                        <Input
                            placeholder="Search reservations..."
                            prefix={<SearchOutlined />}
                            style={{ width: 250 }}
                        />
                        <Button icon={<ReloadOutlined />} onClick={refetch}>
                            {isFetching ? 'Refreshing...' : 'Refresh'}
                        </Button>
                    </Space>
                }
                styles={{ body: { padding: 0 } }} // Remove body padding for table borderless look
                variant="borderless" // Use borderless variant

            >
                {/* Display error message if query failed */}
                {isError && (
                    <Alert
                        message="Error Fetching Data"
                        description={`Could not load reservations: ${error.message}`}
                        type="error"
                        showIcon
                        style={{ margin: 16 }}
                    />
                )}

                {/* Main Data Table */}
                <Table
                    columns={columns}
                    dataSource={response?.reservations || []} // Use fetched data or empty array
                    rowKey="id"
                    loading={isLoading} // AntD table displays loading spinner automatically
                    pagination={{
                        ...pagination,
                        total: response?.totalCount || 0,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '25', '50']
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 'max-content' }} // Ensure horizontal scroll if table exceeds container width
                    size="middle"
                />
            </Card>
            <Text type="secondary">
                This table demonstrates fetching a large dataset with pagination,
                sorting, and filtering managed by TanStack Query.
            </Text>
        </Space>
    );
};

export default Reservations;