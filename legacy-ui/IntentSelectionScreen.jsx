import React from 'react';


const IntentSelectionScreen = ({ onSelect, onBack }) => {
  const intents = [
    { id: 'chatAgent', label: 'AI Chat Agent', icon: '🤖', desc: 'Turn Instagram DMs into Deals', highlight: true },
    { id: 'website', label: 'Build a Website', icon: '🌐', desc: 'Create your professional profile' },
    { id: 'googleAds', label: 'Get Google Leads', icon: '🔍', desc: 'Be seen when buyers search' },
    { id: 'metaLeadGen', label: 'Find Buyers on FB', icon: '∞', desc: 'Ads for Facebook & Instagram' },
    { id: 'smsCampaign', label: 'Wake Up Old Leads', icon: '💬', desc: 'Send SMS to your contacts' },
    { id: 'emailCampaign', label: 'Send Emails', icon: '✉️', desc: 'Automatic follow-up emails' },
    { id: 'propertyValuation', label: 'Property Valuation', icon: '💰', desc: 'Get an instant price estimate' },
    { id: 'commissionCalculator', label: 'Commission Calc', icon: '🧮', desc: 'Estimate your earnings' },
    { id: 'mortgageCalculator', label: 'Mortgage Calc', icon: '🏦', desc: 'Estimate monthly payments' },
    { id: 'marketTrends', label: 'Market Trends', icon: '📈', desc: 'View price & volume data' },
    { id: 'aiMarketExpert', label: 'Ask AI Expert', icon: '🧠', desc: 'Get help with pricing & data' },
  ];

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}
        >
          ←
        </button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Start Here</h1>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>What do you want to achieve today?</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {intents.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={item.highlight ? 'intent-card-highlight' : ''}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '20px',
              backgroundColor: item.highlight ? 'var(--bg-accent)' : 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'transform 0.1s'
            }}
          >
            <span style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{item.label}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{item.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default IntentSelectionScreen;