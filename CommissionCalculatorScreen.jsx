import React, { useState, useEffect, useCallback } from 'react';
import StickyFooter from './StickyFooter';
import ForgivingInput from './ForgivingInput';
import './mobile-styles.css';

const CommissionCalculatorScreen = ({ onBack }) => {
  const [salePrice, setSalePrice] = useState('');
  const [commissionRate, setCommissionRate] = useState('2'); // Default 2%
  const [agentSplit, setAgentSplit] = useState('50'); // Default 50/50 split
  const [result, setResult] = useState(null);

  const calculate = useCallback(() => {
    const price = parseFloat(salePrice.replace(/,/g, '')) || 0;
    const rate = parseFloat(commissionRate) || 0;
    const split = parseFloat(agentSplit) || 0;

    const totalCommission = price * (rate / 100);
    const agentEarnings = totalCommission * (split / 100);
    const brokerEarnings = totalCommission - agentEarnings;

    setResult({
      total: totalCommission,
      agent: agentEarnings,
      broker: brokerEarnings
    });
  }, [salePrice, commissionRate, agentSplit]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Commission Calc</h1>
      </div>

      <ForgivingInput 
        label="Property Sale Price (AED)"
        type="number"
        placeholder="e.g. 2,500,000"
        value={salePrice}
        onChange={(e) => setSalePrice(e.target.value)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <ForgivingInput 
          label="Commission %"
          type="number"
          placeholder="2"
          value={commissionRate}
          onChange={(e) => setCommissionRate(e.target.value)}
        />
        <ForgivingInput 
          label="Your Split %"
          type="number"
          placeholder="50"
          value={agentSplit}
          onChange={(e) => setAgentSplit(e.target.value)}
        />
      </div>

      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Earnings</span>
        <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#10B981', margin: '8px 0' }}>
          AED {result?.agent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </h2>
        
        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '16px 0' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Total Commission</span>
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>AED {result?.total.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '8px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Brokerage Share</span>
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>AED {result?.broker.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CommissionCalculatorScreen;
