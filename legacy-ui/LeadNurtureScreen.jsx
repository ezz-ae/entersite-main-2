import React from 'react';
import StickyFooter from './StickyFooter';
import QuickReply from './QuickReply';
import SmartScheduler from './SmartScheduler';
import './mobile-styles.css';

const LeadNurtureScreen = ({ lead, onBack }) => {
  // Dummy timeline data
  const timeline = [
    { id: 1, type: 'sms', content: 'Hey Sarah, saw you checked out the Downtown Loft. Do you have 5 mins to chat?', time: '2 mins ago', status: 'Sent' },
    { id: 2, type: 'email', content: 'Subject: 3 Exclusive Listings in Downtown Dubai', time: '1 day ago', status: 'Opened' },
    { id: 3, type: 'system', content: 'Lead Score increased to 85 (High Intent)', time: '1 day ago', status: 'System' },
    { id: 4, type: 'sms', content: 'Hi Sarah, thanks for downloading the brochure. Let me know if you have questions.', time: '2 days ago', status: 'Delivered' },
    { id: 5, type: 'action', content: 'Lead captured via Facebook Ad', time: '2 days ago', status: 'Source' },
  ];

  const handleQuickReply = (msg) => {
    alert(`Sending: "${msg}" to ${lead?.name || 'Lead'}`);
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}
        >
          ←
        </button>
        <div>
          <h1 className="screen-title" style={{ marginBottom: '4px', fontSize: '20px' }}>{lead?.name || 'Lead Details'}</h1>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{lead?.phone || '+971 50 000 0000'}</span>
        </div>
      </div>

      <SmartScheduler leadName={lead?.name} />

      {/* Timeline */}
      <div className="timeline-container">
        {timeline.map((event, index) => (
          <div key={event.id} className="timeline-item">
            <div className="timeline-marker">
              <div className={`timeline-dot ${event.type}`}></div>
              {index !== timeline.length - 1 && <div className="timeline-line"></div>}
            </div>
            <div className="timeline-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="timeline-type">{event.type === 'sms' ? '💬 SMS' : event.type === 'email' ? '✉️ Email' : '🤖 System'}</span>
                <span className="timeline-time">{event.time}</span>
              </div>
              <p className="timeline-text">{event.content}</p>
              <span className={`timeline-status status-${event.status.toLowerCase()}`}>{event.status}</span>
            </div>
          </div>
        ))}
      </div>

      <QuickReply onSelect={handleQuickReply} />

      <StickyFooter label="Send Manual Message" onClick={() => alert('Opening chat...')} />
    </div>
  );
};

export default LeadNurtureScreen;