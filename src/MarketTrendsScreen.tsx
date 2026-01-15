import React, { useState } from 'react';
import './mobile-styles.css';

interface MarketTrendsScreenProps {
  onBack: () => void;
}

const MarketTrendsScreen: React.FC<MarketTrendsScreenProps> = ({ onBack }) => {
  const [timeframe, setTimeframe] = useState('6M');
  
  // Mock Data
  const priceData = [
    { label: 'May', value: 1200 },
    { label: 'Jun', value: 1250 },
    { label: 'Jul', value: 1240 },
    { label: 'Aug', value: 1300 },
    { label: 'Sep', value: 1350 },
    { label: 'Oct', value: 1400 },
  ];

  const maxPrice = Math.max(...priceData.map(d => d.value));

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Market Trends</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>LOCATION</span>
          <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Downtown Dubai</div>
        </div>
        <select 
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '12px', outline: 'none' }}
        >
          <option value="3M">3 Months</option>
          <option value="6M">6 Months</option>
          <option value="1Y">1 Year</option>
        </select>
      </div>

      {/* Price Chart */}
      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Avg. Price per Sqft</h3>
        <span style={{ fontSize: '24px', fontWeight: '800', color: '#10B981' }}>AED 1,400</span>
        <span style={{ fontSize: '12px', color: '#10B981', marginLeft: '8px' }}>▲ 12% vs last year</span>

        <div className="chart-container">
          {priceData.map((d, i) => (
            <div key={i} className="chart-bar" style={{ height: `${(d.value / maxPrice) * 100}%` }}>
              <span className="chart-value">{d.value}</span>
              <span className="chart-label">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Volume Stat */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>TRANSACTIONS</span>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>482</div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>TOTAL VALUE</span>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>1.2B</div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrendsScreen;