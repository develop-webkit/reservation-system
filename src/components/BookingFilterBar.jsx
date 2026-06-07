// src/components/BookingFilterBar.jsx

import React, { useState } from 'react';
import { Row, Col, DatePicker, Select, Input, Button, Space, theme } from 'antd';
import { SearchOutlined, FilterOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Search } = Input;
const { Option } = Select;

const BookingFilterBar = ({ onFilterChange }) => {
    // State to hold filter values (e.g., date range, room type, search term)
    const [filters, setFilters] = useState({
        date: moment(),
        roomType: 'ALL',
        status: 'ALL',
        searchTerm: '',
    });
    
    // Ant Design hook for theme tokens (used for dark theme inputs)
    const { token } = theme.useToken();

    const uniqueRoomTypes = ['ALL', 'Single', 'Double', 'Suite', 'Deluxe'];
    
    // Mock booking statuses
    const bookingStatuses = ['ALL', 'CONFIRMED', 'PENDING', 'CHECKED_IN', 'CHECKED_OUT'];

    const handleDateChange = (date) => {
        const newFilters = { ...filters, date };
        setFilters(newFilters);
        if (onFilterChange) onFilterChange(newFilters);
    };

    const handleSelectChange = (value, name) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        if (onFilterChange) onFilterChange(newFilters);
    };

    const handleSearch = (value) => {
        const newFilters = { ...filters, searchTerm: value };
        setFilters(newFilters);
        if (onFilterChange) onFilterChange(newFilters);
    };

    return (
        <Row gutter={[16, 16]} align="middle" style={{ width: '100%' }}>
            {/* 1. Date Picker (Focus Date/Start Date) */}
            <Col>
                <Space>
                    <CalendarOutlined style={{ color: token.colorTextSecondary }} />
                    <DatePicker 
                        value={filters.date}
                        onChange={handleDateChange}
                        allowClear={false}
                        inputReadOnly={true}
                        style={{ width: 120 }}
                        // Apply Dark theme styling to the picker
                        className="dark-picker" 
                    />
                </Space>
            </Col>

            {/* 2. Room Type Filter */}
            <Col>
                <Space>
                    <FilterOutlined style={{ color: token.colorTextSecondary }} />
                    <Select
                        placeholder="Room Type"
                        style={{ width: 150 }}
                        value={filters.roomType}
                        onChange={(value) => handleSelectChange(value, 'roomType')}
                    >
                        {uniqueRoomTypes.map(type => (
                            <Option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalize first letter */}
                            </Option>
                        ))}
                    </Select>
                </Space>
            </Col>

            {/* 3. Status Filter */}
            <Col>
                <Select
                    placeholder="Status"
                    style={{ width: 150 }}
                    value={filters.status}
                    onChange={(value) => handleSelectChange(value, 'status')}
                >
                    {bookingStatuses.map(status => (
                        <Option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                        </Option>
                    ))}
                </Select>
            </Col>
            
            {/* 4. Guest Search Input */}
            <Col flex="auto">
                <Search
                    placeholder="Search Guest Name, ID..."
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                    allowClear
                    prefix={<SearchOutlined />}
                />
            </Col>

            {/* 5. Action Button (e.g., Quick Add Booking) */}
            <Col>
                <Button type="primary">
                    + New Booking
                </Button>
            </Col>
        </Row>
    );
};

export default BookingFilterBar;