// src/utils/chartUtils.js (Mock Implementation)

// Finds the start and end grid column based on the reservation dates
export const getReservationGridStyles = (reservation, totalDays) => {
    // This is highly simplified and assumes the reservation and chart days 
    // align perfectly, which requires date manipulation in a real app.
    
    // Mock mapping:
    // If checkInDay is 1 (index 0) and duration is 3, start is 1, end is 4.
    const startCol = reservation.checkInDay + 1; // +1 because CSS Grid starts at 1, not 0
    const endCol = startCol + reservation.duration;

    return {
        gridColumn: `${startCol} / ${endCol}`,
        // Note: We don't use gridRow here as RoomRow already defines the row context.
    };
};