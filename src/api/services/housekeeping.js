import apiClient from '../config';

/**
 * Housekeeping API Service
 * Handles task generation, allocation, assignment tracking, and completion
 */

const housekeepingApi = {
    /**
     * Get auto-generated task suggestions for a specific date
     * These are not yet allocated/saved — just suggestions based on departures and long-stays
     * @param {string} date - YYYY-MM-DD format
     * @returns {Promise} Array of suggested tasks
     */
    getRoster: (date) =>
        apiClient.get('/housekeeping/roster', { params: { date } }),

    /**
     * Save and allocate tasks to a specific housekeeper
     * @param {object} data - { housekeeperId, date, tasks: [{type, roomId, bookingId}] }
     * @returns {Promise} { message, assignedCount, tasks }
     */
    allocate: (data) =>
        apiClient.post('/housekeeping/allocate', data),

    /**
     * Fetch saved task assignments for a given date (and optionally filter by housekeeper)
     * @param {string} date - YYYY-MM-DD format
     * @param {string} housekeeperId - Optional user ObjectId to filter by specific housekeeper
     * @returns {Promise} Array of saved Task documents
     */
    getAssignments: (date, housekeeperId = null) => {
        const params = { date };
        if (housekeeperId) params.housekeeperId = housekeeperId;
        return apiClient.get('/housekeeping/assignments', { params });
    },

    /**
     * Mark a task as complete
     * This automatically updates the linked room's status to "Clean" and sets lastCleanDate
     * @param {string} id - Task ObjectId
     * @returns {Promise} Updated Task document
     */
    completeTask: (id) =>
        apiClient.patch(`/housekeeping/tasks/${id}/complete`),

    /**
     * Get printable roster grouped by housekeeper for a specific date
     * @param {string} date - YYYY-MM-DD format
     * @returns {Promise} { date, groupedByHousekeeper: { "Housekeeper Name": [tasks] } }
     */
    getPrint: (date) =>
        apiClient.get('/housekeeping/print', { params: { date } }),
};

export default housekeepingApi;
