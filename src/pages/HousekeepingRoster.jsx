
import React, { useState, useMemo } from 'react';
import { Layout, Table, DatePicker, Typography, Space, Button, Modal, Row, Col, Card } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { TeamOutlined, PrinterOutlined, ReloadOutlined, CloseOutlined, SwapOutlined } from '@ant-design/icons';
import { rooms, housekeepers, tasks as initialTasks } from '../data/rooms';
import { reservations } from '../data/reservations';

dayjs.extend(isBetween);

const { Content } = Layout;
const { Title, Text } = Typography;

// --- Print Component ---
const HousekeepingPrintView = ({ date, data, totalTasks }) => {
    return (
        <div className="print-only" style={{ display: 'none', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Report Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Title level={3} style={{ margin: 0 }}>Mount Morgan Space Solutions</Title>
                <Title level={4} style={{ margin: 0 }}>Housekeepers For {date.format('dddd, DD MMM YYYY')}</Title>
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
            {data.map(group => (
                <div key={group.housekeeperId} style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
                    <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px' }}>
                        <Title level={5} style={{ margin: 0 }}>{group.housekeeperName}</Title>
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
                            {group.tasks.length > 0 ? (
                                group.tasks.map(task => (
                                    <tr key={task.taskId} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '8px 5px' }}>{task.roomType}</td>
                                        <td style={{ padding: '8px 5px' }}>{task.roomName}</td>
                                        <td style={{ padding: '8px 5px' }}><a href="#">{task.resNo}</a></td>
                                        <td style={{ padding: '8px 5px' }}>
                                            <div>{task.statusShort && `(${task.statusShort})`}{task.company}</div>
                                            <div>{task.guestName}</div>
                                        </td>
                                        <td style={{ padding: '8px 5px' }}>{task.membershipType}</td>
                                        <td style={{ padding: '8px 5px' }}>{task.people}</td>
                                        <td style={{ padding: '8px 5px' }}>{task.depart}</td>
                                        <td style={{ padding: '8px 5px' }}>{task.taskType}</td>
                                        <td style={{ padding: '8px 5px' }}>{task.taskStatus}</td>
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
                        Sub Total: Area Count {group.tasks.length}
                    </div>
                </div>
            ))}

            {/* Total Footer */}
            <div style={{ marginTop: '30px', borderTop: '2px solid #1890ff', paddingTop: '10px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>Report Generated: {dayjs().format('DD MMM YYYY [at] hh:mm A')} User: HGManager</div>
                    <div><strong>Total Tasks: {totalTasks}</strong></div>
                </div>
            </div>
        </div>
    );
};


const HousekeepingRoster = () => {
    // Default date from screenshot (or today)
    const [selectedDate, setSelectedDate] = useState(dayjs('2025-12-26'));

    // Local state for tasks to allow manipulation in Modal
    const [currentTasks, setCurrentTasks] = useState(initialTasks);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHousekeeper, setSelectedHousekeeper] = useState(null);

    // Dynamic Staff Data Calculation
    const { staffData, totalTasks, totalAllocated, totalRemaining, printReportData } = useMemo(() => {
        let tTasks = 0;
        let tAllocated = 0;
        let tPreArrival = 0;
        let tMidStay = 0;
        let tDeparture = 0;
        let tHoldOver = 0;

        const data = housekeepers.map(hk => {
            // Find tasks assigned to this housekeeper
            const hkTasks = currentTasks.filter(t => t.assignedTo === hk.id);

            const tasksCount = hkTasks.length;
            const allocatedMin = hkTasks.reduce((sum, t) => sum + (t.timeRequired || 0), 0);

            // Count specific types
            const preArrivalCount = hkTasks.filter(t => t.type === 'Pre Arrival Check').length;
            const midStayCount = hkTasks.filter(t => t.type === 'Mid Stay Linen Change').length;
            const departureCount = hkTasks.filter(t => t.type === 'Departure').length;
            const holdOverCount = hkTasks.filter(t => t.type === 'Hold Over Dep Clean').length;

            // Accumulate totals
            tTasks += tasksCount;
            tAllocated += allocatedMin;
            tPreArrival += preArrivalCount;
            tMidStay += midStayCount;
            tDeparture += departureCount;
            tHoldOver += holdOverCount;

            return {
                key: hk.id,
                name: hk.name,
                empType: hk.empType,
                availableMin: 0, // Mock
                tasks: tasksCount,
                allocatedMin: allocatedMin,
                preArrival: preArrivalCount,
                midStay: midStayCount,
                departure: departureCount,
                holdOver: holdOverCount
            };
        });

        // Calculate remaining (Unassigned Tasks)
        const unassignedTasks = currentTasks.filter(t => !t.assignedTo);
        const remainingStats = {
            tasks: unassignedTasks.length,
            allocatedMin: unassignedTasks.reduce((sum, t) => sum + (t.timeRequired || 0), 0),
            preArrival: unassignedTasks.filter(t => t.type === 'Pre Arrival Check').length,
            midStay: unassignedTasks.filter(t => t.type === 'Mid Stay Linen Change').length,
            departure: unassignedTasks.filter(t => t.type === 'Departure').length,
            holdOver: unassignedTasks.filter(t => t.type === 'Hold Over Dep Clean').length,
        };

        // --- NEW: Prepare Data for Print Report ---
        const enrichTask = (task) => {
            const room = rooms.find(r => r.id === task.roomId) || {};
            // Find reservation active on selected date for this room
            const res = reservations.find(r =>
                r.roomId === task.roomId &&
                selectedDate.isBetween(dayjs(r.checkIn), dayjs(r.checkOut), 'day', '[]')
            ) || {};

            return {
                taskId: task.id,
                roomType: room.type || 'Standard Suite', // Mock fallback
                roomName: task.roomId,
                resNo: res.resNo || '-',
                statusShort: res.status ? (res.status === 'Arrived' ? 'In' : 'Out') : '',
                company: res.clientName || 'Unknown',
                guestName: res.guestName || (res.clientName ? '' : 'Guest Name'),
                membershipType: res.company || 'Standard',
                people: res.people || '1A',
                depart: res.checkOut ? dayjs(res.checkOut).format('DD MMM YYYY') : '-',
                taskType: task.type,
                taskStatus: task.status
            };
        };

        const reportData = [
            ...housekeepers.map(hk => ({
                housekeeperId: hk.id,
                housekeeperName: hk.name,
                tasks: currentTasks.filter(t => t.assignedTo === hk.id).map(enrichTask)
            })),
            {
                housekeeperId: 'unnasigned',
                housekeeperName: 'Unassigned Tasks',
                tasks: unassignedTasks.map(enrichTask)
            }
        ];


        return {
            staffData: data,
            totalTasks: {
                name: 'Total Tasks',
                tasks: tTasks + remainingStats.tasks, // Assigned + Unassigned
                allocatedMin: tAllocated + remainingStats.allocatedMin,
                preArrival: tPreArrival + remainingStats.preArrival,
                midStay: tMidStay + remainingStats.midStay,
                departure: tDeparture + remainingStats.departure,
                holdOver: tHoldOver + remainingStats.holdOver
            },
            totalAllocated: {
                name: 'Total Allocated',
                tasks: tTasks,
                allocatedMin: tAllocated,
                preArrival: tPreArrival,
                midStay: tMidStay,
                departure: tDeparture,
                holdOver: tHoldOver
            },
            totalRemaining: {
                name: 'Total Remaining',
                tasks: remainingStats.tasks,
                allocatedMin: remainingStats.allocatedMin,
                preArrival: remainingStats.preArrival,
                midStay: remainingStats.midStay,
                departure: remainingStats.departure,
                holdOver: remainingStats.holdOver
            },
            printReportData: reportData
        };
    }, [currentTasks, selectedDate]);

    // Modal Handlers
    const handleRowDoubleClick = (record) => {
        setSelectedHousekeeper(record);
        setIsModalOpen(true);
    };

    const handleAssignTask = (taskId) => {
        if (!selectedHousekeeper) return;
        setCurrentTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, assignedTo: selectedHousekeeper.key } : t
        ));
    };

    const handleUnassignTask = (taskId) => {
        setCurrentTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, assignedTo: null } : t
        ));
    };

    const handlePrint = () => {
        window.print();
    };

    // Filter tasks for Modal
    const tasksToBeAllocated = useMemo(() =>
        currentTasks.filter(t => !t.assignedTo),
        [currentTasks]);

    const tasksAllocatedToSelected = useMemo(() =>
        selectedHousekeeper ? currentTasks.filter(t => t.assignedTo === selectedHousekeeper.key) : [],
        [currentTasks, selectedHousekeeper]);


    const columns = [
        { title: 'Housekeeper', dataIndex: 'name', key: 'name', width: 200 },
        { title: 'Emp Type', dataIndex: 'empType', key: 'empType', width: 100 },
        { title: 'Available (Min)', dataIndex: 'availableMin', key: 'availableMin', width: 120 },
        { title: 'Tasks', dataIndex: 'tasks', key: 'tasks', width: 80 },
        { title: 'Allocated (Min)', dataIndex: 'allocatedMin', key: 'allocatedMin', width: 120 },
        { title: 'Pre Arrival Check', dataIndex: 'preArrival', key: 'preArrival', width: 120 },
        { title: 'Mid Stay Linen Change', dataIndex: 'midStay', key: 'midStay', width: 150 },
        { title: 'Departure', dataIndex: 'departure', key: 'departure', width: 100 },
        { title: 'Hold Over Dep Clean', dataIndex: 'holdOver', key: 'holdOver', width: 150 },
    ];

    // Sub-tables for Modal
    const splitTableColumns = (actionRenderer) => [
        { title: 'Area', dataIndex: 'roomId', key: 'roomId', width: 100 },
        { title: 'Task', dataIndex: 'type', key: 'type' },
        { title: 'Req (Min)', dataIndex: 'timeRequired', key: 'timeRequired', width: 120 },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            align: 'center',
            render: actionRenderer
        }
    ];

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
            <div className="no-print" style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Title level={4} style={{ margin: 0 }}>Housekeeping Roster</Title>
                    <Text type="secondary">({staffData.length} Records Found)</Text>
                    <DatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        format="DD-MMM-YYYY"
                        allowClear={false}
                    />
                </div>
                <Space size="large">
                    <TeamOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
                    <PrinterOutlined style={{ fontSize: 18, cursor: 'pointer', color: 'blue' }} onClick={handlePrint} title="Print Report" />
                    <ReloadOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
                    <CloseOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
                </Space>
            </div>

            <Content className="no-print" style={{ padding: 24, overflow: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={staffData}
                    pagination={false}
                    size="small"
                    bordered
                    onRow={(record) => ({
                        onDoubleClick: () => handleRowDoubleClick(record),
                        style: { cursor: 'pointer' }
                    })}
                    summary={() => (
                        <>
                            <Table.Summary.Row style={{ backgroundColor: '#fff' }}>
                                <Table.Summary.Cell index={0} colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Tasks</Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>{totalTasks.tasks}</Table.Summary.Cell>
                                <Table.Summary.Cell index={4}>{totalTasks.allocatedMin}</Table.Summary.Cell>
                                <Table.Summary.Cell index={5}>{totalTasks.preArrival}</Table.Summary.Cell>
                                <Table.Summary.Cell index={6}>{totalTasks.midStay}</Table.Summary.Cell>
                                <Table.Summary.Cell index={7}>{totalTasks.departure}</Table.Summary.Cell>
                                <Table.Summary.Cell index={8}>{totalTasks.holdOver}</Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row style={{ backgroundColor: '#fff' }}>
                                <Table.Summary.Cell index={0} colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Allocated</Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>{totalAllocated.tasks}</Table.Summary.Cell>
                                <Table.Summary.Cell index={4}>{totalAllocated.allocatedMin}</Table.Summary.Cell>
                                <Table.Summary.Cell index={5}>{totalAllocated.preArrival}</Table.Summary.Cell>
                                <Table.Summary.Cell index={6}>{totalAllocated.midStay}</Table.Summary.Cell>
                                <Table.Summary.Cell index={7}>{totalAllocated.departure}</Table.Summary.Cell>
                                <Table.Summary.Cell index={8}>{totalAllocated.holdOver}</Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row style={{ backgroundColor: '#fff' }}>
                                <Table.Summary.Cell index={0} colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Remaining</Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>{totalRemaining.tasks}</Table.Summary.Cell>
                                <Table.Summary.Cell index={4}>{totalRemaining.allocatedMin}</Table.Summary.Cell>
                                <Table.Summary.Cell index={5}>{totalRemaining.preArrival}</Table.Summary.Cell>
                                <Table.Summary.Cell index={6}>{totalRemaining.midStay}</Table.Summary.Cell>
                                <Table.Summary.Cell index={7}>{totalRemaining.departure}</Table.Summary.Cell>
                                <Table.Summary.Cell index={8}>{totalRemaining.holdOver}</Table.Summary.Cell>
                            </Table.Summary.Row>
                            {/* Only apply green border to these rows via CSS or style injection if needed, 
                                 but style={{ borderTop: ... }} works on Cells usually. 
                                 Let's try to mimic the screenshot's green lines.
                             */}
                            <style>{`
                                .ant-table-summary tr:nth-child(1) td { border-top: 2px solid #52c41a !important; }
                                .ant-table-summary tr:nth-child(3) td { border-top: 2px solid #52c41a !important; }
                            `}</style>
                        </>
                    )}
                />
            </Content>

            {/* Task Allocation Modal (Hidden in Print) */}
            <Modal
                title={`Task Allocations for ${selectedDate.format('dddd, Do MMMM YYYY')} - ${selectedHousekeeper?.name}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={1600}
                style={{ top: 20 }}
                wrapClassName="no-print"
            >
                <Row gutter={16}>
                    {/* Left: Unassigned Tasks */}
                    <Col span={12}>
                        <Card title={`Tasks to be Allocated (${tasksToBeAllocated.length})`} size="small" headStyle={{ backgroundColor: '#e6f7ff' }}>
                            <Table
                                columns={splitTableColumns((_, r) => (
                                    <Button
                                        type="text"
                                        icon={<SwapOutlined style={{ color: 'blue' }} />}
                                        onClick={() => handleAssignTask(r.id)}
                                        title="Assign to Housekeeper"
                                    />
                                ))}
                                dataSource={tasksToBeAllocated}
                                rowKey="id"
                                size="small"
                                pagination={false}
                                scroll={{ y: 300 }}
                            />
                        </Card>
                    </Col>

                    {/* Right: Assigned Tasks */}
                    <Col span={12}>
                        <Card title={`Task Allocations for ${selectedHousekeeper?.name} (${tasksAllocatedToSelected.length})`} size="small" headStyle={{ backgroundColor: '#f9f0ff' }}>
                            <Table
                                columns={splitTableColumns((_, r) => (
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined style={{ color: 'red' }} />}
                                        onClick={() => handleUnassignTask(r.id)}
                                        title="Unassign Task"
                                    />
                                ))}
                                dataSource={tasksAllocatedToSelected}
                                rowKey="id"
                                size="small"
                                pagination={false}
                                scroll={{ y: 300 }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Modal>

            {/* PRINT VIEW COMPONENT (Visible only in Print) */}
            <HousekeepingPrintView
                date={selectedDate}
                data={printReportData}
                totalTasks={totalTasks.tasks}
            />

        </Layout>
    );
};

export default HousekeepingRoster;
