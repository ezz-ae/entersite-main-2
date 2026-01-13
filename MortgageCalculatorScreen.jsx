import React, { useState, useEffect } from 'react';
import StickyFooter from './StickyFooter';
import ForgivingInput from './ForgivingInput';
import './mobile-styles.css';

const MortgageCalculatorScreen = ({ onBack }) => {
  const [price, setPrice] = useState('');
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [interestRate, setInterestRate] = useState('4.5');
  const [years, setYears] = useState('25');
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    calculate();
  }, [price, downPaymentPercent, interestRate, years]);

  const calculate = () => {
    const p = parseFloat(price.replace(/,/g, '')) || 0;
    const dp = parseFloat(downPaymentPercent) || 0;
    const r = parseFloat(interestRate) || 0;
    const n = parseFloat(years) || 0;

    const principal = p * (1 - dp / 100);
    const monthlyRate = r / 100 / 12;
    const numberOfPayments = n * 12;

    if (principal > 0 && monthlyRate > 0 && numberOfPayments > 0) {
      const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      setMonthlyPayment(payment);
    } else {
      setMonthlyPayment(0);
    }
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Mortgage Calc</h1>
      </div>

      <ForgivingInput 
        label="Property Price (AED)"
        type="number"
        placeholder="e.g. 1,500,000"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <ForgivingInput 
          label="Down Payment %"
          type="number"
          placeholder="20"
          value={downPaymentPercent}
          onChange={(e) => setDownPaymentPercent(e.target.value)}
        />
        <ForgivingInput 
          label="Interest Rate %"
          type="number"
          placeholder="4.5"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
      </div>

      <ForgivingInput 
        label="Loan Duration (Years)"
        type="number"
        placeholder="25"
        value={years}
        onChange={(e) => setYears(e.target.value)}
      />

      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', textAlign: 'center', marginTop: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Est. Monthly Payment</span>
        <h2 style={{ fontSize: '40px', fontWeight: '800', color: 'var(--primary-color)', margin: '8px 0' }}>
          AED {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
          Principal + Interest only.
        </p>
      </div>
    </div>
  );
};

export default MortgageCalculatorScreen;