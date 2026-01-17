import React from 'react';
import StickyFooter from './StickyFooter';
import './mobile-styles.css';

interface QRCodeScreenProps {
  onBack: () => void;
}

const QRCodeScreen: React.FC<QRCodeScreenProps> = ({ onBack }) => {
  const handleDownload = () => {
    alert("QR Code saved to photos!");
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Your QR Code</h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Scan to chat with my AI Agent instantly.
      </p>

      <div className="qr-card">
        <div className="qr-placeholder">
          🏁
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Chat with Sarah</h3>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Elite Properties AI Assistant</p>
      </div>

      <div style={{ backgroundColor: 'var(--bg-accent)', padding: '16px', borderRadius: '12px', border: '1px solid var(--primary-color)', textAlign: 'left', marginBottom: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-color)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Pro Tip</span>
        <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0 }}>
          Print this on your business cards or open house flyers. Leads who scan this convert <strong>40% higher</strong> than email leads.
        </p>
      </div>

      <StickyFooter label="Save to Photos" onClick={handleDownload} />
    </div>
  );
};

export default QRCodeScreen;