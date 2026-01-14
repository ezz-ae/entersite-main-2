import React from 'react';


const PreviewModal = ({ template, onClose, onSelect }) => {
  if (!template) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ height: '300px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
           {template.image ? 
             <img src={template.image} alt={template.title} style={{width:'100%', height:'100%', objectFit:'cover'}} /> 
             : <span style={{fontSize: '40px'}}>📷</span>
           }
           <button 
             onClick={onClose}
             style={{
               position: 'absolute',
               top: '16px',
               right: '16px',
               background: 'rgba(0,0,0,0.5)',
               color: 'white',
               border: 'none',
               borderRadius: '50%',
               width: '32px',
               height: '32px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontSize: '18px',
               cursor: 'pointer'
             }}
           >
             ×
           </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <span style={{ fontSize: '12px', color: '#007AFF', fontWeight: '700', textTransform: 'uppercase' }}>{template.category}</span>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '8px 0 16px 0', color: '#111827' }}>{template.title}</h2>
          <p style={{ color: '#6B7280', marginBottom: '24px', lineHeight: '1.5' }}>
            This template is optimized for {template.category.toLowerCase()} looking to capture high-intent leads on mobile devices.
          </p>
          
          <button 
            className="primary-button" 
            onClick={() => {
              onSelect(template);
              onClose();
            }}
          >
            Use This Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;