// src/components/chart/ReservationTooltip.jsx
import React from 'react';

// Mock data structure for the tooltip content, based on your image
const TooltipDetail = ({ label, value, highlight = false }) => (
    <div className="tooltip-detail d-flex justify-content-between">
        <span className="text-muted small">{label}:</span>
        <span className={`fw-bold small ${highlight ? 'text-success' : 'text-white'}`}>{value}</span>
    </div>
);

const ReservationTooltip = ({ reservation, style }) => {
    // Check if reservation data exists
    if (!reservation) return null;

    return (
        // The tooltip container must be positioned absolutely/fixed relative to the chart wrapper
        <div className="reservation-tooltip-popup" style={style}>
            {/* Header: Reservation No: 455 */}
            <div className="tooltip-header text-white fs-6 fw-bold mb-2 p-2">
                Reservation No: {reservation.id}
            </div>

            <div className="tooltip-body p-2">
                <TooltipDetail label="Master Res No" value="2" />
                <TooltipDetail label="Reservation No" value={reservation.id} />
                <TooltipDetail label="Groupname" value="Heritage Minerals" />
                <TooltipDetail label="Client Name" value={reservation.client} />
                <TooltipDetail label="Arrive" value="Thu 27 Nov 2025 02:00 PM" highlight />
                <TooltipDetail label="Depart" value="Tue 16 Dec 2025 10:00 AM" highlight />
                <TooltipDetail label="Property" value="Mount Morgan Space Solutions" />
                <TooltipDetail label="Room Type" value="Standard Ensuite Shiel" />
                <TooltipDetail label="Area" value="B02" />
                <TooltipDetail label="Status" value="Confirmed" highlight />
                <TooltipDetail label="People" value="1A 0C 0I" />
                <TooltipDetail label="Blkg Source" value="Contracted with Meals" />
                <TooltipDetail label="Tariff Type" value="Occupied Room Rate PRPN" />
                <TooltipDetail label="Balance Owing" value="XXXX" />
                <TooltipDetail label="Caravan Sales Slide" value="None" />
                <TooltipDetail label="Company" value="Heritage Minerals" />
                <TooltipDetail label="Fixed" value="No" />
            </div>
        </div>
    );
};

export default ReservationTooltip;