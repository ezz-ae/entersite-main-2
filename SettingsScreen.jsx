import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import ForgivingInput from './ForgivingInput';
import './mobile-styles.css';

const SettingsScreen = ({ onBack, onSave, theme, onToggleTheme, onNavigateTo, onReferral, onSupport }) => {
  const [profile, setProfile] = useState({
    name: 'Agent Name',
    email: 'agent@example.com',
    phone: '+971 50 000 0000'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
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
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Settings</h1>
      </div>

      {/* Workspace Section */}
      <div className="settings-section-title">Workspace</div>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <SettingsMenuItem 
          icon="👥" 
          label="Team Management" 
          onClick={() => onNavigateTo('teamManagement')} 
        />
        <SettingsMenuItem 
          icon="🔌" 
          label="Integrations & API" 
          onClick={() => onNavigateTo('integrations')} 
        />
        <SettingsMenuItem 
          icon="💳" 
          label="Billing & Invoices" 
          onClick={() => onNavigateTo('billing')} 
        />
        <SettingsMenuItem 
          icon="📦" 
          label="My Services & Reports" 
          onClick={() => onNavigateTo('services')} 
        />
        <SettingsMenuItem 
          icon="🎁" 
          label="Refer & Earn" 
          onClick={() => onNavigateTo('referral')} 
        />
        <SettingsMenuItem 
          icon="❓" 
          label="Help & Support" 
          onClick={() => onNavigateTo('support')} 
        />
      </div>

      {/* Profile Section */}
      <div className="settings-section-title">Personal Profile</div>
      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <ForgivingInput 
        label="Full Name" 
        value={profile.name} 
        onChange={(e) => setProfile({...profile, name: e.target.value})} 
      />
      <ForgivingInput 
        label="Email Address" 
        value={profile.email} 
        onChange={(e) => setProfile({...profile, email: e.target.value})} 
      />
      <ForgivingInput 
        label="Phone Number" 
        type="tel"
        value={profile.phone} 
        onChange={(e) => setProfile({...profile, phone: e.target.value})} 
      />
      </div>

      {/* Appearance Section */}
      <div className="settings-section-title">App Preferences</div>
      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '0 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <ToggleRow label="Dark Mode" checked={theme === 'dark'} onToggle={onToggleTheme} />

      {/* Notifications Section */}
        <ToggleRow label="Email Notifications" checked={notifications.email} onToggle={() => handleToggle('email')} />
        <ToggleRow label="Push Notifications" checked={notifications.push} onToggle={() => handleToggle('push')} />
        <ToggleRow label="SMS Alerts" checked={notifications.sms} onToggle={() => handleToggle('sms')} />
      </div>

      <StickyFooter label="Save Changes" onClick={() => onSave({ profile, notifications })} />
    </div>
  );
};

const SettingsMenuItem = ({ icon, label, onClick }) => (
  <div className="settings-menu-item" onClick={onClick}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="settings-icon-container">{icon}</div>
      <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>{label}</span>
    </div>
    <span style={{ color: 'var(--text-tertiary)' }}>›</span>
  </div>
);

const ToggleRow = ({ label, checked, onToggle }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--bg-tertiary)' }}>
    <span style={{ fontSize: '16px', color: 'var(--text-tertiary)' }}>{label}</span>
    <div 
      onClick={onToggle}
      style={{
        width: '50px', height: '28px', backgroundColor: checked ? 'var(--primary-color)' : 'var(--border-color)', borderRadius: '14px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s'
      }}
    >
      <div style={{
        width: '24px', height: '24px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: checked ? '24px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }} />
    </div>
  </div>
);

export default SettingsScreen;