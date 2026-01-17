import React, { useState } from 'react';


const CompetitorAnalysis = ({ competitors = [], onUpdate }) => {
  const [currentUrl, setCurrentUrl] = useState('');

  const handleAdd = () => {
    if (!currentUrl) return;
    // Add to list
    const newCompetitors = [...competitors, currentUrl];
    onUpdate(newCompetitors);
    setCurrentUrl('');
  };

  const handleRemove = (indexToRemove) => {
    const newCompetitors = competitors.filter((_, index) => index !== indexToRemove);
    onUpdate(newCompetitors);
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
        Competitor Analysis
      </label>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
        Add links to competitors you want to outperform.
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          type="url"
          value={currentUrl}
          onChange={(e) => setCurrentUrl(e.target.value)}
          placeholder="https://competitor.com"
          style={{
            flex: 1,
            padding: '16px',
            fontSize: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!currentUrl}
          style={{
            padding: '0 20px',
            backgroundColor: 'var(--bg-accent)',
            color: 'var(--primary-color)',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: !currentUrl ? 0.5 : 1
          }}
        >
          Add
        </button>
      </div>

      {/* List of Competitors */}
      {competitors.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {competitors.map((url, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{url}</span>
              <button onClick={() => handleRemove(index)} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '18px', cursor: 'pointer', padding: '0 8px' }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompetitorAnalysis;