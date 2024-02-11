// DashboardSidebar.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardSidebar.scss';

// Icon mapping based on the name
const iconMapping = {
  Home: '🏠',
  Reception: '👋',
  Billing: '💳',
  Pharmacy: '💊',
  Laboratory: '🔬',
  Expenditure: '💸',
  Reports: '📊',
  Settings: '⚙️',
  // ... add more mappings for other items
};

const DashboardSidebar = ({ items, expanded }) => {
  const navigate = useNavigate();

  // Function to navigate to the corresponding route
  const navigateTo = (item) => {
    const route = item === 'Home' ? '/home' : `/${item.toLowerCase()}`;
    navigate(route);
  };

  return (
    <aside className={`dashboard-sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      <ul>
        {items.map((item, index) => (
          <li key={index} 
              className={expanded ? 'expanded' : 'collapsed'} 
              onClick={() => navigateTo(item)}>
            {expanded ? item : <span className="icon">{iconMapping[item]}</span>} {/* Show icon when collapsed */}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default DashboardSidebar;
