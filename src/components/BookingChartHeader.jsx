// src/components/BookingChartHeader.jsx

import React from 'react';
import { Button, Select, Space, DatePicker, Typography } from 'antd';
import { LeftOutlined, RightOutlined, SettingOutlined, RedoOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;
const { RangePicker } = DatePicker;

// Mock the initial date range for display purposes
const CURRENT_DATE_RANGE = 'Dec 13 - Jan 11 (2025)';

const BookingChartHeader = ({ onDateRangeChange, onDaysSelect, onTodayClick, dateRangeText }) => {
    
    // Handler for the "Today" button
    const handleTodayClick = () => {
        // In a real app, this would update the parent state to show today's date
        console.log('Navigating to Today...');
        if (onTodayClick) onTodayClick();
    };

    // Handler for the 7/30/60/90 day selection
    const handleDaysSelect = (value) => {
        // In a real app, this would update the chart's visible range
        console.log(`Setting view to ${value} days`);
        if (onDaysSelect) onDaysSelect(value);
    };

    return (
        <div style={{ padding: '16px', borderBottom: '1px solid #cecece', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* --- Left Side: Navigation Controls --- */}
            <Space size="small">
                {/* Arrow Buttons */}
                <Button.Group>
                    <Button icon={<LeftOutlined />} />
                    <Button icon={<RightOutlined />} />
                </Button.Group>

                {/* Today Button */}
                <Button 
                    type="primary" 
                    onClick={handleTodayClick}
                    style={{ fontWeight: 'bold' }}
                >
                    Today
                </Button>

                {/* Day Selection Dropdown */}
                <Select
                    defaultValue="30 Days"
                    style={{ width: 100 }}
                    onChange={handleDaysSelect}
                    options={[
                        { value: '7', label: '7 Days' },
                        { value: '30', label: '30 Days' },
                        { value: '60', label: '60 Days' },
                        { value: '90', label: '90 Days' },
                    ]}
                />
                
                {/* Date Range Display (We'll use a placeholder for now) */}
                <Text strong style={{ fontSize: '16px' }}>
                    {dateRangeText || CURRENT_DATE_RANGE}
                </Text>
            </Space>

            {/* --- Right Side: Actions --- */}
            <Space size="middle">
                <Button icon={<RedoOutlined />}>
                    Refresh
                </Button>
                <Button icon={<SettingOutlined />}>
                    Settings
                </Button>
            </Space>
        </div>
    );
};

export default BookingChartHeader;