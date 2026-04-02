// src/components/BookingChartHeader.jsx
import React, { useState } from 'react';
import { Button, Select, Space, DatePicker, Typography, Popover, Badge, Divider, Input } from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    SettingOutlined,
    RedoOutlined,
    CalendarOutlined,
    MinusOutlined,
    PlusOutlined,
    InfoCircleOutlined,
    SwapOutlined,
    FilterOutlined,
    CloseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import BookingChartOptionsModal from './BookingChartOptionsModal';

const { Text } = Typography;

const LegendContent = () => (
    <div style={{ width: '220px' }}>
        {/* Top Items */}
        <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: 20, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 6, height: 6, backgroundColor: '#000' }} />
                </div>
                <Text style={{ fontSize: '12px', marginLeft: 8 }}>Fixed Reservation</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: 20, display: 'flex', justifyContent: 'center' }}>
                    <SwapOutlined style={{ fontSize: '12px', color: '#000' }} />
                </div>
                <Text style={{ fontSize: '12px', marginLeft: 8 }}>Moveable Reservation</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 20, display: 'flex', justifyContent: 'center' }}>
                    <Text strong style={{ fontStyle: 'italic', fontSize: '12px' }}>I</Text>
                </div>
                <Text style={{ fontSize: '12px', marginLeft: 8 }}>Event Reservation</Text>
            </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Gender */}
        <div style={{ marginBottom: '12px' }}>
            <Text strong style={{ fontSize: '12px' }}>Gender</Text>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Badge color="#1890ff" text={<span style={{ fontSize: '12px' }}>Male</span>} />
                <Badge color="#eb2f96" text={<span style={{ fontSize: '12px' }}>Female</span>} />
                <Badge color="#d9d9d9" text={<span style={{ fontSize: '12px' }}>Not Set</span>} />
            </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Reservation Status */}
        <div style={{ marginBottom: '12px' }}>
            <Text strong style={{ fontSize: '12px' }}>Reservation Status</Text>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Badge color="#faad14" text={<span style={{ fontSize: '12px' }}>Unconfirmed</span>} />
                <Badge color="#52c41a" text={<span style={{ fontSize: '12px' }}>Confirmed</span>} />
                <Badge color="#1890ff" text={<span style={{ fontSize: '12px' }}>Arrived</span>} />
                <Badge color="#13c2c2" text={<span style={{ fontSize: '12px' }}>Pre Check In</span>} />
                <Badge color="#eb2f96" text={<span style={{ fontSize: '12px' }}>Departed</span>} />
                <Badge color="#722ed1" text={<span style={{ fontSize: '12px' }}>Out of Order</span>} />
            </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Credit Status */}
        <div style={{ marginBottom: '12px' }}>
            <Text strong style={{ fontSize: '12px' }}>Credit Status</Text>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Badge color="#faad14" text={<span style={{ fontSize: '12px' }}>Account In Debit</span>} />
                <Badge color="#52c41a" text={<span style={{ fontSize: '12px' }}>Account In Credit</span>} />
                <Badge color="#d9d9d9" text={<span style={{ fontSize: '12px' }}>Zero Balance</span>} />
            </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Area Status */}
        <div>
            <Text strong style={{ fontSize: '12px' }}>Area Status</Text>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Badge color="#52c41a" text={<span style={{ fontSize: '12px' }}>Clean</span>} />
                <Badge color="#f5222d" text={<span style={{ fontSize: '12px' }}>Dirty</span>} />
                <Badge color="#722ed1" text={<span style={{ fontSize: '12px' }}>Out of Order</span>} />
                <Badge color="#faad14" text={<span style={{ fontSize: '12px' }}>Occupied</span>} />
            </div>
        </div>
    </div>
);

