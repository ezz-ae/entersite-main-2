import React, { useState, useEffect } from 'react';
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
  const { user, token, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profile, setProfile] = useState({
    name: user?.name || 'Agent Name',
    email: user?.email || 'agent@example.com',
    phone: user?.phone || '+971 50 000 0000'
  });

  const [workspaceProfile, setWorkspaceProfile] = useState({
    companyName: '',
    vatId: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    email: true,
    push: true,
    sms: false
  });

  useEffect(() => {
    async function fetchTenantProfile() {
      if (!token) return;
      try {
        const response = await fetch('/api/tenant/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.profile) {
            setWorkspaceProfile(data.profile);
          }
        }
      } catch (error) {
        console.error("Failed to fetch tenant profile", error);
      }
    }
    fetchTenantProfile();
  }, [token]);


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

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    // Simulate password change logic here
    alert("Password changed successfully!");
    setShowChangePassword(false);
    // Reset fields
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    // Basic phone validation: allows +, spaces, dashes, and digits, min length 7
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  };

  const handleSave = async () => {
    let valid = true;
    const newErrors = { email: '', phone: '' };

    if (!validateEmail(profile.email)) {
      newErrors.email = 'Please enter a valid email address.';
      valid = false;
    }

    if (!validatePhone(profile.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      // Prop-based save for personal profile and notifications
      onSave({ profile, notifications });

      // API-based save for workspace profile
      if (token) {
        try {
          await fetch('/api/tenant/profile', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(workspaceProfile),
          });
          alert('Settings saved!');
        } catch (error) {
          console.error("Failed to save workspace profile", error);
          alert('Failed to save company settings.');
        }
      }
    }
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
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <SettingsMenuItem icon="🏢" label="Company Profile" onClick={() => { /* Can navigate to a dedicated screen in future */ }} isSection />
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '0 16px 16px 16px' }}>
          <ForgivingInput 
            label="Company Name" 
            value={workspaceProfile.companyName} 
            onChange={(e) => setWorkspaceProfile({...workspaceProfile, companyName: e.target.value})} 
          />
          <ForgivingInput 
            label="VAT ID (Optional)" 
            value={workspaceProfile.vatId} 
            onChange={(e) => setWorkspaceProfile({...workspaceProfile, vatId: e.target.value})} 
          />
        </div>
        <SettingsMenuItem icon="👥" label="Team Management" onClick={() => onNavigateTo('teamManagement')} />
        <SettingsMenuItem icon="📅" label="Meeting Availability" onClick={() => onNavigateTo('meetingScheduler')} />
        <SettingsMenuItem icon="💳" label="Billing & Invoices" onClick={() => onNavigateTo('billing')} />
        <SettingsMenuItem icon="🔌" label="Integrations & API" onClick={() => onNavigateTo('integrations')} />
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
        style={errors.email ? { borderColor: 'var(--danger)' } : {}}
      />
      {errors.email && <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '-12px', marginBottom: '12px' }}>{errors.email}</div>}
      
      <ForgivingInput 
        label="Phone Number" 
        type="tel"
        value={profile.phone} 
        onChange={(e) => setProfile({...profile, phone: e.target.value})} 
        style={errors.phone ? { borderColor: 'var(--danger)' } : {}}
      />
      {errors.phone && <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '-12px', marginBottom: '12px' }}>{errors.phone}</div>}
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

      {/* Security Section */}
      <div className="settings-section-title">Security</div>
      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '0 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div 
          onClick={() => setShowChangePassword(true)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="settings-icon-container">🔒</div>
            <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>Change Password</span>
          </div>
          <span style={{ color: 'var(--text-tertiary)' }}>›</span>
        </div>
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

      {showChangePassword && (
        <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Change Password</h3>
            
            <ForgivingInput 
              label="Current Password" 
              type="password"
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
            />
            
            <ForgivingInput 
              label="New Password" 
              type="password"
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />

            <ForgivingInput 
              label="Confirm New Password" 
              type="password"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => setShowChangePassword(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button 
                onClick={handleChangePassword} 
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary-color)', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: (!currentPassword || !newPassword || !confirmPassword) ? 0.5 : 1 }}
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <StickyFooter label="Save Changes" onClick={handleSave} />
    </div>
  );
};

const SettingsMenuItem: React.FC<{ icon: string; label: string; onClick: () => void; isSection?: boolean }> = ({ icon, label, onClick, isSection }) => (
  <div className="settings-menu-item" onClick={onClick} style={isSection ? { cursor: 'default' } : {}}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="settings-icon-container">{icon}</div>
      <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>{label}</span>
    </div>
    {!isSection && <span style={{ color: 'var(--text-tertiary)' }}>›</span>}
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