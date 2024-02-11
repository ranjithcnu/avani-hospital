import React from 'react';
import '../styles/DashboardCard.scss';

// DashboardCard.js

const DashboardCard = ({ title, count, amount, occupied, available, type, icon }) => {
    return (
      <div className={`dashboard-card ${type}`}>
        <span className="card-icon">{icon}</span>
        <h3>{title}</h3>
        {count !== undefined ? (
          <>
            <p>{`${count} PATIENTS`}</p>
            <p>{`${amount} INCOME`}</p>
          </>
        ) : (
          <>
            <p>{`${occupied} OCCUPIED`}</p>
            <p>{`${available} AVAILABLE`}</p>
          </>
        )}
      </div>
    );
  };
  

export default DashboardCard;
