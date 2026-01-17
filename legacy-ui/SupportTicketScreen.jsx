import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import ForgivingInput from './ForgivingInput';
import './mobile-styles.css';

const SupportTicketScreen = ({ onBack, onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical Issue');

  const handleSubmit = () => {
    onSubmit({ subject, category, description });
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Support</h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Having trouble? Our team usually responds within 2 hours.
      </p>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Category</label>
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }}
        >
          <option>Technical Issue</option>
          <option>Billing Question</option>
          <option>Feature Request</option>
          <option>Account Help</option>
        </select>
      </div>

      <ForgivingInput 
        label="Subject" 
        placeholder="e.g. Cannot connect Instagram" 
        value={subject} 
        onChange={(e) => setSubject(e.target.value)} 
      />

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Description</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail..."
          style={{ width: '100%', height: '150px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', resize: 'none' }}
        />
      </div>

      <StickyFooter label="Submit Ticket" onClick={handleSubmit} disabled={!subject || !description} />
    </div>
  );
};

export default SupportTicketScreen;