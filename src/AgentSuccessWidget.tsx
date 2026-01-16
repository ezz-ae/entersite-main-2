import React from 'react';

const AgentSuccessWidget: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <div className="success-widget-container">
    <div className="success-header">
      <div>
        <span className="rank-badge">Top Priority</span>
        <h3 className="widget-title">Follow up with Sarah Miller</h3>
      </div>
    </div>
    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
      Smart has qualified this lead as "High Intent".
    </p>
    <button className="next-step-card" onClick={onAction}>
      <div className="step-icon">💬</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>Open Chat</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Last message: 2 hours ago</div>
      </div>
      <span>→</span>
    </button>
  </div>
);

export default AgentSuccessWidget;