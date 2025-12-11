// src/pages/Reservations.jsx
import React from 'react';

const Reservations = () => {
  return (
    <div className="mt-4">
      <h2>All Reservations</h2>
      <button className="btn btn-success mb-3">
        + New Reservation
      </button>
      {/* Reservation Table/List component will go here */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Placeholder Row */}
          <tr>
            <td>R1001</td>
            <td>John Doe</td>
            <td>2025-12-15</td>
            <td>7:00 PM</td>
            <td><span className="badge text-bg-success">Confirmed</span></td>
            <td><button className="btn btn-sm btn-info me-2">View</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Reservations;