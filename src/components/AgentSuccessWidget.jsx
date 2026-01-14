import React from 'react';
import './mobile-styles.css';

const AgentSuccessWidget = ({ onAction }) => {
  return (
    <div className="success-widget-container">
      {/* Header / Gamification */}
      <div className="success-header">
        <div>
          <span className="rank-badge">🏆 Top 10% Agent</span>
          <h3 className="widget-title">Money Machine</h3>
        </div>
        <div className="machine-status">
          <span style={{fontSize: '20px', display: 'block'}}>⚙️</span>
          <span style={{fontSize: '10px', fontWeight: '700', color: '#065F46', textTransform: 'uppercase'}}>Active</span>
        </div>
      </div>

      {/* Targets / Progress */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Weekly Target</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-color)' }}>AED 35k / 50k</span>
        </div>
        <div className="widget-progress-bg">
          <div className="widget-progress-fill" style={{ width: '70%' }}></div>
        </div>
      </div>

      {/* Best Next Step */}
      <div className="next-step-card" onClick={onAction}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="step-icon">📞</div>
          <div>
            <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Best Next Step</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Call Sarah Miller</span>
          </div>
        </div>
        <div style={{ backgroundColor: '#EFF6FF', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', color: 'var(--primary-color)' }}>
          High Intent
        </div>
      </div>

      {/* Higher Quality Lead Tip */}
      <div className="quality-tip">
        <span style={{ marginRight: '8px', fontSize: '16px' }}>💎</span>
        <span style={{ lineHeight: '1.3' }}><strong>Pro Tip:</strong> Leads with verified emails convert 3x faster. <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Enable verification.</span></span>
      </div>
    </div>
  );
};

export default AgentSuccessWidget;