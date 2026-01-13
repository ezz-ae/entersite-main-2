import React from 'react';
import './mobile-styles.css';

const ServicesScreen = ({ onBack }) => {
  const services = [
    { id: 1, name: 'AI Chat Agent', status: 'Active', renewal: 'Nov 24, 2023', icon: '🤖', reportAvailable: true },
    { id: 2, name: 'Google Ads Manager', status: 'Active', renewal: 'Nov 24, 2023', icon: '🔍', reportAvailable: true },
    { id: 3, name: 'Website Hosting', status: 'Active', renewal: 'Yearly', icon: '🌐', reportAvailable: false },
    { id: 4, name: 'SMS Blast', status: 'Inactive', renewal: '-', icon: '💬', reportAvailable: false },
  ];

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>My Services</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {services.map(service => (
          <div key={service.id} style={{ 
            backgroundColor: 'var(--bg-primary)', 
            padding: '20px', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '28px' }}>{service.icon}</div>
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px' }}>{service.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Renews: {service.renewal}</div>
                </div>
              </div>
              <span style={{ 
                fontSize: '11px', 
                padding: '4px 8px', 
                borderRadius: '12px', 
                backgroundColor: service.status === 'Active' ? '#D1FAE5' : '#F3F4F6',
                color: service.status === 'Active' ? '#065F46' : '#6B7280',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {service.status}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)', fontWeight: '600', fontSize: '13px' }}>
                Manage
              </button>
              {service.reportAvailable && (
                <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--bg-accent)', color: 'var(--primary-color)', fontWeight: '600', fontSize: '13px' }}>
                  View Report 📊
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesScreen;