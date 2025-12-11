// src/App.jsx
import React, { useState } from 'react'; // <-- Import useState
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

// Import all pages
import Login from './pages/Login'; // <-- Import Login
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations'; 
import BookingChart from './pages/BookingChart';


const MainLayout = ({ children }) => (
    <div className="d-flex" id="wrapper">
      <Sidebar />
      <div id="content-wrapper">
        <TopBar />
        <div className="container-fluid p-4">
          {children}
        </div>
      </div>
    </div>
);


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // <-- Login state

  // Function to handle login success
  const handleLogin = (status) => {
      setIsAuthenticated(status);
  }

  // Function to handle logout (optional, but good practice)
  const handleLogout = () => {
      setIsAuthenticated(false);
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      
      {/* Protected Routes - Render MainLayout only if authenticated */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? (
            <MainLayout>
              <Routes>
                {/* Nested Routes for the main application */}
                <Route path="/" element={<Dashboard />} /> 
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/charts/bookingchart" element={<BookingChart />} /> {/* <-- Add this route */}
                <Route path="*" element={<h1 className="text-center mt-5">404 - Page Not Found</h1>} />
              </Routes>
            </MainLayout>
          ) : (
            // Redirect unauthenticated users to login page
            <Login onLogin={handleLogin} />
          )
        }
      />
    </Routes>
  );
}

export default App;