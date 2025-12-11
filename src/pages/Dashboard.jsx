// src/pages/Dashboard.jsx
import React from 'react';
// Assuming the logo is in src/assets/rms-logo.svg (You should add your logo there)
import RmsLogo from '../assets/logo.png'; 

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      {/* Dashboard Content Container */}
      <div className="dashboard-hero-container">
        
        {/* Left Side: Text and Logo */}
        <div className="hero-text-area">
          <img src={RmsLogo} alt="RMS Logo" className="rms-logo mb-4" />
          <h1 className="hero-title-main">
            Your guests.<br />
            Our mission.
          </h1>
          <h2 className="hero-title-sub">
            Smarter tech, better stays.<br />
            Hospitality, upgraded.
          </h2>
        </div>

        {/* Right Side: Image and Curve */}
        <div className="hero-image-area">
          {/* This div will hold the background image and the curved shape */}
          <div className="hero-image-wrapper">
             <div className="image-caption">Summerstar Tourist Parks</div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;