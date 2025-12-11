// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Assuming the logo is available for use
import RmsLogo from '../assets/logo.png'; 

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('HGManager');
  const [password, setPassword] = useState('password');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple mock authentication for now
    if (username === 'HGManager' && password === 'password') {
      // In a real app, you would verify credentials and get an auth token
      onLogin(true); 
      navigate('/'); // Redirect to Dashboard on success
    } else {
      alert('Invalid credentials. Use HGManager/password.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card shadow p-4">
        <div className="text-center mb-4">
          <img src={RmsLogo} alt="RMS Logo" className="login-logo mb-3" />
          <h2 className="h4 text-primary">RMS</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Client No Input */}
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="bi bi-pencil-square"></i></span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Client No" 
              value="1" // Pre-filled based on image
              readOnly 
            />
          </div>

          {/* Username Input */}
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="HGManager" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="input-group mb-2">
            <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="d-flex justify-content-end mb-3">
            <small><a href="#">Forgot your password?</a></small>
          </div>

          {/* Checkboxes */}
          <div className="d-flex justify-content-between mb-4 small">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="keepLoggedIn" />
              <label className="form-check-label" htmlFor="keepLoggedIn">Keep me logged in</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="showMobile" />
              <label className="form-check-label" htmlFor="showMobile">Show Mobile Version</label>
            </div>
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-100">Login</button>
          
          <div className="text-center mt-3">
            <small><a href="#" className="text-muted">Login To Training</a></small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;