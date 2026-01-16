import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import './mobile-styles.css';

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited';
}

interface TeamManagementScreenProps {
  onBack: () => void;
}

const TeamManagementScreen: React.FC<TeamManagementScreenProps> = ({ onBack }) => {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: 'Mahmoud Ezz', email: 'mahmoud@agency.com', role: 'Owner', status: 'Active' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@agency.com', role: 'Agent', status: 'Active' },
    { id: 3, name: 'Pending User', email: 'new@agency.com', role: 'Agent', status: 'Invited' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Agent');
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInviteClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInviteEmail('');
    setInviteRole('Agent');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendInvite = () => {
    if (inviteEmail) {
      setMembers([...members, { id: Date.now(), name: 'Invited User', email: inviteEmail, role: inviteRole, status: 'Invited' }]);
      handleCloseModal();
      showToast(`Invitation sent to ${inviteEmail}`);
    }
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      setMembers(members.filter(m => m.id !== memberToDelete.id));
      setMemberToDelete(null);
      showToast(`${memberToDelete.name} has been removed`);
    }
  };

  const handleResendInvite = (member: Member) => {
    showToast(`Invitation resent to ${member.email}`);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    showToast('Email copied to clipboard');
  };

  return (
    <div className="screen-container" style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>←</button>
        <h1 className="screen-title" style={styles.title}>Team</h1>
      </div>

      <div style={styles.statsRow}>
        <span style={styles.statsText}>{members.length} Members</span>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.list}>
        {members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase())).map(member => (
          <div key={member.id} style={styles.card}>
            <div style={styles.cardLeft}>
              <div style={styles.avatar}>
                {member.name.charAt(0)}
              </div>
              <div>
                <div style={styles.name}>{member.name}</div>
                <div style={styles.email} onClick={() => handleCopyEmail(member.email)}>{member.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {member.status === 'Invited' && (
                <button onClick={() => handleResendInvite(member)} style={styles.resendButton}>
                  Resend
                </button>
              )}
              <div style={styles.cardRight}>
                <span style={getStatusStyle(member.status)}>
                  {member.status}
                </span>
                <span style={styles.role}>{member.role}</span>
              </div>
              <button 
                onClick={() => setMemberToDelete(member)}
                style={styles.deleteButton}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Invite Team Member</h3>
            <p style={{ margin: '0 0 20px 0', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              Enter the email address of the person you want to invite to your team.
            </p>
            <input
              type="email"
              placeholder="email@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                marginBottom: '12px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
              autoFocus
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                marginBottom: '24px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="Agent">Agent</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleCloseModal} style={styles.modalButtonSecondary}>
                Cancel
              </button>
              <button onClick={handleSendInvite} style={styles.modalButtonPrimary}>
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {memberToDelete && (
        <div className="modal-overlay" onClick={() => setMemberToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Remove Member?</h3>
            <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              Are you sure you want to remove <strong>{memberToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setMemberToDelete(null)} style={styles.modalButtonSecondary}>
                Cancel
              </button>
              <button onClick={confirmDelete} style={styles.modalButtonDanger}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            {toastMessage}
          </div>
        </div>
      )}

      <StickyFooter label="Invite New Member" onClick={handleInviteClick} />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', paddingBottom: '100px' },
  header: { display: 'flex', alignItems: 'center', marginBottom: '24px' },
  backButton: { background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' },
  title: { marginBottom: 0 },
  statsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  statsText: { fontSize: '14px', color: 'var(--text-secondary)' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { 
    backgroundColor: 'var(--bg-primary)', 
    padding: '16px', 
    borderRadius: '12px', 
    border: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { 
    width: '40px', height: '40px', borderRadius: '50%', 
    backgroundColor: 'var(--bg-accent)', color: 'var(--primary-color)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700'
  },
  name: { fontWeight: '600', color: 'var(--text-primary)' },
  email: { fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' },
  cardRight: { textAlign: 'right' },
  role: { fontSize: '11px', color: 'var(--text-tertiary)' },
  modalButtonSecondary: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontWeight: 600,
    cursor: 'pointer'
  },
  modalButtonPrimary: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  },
  modalButtonDanger: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: 'var(--danger)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: 'var(--text-tertiary)',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 0 0 8px',
    lineHeight: 1
  },
  resendButton: {
    background: 'none',
    border: '1px solid var(--primary-color)',
    borderRadius: '12px',
    color: 'var(--primary-color)',
    fontSize: '11px',
    fontWeight: 600,
    padding: '4px 8px',
    cursor: 'pointer'
  },
  searchInput: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  }
};

const getStatusStyle = (status: string): React.CSSProperties => ({
  fontSize: '11px', 
  padding: '4px 8px', 
  borderRadius: '12px', 
  backgroundColor: status === 'Active' ? '#D1FAE5' : '#FEF3C7',
  color: status === 'Active' ? '#065F46' : '#D97706',
  fontWeight: '600',
  display: 'block',
  marginBottom: '4px'
});

export default TeamManagementScreen;