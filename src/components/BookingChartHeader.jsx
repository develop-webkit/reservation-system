// src/components/BookingChartHeader.jsx
import React from 'react';
import { Button, Select, Space, DatePicker, Typography } from 'antd';
import { 
    LeftOutlined, 
    RightOutlined, 
    SettingOutlined, 
    RedoOutlined,
    CalendarOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs'; 

const { Text } = Typography;

const BookingChartHeader = ({ 
    currentStart, 
    visibleDays, 
    onDateChange, 
    onDaysSelect 
}) => {

    // dayjs is immutable - these operations create NEW date strings safely
    const handlePrev = () => {
        const newDate = dayjs(currentStart).subtract(visibleDays, 'days').format('YYYY-MM-DD');
        onDateChange(newDate);
    };

    const handleNext = () => {
        const newDate = dayjs(currentStart).add(visibleDays, 'days').format('YYYY-MM-DD');
        onDateChange(newDate);
    };

    const startStr = dayjs(currentStart).format('MMM D');
    const endStr = dayjs(currentStart).add(visibleDays - 1, 'days').format('MMM D, YYYY');

    return (
        <div style={{ 
            padding: '16px', borderBottom: '1px solid #cecece', backgroundColor: '#fff', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
        }}>
            <Space size="middle">
                <Button.Group>
                    <Button icon={<LeftOutlined />} onClick={handlePrev} />
                    <Button onClick={() => onDateChange(dayjs().format('YYYY-MM-DD'))}>Today</Button>
                    <Button icon={<RightOutlined />} onClick={handleNext} />
                </Button.Group>

                <DatePicker 
                    // Convert string back to object for the UI only
                    value={dayjs(currentStart)}
                    onChange={(date) => {
                        // Send only the string to the parent to prevent the .format() error
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
                        { value: '90', label: '90 Days' },
                    ]}
                />
                
                <Text strong style={{ marginLeft: 8, color: '#141414', fontSize: '15px' }}>
                    {startStr} — {endStr}
                </Text>
            </Space>

            <Space size="middle">
                <Button icon={<RedoOutlined />} onClick={() => window.location.reload()}>Refresh</Button>
                <Button icon={<SettingOutlined />} />
            </Space>
        </div>
    );
};

export default BookingChartHeader;