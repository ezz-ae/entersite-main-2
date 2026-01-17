import React, { useState } from 'react';
import './mobile-styles.css';

const IntegrationsScreen = ({ onBack }) => {
  const [integrations, setIntegrations] = useState([
    { id: 'google', name: 'Google Ads', icon: '🔍', status: 'Connected', account: '123-456-7890' },
    { id: 'meta', name: 'Meta Ads (FB/Insta)', icon: '∞', status: 'Connected', account: 'Act_998877' },
    { id: 'whatsapp', name: 'WhatsApp Business', icon: '💬', status: 'Disconnected', account: null },
    { id: 'hubspot', name: 'HubSpot CRM', icon: '🟠', status: 'Disconnected', account: null },
    { id: 'calendly', name: 'Calendly', icon: '📅', status: 'Connected', account: 'cal.com/agent' },
  ]);

  const toggleConnection = (id) => {
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'Connected' ? 'Disconnected' : 'Connected'
        };
      }
      return item;
    }));
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Integrations</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {integrations.map(item => (
          <div key={item.id} style={{ 
            backgroundColor: 'var(--bg-primary)', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '24px' }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.status === 'Connected' ? item.account : 'Not connected'}</div>
              </div>
            </div>
            <button 
              onClick={() => toggleConnection(item.id)}
              className={item.status === 'Connected' ? 'status-connected status-badge' : 'status-disconnected status-badge'}
              style={{ border: 'none', cursor: 'pointer' }}
            >
              {item.status === 'Connected' ? 'Active' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsScreen;