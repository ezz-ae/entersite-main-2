import React from 'react';
import './mobile-styles.css';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-container">
      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default ProgressBar;