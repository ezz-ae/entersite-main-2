import React from 'react';
import './mobile-styles.css';

const PersonaSelector = ({ selectedPersona, onSelect }) => {
  const personas = [
    { id: 'professional', label: 'Professional', icon: '👔', desc: 'Trustworthy & Formal' },
    { id: 'friendly', label: 'Friendly', icon: '👋', desc: 'Warm & Approachable' },
    { id: 'luxury', label: 'Luxury', icon: '✨', desc: 'Elegant & Exclusive' },
    { id: 'urgent', label: 'Urgent', icon: '🔥', desc: 'High Energy & Direct' },
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
        AI Tone of Voice
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: selectedPersona === p.id ? 'var(--bg-accent)' : 'var(--bg-secondary)',
              border: `1px solid ${selectedPersona === p.id ? 'var(--primary-color)' : 'var(--border-color)'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '24px', marginBottom: '8px' }}>{p.icon}</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{p.label}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{p.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonaSelector;