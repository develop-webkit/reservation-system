// src/pages/BookingChart.jsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import CoreBookingChart from '../components/BookingChart';
import BookingChartHeader from '../components/BookingChartHeader';
import { useChartOptions } from '../hooks/useChartOptions';
import { roomsData } from '../data/mockData';

const AREA_HEIGHT_MAP = { Small: 30, Medium: 42, Large: 54 };

const BookingChartPage = () => {
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [collapsedCategories, setCollapsedCategories] = useState(new Set());
    const { options, saveOptions, restoreDefaults } = useChartOptions();

    // Sync visible days from options whenever options change
    const visibleDays = parseInt(options.dayView, 10) || 30;
    const rowHeight = AREA_HEIGHT_MAP[options.areaHeight] || 30;

    const [filters, setFilters] = useState({
        surname: '',
        status: [],
        tariffType: [],
        area: ''
    });

    const toggleCategory = (category) => {
        setCollapsedCategories(prev => {
            const next = new Set(prev);
            if (next.has(category)) next.delete(category);
            else next.add(category);
            return next;
        });
    };

    const handleExpandAll = () => setCollapsedCategories(new Set());

    const handleCollapseAll = () => {
        const allCategories = new Set(roomsData.map(r => r.category || 'Uncategorized'));
        setCollapsedCategories(allCategories);
    };

    const handleOptionsSave = (newOptions) => {
        return saveOptions(newOptions);
    };

    const handleOptionsRestore = () => {
        restoreDefaults();
    };

    return (
        <div>
            <BookingChartHeader
                currentStart={startDate}
                visibleDays={visibleDays}
                onDateChange={setStartDate}
                onDaysSelect={(v) => saveOptions({ ...options, dayView: String(v) })}
                onExpandAll={handleExpandAll}
                onCollapseAll={handleCollapseAll}
                filters={filters}
                onFiltersChange={setFilters}
                chartOptions={options}
                onChartOptionsSave={handleOptionsSave}
                onChartOptionsRestore={handleOptionsRestore}
            />
            <CoreBookingChart
                startDate={startDate}
                visibleDays={visibleDays}
                rowHeight={rowHeight}
                collapsedCategories={collapsedCategories}
                onToggleCategory={toggleCategory}
                filters={filters}
                chartOptions={options}
            />
        </div>
    );
};

export default BookingChartPage;
