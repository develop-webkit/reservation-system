// src/pages/BookingChart.jsx (FINAL PAGE STRUCTURE)

import React from 'react';
import CoreBookingChart from '../components/BookingChart';
import BookingChartHeader from '../components/BookingChartHeader'; // <-- IMPORT NEW HEADER
import { ConfigProvider, theme } from 'antd';

// This page component applies the light theme and sets up the layout.
const BookingChartPage = () => {
    // Note: Removed ConfigProvider/darkAlgorithm since the chart is now white/light
    return (
        <div style={{ 
            // The padding/margin values here are to ensure the component 
            // fits correctly within the AntD Content area defined in App.jsx
            padding: 0, 
            margin: -10, 
            width: 'calc(100% + 20px)', 
            minHeight: 'calc(100vh - 82px)',
            backgroundColor: '#f0f2f5' // Matches AntD default background
        }}>
            {/* 1. The Interactive Controls Header */}
            <BookingChartHeader /> 

            {/* 2. The Core Booking Chart Component (The Grid) */}
            <CoreBookingChart />
        </div>
    );
};

export default BookingChartPage;