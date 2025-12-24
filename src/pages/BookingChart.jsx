// src/pages/BookingChart.jsx
import React, { useState } from 'react';
import CoreBookingChart from '../components/BookingChart';
import BookingChartHeader from '../components/BookingChartHeader';
import moment from 'moment';

const BookingChartPage = () => {
    const [startDate, setStartDate] = useState('2025-12-13');
    const [visibleDays, setVisibleDays] = useState(30);

    return (
        <div>
            <BookingChartHeader
                currentStart={startDate}
                visibleDays={visibleDays}
                onDateChange={(d) => setStartDate(d)}
                onDaysSelect={(v) => setVisibleDays(v)}
            />
            <CoreBookingChart
                startDate={startDate}
                visibleDays={visibleDays}
            />
        </div>
    );
};

export default BookingChartPage;