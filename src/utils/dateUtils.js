// src/utils/dateUtils.js

// Function to generate a list of dates between a start and end date (inclusive/exclusive)
// This is essential for rendering the X-axis (Date axis) of the chart.
export const generateDateRange = (startDate, numDays) => {
    const dates = [];
    const currentDate = new Date(startDate);
    
    // Set time to midnight to prevent timezone issues
    currentDate.setHours(0, 0, 0, 0); 

    for (let i = 0; i < numDays; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        
        // Format as YYYY-MM-DD string
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        dates.push(`${year}-${month}-${day}`);
    }
    
    return dates;
};