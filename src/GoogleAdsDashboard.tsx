import React, { useState } from 'react';
import './mobile-styles.css';

interface Stat {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
}

interface Campaign {
  id: number;
  name: string;
  clicks: number;
  ctr: string;
  cost: string;
  status: 'Active' | 'Paused';
}

interface GoogleAdsDashboardProps {
  onBack: () => void;
}

const GoogleAdsDashboard: React.FC<GoogleAdsDashboardProps> = ({ onBack }) => {
  const [stats] = useState<Stat[]>([
    { label: 'Impressions', value: '12.5K', trend: 'up' },
    { label: 'Clicks', value: '843', trend: 'up' },
    { label: 'Avg CPC', value: '$1.42', trend: 'down' },
  ]);

  const [campaigns] = useState<Campaign[]>([
    { id: 1, name: 'Summer Sale Promo', clicks: 450, ctr: '4.2%', cost: '$320', status: 'Active' },
    { id: 2, name: 'Retargeting - Cart', clicks: 210, ctr: '6.8%', cost: '$180', status: 'Active' },
    { id: 3, name: 'Brand Awareness', clicks: 183, ctr: '1.5%', cost: '$110', status: 'Paused' },
  ]);

  return (
    <div className="screen-container" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>←</button>
        <h1 className="screen-title" style={styles.title}>Google Ads</h1>
      </div>

      {/* Marketing Stats Row */}
      <div className="marketing-stat-row">
        {stats.map((stat, index) => (
          <div key={index} className="marketing-stat-item">
            <div style={styles.statLabel}>{stat.label}</div>
            <div style={styles.statValue}>{stat.value}</div>
            <div style={{ 
              fontSize: '10px', 
              color: stat.trend === 'up' ? '#10B981' : stat.trend === 'down' ? '#EF4444' : 'var(--text-secondary)',
              fontWeight: 700 
            }}>
              {stat.trend === 'up' ? '↑ 12%' : stat.trend === 'down' ? '↓ 5%' : '-'}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section (Visual Only) */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={styles.sectionTitle}>Performance (Last 7 Days)</h3>
        <div className="chart-container">
          {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
            <div key={i} className="chart-bar" style={{ height: `${height}%` }}>
              {i === 6 && <span className="chart-value">90</span>}
              <span className="chart-label">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Planner / Insights */}
      <div className="smart-planner-container">
        <div className="trend-badge">🔥 Trending Keyword</div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--text-primary)' }}>"Luxury Apartments"</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          CPC has dropped by 15% for this keyword. Consider increasing bid cap.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="keyword-tag">Real Estate</span>
          <span className="keyword-tag">Rentals</span>
        </div>
      </div>

      {/* Campaigns List */}
      <div>
        <h3 style={styles.sectionTitle}>Active Campaigns</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {campaigns.map(campaign => (
            <div key={campaign.id} style={styles.card}>
              <div style={{ flex: 1 }}>
                <div style={styles.campaignName}>{campaign.name}</div>
                <div style={styles.campaignMeta}>
                  {campaign.clicks} Clicks • CTR {campaign.ctr}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={styles.cost}>{campaign.cost}</div>
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: campaign.status === 'Active' ? '#D1FAE5' : '#F3F4F6',
                  color: campaign.status === 'Active' ? '#065F46' : '#6B7280',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {campaign.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', paddingBottom: '100px' },
  header: { display: 'flex', alignItems: 'center', marginBottom: '24px' },
  backButton: { background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' },
  title: { marginBottom: 0 },
  statLabel: { fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' },
  statValue: { fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' },
  sectionTitle: { fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' },
  card: { 
    backgroundColor: 'var(--bg-primary)', 
    padding: '16px', 
    borderRadius: '12px', 
    border: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  campaignName: { fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' },
  campaignMeta: { fontSize: '12px', color: 'var(--text-secondary)' },
  cost: { fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }
};

export default GoogleAdsDashboard;
```

<!--
[PROMPT_SUGGESTION]Can you create a "Create Campaign" wizard component for this dashboard?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]How can I add a date range picker to filter the ads performance data?[/PROMPT_SUGGESTION]
-->