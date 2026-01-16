import React from 'react';
import './mobile-styles.css';

type Props = {
  data: {
    clicks?: number;
    leads?: number;
    cost?: number;
    ctr?: string;
  };
};

const SmartReport: React.FC<Props> = ({ data }) => {
  const cards = [
    { label: 'Clicks', value: data.clicks ?? 0 },
    { label: 'Leads', value: data.leads ?? 0 },
    { label: 'Cost', value: data.cost ?? 0 },
    { label: 'CTR', value: data.ctr ?? '0%' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            padding: '14px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
            {c.label}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '6px' }}>{c.value}</div>
        </div>
      ))}
    </div>
  );
};

export default SmartReport;
