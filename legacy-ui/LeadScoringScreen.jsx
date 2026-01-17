import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import './mobile-styles.css';

const LeadScoringScreen = ({ onBack, onSave }) => {
  const [rules, setRules] = useState([
    { id: 1, action: 'Opened Email', points: 5 },
    { id: 2, action: 'Clicked Link', points: 10 },
    { id: 3, action: 'Replied to SMS', points: 20 },
    { id: 4, action: 'Visited Pricing Page', points: 15 },
    { id: 5, action: 'Downloaded Brochure', points: 25 },
    { id: 6, action: 'Booked Meeting', points: 50 },
  ]);

  const handlePointChange = (id, newPoints) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, points: parseInt(newPoints) || 0 } : rule
    ));
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Lead Scoring</h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Define how many points a lead gets for each action. High scores indicate high intent.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {rules.map(rule => (
          <div key={rule.id} style={{ 
            backgroundColor: 'var(--bg-primary)', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>{rule.action}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="number" 
                value={rule.points}
                onChange={(e) => handlePointChange(rule.id, e.target.value)}
                style={{ 
                  width: '60px', 
                  padding: '8px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)', 
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'var(--primary-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>pts</span>
            </div>
          </div>
        ))}
      </div>

      <StickyFooter label="Save Scoring Rules" onClick={() => onSave(rules)} />
    </div>
  );
};

export default LeadScoringScreen;