const BookingChartHeader = ({
    currentStart,
    visibleDays,
    onDateChange,
    onDaysSelect,
    onExpandAll,
    onCollapseAll,
    filters,
    onFiltersChange
}) => {
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const debounceTimerRef = React.useRef(null);

    // Debounced filter update
    const handleFilterChange = (newFilters) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            onFiltersChange(newFilters);
        }, 300); // 300ms debounce
    };

    React.useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handlePrev = () => {
        const newDate = dayjs(currentStart).subtract(1, 'days').format('YYYY-MM-DD');
        onDateChange(newDate);
    };

    const handleNext = () => {
        const newDate = dayjs(currentStart).add(1, 'days').format('YYYY-MM-DD');
        onDateChange(newDate);
    };

    const startStr = dayjs(currentStart).format('MMM D');
    const endStr = dayjs(currentStart).add(visibleDays - 1, 'days').format('MMM D, YYYY');

    const hasActiveFilters = filters.surname || filters.status?.length > 0 || filters.tariffType?.length > 0 || filters.area;

    const handleResetFilters = () => {
        onFiltersChange({
            surname: '',
            status: [],
            tariffType: [],
            area: ''
        });
        setShowFilters(false);
    };

    return (
        <>
            <div style={{
                padding: '16px', borderBottom: '1px solid #cecece', backgroundColor: '#fff',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Space size="middle">
                    {/* Expand/Collapse Group */}
                    <Space.Compact>
                        <Button icon={<PlusOutlined />} onClick={onExpandAll} title="Expand All" />
                        <Button icon={<MinusOutlined />} onClick={onCollapseAll} title="Collapse All" />
                    </Space.Compact>

                    {/* Navigation Group */}
                    <Space.Compact>
                        <Button icon={<LeftOutlined />} onClick={handlePrev} />
                        <Button onClick={() => onDateChange(dayjs().format('YYYY-MM-DD'))}>Today</Button>
                        <Button icon={<RightOutlined />} onClick={handleNext} />
                    </Space.Compact>

                    <DatePicker
                        value={dayjs(currentStart)}
                        onChange={(date) => {
                            if (date && date.isValid()) {
                                onDateChange(date.format('YYYY-MM-DD'));
                            }
                        }}
                        format="MMM DD, YYYY"
                        allowClear={false}
                        suffixIcon={<CalendarOutlined />}
                        style={{ width: 160 }}
                    />

                    <Select
                        value={String(visibleDays)}
                        style={{ width: 110 }}
                        onChange={(val) => onDaysSelect(Number(val))}
                        options={[
                            { value: '7', label: '7 Days' },
                            { value: '14', label: '14 Days' },
                            { value: '30', label: '30 Days' },
                            { value: '60', label: '60 Days' },
                        ]}
                    />

                    <Text strong style={{ marginLeft: 8, color: '#141414', fontSize: '15px' }}>
                        {startStr} — {endStr}
                    </Text>
                </Space>

                <Space size="middle">
                    <Popover
                        content={<LegendContent />}
                        title={<Text strong>Legend</Text>}
                        trigger="click"
                        placement="bottomRight"
                    >
                        <Button
                            icon={<InfoCircleOutlined style={{ fontSize: '18px', color: '#13c2c2' }} />}
                            type="text"
                            style={{ padding: 4 }}
                        />
                    </Popover>
                    <Button
                        icon={<FilterOutlined />}
                        onClick={() => setShowFilters(!showFilters)}
                        type={hasActiveFilters ? 'primary' : 'default'}
                        danger={hasActiveFilters}
                    >
                        Filter {hasActiveFilters && <Badge count={Object.values(filters).filter(f => f && (Array.isArray(f) ? f.length > 0 : true)).length} style={{ backgroundColor: '#ff4d4f' }} />}
                    </Button>
                    <Button icon={<RedoOutlined />} onClick={() => window.location.reload()}>Refresh</Button>
                    <Button icon={<SettingOutlined />} onClick={() => setIsOptionsVisible(true)} />
                </Space>

                <BookingChartOptionsModal visible={isOptionsVisible} onClose={() => setIsOptionsVisible(false)} />
            </div>

            {/* Filter Section */}
            {showFilters && (
                <div style={{
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderBottom: '1px solid #cecece',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <Text strong style={{ marginRight: '8px' }}>Filters:</Text>

                    {/* Surname Filter */}
                    <Input
                        placeholder="Surname"
                        value={filters.surname}
                        onChange={(e) => handleFilterChange({ ...filters, surname: e.target.value })}
                        style={{ width: '150px' }}
                        allowClear
                    />

                    {/* Reservation Status Filter */}
                    <Select
                        mode="multiple"
                        placeholder="Reservation Status"
                        value={filters.status}
                        onChange={(val) => onFiltersChange({ ...filters, status: val })}
                        style={{ width: '200px' }}
                        options={[
                            { value: 'Unconfirmed', label: 'Unconfirmed' },
                            { value: 'Confirmed', label: 'Confirmed' },
                            { value: 'Arrived', label: 'Arrived' },
                            { value: 'Pre Check In', label: 'Pre Check In' },
                            { value: 'Departed', label: 'Departed' },
                            { value: 'Canceled', label: 'Canceled' },
                        ]}
                        maxTagCount="responsive"
                    />

                    {/* Tariff Type Filter */}
                    <Select
                        mode="multiple"
                        placeholder="Occupied Room Rate P/Y"
                        value={filters.tariffType}
                        onChange={(val) => onFiltersChange({ ...filters, tariffType: val })}
                        style={{ width: '220px' }}
                        options={[
                            { value: 'Standard', label: 'Standard' },
                            { value: 'Corporate', label: 'Corporate' },
                            { value: 'Government', label: 'Government' },
                            { value: 'Contract', label: 'Contract' },
                            { value: 'Occupied Room Rate PRPN', label: 'PRPN' },
                        ]}
                        maxTagCount="responsive"
                    />

                    {/* Area Filter */}
                    <Input
                        placeholder="Filter Area (Room)"
                        value={filters.area}
                        onChange={(e) => handleFilterChange({ ...filters, area: e.target.value })}
                        style={{ width: '150px' }}
                        allowClear
                    />

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <Button
                            danger
                            size="small"
                            onClick={handleResetFilters}
                            icon={<CloseOutlined />}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            )}
        </>
    );
};

export default BookingChartHeader;
