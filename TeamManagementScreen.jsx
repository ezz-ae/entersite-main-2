import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import './mobile-styles.css';

const TeamManagementScreen = ({ onBack }) => {
  const [members, setMembers] = useState([
    { id: 1, name: 'Mahmoud Ezz', email: 'mahmoud@agency.com', role: 'Owner', status: 'Active' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@agency.com', role: 'Agent', status: 'Active' },
    { id: 3, name: 'Pending User', email: 'new@agency.com', role: 'Agent', status: 'Invited' },
  ]);

  const handleInvite = () => {
    const email = prompt("Enter email address to invite:");
    if (email) {
      setMembers([...members, { id: Date.now(), name: 'Invited User', email, role: 'Agent', status: 'Invited' }]);
    }
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Team</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{members.length} Members</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {members.map(member => (
          <div key={member.id} style={{ 
            backgroundColor: 'var(--bg-primary)', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                backgroundColor: 'var(--bg-accent)', color: 'var(--primary-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700'
              }}>
                {member.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{member.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{member.email}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ 
                fontSize: '11px', 
                padding: '4px 8px', 
                borderRadius: '12px', 
                backgroundColor: member.status === 'Active' ? '#D1FAE5' : '#FEF3C7',
                color: member.status === 'Active' ? '#065F46' : '#D97706',
                fontWeight: '600',
                display: 'block',
                marginBottom: '4px'
              }}>
                {member.status}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{member.role}</span>
            </div>
          </div>
        ))}
      </div>

      <StickyFooter label="Invite New Member" onClick={handleInvite} />
    </div>
  );
};

export default TeamManagementScreen;