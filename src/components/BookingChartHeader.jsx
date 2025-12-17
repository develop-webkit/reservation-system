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
import moment from 'moment';

const { Text } = Typography;

/**
 * @param {string} currentStart - The current start date (YYYY-MM-DD)
 * @param {number} visibleDays - The current zoom level (7, 30, 60)
 * @param {function} onDateChange - Function to update the start date
 * @param {function} onDaysSelect - Function to update the number of columns
 * @param {function} onTodayClick - Function to reset to today's date
 */
const BookingChartHeader = ({ 
    currentStart, 
    visibleDays, 
    onDateChange, 
    onDaysSelect, 
    onTodayClick 
}) => {

    // Helper to shift the date by the current "zoom" amount
    const handlePrev = () => {
        const newDate = moment(currentStart).subtract(visibleDays, 'days');
        onDateChange(newDate);
    };

    const handleNext = () => {
        const newDate = moment(currentStart).add(visibleDays, 'days');
        onDateChange(newDate);
    };

    return (
        <div style={{ 
            padding: '12px 20px', 
            borderBottom: '1px solid #cecece', 
            backgroundColor: '#fff', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            
            {/* --- Left Side: Navigation & Timeline Controls --- */}
            <Space size="middle">
                <Button.Group>
                    <Button 
                        icon={<LeftOutlined />} 
                        onClick={handlePrev}
                        title={`Prev ${visibleDays} Days`}
                    />
                    <Button 
                        icon={<RightOutlined />} 
                        onClick={handleNext}
                        title={`Next ${visibleDays} Days`}
                    />
                </Button.Group>

                <Button 
                    type="primary" 
                    onClick={onTodayClick}
                    style={{ fontWeight: '600' }}
                >
                    Today
                </Button>

                {/* The Date Picker: Updates the chart instantly when changed */}
                <DatePicker 
                    value={moment(currentStart)} 
                    onChange={(date) => onDateChange(date)}
                    format="MMM DD, YYYY"
                    allowClear={false}
                    suffixIcon={<CalendarOutlined />}
                    style={{ width: 160 }}
                />

                {/* Column Count (Zoom Level) */}
                <Select
                    value={String(visibleDays)}
                    style={{ width: 110 }}
                    onChange={(value) => onDaysSelect(Number(value))}
                    options={[
                        { value: '7', label: '7 Days' },
                        { value: '14', label: '14 Days' },
                        { value: '30', label: '30 Days' },
                        { value: '60', label: '60 Days' },
                    ]}
                />
                
                {/* Calculated Display Range */}
                <Text strong style={{ marginLeft: 8, color: '#595959' }}>
                    {moment(currentStart).format('MMM D')} - {moment(currentStart).add(visibleDays, 'days').format('MMM D, YYYY')}
                </Text>
            </Space>

            {/* --- Right Side: System Actions --- */}
            <Space size="middle">
                <Button icon={<RedoOutlined />} onClick={() => window.location.reload()}>
                    Refresh
                </Button>
                <Button icon={<SettingOutlined />} />
            </Space>
        </div>
    );
};

export default BookingChartHeader;