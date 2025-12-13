// src/components/chart/ChartHeader.jsx
import React from 'react';
import { Space, Button, Select, theme, Typography } from 'antd'; // Ant Design components
import { 
    CalendarOutlined, 
    LeftOutlined, 
    RightOutlined, 
    ReloadOutlined, 
    SettingOutlined 
} from '@ant-design/icons'; // Ant Design Icons

const { Text } = Typography;
const { useToken } = theme;

// Mock data for the view selector
const viewOptions = [
    { value: 7, label: '7 Days' },
    { value: 14, label: '14 Days' },
    { value: 30, label: '30 Days' },
    { value: 90, label: '90 Days' },
    { value: 180, label: '180 Days' },
];

// Mock function to determine the current date text
const getCurrentDateRange = (chartDays) => {
    const today = new Date();
    const startDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const endDate = new Date();
    endDate.setDate(today.getDate() + chartDays - 1);
    const endDateString = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return `${startDate} - ${endDateString} (${today.getFullYear()})`;
};


const ChartHeader = ({ chartDays, ROOM_COL_WIDTH }) => {
    const { token } = useToken();
    
    // The date columns start at index 2 of the grid (index 1 is the room label column)
    const dateGridColumns = `repeat(${chartDays}, 1fr)`;

    return (
        <div className="chart-header-container">
            
            {/* 1. TOP TOOLBAR - Replaces the Bootstrap nav/toolbar */}
            <div 
                className="chart-toolbar"
                style={{ 
                    padding: token.paddingSM, 
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    background: token.colorBgContainer 
                }}
            >
                <Space size="middle" style={{ width: '100%', justifyContent: 'space-between' }}>
                    
                    {/* Left Side: Navigation Controls and View Selector */}
                    <Space>
                        {/* Go to Previous Period */}
                        <Button icon={<LeftOutlined />} />
                        {/* Go to Current Date */}
                        <Button type="primary" icon={<CalendarOutlined />}>Today</Button>
                        {/* Go to Next Period */}
                        <Button icon={<RightOutlined />} />
                        
                        {/* View Selector (e.g., 7 Days) */}
                        <Select
                            defaultValue={chartDays}
                            style={{ width: 100 }}
                            options={viewOptions}
                        />

                        {/* Current Date Range Display */}
                        <Text strong style={{ marginLeft: token.marginSM }}>
                            {getCurrentDateRange(chartDays)}
                        </Text>
                    </Space>
                    
                    {/* Right Side: Action Buttons */}
                    <Space>
                        <Button icon={<ReloadOutlined />}>Refresh</Button>
                        <Button icon={<SettingOutlined />}>Settings</Button>
                    </Space>
                </Space>
            </div>
            
            {/* 2. CHART GRID HEADER - Date/Day Column Headers (CSS Grid Part) */}
            <div 
                className="chart-date-header"
                style={{
                    // Use CSS Grid styles directly on this container
                    display: 'grid',
                    // The first column is the static Room Label width, followed by date columns
                    gridTemplateColumns: `${ROOM_COL_WIDTH} ${dateGridColumns}`, 
                    position: 'sticky', // Makes the header stick to the top when scrolling
                    top: 0,
                    zIndex: 2, // Ensure it sits above the scrolling chart body
                    backgroundColor: token.colorBgContainer, // White background
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                }}
            >
                {/* 2a. Static Empty Column (Aligns with Room Label) */}
                <div style={{ 
                    height: 50, // Fixed height for the header rows
                    lineHeight: '50px', 
                    paddingLeft: token.paddingSM,
                    borderRight: `1px solid ${token.colorBorderSecondary}`,
                    fontWeight: 'bold',
                    backgroundColor: token.colorFillAlter // Light gray for the sidebar column
                }}>
                    Room/Unit
                </div>

                {/* 2b. Dynamic Date Columns */}
                {/* Map through the mock dates to create the individual grid cells */}
                {chartDays > 0 && Array.from({ length: chartDays }).map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() + index);
                    
                    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const dateNum = date.getDate();
                    
                    const isWeekend = day === 'Sat' || day === 'Sun';
                    
                    return (
                        <div
                            key={index}
                            className="date-col-header"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 50,
                                fontSize: '0.8rem',
                                borderRight: `1px solid ${token.colorBorderSecondary}`,
                                // Highlight weekend days with a distinct background
                                backgroundColor: isWeekend ? token.colorFillQuaternary : token.colorBgContainer,
                            }}
                        >
                            <Text strong style={{ margin: 0 }}>{day}</Text>
                            <Text style={{ margin: 0, fontSize: '0.9rem' }}>{dateNum}</Text>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChartHeader;