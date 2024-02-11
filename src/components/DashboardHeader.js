import React from 'react';
import '../styles/DashboardHeader.scss';

// Pass the toggleSidebar function as a prop to DashboardHeader
const DashboardHeader = ({ toggleSidebar }) => (
  <header className="dashboard-header">
    <button onClick={toggleSidebar} className="sidebar-toggle">
      {/* Assuming you have SVG or an icon for the button */}
      <span>☰</span> {/* This can be replaced with an icon */}
    </button>
    <h1 className="animated-header">AVANI HOSPITAL</h1>
    {/* Rest of the header content */}
  </header>
);

export default DashboardHeader;
