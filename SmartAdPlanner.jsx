import React, { useState, useEffect } from 'react';
import BudgetCalculator from './BudgetCalculator';
import './mobile-styles.css';

const SmartAdPlanner = ({ market, budget, onBudgetChange }) => {
  const [analyzing, setAnalyzing] = useState(true);
  
  // Simulate the "Smart" analysis happening in real-time
  useEffect(() => {
    if (market && market.length > 2) {
      setAnalyzing(true);
      const timer = setTimeout(() => setAnalyzing(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [market]);

  if (!market || market.length < 3) return null;

  return (
    <div>
      {analyzing ? (
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', marginBottom: '24px' }}>
          <div className="spinner" style={{ width: '24px', height: '24px', margin: '0 auto 12px auto', borderWidth: '3px' }}></div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Scanning Google Search Trends for <strong>{market}</strong>...</p>
        </div>
      ) : (
        <div className="smart-planner-container">
          {/* Insight Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>High Demand Detected</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                We found <strong>1,240+ people</strong> searching for properties in {market} right now.
              </p>
            </div>
            <span className="trend-badge">🔥 Hot Market</span>
          </div>

          {/* Auto-Generated Keywords */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Top Search Terms We Will Target:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span className="keyword-tag">Buy Villa in {market}</span>
              <span className="keyword-tag">Apartments for sale {market}</span>
              <span className="keyword-tag">{market} Real Estate Agent</span>
              <span className="keyword-tag" style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>+ 45 more</span>
            </div>
          </div>

          {/* No Account Needed Reassurance */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>✅</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
              <strong>No Google Account needed.</strong> We run this through our verified agency partner account.
            </span>
          </div>
        </div>
      )}

      <BudgetCalculator value={budget} onChange={onBudgetChange} platform="googleAds" />
    </div>
  );
};

export default SmartAdPlanner;