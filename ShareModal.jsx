import React, { useState } from 'react';
import './mobile-styles.css';

const ShareModal = ({ url, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    window.location.href = `mailto:?subject=Check out my new site&body=Here is the link: ${url}`;
  };

  const handleSMS = () => {
    window.location.href = `sms:?body=Check out my new site: ${url}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent("Check out my new site: " + url)}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#111827' }}>Share Project</h3>
          <button 
            onClick={onClose} 
            style={{ 
              background: '#F3F4F6', 
              border: 'none', 
              borderRadius: '50%',
              width: '32px', 
              height: '32px', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px', 
              cursor: 'pointer',
              color: '#4B5563'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <ShareOption 
            icon="📋" 
            label={copied ? "Copied!" : "Copy Link"} 
            onClick={handleCopy} 
            color="#F3F4F6" 
            textColor="#1F2937" 
          />
          <ShareOption 
            icon="💬" 
            label="WhatsApp" 
            onClick={handleWhatsApp} 
            color="#DCFCE7" 
            textColor="#166534" 
          />
          <ShareOption 
            icon="✉️" 
            label="Email" 
            onClick={handleEmail} 
            color="#DBEAFE" 
            textColor="#1E40AF" 
          />
          <ShareOption 
            icon="📱" 
            label="SMS" 
            onClick={handleSMS} 
            color="#FEF3C7" 
            textColor="#92400E" 
          />
        </div>
      </div>
    </div>
  );
};

const ShareOption = ({ icon, label, onClick, color, textColor }) => (
  <button 
    onClick={onClick}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: color,
      borderRadius: '16px',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.1s',
      width: '100%'
    }}
  >
    <span style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</span>
    <span style={{ fontSize: '14px', fontWeight: '600', color: textColor }}>{label}</span>
  </button>
);

export default ShareModal;