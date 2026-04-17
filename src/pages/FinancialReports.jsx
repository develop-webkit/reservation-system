import React, { useState, useRef } from 'react';
import {
    Tabs, Card, Row, Col, Statistic, Table, DatePicker, Select, Space, Tag, Button,
    Typography, Spin, Empty, Segmented, Divider, Alert,
} from 'antd';
import {
    DollarOutlined, HomeOutlined, RiseOutlined, TeamOutlined,
    PrinterOutlined, FileTextOutlined, BarChartOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import dayjs from 'dayjs';
import {
    useReportReservations, useReportAccounting, useReportRooms,
    useRevenueSummary, useRevenueTrend, useRevenueByRoom,
    useRevenueBySource, useGuestPayments, useExpenseSummary,
} from '../hooks/useFinancialReports';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const formatCurrency = (val) => `$${(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const FinancialReports = () => {
    const printRef = useRef();

    // Filters
    const [dateRange, setDateRange] = useState([
        dayjs().startOf('month'),
        dayjs().endOf('month'),
    ]);
    const [period, setPeriod] = useState('daily');

    const startDate = dateRange?.[0]?.format('YYYY-MM-DD');
    const endDate = dateRange?.[1]?.format('YYYY-MM-DD');

    // Data fetching
    const { data: reservationsData, isLoading: loadingRes } = useReportReservations();
    const { data: accountingData, isLoading: loadingAcc } = useReportAccounting();
    const { data: roomsData, isLoading: loadingRooms } = useReportRooms();

    const isLoading = loadingRes || loadingAcc || loadingRooms;

    // Aggregations
    const summary = useRevenueSummary(reservationsData, roomsData, startDate, endDate);
    const trend = useRevenueTrend(reservationsData, period, startDate, endDate);
    const byRoom = useRevenueByRoom(reservationsData, startDate, endDate);
    const bySource = useRevenueBySource(reservationsData, startDate, endDate);
    const guestPayments = useGuestPayments(reservationsData, accountingData, startDate, endDate);
    const expenses = useExpenseSummary(accountingData, startDate, endDate);

    const handlePrint = () => {
        window.print();
    };

    // --- Filter Bar ---
    const FilterBar = (
        <Row gutter={[16, 12]} align="middle" style={{ marginBottom: 16 }}>
            <Col>
                <Text strong>Date Range:</Text>{' '}
                <RangePicker
                    value={dateRange}
                    onChange={(vals) => setDateRange(vals)}
                    allowClear={false}
                    style={{ width: 280 }}
                />
            </Col>
            <Col>
                <Text strong>Period:</Text>{' '}
                <Segmented
                    options={['daily', 'weekly', 'monthly', 'yearly']}
                    value={period}
                    onChange={setPeriod}
                />
            </Col>
            <Col flex="auto" style={{ textAlign: 'right' }}>
                <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                    Print Report
                </Button>
            </Col>
        </Row>
    );

    // --- Overview Tab ---
    const OverviewTab = () => (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={summary.totalRevenue}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Bookings"
                            value={summary.bookingsCount}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Avg Room Rate"
                            value={summary.avgRate}
                            prefix={<DollarOutlined />}
                            precision={2}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Occupancy Rate"
                            value={summary.occupancyRate}
                            suffix="%"
                            prefix={<HomeOutlined />}
                            precision={1}
                            valueStyle={{ color: summary.occupancyRate > 70 ? '#3f8600' : '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Outstanding Balances"
                            value={summary.outstandingBalances}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: summary.outstandingBalances > 0 ? '#cf1322' : '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Occupied Room-Nights"
                            value={summary.occupiedNights}
                            suffix={` / ${summary.totalRoomNights}`}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Revenue Trend" style={{ marginTop: 24 }}>
                {trend.length > 0 ? (
                    <Line
                        data={trend}
                        xField="period"
                        yField="revenue"
                        shapeField="smooth"
                        style={{ lineWidth: 2 }}
                        point={{ shapeField: 'circle', sizeField: 4 }}
                        height={350}
                        axis={{
                            y: { labelFormatter: (v) => `$${Number(v).toLocaleString()}` },
                        }}
                    />
                ) : (
                    <Empty description="No revenue data for selected period" />
                )}
            </Card>
        </div>
    );

    // --- Revenue Analysis Tab ---
    const RevenueAnalysisTab = () => {
        const roomColumns = [
            { title: 'Room', dataIndex: 'room', key: 'room' },
            {
                title: 'Revenue',
                dataIndex: 'revenue',
                key: 'revenue',
                render: (v) => formatCurrency(v),
                sorter: (a, b) => a.revenue - b.revenue,
                defaultSortOrder: 'descend',
            },
            { title: 'Bookings', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
            {
                title: 'Avg Rate',
                key: 'avg',
                render: (_, r) => formatCurrency(r.count > 0 ? r.revenue / r.count : 0),
            },
        ];

        return (
            <div>
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={14}>
                        <Card title="Revenue by Room">
                            <Table
                                dataSource={byRoom}
                                columns={roomColumns}
                                rowKey="room"
                                pagination={{ pageSize: 15 }}
                                size="small"
                                summary={(data) => {
                                    const totalRev = data.reduce((s, r) => s + r.revenue, 0);
                                    const totalCount = data.reduce((s, r) => s + r.count, 0);
                                    return (
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell><strong>Total</strong></Table.Summary.Cell>
                                            <Table.Summary.Cell><strong>{formatCurrency(totalRev)}</strong></Table.Summary.Cell>
                                            <Table.Summary.Cell><strong>{totalCount}</strong></Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <strong>{formatCurrency(totalCount > 0 ? totalRev / totalCount : 0)}</strong>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    );
                                }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={10}>
                        <Card title="Revenue by Room (Chart)">
                            {byRoom.length > 0 ? (
                                <Column
                                    data={byRoom.slice(0, 15)}
                                    xField="room"
                                    yField="revenue"
                                    height={350}
                                    label={{
                                        text: (d) => formatCurrency(d.revenue),
                                        position: 'outside',
                                        style: { fontSize: 11 },
                                    }}
                                    axis={{
                                        y: { labelFormatter: (v) => `$${Number(v).toLocaleString()}` },
                                    }}
                                />
                            ) : (
                                <Empty />
                            )}
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    <Col xs={24} lg={12}>
                        <Card title="Revenue by Booking Source">
                            {bySource.length > 0 ? (
                                <Pie
                                    data={bySource}
                                    angleField="revenue"
                                    colorField="source"
                                    radius={0.85}
                                    innerRadius={0.55}
                                    height={350}
                                    label={{
                                        text: (d) => `${d.source}\n${formatCurrency(d.revenue)}`,
                                        position: 'outside',
                                    }}
                                />
                            ) : (
                                <Empty />
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card title="Booking Source Breakdown">
                            <Table
                                dataSource={bySource}
                                rowKey="source"
                                size="small"
                                pagination={false}
                                columns={[
                                    { title: 'Source', dataIndex: 'source', key: 'source' },
                                    {
                                        title: 'Revenue',
                                        dataIndex: 'revenue',
                                        key: 'revenue',
                                        render: (v) => formatCurrency(v),
                                        sorter: (a, b) => a.revenue - b.revenue,
                                    },
                                    { title: 'Bookings', dataIndex: 'count', key: 'count' },
                                    {
                                        title: '% of Total',
                                        key: 'pct',
                                        render: (_, r) => {
                                            const total = bySource.reduce((s, x) => s + x.revenue, 0);
                                            return total > 0 ? `${((r.revenue / total) * 100).toFixed(1)}%` : '0%';
                                        },
                                    },
                                ]}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };

    // --- Guest Payments Tab ---
    const GuestPaymentsTab = () => {
        const columns = [
            { title: 'Res #', dataIndex: 'resNo', key: 'resNo', width: 100 },
            { title: 'Guest', dataIndex: 'guestName', key: 'guestName', width: 160 },
            { title: 'Room', dataIndex: 'room', key: 'room', width: 90 },
            {
                title: 'Check In',
                dataIndex: 'checkIn',
                key: 'checkIn',
                width: 110,
                render: (v) => v ? dayjs(v).format('DD MMM YYYY') : '-',
            },
            {
                title: 'Check Out',
                dataIndex: 'checkOut',
                key: 'checkOut',
                width: 110,
                render: (v) => v ? dayjs(v).format('DD MMM YYYY') : '-',
            },
            {
                title: 'Total Tariff',
                dataIndex: 'totalTariff',
                key: 'totalTariff',
                width: 120,
                render: (v) => formatCurrency(v),
                sorter: (a, b) => a.totalTariff - b.totalTariff,
            },
            {
                title: 'Payments',
                dataIndex: 'totalPayments',
                key: 'totalPayments',
                width: 120,
                render: (v) => formatCurrency(v),
            },
            {
                title: 'Balance',
                dataIndex: 'balance',
                key: 'balance',
                width: 120,
                render: (v) => (
                    <Text style={{ color: v > 0 ? '#cf1322' : '#3f8600', fontWeight: 600 }}>
                        {formatCurrency(v)}
                    </Text>
                ),
                sorter: (a, b) => a.balance - b.balance,
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (s) => {
                    const colorMap = { Active: 'blue', Departed: 'green', Confirmed: 'cyan', Canceled: 'red' };
                    return <Tag color={colorMap[s] || 'default'}>{s}</Tag>;
                },
            },
            { title: 'Source', dataIndex: 'bookingSource', key: 'bookingSource', width: 100 },
        ];

        const totalTariff = guestPayments.reduce((s, r) => s + r.totalTariff, 0);
        const totalPaid = guestPayments.reduce((s, r) => s + r.totalPayments, 0);
        const totalBalance = guestPayments.reduce((s, r) => s + r.balance, 0);

        return (
            <div>
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={8}>
                        <Card size="small">
                            <Statistic title="Total Tariff" value={totalTariff} prefix="$" precision={2} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card size="small">
                            <Statistic title="Total Payments" value={totalPaid} prefix="$" precision={2} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card size="small">
                            <Statistic
                                title="Total Outstanding"
                                value={totalBalance}
                                prefix="$"
                                precision={2}
                                valueStyle={{ color: totalBalance > 0 ? '#cf1322' : '#3f8600' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card>
                    <Table
                        dataSource={guestPayments}
                        columns={columns}
                        rowKey="_id"
                        size="small"
                        scroll={{ x: 1100 }}
                        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t) => `${t} reservations` }}
                        rowClassName={(r) => r.balance > 0 ? 'row-outstanding' : ''}
                    />
                </Card>
            </div>
        );
    };

    // --- Expenses Tab ---
    const ExpensesTab = () => {
        const typeColumns = [
            { title: 'Type', dataIndex: 'type', key: 'type' },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                render: (v) => formatCurrency(v),
                sorter: (a, b) => a.total - b.total,
                defaultSortOrder: 'descend',
            },
            { title: 'Count', dataIndex: 'count', key: 'count' },
        ];

        const entryColumns = [
            {
                title: 'Date',
                dataIndex: 'entryDate',
                key: 'entryDate',
                render: (v) => v ? dayjs(v).format('DD MMM YYYY') : '-',
                sorter: (a, b) => dayjs(a.entryDate).unix() - dayjs(b.entryDate).unix(),
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                render: (t) => {
                    const colorMap = { Invoice: 'blue', Payment: 'green', Credit: 'orange', Adjustment: 'purple' };
                    return <Tag color={colorMap[t] || 'default'}>{t}</Tag>;
                },
            },
            { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
            {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount',
                render: (v) => formatCurrency(v),
                sorter: (a, b) => a.amount - b.amount,
            },
            { title: 'Reference', dataIndex: 'referenceNo', key: 'referenceNo' },
        ];

        return (
            <div>
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={10}>
                        <Card title="Summary by Type">
                            <Table
                                dataSource={expenses.byType}
                                columns={typeColumns}
                                rowKey="type"
                                pagination={false}
                                size="small"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={14}>
                        <Card title="Monthly Trend">
                            {expenses.monthlyTrend.length > 0 ? (
                                <Column
                                    data={expenses.monthlyTrend}
                                    xField="period"
                                    yField="total"
                                    height={300}
                                    axis={{
                                        y: { labelFormatter: (v) => `$${Number(v).toLocaleString()}` },
                                    }}
                                />
                            ) : (
                                <Empty description="No accounting entries" />
                            )}
                        </Card>
                    </Col>
                </Row>

                <Card title="All Accounting Entries" style={{ marginTop: 24 }}>
                    <Table
                        dataSource={expenses.entries}
                        columns={entryColumns}
                        rowKey="_id"
                        size="small"
                        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t) => `${t} entries` }}
                    />
                </Card>
            </div>
        );
    };

    // --- Staff Wages Tab ---
    const StaffWagesTab = () => (
        <Card>
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                    <div>
                        <Title level={4} style={{ marginBottom: 8 }}>Staff Wages - Coming Soon</Title>
                        <Text type="secondary">
                            This module will include wage calculations, timesheets, and payroll summaries.
                        </Text>
                    </div>
                }
            />
        </Card>
    );

    // --- Tab items ---
    const tabItems = [
        {
            key: 'overview',
            label: <span><BarChartOutlined /> Overview</span>,
            children: <OverviewTab />,
        },
        {
            key: 'revenue',
            label: <span><RiseOutlined /> Revenue Analysis</span>,
            children: <RevenueAnalysisTab />,
        },
        {
            key: 'payments',
            label: <span><DollarOutlined /> Guest Payments</span>,
            children: <GuestPaymentsTab />,
        },
        {
            key: 'expenses',
            label: <span><FileTextOutlined /> Expenses</span>,
            children: <ExpensesTab />,
        },
        {
            key: 'wages',
            label: <span><TeamOutlined /> Staff Wages</span>,
            children: <StaffWagesTab />,
        },
    ];

    return (
        <div ref={printRef}>
            <div style={{ marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Financial Reports</Title>
                <Text type="secondary">
                    {startDate && endDate
                        ? `${dayjs(startDate).format('DD MMM YYYY')} - ${dayjs(endDate).format('DD MMM YYYY')}`
                        : 'All time'}
                </Text>
            </div>

            {FilterBar}

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: 80 }}>
                    <Spin size="large" tip="Loading financial data..." />
                </div>
            ) : (
                <Tabs defaultActiveKey="overview" items={tabItems} size="large" />
            )}

            <style>{`
                .row-outstanding { background-color: #fff2f0 !important; }
                @media print {
                    .ant-layout-sider, .ant-layout-header, .ant-tabs-nav { display: none !important; }
                    .ant-layout-content { margin: 0 !important; }
                    .ant-card { break-inside: avoid; }
                }
            `}</style>
        </div>
    );
};

export default FinancialReports;
