
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Layout, Checkbox, Input, Badge, Table, Tag, Row, Col, Typography, Select, Button, Space } from 'antd';
import { SearchOutlined, FilterOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { rooms } from '../data/rooms';
import { reservations } from '../data/reservations';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// Mock Colors matching the screenshot (approx)
const STATUS_COLORS = {
    'Clean': '#52c41a',      // Green
    'Dirty': '#ff4d4f',      // Red
    'Inspect': '#ff7875',    // Light Red
    'Occupied': '#faad14',   // Orange/Gold
    'Out of Order': '#d3adf7', // Purple
    'Owner Occupied': '#87e8de' // Cyan
};

// --- Resizable Header Component ---
const ResizableTitle = (props) => {
    const { onResize, width, ...restProps } = props;
    const [resizing, setResizing] = useState(false);
    const startX = useRef(0);
    const startWidth = useRef(0);

    const handleMouseDown = (e) => {
        setResizing(true);
        startX.current = e.pageX;
        startWidth.current = width;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none'; // Prevent text selection

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const diff = e.pageX - startX.current;
        const newWidth = Math.max(50, startWidth.current + diff); // Minimum width 50
        if (onResize) {
            onResize(newWidth);
        }
    };

    const handleMouseUp = () => {
        setResizing(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    if (!width) return <th {...restProps} />;

    return (
        <th {...restProps} style={{ ...restProps.style, position: 'relative' }}>
            {restProps.children}
            <div
                onMouseDown={handleMouseDown}
                onClick={(e) => e.stopPropagation()} // Prevent sort trigger
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 5,
                    cursor: 'col-resize',
                    zIndex: 1,
                    borderRight: '2px solid transparent',
                    backgroundColor: resizing ? '#1890ff' : 'transparent',
                }}
            />
        </th>
    );
};

const CleanScreen = () => {
    // --- State ---
    const [searchText, setSearchText] = useState('');
    const [selectedCleanStatuses, setSelectedCleanStatuses] = useState(['Dirty', 'Inspect']);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);

    // --- Data Processing (Calculate Statuses) ---
    const roomData = useMemo(() => {
        // Ideally we use a fixed date like in previous tasks, but for "Real-time" housekeeping, today is better.
        // However, since our mock data spreads around Dec 2025/Jan 2026, let's pick a date within that range to show meaningful data if today is not matching.
        // Let's stick to "Today" being roughly start of Jan 2026 for the mock context, OR just use system today.
        // The user prompts don't specify a "Simulation Date", but previous tasks treated Dec 31 2025 as "Today".
        // Let's use Dec 31 2025 as our reference "Today" to match recent data work.
        const effectiveToday = dayjs('2025-12-31');

        return rooms.map(room => {
            // 1. Find Active Reservations (Arrived) or Maintenance (Out of Order)
            const activeRes = reservations.find(r =>
                (r.roomId === room.id) &&
                dayjs(effectiveToday).isBetween(r.checkIn, r.checkOut, 'day', '[)') && // [) inc start, exc end
                (r.status === 'Arrived' || r.status === 'Out of Order')
            );

            // 2. Find Next Arrival
            // Filter future reservations for this room
            const futureRes = reservations
                .filter(r => r.roomId === room.id && dayjs(r.checkIn).isSameOrAfter(effectiveToday))
                .sort((a, b) => dayjs(a.checkIn).valueOf() - dayjs(b.checkIn).valueOf())[0];

            let occupancyStatus = 'Vacant'; // Default derived occupancy
            if (activeRes) {
                if (activeRes.status === 'Out of Order') {
                    occupancyStatus = 'Out of Order';
                } else if (activeRes.status === 'Arrived') {
                    occupancyStatus = 'Occupied';
                }
            }

            // Create a composite object
            return {
                ...room,
                key: room.id,
                computedStatus: room.defaultCleanStatus, // The actual clean state (Clean/Dirty)
                occupancyStatus: occupancyStatus,
                activeRes: activeRes,
                nextArrive: futureRes ? futureRes.checkIn : null,
                nextArriveRes: futureRes
            };
        });
    }, []);

    // --- Statistics ---
    const stats = useMemo(() => {
        const counts = {
            'Clean': 0,
            'Dirty': 0,
            'Inspect': 0,
            'Occupied': 0,
            'Out of Order': 0,
            'Owner Occupied': 0
        };

        roomData.forEach(r => {
            // Count Clean/Dirty
            if (counts[r.computedStatus] !== undefined) {
                counts[r.computedStatus]++;
            }
            // Count Occupied
            if (r.occupancyStatus === 'Occupied') {
                counts['Occupied']++;
            }
            if (r.occupancyStatus === 'Out of Order') {
                counts['Out of Order']++;
            }
        });
        return counts;
    }, [roomData]);

    const uniqueRoomTypes = [...new Set(rooms.map(r => r.category).filter(Boolean))];

    // --- Filtering ---
    const filteredData = useMemo(() => {
        return roomData.filter(item => {
            // 1. Text Search
            const matchesText = !searchText ||
                item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.category?.toLowerCase().includes(searchText.toLowerCase());

            // 2. Room Type Filter
            const matchesRoomType = selectedRoomTypes.length === 0 || selectedRoomTypes.includes(item.category);

            // 3. Status Filter
            let matchesStatus = false;
            if (selectedCleanStatuses.length === 0) {
                matchesStatus = true;
            } else {
                // Check Cleanliness
                if (selectedCleanStatuses.includes(item.computedStatus)) matchesStatus = true;
                // Check Occupancy
                if (selectedCleanStatuses.includes('Occupied') && item.occupancyStatus === 'Occupied') matchesStatus = true;
                if (selectedCleanStatuses.includes('Out of Order') && item.occupancyStatus === 'Out of Order') matchesStatus = true;
            }

            return matchesText && matchesRoomType && matchesStatus;
        });
    }, [roomData, searchText, selectedRoomTypes, selectedCleanStatuses]);

    // --- Column Definitions with State for Width ---
    const [columnWidths, setColumnWidths] = useState({
        category: 200,
        name: 80,
        computedStatus: 120,
        taskStatus: 100,
        verified: 80,
        hkStatus: 120,
        resNo: 80,
        arrive: 80,
        depart: 80,
        clientName: 120,
        clientStatus: 100,
        nextArrive: 150,
        note: 100,
        areaGrouping: 120,
        timeSetToClean: 150,
        userWhoSetToClean: 150,
        people: 80,
        discrepantClean: 120,
        membershipType: 120
    });

    const handleResize = (key) => (newWidth) => {
        setColumnWidths(prev => ({
            ...prev,
            [key]: newWidth,
        }));
    };

    const columns = [
        {
            title: 'Room Type',
            dataIndex: 'category',
            key: 'category',
            width: columnWidths.category,
            ellipsis: true,
        },
        {
            title: 'Area',
            dataIndex: 'name',
            key: 'name',
            width: columnWidths.name,
        },
        {
            title: 'Clean Status',
            dataIndex: 'computedStatus',
            key: 'computedStatus',
            width: columnWidths.computedStatus,
            render: (status) => {
                const color = STATUS_COLORS[status] || 'default';
                return (
                    <Tag color={color} style={{ borderRadius: 4, fontWeight: 'bold' }}>
                        <div style={{ width: 10, height: 10, backgroundColor: color, display: 'inline-block', marginRight: 8, verticalAlign: 'middle', borderRadius: 2 }}></div>
                        {status}
                    </Tag>
                );
            }
        },
        {
            title: 'Task Status',
            key: 'taskStatus',
            width: columnWidths.taskStatus,
            render: () => <span style={{ color: '#888' }}>(No Tasks)</span>
        },
        { title: 'Verified', key: 'verified', width: columnWidths.verified },
        { title: 'HouseKeeper Res Status', key: 'hkStatus', width: columnWidths.hkStatus },
        { title: 'Res No', key: 'resNo', width: columnWidths.resNo, render: (_, r) => r.activeRes?.resNo },
        { title: 'Arrive', key: 'arrive', width: columnWidths.arrive, render: (_, r) => r.activeRes?.arriveTime },
        { title: 'Depart', key: 'depart', width: columnWidths.depart, render: (_, r) => r.activeRes?.departTime },
        { title: 'Client Name', key: 'clientName', width: columnWidths.clientName, render: (_, r) => r.activeRes?.clientName },
        { title: 'Client Status', key: 'clientStatus', width: columnWidths.clientStatus, render: (_, r) => r.activeRes?.status },
        {
            title: 'Next Arrive',
            key: 'nextArrive',
            width: columnWidths.nextArrive,
            render: (val) => val ? dayjs(val).format('DD-MMM-YYYY') : ''
        },
        { title: 'Note', key: 'note', width: columnWidths.note },

        // --- New Columns ---
        { title: 'Area Grouping', key: 'areaGrouping', width: columnWidths.areaGrouping, render: () => '' },
        {
            title: 'Time Set To Clean',
            key: 'timeSetToClean',
            width: columnWidths.timeSetToClean,
            render: (_, r) => r.computedStatus === 'Dirty' ? '02-Dec-2025 01:36 pm' : '' // Mock
        },
        {
            title: 'User Who Set To Clean',
            key: 'userWhoSetToClean',
            width: columnWidths.userWhoSetToClean,
            render: (_, r) => r.computedStatus === 'Dirty' ? 'HGManager' : '' // Mock
        },
        {
            title: 'People',
            key: 'people',
            width: columnWidths.people,
            render: (_, r) => r.activeRes?.people || ''
        },
        { title: 'Discrepant Clean', key: 'discrepantClean', width: columnWidths.discrepantClean },
        { title: 'Membership Type', key: 'membershipType', width: columnWidths.membershipType },
    ];

    // Transform columns to support resizing
    const resizableColumns = columns.map((col, index) => ({
        ...col,
        onHeaderCell: (column) => ({
            width: column.width,
            onResize: handleResize(column.key || column.dataIndex),
        }),
    }));

    return (
        <Layout style={{ height: 'calc(100vh - 64px)', background: '#fff' }}>
            {/* --- Top Bar (Custom for this page) --- */}
            <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Title level={4} style={{ margin: 0 }}>Clean Screen</Title>
                    <Select defaultValue="Area View" style={{ width: 120 }}>
                        <Option value="Area View">Area View</Option>
                    </Select>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                    <Button icon={<SearchOutlined />} />
                    <Button icon={<FilterOutlined />} />
                    {/* Add more toolbar icons */}
                </div>
            </Header>

            <Layout>
                {/* --- Left Sidebar (Filters) --- */}
                <Sider width={280} theme="light" style={{ borderRight: '1px solid #f0f0f0', padding: '16px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Title level={5} style={{ margin: 0 }}>Filters</Title>
                        <SearchOutlined />
                    </div>

                    {/* Clean Status Filter */}
                    <div style={{ marginBottom: 24 }}>
                        <Text strong style={{ display: 'block', marginBottom: 12 }}>Clean Status</Text>
                        <Checkbox.Group
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}
                            value={selectedCleanStatuses}
                            onChange={setSelectedCleanStatuses}
                        >
                            {Object.keys(STATUS_COLORS).map(status => (
                                <Row key={status} justify="space-between" align="middle" style={{ width: '100%' }}>
                                    <Checkbox value={status}>{status}</Checkbox>
                                    <Badge
                                        count={stats[status]}
                                        style={{ backgroundColor: selectedCleanStatuses.includes(status) ? STATUS_COLORS[status] : '#d9d9d9', color: '#fff' }}
                                    />
                                </Row>
                            ))}
                        </Checkbox.Group>
                    </div>

                    {/* Room Types Filter */}
                    <div style={{ marginBottom: 24 }}>
                        <Text strong style={{ display: 'block', marginBottom: 12 }}>Room Types</Text>
                        <Checkbox.Group
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}
                            value={selectedRoomTypes}
                            onChange={setSelectedRoomTypes}
                        >
                            {uniqueRoomTypes.map(type => (
                                <div key={type}><Checkbox value={type}>{type}</Checkbox></div>
                            ))}
                        </Checkbox.Group>
                    </div>

                    {/* Options (Mock) */}
                    <div style={{ marginBottom: 24 }}>
                        <Text strong style={{ display: 'block', marginBottom: 12 }}>Options</Text>
                        {/* Empty as per screenshot */}
                    </div>

                    {/* Show Select */}
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>Show</Text>
                        <Select defaultValue="all" style={{ width: '100%' }}>
                            <Option value="all">(All Reservations)</Option>
                        </Select>
                    </div>

                </Sider>

                {/* --- Main Content (Table) --- */}
                <Content style={{ padding: '16px', overflow: 'auto' }}>
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                        <MenuOutlined style={{ marginRight: 8 }} />
                        <Title level={5} style={{ margin: 0 }}>Clean Status</Title>
                        <Text type="secondary" style={{ marginLeft: 16 }}>Records Found: {filteredData.length}</Text>
                        <div style={{ flex: 1 }}></div>
                        <Input.Search placeholder="Room Type or Area..." style={{ width: 250 }} onChange={e => setSearchText(e.target.value)} />
                    </div>

                    <Table
                        rowSelection={{ type: 'checkbox' }}
                        columns={resizableColumns}
                        dataSource={filteredData}
                        pagination={false}
                        size="small"
                        scroll={{ x: 'max-content' }}
                        bordered
                        components={{
                            header: {
                                cell: ResizableTitle,
                            },
                        }}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default CleanScreen;
