// src/api/dashboardApi.js
import axios from 'axios';

// Mock function to simulate a short API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Mock Data Retrieval Functions (Replace with actual Axios calls later) ---

// 1. Get quick counts (e.g., Arrivals, Departures)
export const fetchQuickCounts = async () => {
    await delay(500); // Simulate network latency
    return {
        arrivalsToday: 15,
        departuresToday: 22,
        roomsOccupied: 356,
        roomsAvailable: 44,
    };
};

// 2. Get recent activity feed
export const fetchActivityFeed = async () => {
    await delay(800);
    return [
        { id: 1, type: 'Arrival', guest: 'J. Mason', time: '10:30 AM', room: '101' },
        { id: 2, type: 'Departure', guest: 'W. Smith', time: '09:00 AM', room: '205' },
        { id: 3, type: 'Maintenance', guest: 'Room 304', time: '11:15 AM', notes: 'HVAC repair' },
        { id: 4, type: 'New Booking', guest: 'L. Green', time: '1:45 PM', room: 'Tentative' },
    ];
};

// 3. Get occupancy chart data
export const fetchOccupancyChart = async () => {
    await delay(600);
    return [
        { month: 'Jan', occupancy: 85 },
        { month: 'Feb', occupancy: 92 },
        { month: 'Mar', occupancy: 78 },
        { month: 'Apr', occupancy: 95 },
    ];
};