import React from 'react';

const ShareModal: React.FC<{ url: string, onClose: () => void }> = ({ url, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
      <h3 style={{ margin: '0 0 16px 0' }}>Share Project</h3>
      <input 
        type="text" 
        readOnly 
        value={url} 
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '12px' }}
      />
      <button 
        onClick={() => { navigator.clipboard.writeText(url); alert('Copied!'); }}
        style={{ width: '100%', padding: '12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600 }}
      >
        Copy Link
      </button>
    </div>
  </div>
);

export default ShareModal;