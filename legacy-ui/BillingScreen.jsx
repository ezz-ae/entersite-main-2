import React from 'react';
import './mobile-styles.css';

const BillingScreen = ({ onBack }) => {
  const invoices = [
    { id: 'INV-001', date: 'Oct 24, 2023', amount: 'AED 450.00', status: 'Paid', service: 'Google Ads Budget' },
    { id: 'INV-002', date: 'Oct 10, 2023', amount: 'AED 199.00', status: 'Paid', service: 'Website Hosting' },
    { id: 'INV-003', date: 'Sep 24, 2023', amount: 'AED 450.00', status: 'Paid', service: 'Google Ads Budget' },
  ];

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Billing</h1>
      </div>

      {/* Payment Method */}
      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Payment Method</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>💳</span>
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Visa ending in 4242</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Expires 12/25</div>
          </div>
          <button style={{ marginLeft: 'auto', border: '1px solid var(--border-color)', background: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>Update</button>
        </div>
      </div>

      {/* Invoices */}
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>Invoice History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {invoices.map(inv => (
          <div key={inv.id} style={{ 
            backgroundColor: 'var(--bg-primary)', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>{inv.service}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{inv.date} • {inv.id}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{inv.amount}</div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>{inv.status}</div>
            </div>
            <button style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--primary-color)', marginLeft: '8px' }}>
              ⬇️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillingScreen;