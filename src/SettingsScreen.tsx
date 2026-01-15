import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import ForgivingInput from './ForgivingInput';
import { useAuth } from './AuthContext';

interface SettingsScreenProps {
  onBack: () => void;
  onSave: (data: any) => void;
  theme: string;
  onToggleTheme: () => void;
  onNavigateTo: (screen: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onSave, theme, onToggleTheme, onNavigateTo }) => {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Agent Name',
    email: user?.email || 'agent@example.com',
    phone: user?.phone || '+971 50 000 0000'
  });

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    email: true,
    push: true,
    sms: false
  });

  const handleToggle = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    logout();
    setShowDeleteConfirm(false);
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
        <SettingsMenuItem icon="👥" label="Team Management" onClick={() => onNavigateTo('teamManagement')} />
        <SettingsMenuItem icon="📅" label="Meeting Availability" onClick={() => onNavigateTo('meetingScheduler')} />
        <SettingsMenuItem icon="📊" label="CRM Pipeline" onClick={() => onNavigateTo('crmPipeline')} />
        <SettingsMenuItem icon="🎯" label="Lead Scoring" onClick={() => onNavigateTo('leadScoring')} />
        <SettingsMenuItem icon="🔌" label="Integrations & API" onClick={() => onNavigateTo('integrations')} />
        <SettingsMenuItem icon="💳" label="Billing & Invoices" onClick={() => onNavigateTo('billing')} />
        <SettingsMenuItem icon="📦" label="My Services & Reports" onClick={() => onNavigateTo('services')} />
        <SettingsMenuItem icon="🎁" label="Refer & Earn" onClick={() => onNavigateTo('referral')} />
        <SettingsMenuItem icon="❓" label="Help & Support" onClick={() => onNavigateTo('support')} />
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

      {/* Account Actions */}
      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>

        <button 
          onClick={handleDeleteAccount}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--danger)',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            color: 'var(--danger)',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Delete Account
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Logout?</h3>
            <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              Are you sure you want to log out?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={confirmLogout} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--danger)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Delete Account?</h3>
            <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              Are you sure you want to delete your account? This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={confirmDeleteAccount} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--danger)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <StickyFooter label="Save Changes" onClick={() => onSave({ profile, notifications })} />
    </div>
  );
};

const SettingsMenuItem: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <div className="settings-menu-item" onClick={onClick}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="settings-icon-container">{icon}</div>
      <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>{label}</span>
    </div>
    <span style={{ color: 'var(--text-tertiary)' }}>›</span>
  </div>
);

const ToggleRow: React.FC<{ label: string; checked: boolean; onToggle: () => void }> = ({ label, checked, onToggle }) => (
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