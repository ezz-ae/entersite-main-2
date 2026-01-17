import React from 'react';

interface PersonaSelectorProps {
  selectedPersona: string;
  onSelect: (persona: string) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersona, onSelect }) => {
  const personas = [
    { id: 'professional', name: 'Professional', icon: '💼', desc: 'Formal and direct' },
    { id: 'friendly', name: 'Friendly', icon: '😊', desc: 'Warm and approachable' },
    { id: 'luxury', name: 'Luxury', icon: '💎', desc: 'Elegant and exclusive' },
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
        Brand Voice
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {personas.map(p => (
          <div
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`recipient-option ${selectedPersona === p.id ? 'selected' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '20px' }}>{p.icon}</div>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.desc}</div>
              </div>
            </div>
            {selectedPersona === p.id && <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonaSelector;