import React from 'react';
import './mobile-styles.css';

const BudgetCalculator = ({ value, onChange, platform }) => {
  const budget = parseFloat(value) || 0;
  
  // Estimation logic (Approximate values for Real Estate in AED)
  // Meta: Lower CPC, generally lower CPL but lower intent
  // Google: Higher CPC, higher CPL but higher intent
  const cpc = platform === 'googleAds' ? 15 : 4; 
  const cpl = platform === 'googleAds' ? 80 : 35;
  
  const estimatedClicks = Math.floor(budget / cpc);
  const estimatedLeads = (budget / cpl).toFixed(1); // Show decimal for daily estimates

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-secondary)', 
      padding: '20px', 
      borderRadius: '16px', 
      border: '1px solid var(--border-color)',
      marginBottom: '24px'
    }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
        Daily Budget (AED)
      </label>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginRight: '8px' }}>AED</span>
        <input 
          type="number" 
          inputMode="decimal"
          value={value}
          onChange={onChange}
          placeholder="100"
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--primary-color)',
            border: 'none',
            background: 'transparent',
            width: '100%',
            outline: 'none'
          }}
        />
      </div>

      {/* Range Slider for quick adjustment */}
      <input 
        type="range" 
        min="50" 
        max="2000" 
        step="50" 
        value={budget || 50} 
        onChange={onChange}
        style={{ width: '100%', marginBottom: '24px', accentColor: 'var(--primary-color)' }}
      />

      {/* Estimates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Est. Clicks</span>
          <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{estimatedClicks}</span>
        </div>
        <div style={{ backgroundColor: 'var(--bg-accent)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '12px', color: 'var(--primary-color)', marginBottom: '4px', fontWeight: '600' }}>Est. Leads/Day</span>
          <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary-color)' }}>{estimatedLeads}</span>
        </div>
      </div>
      
      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '12px', textAlign: 'center' }}>
        *Estimates based on {platform === 'googleAds' ? 'Google' : 'Meta'} market averages.
      </p>
    </div>
  );
};

export default BudgetCalculator;