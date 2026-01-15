import React from 'react';
import './mobile-styles.css';

interface NotificationCenterScreenProps {
  onBack: () => void;
}

const NotificationCenterScreen: React.FC<NotificationCenterScreenProps> = ({ onBack }) => {
  const notifications = [
    { id: 1, title: "Lead Score Increased", message: "Sarah Miller is now High Intent (85/100).", time: "2 mins ago", icon: "🔥", unread: true },
    { id: 2, title: "New Lead Captured", message: "Mohammed Ali via Facebook Ads.", time: "1 hour ago", icon: "👤", unread: true },
    { id: 3, title: "Campaign Published", message: "Downtown Luxury Loft is live.", time: "5 hours ago", icon: "🚀", unread: false },
    { id: 4, title: "System Update", message: "New AI features added to your dashboard.", time: "1 day ago", icon: "⚙️", unread: false },
  ];

  return (
    <div className="screen-container" style={{ padding: '0', paddingBottom: '40px' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Notifications</h1>
      </div>

      <div>
        {notifications.map((notif) => (
          <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
            <div className="notification-icon">{notif.icon}</div>
            <div className="notification-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="notification-title">{notif.title}</span>
                {notif.unread && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></span>}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{notif.message}</p>
              <span className="notification-time" style={{ marginTop: '4px', display: 'block' }}>{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenterScreen;