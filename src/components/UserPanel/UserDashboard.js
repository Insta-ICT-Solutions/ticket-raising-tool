import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';
import './UserDashboard.css';

const UserDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate(); // For navigation

  // Function to add a new ticket
  const addNewTicket = (newTicket) => {
    setTickets((prevTickets) => [...prevTickets, newTicket]);
    navigate('/user-dashboard/mytickets'); // Redirect back to the tickets table after adding a new ticket
  };

  return (
    <div className="user-dashboard-container-trt">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`content-trt ${isSidebarOpen ? 'sidebar-open-trt' : ''}`}>
        {/* The Outlet will render the nested routes */}
        <Outlet context={{ tickets, addNewTicket }} />
      </div>
    </div>
  );
};

export default UserDashboard;