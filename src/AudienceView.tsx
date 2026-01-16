import React from 'react';
import './mobile-styles.css';

const SegmentCard = ({ label, count, color, bg }: { label: string; count: number; color: string; bg: string }) => (
  <div
    style={{
      backgroundColor: bg,
      padding: '12px',
      borderRadius: '12px',
      textAlign: 'center',
      border: `1px solid ${color}20`,
    }}
  >
    <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color, marginBottom: '4px' }}>{label}</span>
    <span style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937' }}>{count}</span>
  </div>
);

const AudienceView: React.FC<{ leads: number }> = ({ leads }) => {
  const hot = Math.floor(leads * 0.15);
  const warm = Math.floor(leads * 0.35);
  const cold = Math.max(0, leads - hot - warm);

  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '24px' }}>
        <SegmentCard label="🔥 Hot" count={hot} color="#DC2626" bg="#FEF2F2" />
        <SegmentCard label="🙂 Warm" count={warm} color="#D97706" bg="#FFFBEB" />
        <SegmentCard label="❄️ Cold" count={cold} color="#2563EB" bg="#EFF6FF" />
      </div>

      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Live Signals</h3>

        <div className="signal-item">
          <span className="signal-icon">🔥</span>
          <div>
            <span className="signal-text">
              <strong>Sarah M.</strong> visited pricing page 3x
            </span>
            <span className="signal-meta">Moved to Hot • 10m ago</span>
          </div>
        </div>

        <div className="signal-item">
          <span className="signal-icon">🛑</span>
          <div>
            <span className="signal-text">
              <strong>John D.</strong> replied "Not interested"
            </span>
            <span className="signal-meta">Automation suppressed • 1h ago</span>
          </div>
        </div>

        <div className="signal-item">
          <span className="signal-icon">👀</span>
          <div>
            <span className="signal-text">
              <strong>Ahmed K.</strong> opened "Brochure PDF"
            </span>
            <span className="signal-meta">Score +10 • 2h ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceView;
