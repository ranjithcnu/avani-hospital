import React, { useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import '../styles/Dashboard.scss';

// Sidebar items data
const sidebarItems = [
  'Home',
  'Reception',
  'Billing',
  'Pharmacy',
  'Laboratory',
  'Expenditure',
  'Reports',
  'Settings',
];

// Cards data
const cardData = [
  {
    title: 'OP Patients',
    count: 0,
    amount: '₹0.00',
    type: 'teal',
    icon: '👥', // Replace with actual icons you are using
  },
  {
    title: 'IP Patients',
    count: 0,
    amount: '₹0.00',
    type: 'orange',
    icon: '🛏️',
  },
  {
    title: 'IP Advances',
    count: 0,
    amount: '₹0.00',
    type: 'light-blue',
    icon: '💵',
  },
  {
    title: 'IP Final Bill',
    count: 0,
    amount: '₹0.00',
    type: 'salmon',
    icon: '📄',
  },
  {
    title: 'Utility Bill',
    count: 0,
    amount: '₹0.00',
    type: 'green',
    icon: '🔌',
  },
  {
    title: 'Laboratory',
    count: 0,
    amount: '₹0.00',
    type: 'mint',
    icon: '🧪',
  },
  {
    title: 'Pharmacy',
    count: 0,
    amount: '₹0.00',
    type: 'red',
    icon: '💊',
  },
  {
    title: 'Expenditure',
    count: 0,
    amount: '₹0.00',
    type: 'light-navy',
    icon: '💸',
  },
  {
    title: 'Bed Status',
    occupied: 101,
    available: 3,
    type: 'light-blue',
    icon: '🛌',
  },
  // ... add more card objects as needed
];


const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

// Inside your Dashboard component file
return (
  <div className="dashboard">
    <DashboardHeader toggleSidebar={toggleSidebar} />
    <DashboardSidebar items={sidebarItems} expanded={isSidebarExpanded} />
    <div className="dashboard-content">
      <div className="cards-grid">
        {cardData.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
    </div>
    <footer className="footer-bar">
      <p>© 2024 AVANI HOSPITAL. All rights reserved.</p>
    </footer>
  </div>
);
};

export default Dashboard;