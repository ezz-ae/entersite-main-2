import React, { useState, useEffect } from 'react';
import './mobile-styles.css';
import { useAuth } from '@/AuthContext'; // Assuming AuthContext provides the token

interface BillingEvent {
  id: string;
  createdAt: string;
  amount: number;
  currency?: string;
  type: string;
  [key: string]: any;
}

interface BillingScreenProps {
  onBack: () => void;
}

function formatEvent(event: BillingEvent) {
  const date = new Date(event.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  let amount = 'N/A';
  if (event.amount) {
    const currency = event.currency || 'AED';
    amount = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(event.amount);
  } else if (event.priceAed) {
     amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED' }).format(event.priceAed);
  }

  let service = 'Account Activity';
  switch (event.type) {
    case 'subscription_created':
      service = `Subscribed to ${event.plan || 'a plan'}`;
      break;
    case 'subscription_updated':
      service = `Plan updated to ${event.plan || ''}`;
      break;
    case 'add_on_applied':
      service = `Purchased: ${event.sku || 'Add-on'}`;
      break;
    case 'limit_blocked':
      service = `Usage limit reached for ${event.metric}`;
      amount = 'Usage Blocked';
      break;
    case 'trial_ended':
      service = 'Trial Ended';
      amount = 'N/A';
      break;
    default:
      service = event.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  return { ...event, date, amount, service };
}

const BillingScreen: React.FC<BillingScreenProps> = ({ onBack }) => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchBillingHistory() {
      if (!token) {
        setLoading(false);
        setError("Authentication required.");
        return;
      }
      try {
        const response = await fetch('/api/billing/history', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch billing history.');
        }
        const data = await response.json();
        setInvoices(data.history.map(formatEvent));
      } catch (e: any) {
        setError(e.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchBillingHistory();
  }, [token]);

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
        {loading && <div style={{ color: 'var(--text-secondary)'}}>Loading history...</div>}
        {error && <div style={{ color: 'var(--danger-color)'}}>{error}</div>}
        {!loading && !error && invoices.length === 0 && <div style={{ color: 'var(--text-secondary)'}}>No billing history found.</div>}
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
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{inv.date} • {inv.id.substring(0, 7)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{inv.amount}</div>
              {inv.status && <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>{inv.status}</div>}
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