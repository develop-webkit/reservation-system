import React, { useState, useMemo } from 'react';
import { DatePicker, Table, Card, Typography, Space, Tag, Alert } from 'antd';
import dayjs from 'dayjs';
import { useBookingChart } from '../hooks/useBookings';
import { useRooms } from '../hooks/useRooms';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const BookingsByDate = () => {
    // Default to past 6 months to ensure we catch recent test data
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(6, 'months').startOf('month'),
        dayjs().endOf('month')
    ]);

    // Fetch data using the existing chart hook
    const {
        data: chartData,
        isLoading,
        error
    } = useBookingChart({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD')
    });

    // Fetch rooms to map room IDs to names (if needed)
    const { data: roomsData } = useRooms();

    // Process data for the table
    const dataSource = useMemo(() => {
        console.log('BookingsByDate: chartData', chartData);
        if (!chartData?.bookings) return [];

        // Map room IDs to names for better display
        const roomsMap = {};
        if (roomsData) {
            const roomsList = Array.isArray(roomsData) ? roomsData : (roomsData.rooms || []);
            roomsList.forEach(r => {
                roomsMap[r._id || r.id] = r.name;
            });
        }

        // Also check chartData.rooms as fallback
        if (chartData.rooms) {
            chartData.rooms.forEach(r => {
                roomsMap[r._id || r.id] = r.name;
            });
        }

        return chartData.bookings.map(booking => ({
            ...booking,
            key: booking._id || booking.id, // Ensure unique key
            roomName: roomsMap[booking.roomId] || booking.roomId,
        }));
    }, [chartData, roomsData]);

    const columns = [
        {
            title: 'Guest Name',
            dataIndex: 'guestName', // or clientName based on API
            key: 'guestName',
            render: (text, record) => record.guestName || record.clientName || 'Unknown',
            sorter: (a, b) => (a.guestName || '').localeCompare(b.guestName || ''),
        },
        {
            title: 'Room',
            dataIndex: 'roomName',
            key: 'roomName',
            sorter: (a, b) => (a.roomName || '').localeCompare(b.roomName || ''),
        },
        {
            title: 'Check In',
            dataIndex: 'startDate', // or checkIn
            key: 'startDate',
            render: (date) => dayjs(date).format('DD MMM YYYY'),
            sorter: (a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf(),
        },
        {
            title: 'Check Out',
            dataIndex: 'endDate', // or checkOut
            key: 'endDate',
            render: (date) => dayjs(date).format('DD MMM YYYY'),
            sorter: (a, b) => dayjs(a.endDate).valueOf() - dayjs(b.endDate).valueOf(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'blue';
                if (status === 'Confirmed') color = 'green';
                if (status === 'CheckedIn') color = 'cyan';
                if (status === 'CheckedOut') color = 'gray';
                if (status === 'Cancelled') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Source',
            dataIndex: 'bookingSource',
            key: 'bookingSource',
        },
        {
            title: 'Voucher',
            dataIndex: 'voucher',
            key: 'voucher',
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={2}>Bookings by Date Range</Title>
                    <Space>
                        <Text>Date Range:</Text>
                        <RangePicker
                            value={dateRange}
                            onChange={(dates) => {
                                if (dates) setDateRange(dates);
                            }}
                            allowClear={false}
                        />
                    </Space>
                </div>

                {error && (
                    <Alert
                        message="Error fetching bookings"
                        description={error.message}
                        type="error"
                        showIcon
                    />
                )}

                <Card loading={isLoading} variant="borderless">
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: true }}
                    />
                </Card>
            </Space>
        </div>
    );
};

export default BookingsByDate;
