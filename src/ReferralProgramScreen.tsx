import React from 'react';
import StickyFooter from './StickyFooter';
import './mobile-styles.css';

interface ReferralProgramScreenProps {
  onBack: () => void;
}

const ReferralProgramScreen: React.FC<ReferralProgramScreenProps> = ({ onBack }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on EnterSite',
        text: 'Use my code AGENT2024 to get AED 100 credit!',
        url: 'https://entersite.io/invite/AGENT2024',
      });
    } else {
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Refer & Earn</h1>
      </div>

      <div className="referral-hero">
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎁</div>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Give 100, Get 100</h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          Invite a colleague. When they launch their first campaign, you both get AED 100 in ad credits.
        </p>
        
        <div className="referral-code-box" onClick={() => alert('Copied!')}>
          AGENT2024
        </div>
        <span style={{ fontSize: '10px', opacity: 0.8 }}>TAP TO COPY</span>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>Your Referrals</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ReferralItem name="Ahmed Khalid" status="Completed" reward="AED 100" />
        <ReferralItem name="Sarah Jones" status="Pending" reward="-" />
        <ReferralItem name="Mike Ross" status="Pending" reward="-" />
      </div>

      <StickyFooter label="Share Invite Link" onClick={handleShare} />
    </div>
  );
};

const ReferralItem: React.FC<{ name: string; status: string; reward: string }> = ({ name, status, reward }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
      <div>
        <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{name}</div>
        <div style={{ fontSize: '12px', color: status === 'Completed' ? '#059669' : 'var(--text-secondary)' }}>{status}</div>
      </div>
    </div>
    <div style={{ fontWeight: '700', color: status === 'Completed' ? '#059669' : 'var(--text-tertiary)', fontSize: '14px' }}>{reward}</div>
  </div>
);

export default ReferralProgramScreen;