import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import './mobile-styles.css';

const MeetingSchedulerScreen = ({ onBack, onSave }) => {
  const [days, setDays] = useState({
    Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false
  });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [timezone, setTimezone] = useState('Asia/Dubai');

  const toggleDay = (day) => {
    setDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Availability</h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Set when the AI is allowed to book meetings on your calendar.
      </p>

      <div style={{ marginBottom: '24px' }}>
        <label className="control-label">Timezone</label>
        <select 
          value={timezone} 
          onChange={(e) => setTimezone(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }}
        >
          <option value="Asia/Dubai">Dubai (GMT+4)</option>
          <option value="Europe/London">London (GMT+0)</option>
          <option value="America/New_York">New York (EST)</option>
        </select>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label className="control-label">Working Days</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.keys(days).map(day => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: days[day] ? 'none' : '1px solid var(--border-color)',
                backgroundColor: days[day] ? 'var(--primary-color)' : 'var(--bg-primary)',
                color: days[day] ? 'white' : 'var(--text-secondary)',
                fontWeight: '600', cursor: 'pointer'
              }}
            >
              {day.charAt(0)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label className="control-label">Start Time</label>
          <input 
            type="time" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }} 
          />
        </div>
        <div>
          <label className="control-label">End Time</label>
          <input 
            type="time" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }} 
          />
        </div>
      </div>

      <StickyFooter label="Save Availability" onClick={() => onSave({ days, startTime, endTime, timezone })} />
    </div>
  );
};

export default MeetingSchedulerScreen;