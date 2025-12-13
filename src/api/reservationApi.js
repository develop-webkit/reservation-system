// src/api/reservationApi.js
import axios from 'axios'; 
import { mockReservations } from '../data/mockReservations'; // Assumes mock data exists

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates fetching paginated, sorted, and filtered reservation data.
 * * @param {object} params - Contains pagination, sorting, and filter details.
 * @returns {object} - Paginated data (reservations and total count).
 */
export const fetchReservations = async ({ 
    pageIndex = 1, 
    pageSize = 10, 
    sortBy = 'id', 
    sortOrder = 'ascend',
    filters = {}
}) => {
    console.log(`Fetching Reservations: Page ${pageIndex}, Size ${pageSize}, Sort ${sortBy} ${sortOrder}`);
    await delay(750); // Simulate network latency

    let data = [...mockReservations];

    // 1. Apply Filtering (Basic mock)
    if (filters.status) {
        data = data.filter(res => res.status === filters.status[0]);
    }

    // 2. Apply Sorting (Basic mock)
    data.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        
        if (valA < valB) return sortOrder === 'ascend' ? -1 : 1;
        if (valA > valB) return sortOrder === 'ascend' ? 1 : -1;
        return 0;
    });


    // 3. Apply Pagination
    const totalCount = data.length;
    const start = (pageIndex - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = data.slice(start, end);

    return {
        reservations: paginatedData,
        totalCount: totalCount,
    };
};