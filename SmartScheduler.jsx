import React from 'react';
import './mobile-styles.css';

const SmartScheduler = ({ leadName }) => {
  // In a real app, this would calculate based on the 'time' of previous interactions
  const bestTime = "6:30 PM - 7:30 PM";
  const reason = "They opened your last 3 emails around this time.";

  return (
    <div className="scheduler-card">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px', marginRight: '8px' }}>🧠</span>
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#065F46' }}>AI Call Suggestion</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ display: 'block', fontSize: '18px', fontWeight: '800', color: '#059669' }}>{bestTime}</span>
          <span style={{ fontSize: '12px', color: '#047857' }}>{reason}</span>
        </div>
        <button className="schedule-btn" onClick={() => alert(`Scheduled call with ${leadName || 'Lead'} for ${bestTime}`)}>
          📅 Schedule
        </button>
      </div>
    </div>
  );
};

export default SmartScheduler;