import React, { useState } from 'react';
import StickyFooter from './StickyFooter';


const PaymentScreen = ({ amount, onPaymentComplete, onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState('apple');
  const displayAmount = amount || '199';

  const handlePay = () => {
    // Simulate payment processing delay
    onPaymentComplete();
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}
        >
          ←
        </button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Activate</h1>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '48px', fontWeight: '800', color: 'var(--text-primary)' }}>AED {displayAmount}</span>
        <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px' }}>Total Budget</span>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>Pay with</h3>

      <div 
        className={`payment-method-card ${selectedMethod === 'apple' ? 'selected' : ''}`}
        onClick={() => setSelectedMethod('apple')}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '12px' }}>🍎</span>
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Apple Pay</span>
        </div>
        <div className="radio-circle">
          {selectedMethod === 'apple' && <div className="radio-dot" />}
        </div>
      </div>

      <div 
        className={`payment-method-card ${selectedMethod === 'google' ? 'selected' : ''}`}
        onClick={() => setSelectedMethod('google')}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '12px' }}>🤖</span>
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Google Pay</span>
        </div>
        <div className="radio-circle">
          {selectedMethod === 'google' && <div className="radio-dot" />}
        </div>
      </div>

      <div 
        className={`payment-method-card ${selectedMethod === 'card' ? 'selected' : ''}`}
        onClick={() => setSelectedMethod('card')}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '12px' }}>💳</span>
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Credit Card</span>
        </div>
        <div className="radio-circle">
          {selectedMethod === 'card' && <div className="radio-dot" />}
        </div>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '24px', lineHeight: '1.5' }}>
        🔒 Secure payment processed by Stripe. No payment profile required.
      </p>

      <StickyFooter label={`Pay AED ${displayAmount}`} onClick={handlePay} />
    </div>
  );
};

export default PaymentScreen;