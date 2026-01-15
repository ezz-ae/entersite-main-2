import React from 'react';
import BudgetCalculator from './BudgetCalculator';
import './mobile-styles.css';

interface SmartAdPlannerProps {
  market: string;
  budget: string | number;
  onBudgetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SmartAdPlanner: React.FC<SmartAdPlannerProps> = ({ market, budget, onBudgetChange }) => {
  // Mock keyword generation based on market
  const keywords = market 
    ? [`${market} real estate`, `property in ${market}`, `buy home ${market}`]
    : ['real estate', 'property for sale'];

  return (
    <div className="smart-planner-container" style={{ animation: 'none', border: 'none', padding: 0 }}>
      <BudgetCalculator 
        value={budget}
        onChange={onBudgetChange}
        platform="googleAds"
      />
      
      <div style={{ marginTop: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
          Suggested Keywords
        </label>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
          We'll automatically target these keywords for you.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {keywords.map(kw => (
            <span key={kw} className="keyword-tag">{kw}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartAdPlanner;