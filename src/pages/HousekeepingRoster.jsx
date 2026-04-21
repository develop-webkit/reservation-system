import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout, Table, DatePicker, Typography, Space, Button, Modal, Row, Col, Card, Spin, Empty, Tag, message, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { TeamOutlined, PrinterOutlined, ReloadOutlined, CloseOutlined, SwapOutlined, CheckOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    useRosterSuggestions,
    useHousekeepingAssignments,
    useAllocateTasks,
    useCompleteTask,
    useHousekeepingPrint,
    useHousekeepers
} from '../hooks/useHousekeeping';

const { Content } = Layout;
const { Title, Text } = Typography;

// --- Print Component ---
const HousekeepingPrintView = ({ date, groupedByHousekeeper }) => {
    return (
        <div className="print-only" style={{ display: 'none', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Report Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Title level={3} style={{ margin: 0 }}>Mount Morgan Space Solutions</Title>
                <Title level={4} style={{ margin: 0 }}>Housekeepers For {dayjs(date).format('dddd, DD MMM YYYY')}</Title>
            </div>

            {/* Report Metadata */}
            <div style={{ borderTop: '2px solid #1890ff', borderBottom: '2px solid #1890ff', padding: '10px 0', marginBottom: '20px', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <div><strong>Properties:</strong> Mount Morgan Space Solutions</div>
                    <div><strong>Room Type:</strong> Multiple</div>
                </div>
                <div>
                    <div><strong>Housekeeping Task:</strong> All</div>
                    <div><strong>Group By:</strong> Housekeeper</div>
                </div>
                <div>
                    <div><strong>Report Type:</strong> Detail</div>
                    <div><strong>Include Maint:</strong> No</div>
                </div>
            </div>

            {/* Report Content - Grouped by Housekeeper */}
            {Object.entries(groupedByHousekeeper || {}).map(([housekeeperName, tasks]) => (
                <div key={housekeeperName} style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
                    <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px' }}>
                        <Title level={5} style={{ margin: 0 }}>{housekeeperName}</Title>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                        <thead>
                            <tr style={{ color: '#555', textAlign: 'left' }}>
                                <th style={{ padding: '5px', width: '15%' }}>Room Type</th>
                                <th style={{ padding: '5px', width: '5%' }}>Area</th>
                                <th style={{ padding: '5px', width: '5%' }}>Res No</th>
                                <th style={{ padding: '5px', width: '20%' }}>Name</th>
                                <th style={{ padding: '5px', width: '15%' }}>Membership Type</th>
                                <th style={{ padding: '5px', width: '5%' }}>People</th>
                                <th style={{ padding: '5px', width: '10%' }}>Depart</th>
                                <th style={{ padding: '5px', width: '15%' }}>Task</th>
                                <th style={{ padding: '5px', width: '10%' }}>Task Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks && tasks.length > 0 ? (
                                tasks.map((task, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '8px 5px' }}>{task.room?.category || 'Standard'}</td>
                                        <td style={{ padding: '8px 5px' }}>{task.room?.name || '—'}</td>
                                        <td style={{ padding: '8px 5px' }}>{task.booking?.resNo || '—'}</td>
                                        <td style={{ padding: '8px 5px' }}>
                                            <div>{task.booking?.guestName || 'Guest'}</div>
                                        </td>
                                        <td style={{ padding: '8px 5px' }}>{task.booking?.tariffType || '—'}</td>
                                        <td style={{ padding: '8px 5px' }}>{task.booking?.adults || '—'}</td>
                                        <td style={{ padding: '8px 5px' }}>{task.booking?.checkOut ? dayjs(task.booking.checkOut).format('DD MMM YYYY') : '—'}</td>
                                        <td style={{ padding: '8px 5px' }}>{task.type}</td>
                                        <td style={{ padding: '8px 5px' }}>{task.status || 'Pending'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" style={{ padding: '10px', textAlign: 'center', color: '#999' }}>No tasks assigned</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div style={{ textAlign: 'right', marginTop: '10px', fontWeight: 'bold', fontSize: '11px' }}>
                        Sub Total: Area Count {tasks?.length || 0}
                    </div>
                </div>
            ))}

            {/* Total Footer */}
            <div style={{ marginTop: '30px', borderTop: '2px solid #1890ff', paddingTop: '10px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>Report Generated: {dayjs().format('DD MMM YYYY [at] hh:mm A')}</div>
                    <div><strong>Total Tasks: {Object.values(groupedByHousekeeper || {}).flat().length}</strong></div>
                </div>
            </div>
        </div>
    );
};


const HousekeepingRoster = () => {
    // Read ?date= from query params
    const [searchParams] = useSearchParams();
    const dateParam = searchParams.get('date');

    // Default date: tomorrow, or from query param
    const [selectedDate, setSelectedDate] = useState(
        dateParam ? dayjs(dateParam) : dayjs().add(1, 'day')
    );

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHousekeeper, setSelectedHousekeeper] = useState(null);

    // Search & Filter State
    const [housekeeperSearch, setHousekeeperSearch] = useState('');
    const [pageSize, setPageSize] = useState(10);

    // API Hooks
    const { data: suggestions = [], isLoading: suggestionsLoading } = useRosterSuggestions(selectedDate.format('YYYY-MM-DD'));
    const { data: assignments = [], isLoading: assignmentsLoading } = useHousekeepingAssignments(selectedDate.format('YYYY-MM-DD'));
    const { data: housekeepers = [], isLoading: housekeepersLoading } = useHousekeepers();
    const { data: printData, refetch: refetchPrint } = useHousekeepingPrint(selectedDate.format('YYYY-MM-DD'));

    const allocateTasks = useAllocateTasks();
    const completeTask = useCompleteTask();

    // Dynamic Staff Data Calculation
    const { staffData, totalStats } = useMemo(() => {
        const data = housekeepers.map(hk => {
            // Find tasks assigned to this housekeeper
            const hkAssignments = assignments.filter(t => t.assignedTo?._id === hk._id || t.assignedTo === hk._id);

            const tasksCount = hkAssignments.length;
            const allocatedMin = hkAssignments.reduce((sum, t) => sum + (t.timeRequired || 0), 0);

            // Count specific types
            const preArrivalCount = hkAssignments.filter(t => t.type === 'Pre Arrival Check').length;
            const stayOverCount = hkAssignments.filter(t => t.type === 'Stay Over Clean').length;
            const departureCount = hkAssignments.filter(t => t.type === 'Departure Clean').length;
            const holdOverCount = hkAssignments.filter(t => t.type === 'Holdover Departure Clean').length;

            return {
                key: hk._id,
                name: hk.name || hk.username,
                preArrival: preArrivalCount,
                stayOver: stayOverCount,
                departure: departureCount,
                holdOver: holdOverCount,
                total: preArrivalCount + stayOverCount + departureCount + holdOverCount,
                _id: hk._id
            };
        });

        // Calculate totals
        const totals = {
            tasks: assignments.length,
            preArrival: assignments.filter(t => t.type === 'Pre Arrival Check').length,
            stayOver: assignments.filter(t => t.type === 'Stay Over Clean').length,
            departure: assignments.filter(t => t.type === 'Departure Clean').length,
            holdOver: assignments.filter(t => t.type === 'Holdover Departure Clean').length,
        };

        const unassigned = suggestions.filter(t => !assignments.find(a => a._id === t._id));
        const totalAll = {
            tasks: suggestions.length,
            preArrival: suggestions.filter(t => t.type === 'Pre Arrival Check').length,
            stayOver: suggestions.filter(t => t.type === 'Stay Over Clean').length,
            departure: suggestions.filter(t => t.type === 'Departure Clean').length,
            holdOver: suggestions.filter(t => t.type === 'Holdover Departure Clean').length,
        };

        const remaining = {
            tasks: unassigned.length,
            preArrival: unassigned.filter(t => t.type === 'Pre Arrival Check').length,
            stayOver: unassigned.filter(t => t.type === 'Stay Over Clean').length,
            departure: unassigned.filter(t => t.type === 'Departure Clean').length,
            holdOver: unassigned.filter(t => t.type === 'Holdover Departure Clean').length,
        };

        return {
            staffData: data,
            totalStats: { totals, totalAll, remaining }
        };
    }, [housekeepers, assignments, suggestions]);

    // Modal Handlers
    const handleRowDoubleClick = (record) => {
        setSelectedHousekeeper(record);
        setIsModalOpen(true);
    };

    const handleAllocateTasksToHousekeeper = (tasksToAllocate) => {
        if (!selectedHousekeeper || tasksToAllocate.length === 0) return;

        const payload = {
            housekeeperId: selectedHousekeeper._id || selectedHousekeeper.key,
            date: selectedDate.format('YYYY-MM-DD'),
            tasks: tasksToAllocate.map(t => ({
                type: t.type,
                roomId: t.room?._id || t.room,
                bookingId: t.booking?._id || t.booking
            }))
        };

        allocateTasks.mutate(payload, {
            onSuccess: () => {
                message.success(`Allocated ${tasksToAllocate.length} task(s) to ${selectedHousekeeper.name}`);
            },
            onError: (err) => {
                message.error('Failed to allocate tasks: ' + (err.response?.data?.message || err.message));
            }
        });
    };

    const handleCompleteTask = (taskId) => {
        completeTask.mutate(taskId, {
            onSuccess: () => {
                message.success('Task marked as complete — room set to Clean');
            },
            onError: (err) => {
                message.error('Failed to complete task: ' + (err.response?.data?.message || err.message));
            }
        });
    };

    const handlePrint = async () => {
        await refetchPrint();
        setTimeout(() => window.print(), 500);
    };

    // Filter unassigned tasks for modal
    const unassignedTasks = useMemo(() =>
        suggestions.filter(t => !assignments.find(a => a._id === t._id)),
        [suggestions, assignments]
    );

    const tasksAllocatedToSelected = useMemo(() =>
        selectedHousekeeper ? assignments.filter(t => (t.assignedTo?._id === selectedHousekeeper._id || t.assignedTo === selectedHousekeeper.key)) : [],
        [assignments, selectedHousekeeper]
    );

    // Filter housekeepers based on search
    const filteredStaffData = useMemo(() => {
        if (!housekeeperSearch) return staffData;
        return staffData.filter(staff =>
            staff.name?.toLowerCase().includes(housekeeperSearch.toLowerCase())
        );
    }, [staffData, housekeeperSearch]);

    const columns = [
        { title: 'Housekeeper', dataIndex: 'name', key: 'name', width: 160, sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'Pre Arrival Check', dataIndex: 'preArrival', key: 'preArrival', width: 140, align: 'center' },
        { title: 'Stay Over Clean', dataIndex: 'stayOver', key: 'stayOver', width: 130, align: 'center' },
        { title: 'Departure Clean', dataIndex: 'departure', key: 'departure', width: 130, align: 'center' },
        { title: 'Holdover Clean', dataIndex: 'holdOver', key: 'holdOver', width: 130, align: 'center' },
        { title: 'Total', dataIndex: 'total', key: 'total', width: 80, align: 'center' },
    ];

    const taskTableColumns = (showCompleteButton) => [
        { title: 'Area', dataIndex: ['room', 'name'], key: 'room', width: 100 },
        { title: 'Task Type', dataIndex: 'type', key: 'type', width: 180 },
        { title: 'Booking Ref', dataIndex: ['booking', 'resNo'], key: 'resNo', width: 120 },
        showCompleteButton && {
            title: 'Action',
            key: 'action',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Button
                    size="small"
                    icon={<CheckOutlined />}
                    onClick={() => handleCompleteTask(record._id)}
                    loading={completeTask.isPending}
                />
            )
        }
    ].filter(Boolean);

    const isLoading = suggestionsLoading || assignmentsLoading || housekeepersLoading;

    return (
        <Layout style={{ minHeight: '100%', background: '#fff' }}>
            <style>{`
                @media print {
                    .ant-layout-sider, .ant-layout-header, .no-print {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                    .ant-layout {
                        background: white !important;
                    }
                    body {
                        background: white !important;
                    }
                }
            `}</style>

            {/* Header Section (Hidden in Print) */}
            <div className="no-print" style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>Housekeeping Roster</Title>
                        <Text type="secondary">({housekeepers.length} Housekeepers)</Text>
                        <DatePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                            format="DD-MMM-YYYY"
                            allowClear={false}
                        />
                    </div>
                    <Space size="large">
                        <PrinterOutlined style={{ fontSize: 18, cursor: 'pointer', color: 'blue' }} onClick={handlePrint} title="Print Report" />
                        <ReloadOutlined style={{ fontSize: 18, cursor: 'pointer' }} title="Refresh" />
                    </Space>
                </div>

                {/* Search and Filter Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                    <Input
                        placeholder="Search by housekeeper name..."
                        value={housekeeperSearch}
                        onChange={(e) => setHousekeeperSearch(e.target.value)}
                    />
                </div>
            </div>

            <Content className="no-print" style={{ padding: 24, overflow: 'auto' }}>
                {isLoading ? (
                    <Spin tip="Loading housekeeping data..." />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredStaffData}
                        pagination={{ pageSize: pageSize, pageSizeOptions: ['10', '20', '30'], showSizeChanger: true }}
                        size="small"
                        bordered
                        loading={allocateTasks.isPending}
                        onRow={(record) => ({
                            onDoubleClick: () => handleRowDoubleClick(record),
                            style: { cursor: 'pointer' }
                        })}
                        summary={() => (
                            <>
                                <Table.Summary.Row style={{ backgroundColor: '#fff' }}>
                                    <Table.Summary.Cell index={0} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Available</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>{totalStats.totalAll.preArrival}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>{totalStats.totalAll.stayOver}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={3}>{totalStats.totalAll.departure}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={4}>{totalStats.totalAll.holdOver}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={5}>{totalStats.totalAll.tasks}</Table.Summary.Cell>
                                </Table.Summary.Row>
                                <Table.Summary.Row style={{ backgroundColor: '#fff' }}>
                                    <Table.Summary.Cell index={0} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Allocated</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>{totalStats.totals.preArrival}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>{totalStats.totals.stayOver}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={3}>{totalStats.totals.departure}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={4}>{totalStats.totals.holdOver}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={5}>{totalStats.totals.tasks}</Table.Summary.Cell>
                                </Table.Summary.Row>
                                <Table.Summary.Row style={{ backgroundColor: '#fff' }}>
                                    <Table.Summary.Cell index={0} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Remaining</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>{totalStats.remaining.preArrival}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>{totalStats.remaining.stayOver}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={3}>{totalStats.remaining.departure}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={4}>{totalStats.remaining.holdOver}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={5}>{totalStats.remaining.tasks}</Table.Summary.Cell>
                                </Table.Summary.Row>
                                <style>{`
                                    .ant-table-summary tr:nth-child(1) td { border-top: 2px solid #52c41a !important; }
                                    .ant-table-summary tr:nth-child(3) td { border-top: 2px solid #52c41a !important; }
                                `}</style>
                            </>
                        )}
                    />
                )}
            </Content>

            {/* Task Allocation Modal */}
            <Modal
                title={`Task Allocations for ${selectedDate.format('dddd, Do MMMM YYYY')}${selectedHousekeeper ? ` — ${selectedHousekeeper.name}` : ''}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={1600}
                style={{ top: 20 }}
                wrapClassName="no-print"
            >
                <AllocationModalContent
                    unassignedTasks={unassignedTasks}
                    assignedTasks={tasksAllocatedToSelected}
                    housekeeperName={selectedHousekeeper?.name}
                    onAllocate={handleAllocateTasksToHousekeeper}
                    onComplete={handleCompleteTask}
                    isAllocating={allocateTasks.isPending}
                    isCompleting={completeTask.isPending}
                />
            </Modal>

            {/* PRINT VIEW (Visible only in Print) */}
            <HousekeepingPrintView
                date={selectedDate.format('YYYY-MM-DD')}
                groupedByHousekeeper={printData?.groupedByHousekeeper || {}}
            />
        </Layout>
    );
};

/**
 * Allocation Modal Content Component
 */
const AllocationModalContent = ({ unassignedTasks, assignedTasks, housekeeperName, onAllocate, onComplete, isAllocating, isCompleting }) => {
    const [selectedTasks, setSelectedTasks] = React.useState([]);

    const taskColumns = (showAction, actionRender) => [
        { title: 'Area', dataIndex: ['room', 'name'], key: 'room', width: 80 },
        { title: 'Task Type', dataIndex: 'type', key: 'type', width: 150 },
        { title: 'Booking Ref', dataIndex: ['booking', 'resNo'], key: 'resNo', width: 100 },
        { title: 'Time (Min)', dataIndex: 'timeRequired', key: 'timeRequired', width: 80, align: 'right' },
        showAction && {
            title: 'Action',
            key: 'action',
            width: 80,
            align: 'center',
            render: actionRender
        }
    ].filter(Boolean);

    return (
        <Row gutter={16}>
            {/* Left: Unassigned Tasks */}
            <Col span={12}>
                <Card title={`Available Tasks (${unassignedTasks.length})`} size="small" headStyle={{ backgroundColor: '#e6f7ff' }}>
                    <Table
                        columns={taskColumns(true, (_, record) => (
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => setSelectedTasks(prev => [...prev, record])}
                            >
                                Select
                            </Button>
                        ))}
                        dataSource={unassignedTasks}
                        rowKey="_id"
                        size="small"
                        pagination={false}
                        scroll={{ y: 300 }}
                    />
                    {selectedTasks.length > 0 && (
                        <div style={{ marginTop: '12px', textAlign: 'right' }}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    onAllocate(selectedTasks);
                                    setSelectedTasks([]);
                                }}
                                loading={isAllocating}
                            >
                                Allocate {selectedTasks.length} Task(s)
                            </Button>
                        </div>
                    )}
                </Card>
            </Col>

            {/* Right: Assigned Tasks */}
            <Col span={12}>
                <Card title={`Assigned to ${housekeeperName} (${assignedTasks.length})`} size="small" headStyle={{ backgroundColor: '#f9f0ff' }}>
                    <Table
                        columns={taskColumns(true, (_, record) => (
                            <Button
                                size="small"
                                type="dashed"
                                icon={<CheckOutlined />}
                                onClick={() => onComplete(record._id)}
                                loading={isCompleting}
                            >
                                Done
                            </Button>
                        ))}
                        dataSource={assignedTasks}
                        rowKey="_id"
                        size="small"
                        pagination={false}
                        scroll={{ y: 300 }}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default HousekeepingRoster;
