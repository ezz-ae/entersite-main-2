import React from 'react';
import './mobile-styles.css';

const DashboardStats = ({ views, leads }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-label">Total Views</span>
        <span className="stat-value">{views.toLocaleString()}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Total Leads</span>
        <span className="stat-value">{leads.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default DashboardStats;