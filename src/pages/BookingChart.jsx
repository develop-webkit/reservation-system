// src/pages/BookingChart.jsx
import React, { useState } from 'react';
import dayjs from 'dayjs';
import CoreBookingChart from '../components/BookingChart';
import BookingChartHeader from '../components/BookingChartHeader';
import { roomsData } from '../data/mockData';


const BookingChartPage = () => {
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [visibleDays, setVisibleDays] = useState(30);
    const [collapsedCategories, setCollapsedCategories] = useState(new Set());

    // Filter states
    const [filters, setFilters] = useState({
        surname: '',
        status: [],
        tariffType: [],
        area: ''
    });

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
                filters={filters}
                onFiltersChange={setFilters}
            />
            <CoreBookingChart
                startDate={startDate}
                visibleDays={visibleDays}
                collapsedCategories={collapsedCategories}
                onToggleCategory={toggleCategory}
                filters={filters}
            />
        </div>
    );
};

export default BookingChartPage;