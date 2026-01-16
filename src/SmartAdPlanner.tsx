import React, { useEffect, useMemo, useState } from 'react';
import BudgetCalculator from './BudgetCalculator';
import './mobile-styles.css';

type Props = {
  market: string;
  budget: number;
  onBudgetChange: (value: number) => void;
  onStrategyChange?: (strategy: Strategy) => void;
};

type Strategy = {
  keywords: string[];
  headlines: string[];
  descriptions: string[];
  competitors: string[];
  interceptEnabled: boolean;
};

const SmartAdPlanner: React.FC<Props> = ({ market, budget, onBudgetChange, onStrategyChange }) => {
  const [step, setStep] = useState<'analyzing' | 'strategy'>('analyzing');
  const [strategy, setStrategy] = useState<Strategy>({
    keywords: [],
    headlines: [],
    descriptions: [],
    competitors: ['bayut.com', 'propertyfinder.ae'],
    interceptEnabled: true,
  });

  const hostname = useMemo(() => {
    // Safe for Next.js client components.
    if (typeof window === 'undefined') return 'entrestate.com';
    return window.location.hostname;
  }, []);

  const generateAIStrategy = () => {
    const next: Strategy = {
      keywords: [`Buy ${market}`, `Apartments in ${market}`, `${market} Investment`, `Luxury Real Estate`],
      headlines: [`New Launch in ${market}`, `Own a Home in ${market}`, `High ROI Investment`],
      descriptions: [
        `Exclusive payment plans available. Book your viewing today.`,
        `Luxury living in the heart of ${market}. Starting from AED 1.2M.`,
      ],
      competitors: ['bayut.com', 'propertyfinder.ae', 'dubizzle.com'],
      interceptEnabled: true,
    };
    setStrategy(next);
    onStrategyChange?.(next);
  };

  useEffect(() => {
    if (!market || market.length < 3) return;
    setStep('analyzing');
    const timer = setTimeout(() => {
      generateAIStrategy();
      setStep('strategy');
    }, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market]);

  if (!market || market.length < 3) return null;

  return (
    <div className="smart-planner-container">
      {step === 'analyzing' && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Smart Market Scan</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Analyzing search volume, competitor bids, and high-intent keywords for <strong>{market}</strong>...
          </p>
        </div>
      )}

      {step === 'strategy' && (
        <div className="fade-in">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Smart Strategy Draft</h3>
            <span className="trend-badge">✨ Optimized</span>
          </div>

          {/* 1) Competitor Intercept */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px',
              border: '1px solid #E5E7EB',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>🎯 Competitor Intercept</span>
              <input
                type="checkbox"
                checked={strategy.interceptEnabled}
                onChange={(e) => {
                  const next = { ...strategy, interceptEnabled: e.target.checked };
                  setStrategy(next);
                  onStrategyChange?.(next);
                }}
                style={{ accentColor: 'var(--primary-color)' }}
              />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              We detected <strong>{strategy.competitors.length} portals</strong> dominating this area. Enable this to
              show your ad when people search for them.
            </p>
          </div>

          {/* 2) Ad preview */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Generated Ad Preview
            </label>
            <div
              style={{
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#202124' }}>Ad · {hostname}</div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#1a0dab',
                  fontWeight: 400,
                  margin: '4px 0',
                  textDecoration: 'underline',
                }}
              >
                {strategy.headlines[0]} | {strategy.headlines[1]}
              </div>
              <div style={{ fontSize: '14px', color: '#4d5156' }}>
                {strategy.descriptions[0]} {strategy.descriptions[1]}
              </div>
            </div>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                fontSize: '12px',
                fontWeight: 600,
                marginTop: '8px',
                cursor: 'pointer',
              }}
              onClick={generateAIStrategy}
            >
              🔄 Regenerate Copy
            </button>
          </div>

          {/* 3) Budget */}
          <BudgetCalculator value={budget} onChange={onBudgetChange} platform="googleAds" />
        </div>
      )}
    </div>
  );
};

export default SmartAdPlanner;
