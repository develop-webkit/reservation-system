import React, { useState, useMemo } from 'react';
import {
    Card, Row, Col, Statistic, Table, DatePicker, Input, Button,
    Typography, Spin, Tag, Space, Tooltip,
} from 'antd';
import {
    DollarOutlined, UserOutlined, HomeOutlined, PrinterOutlined,
    SearchOutlined, WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
    useReportReservations, useReportAccounting, useGuestDebtors,
} from '../hooks/useFinancialReports';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const formatCurrency = (val) => `$${(Number(val) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const GuestDebtorsReport = () => {
    const [dateRange, setDateRange] = useState([
        dayjs().startOf('month'),
        dayjs().endOf('month'),
    ]);
    const [search, setSearch] = useState('');
    const [onlyOutstanding, setOnlyOutstanding] = useState(true);

    const startDate = dateRange?.[0]?.format('YYYY-MM-DD');
    const endDate = dateRange?.[1]?.format('YYYY-MM-DD');

    const { data: reservationsData, isLoading: loadingRes } = useReportReservations();
    const { data: accountingData, isLoading: loadingAcc } = useReportAccounting();

    const isLoading = loadingRes || loadingAcc;
    const debtors = useGuestDebtors(reservationsData, accountingData, startDate, endDate);

    const filtered = useMemo(() => {
        let list = debtors;
        if (onlyOutstanding) list = list.filter((d) => d.totalBalance > 0);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (d) =>
                    d.clientName.toLowerCase().includes(q) ||
                    (d.createdBy || '').toLowerCase().includes(q) ||
                    d.rooms.some((r) => r.toLowerCase().includes(q)) ||
                    (d.clientNo || '').toLowerCase().includes(q)
            );
        }
        return list;
    }, [debtors, search, onlyOutstanding]);

    const totals = useMemo(() => ({
        guestCount: filtered.length,
        totalOwed: filtered.reduce((s, d) => s + d.totalBalance, 0),
        totalTariff: filtered.reduce((s, d) => s + d.totalTariff, 0),
        totalPaid: filtered.reduce((s, d) => s + d.totalPaid, 0),
        totalRooms: new Set(filtered.flatMap((d) => d.rooms)).size,
    }), [filtered]);

    const columns = [
        {
            title: 'Client Name',
            dataIndex: 'clientName',
            key: 'clientName',
            fixed: 'left',
            width: 200,
            render: (name, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{name}</Text>
                    {record.clientNo !== '-' && (
                        <Text type="secondary" style={{ fontSize: 11 }}>#{record.clientNo}</Text>
                    )}
                </Space>
            ),
            sorter: (a, b) => a.clientName.localeCompare(b.clientName),
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 140,
            render: (v) => v && v !== '-' ? <Tag icon={<UserOutlined />}>{v}</Tag> : <Text type="secondary">-</Text>,
            sorter: (a, b) => (a.createdBy || '').localeCompare(b.createdBy || ''),
        },
        {
            title: 'Bookings',
            dataIndex: 'bookingsCount',
            key: 'bookingsCount',
            width: 90,
            align: 'center',
            sorter: (a, b) => a.bookingsCount - b.bookingsCount,
        },
        {
            title: 'Rooms Booked',
            dataIndex: 'rooms',
            key: 'rooms',
            width: 240,
            render: (rooms) => (
                <Space size={[4, 4]} wrap>
                    {rooms.map((r) => (
                        <Tag key={r} color="blue" icon={<HomeOutlined />}>{r}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Last Stay',
            dataIndex: 'lastCheckIn',
            key: 'lastCheckIn',
            width: 120,
            render: (d) => d ? dayjs(d).format('DD MMM YYYY') : '-',
            sorter: (a, b) =>
                (a.lastCheckIn ? dayjs(a.lastCheckIn).unix() : 0) -
                (b.lastCheckIn ? dayjs(b.lastCheckIn).unix() : 0),
        },
        {
            title: 'Total Tariff',
            dataIndex: 'totalTariff',
            key: 'totalTariff',
            width: 130,
            render: (v) => formatCurrency(v),
            sorter: (a, b) => a.totalTariff - b.totalTariff,
        },
        {
            title: 'Paid',
            dataIndex: 'totalPaid',
            key: 'totalPaid',
            width: 130,
            render: (v) => <Text style={{ color: '#3f8600' }}>{formatCurrency(v)}</Text>,
            sorter: (a, b) => a.totalPaid - b.totalPaid,
        },
        {
            title: 'Outstanding',
            dataIndex: 'totalBalance',
            key: 'totalBalance',
            width: 150,
            render: (v) => (
                <Text strong style={{
                    color: v > 0 ? '#cf1322' : '#3f8600',
                    fontSize: 14,
                }}>
                    {v > 0 && <WarningOutlined style={{ marginRight: 4 }} />}
                    {formatCurrency(v)}
                </Text>
            ),
            sorter: (a, b) => a.totalBalance - b.totalBalance,
            defaultSortOrder: 'descend',
        },
        {
            title: 'Booking Sources',
            dataIndex: 'sources',
            key: 'sources',
            width: 180,
            render: (sources) => (
                <Space size={[4, 4]} wrap>
                    {sources.map((s) => (
                        <Tag key={s}>{s}</Tag>
                    ))}
                </Space>
            ),
        },
    ];

    const expandedRowRender = (record) => {
        const subColumns = [
            { title: 'Res #', dataIndex: 'resNo', key: 'resNo', width: 120 },
            {
                title: 'Room',
                key: 'room',
                width: 100,
                render: (_, r) => r.roomId || r.room?.name || '-',
            },
            {
                title: 'Check In',
                dataIndex: 'checkIn',
                key: 'checkIn',
                width: 120,
                render: (v) => v ? dayjs(v).format('DD MMM YYYY') : '-',
            },
            {
                title: 'Check Out',
                dataIndex: 'checkOut',
                key: 'checkOut',
                width: 120,
                render: (v) => v ? dayjs(v).format('DD MMM YYYY') : '-',
            },
            {
                title: 'Nights',
                key: 'nights',
                width: 80,
                render: (_, r) => {
                    if (!r.checkIn || !r.checkOut) return '-';
                    return dayjs(r.checkOut).diff(dayjs(r.checkIn), 'day');
                },
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 110,
                render: (s) => {
                    const colorMap = { Departed: 'green', CheckedIn: 'blue', Confirmed: 'cyan', Unconfirmed: 'orange', Canceled: 'red' };
                    return <Tag color={colorMap[s] || 'default'}>{s}</Tag>;
                },
            },
            {
                title: 'Tariff',
                dataIndex: 'totalTariff',
                key: 'totalTariff',
                width: 110,
                render: (v) => formatCurrency(v),
            },
            {
                title: 'Balance',
                dataIndex: 'balance',
                key: 'balance',
                width: 120,
                render: (v) => (
                    <Text style={{ color: v > 0 ? '#cf1322' : '#3f8600' }}>
                        {formatCurrency(v)}
                    </Text>
                ),
            },
        ];

        return (
            <Table
                columns={subColumns}
                dataSource={record.reservations}
                rowKey="_id"
                pagination={false}
                size="small"
            />
        );
    };

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Guest Debtors Report</Title>
                <Text type="secondary">
                    Track who owes us money and which rooms they've booked
                </Text>
            </div>

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
                    <Input
                        placeholder="Search guest, client # or room"
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: 260 }}
                        allowClear
                    />
                </Col>
                <Col>
                    <Button
                        type={onlyOutstanding ? 'primary' : 'default'}
                        onClick={() => setOnlyOutstanding((v) => !v)}
                    >
                        {onlyOutstanding ? 'Showing Debtors Only' : 'Showing All Guests'}
                    </Button>
                </Col>
                <Col flex="auto" style={{ textAlign: 'right' }}>
                    <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
                        Print
                    </Button>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Guests"
                            value={totals.guestCount}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Rooms Involved"
                            value={totals.totalRooms}
                            prefix={<HomeOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Paid"
                            value={totals.totalPaid}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Outstanding"
                            value={totals.totalOwed}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: totals.totalOwed > 0 ? '#cf1322' : '#3f8600' }}
                        />
                    </Card>
                </Col>
            </Row>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: 80 }}>
                    <Spin size="large" tip="Loading debtors..." />
                </div>
            ) : (
                <Card>
                    <Table
                        columns={columns}
                        dataSource={filtered}
                        rowKey="clientName"
                        expandable={{ expandedRowRender }}
                        size="small"
                        scroll={{ x: 1200 }}
                        pagination={{
                            pageSize: 25,
                            showSizeChanger: true,
                            showTotal: (t) => `${t} guests`,
                        }}
                        rowClassName={(r) => r.totalBalance > 0 ? 'row-debtor' : ''}
                        summary={(data) => {
                            const sumTariff = data.reduce((s, r) => s + r.totalTariff, 0);
                            const sumPaid = data.reduce((s, r) => s + r.totalPaid, 0);
                            const sumBalance = data.reduce((s, r) => s + r.totalBalance, 0);
                            return (
                                <Table.Summary fixed>
                                    <Table.Summary.Row style={{ background: '#fafafa' }}>
                                        <Table.Summary.Cell index={0} colSpan={5}>
                                            <strong>Page Totals</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={5}>
                                            <strong>{formatCurrency(sumTariff)}</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={6}>
                                            <strong style={{ color: '#3f8600' }}>{formatCurrency(sumPaid)}</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={7}>
                                            <strong style={{ color: sumBalance > 0 ? '#cf1322' : '#3f8600' }}>
                                                {formatCurrency(sumBalance)}
                                            </strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={8} />
                                    </Table.Summary.Row>
                                </Table.Summary>
                            );
                        }}
                    />
                </Card>
            )}

            <style>{`
                .row-debtor { background-color: #fff2f0 !important; }
                @media print {
                    .ant-layout-sider, .ant-layout-header { display: none !important; }
                    .ant-layout-content { margin: 0 !important; }
                    .ant-card { break-inside: avoid; }
                }
            `}</style>
        </div>
    );
};

export default GuestDebtorsReport;
