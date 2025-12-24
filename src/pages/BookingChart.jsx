// src/pages/BookingChart.jsx
import React, { useState } from 'react';
import CoreBookingChart from '../components/BookingChart';
import BookingChartHeader from '../components/BookingChartHeader';
import { roomsData } from '../data/mockData';


const BookingChartPage = () => {
    const [startDate, setStartDate] = useState('2025-12-13');
    const [visibleDays, setVisibleDays] = useState(30);
    const [collapsedCategories, setCollapsedCategories] = useState(new Set());

    const toggleCategory = (category) => {
        const newCollapsed = new Set(collapsedCategories);
        if (newCollapsed.has(category)) {
            newCollapsed.delete(category);
        } else {
            newCollapsed.add(category);
        }
        setCollapsedCategories(newCollapsed);
    };

    const handleExpandAll = () => {
        setCollapsedCategories(new Set());
    };

    const handleCollapseAll = () => {
        const allCategories = new Set(roomsData.map(r => r.category || 'Uncategorized'));
        setCollapsedCategories(allCategories);
    };

    return (
        <div>
            <BookingChartHeader
                currentStart={startDate}
                visibleDays={visibleDays}
                onDateChange={(d) => setStartDate(d)}
                onDaysSelect={(v) => setVisibleDays(v)}
                onExpandAll={handleExpandAll}
                onCollapseAll={handleCollapseAll}
                propertyName="Mount Morgan Space Solutions"
            />
            <CoreBookingChart
                startDate={startDate}
                visibleDays={visibleDays}
                collapsedCategories={collapsedCategories}
                onToggleCategory={toggleCategory}
            />
        </div>
    );
};

export default BookingChartPage;