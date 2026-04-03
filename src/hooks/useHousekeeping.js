import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import housekeepingApi from '../api/services/housekeeping';
import usersApi from '../api/services/users';

/**
 * Query keys for housekeeping
 */
export const housekeepingKeys = {
    all: ['housekeeping'],
    roster: () => [...housekeepingKeys.all, 'roster'],
    rosterDate: (date) => [...housekeepingKeys.roster(), date],
    assignments: () => [...housekeepingKeys.all, 'assignments'],
    assignmentsDate: (date) => [...housekeepingKeys.assignments(), date],
};

/**
 * Fetch auto-generated task suggestions for a date
 * These tasks are NOT yet allocated/saved — they're just suggestions
 * @param {string} date - YYYY-MM-DD format
 * @returns {QueryResult} Array of suggested tasks with populated room/booking data
 */
export const useRosterSuggestions = (date) => {
    return useQuery({
        queryKey: housekeepingKeys.rosterDate(date),
        queryFn: () => housekeepingApi.getRoster(date),
        enabled: !!date,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Fetch saved task assignments for a date
 * These are previously allocated tasks that have been saved to the database
 * @param {string} date - YYYY-MM-DD format
 * @param {string} housekeeperId - Optional: filter by specific housekeeper
 * @returns {QueryResult} Array of saved Task documents with populated room/booking data
 */
export const useHousekeepingAssignments = (date, housekeeperId = null) => {
    return useQuery({
        queryKey: housekeepingKeys.assignmentsDate(date),
        queryFn: () => housekeepingApi.getAssignments(date, housekeeperId),
        enabled: !!date,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Allocate multiple tasks to a housekeeper on a specific date
 * @returns {MutationResult} { message, assignedCount, tasks }
 */
export const useAllocateTasks = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => housekeepingApi.allocate(data),
        onSuccess: (response, variables) => {
            // Invalidate both roster suggestions and assignments for that date
            // so they refresh with the newly allocated tasks
            const date = variables.date;
            queryClient.invalidateQueries({ queryKey: housekeepingKeys.rosterDate(date) });
            queryClient.invalidateQueries({ queryKey: housekeepingKeys.assignmentsDate(date) });
        },
    });
};

/**
 * Mark a single task as complete
 * This automatically updates the linked room's status to "Clean" and sets lastCleanDate
 * @returns {MutationResult} Updated Task document
 */
export const useCompleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taskId) => housekeepingApi.completeTask(taskId),
        onSuccess: (response, taskId) => {
            // Invalidate assignments and rooms so:
            // 1. Assignment list refreshes with updated task status
            // 2. Booking chart dots update (room is now Clean)
            queryClient.invalidateQueries({ queryKey: housekeepingKeys.assignments() });
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
    });
};

/**
 * Fetch housekeeping roster for print
 * Returns tasks grouped by housekeeper name for print layout
 * @param {string} date - YYYY-MM-DD format
 * @returns {Promise} { date, groupedByHousekeeper: { "Name": [tasks] } }
 */
export const useHousekeepingPrint = (date) => {
    return useQuery({
        queryKey: ['housekeeping', 'print', date],
        queryFn: () => housekeepingApi.getPrint(date),
        enabled: !!date,
        // Don't cache print data aggressively — it's often stale
        staleTime: 0,
    });
};

/**
 * Fetch list of housekeepers (users with housekeeper role)
 * @returns {QueryResult} Array of User documents
 */
export const useHousekeepers = () => {
    return useQuery({
        queryKey: ['users', 'housekeepers'],
        queryFn: async () => {
            try {
                const response = await usersApi.getAll({ role: 'housekeeper' });
                const users = Array.isArray(response) ? response : (response.data || []);
                return users;
            } catch (error) {
                // Fallback: fetch all users and filter client-side
                console.warn('Failed to fetch housekeepers with role filter, fetching all users...');
                const response = await usersApi.getAll();
                const users = Array.isArray(response) ? response : (response.data || []);
                return users.filter(u => u.role === 'housekeeper');
            }
        },
        staleTime: 1000 * 60 * 30, // 30 minutes — housekeepers don't change often
    });
};
