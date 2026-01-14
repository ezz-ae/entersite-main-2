import React from 'react';


const SmartReport = ({ data }) => {
  // Default dummy data if none provided
  const stats = data || {
    clicks: 1240,
    leads: 45,
    cost: 450, // AED
    ctr: '3.2%'
  };

  const cpl = (stats.cost / stats.leads).toFixed(2);

  return (
    <div className="smart-report-container">
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
        Performance Summary
      </h3>
      
      <div className="report-grid">
        <ReportCard 
          label="Total Leads" 
          value={stats.leads} 
          trend="+12%" 
          icon="👥" 
          color="var(--primary-color)"
          bgColor="var(--bg-accent)"
        />
        <ReportCard 
          label="Cost Per Lead" 
          value={`AED ${cpl}`} 
          trend="-5%" 
          trendGood={true} // Lower cost is good
          icon="💰" 
          color="#059669"
          bgColor="#D1FAE5"
        />
        <ReportCard 
          label="Ad Clicks" 
          value={stats.clicks.toLocaleString()} 
          trend="+8%" 
          icon="👆" 
          color="#D97706"
          bgColor="#FEF3C7"
        />
        <ReportCard 
          label="Total Spent" 
          value={`AED ${stats.cost}`} 
          icon="💳" 
          color="#DC2626"
          bgColor="#FEE2E2"
        />
      </div>

      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
          💡 AI Insight
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
          Your cost per lead is <strong>5% lower</strong> than the market average for this area. We recommend increasing your budget by AED 50 to capture more volume.
        </p>
      </div>
    </div>
  );
};

const ReportCard = ({ label, value, trend, trendGood = true, icon, color, bgColor }) => (
  <div style={{ 
    backgroundColor: 'var(--bg-primary)', 
    padding: '16px', 
    borderRadius: '16px', 
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  }}>
    <div style={{ 
      width: '32px', 
      height: '32px', 
      borderRadius: '8px', 
      backgroundColor: bgColor, 
      color: color,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '16px',
      marginBottom: '12px'
    }}>
      {icon}
    </div>
    
    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
      {label}
    </span>
    
    <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
      {value}
    </span>

    {trend && (
      <span style={{ 
        position: 'absolute',
        top: '16px',
        right: '16px',
        fontSize: '11px',
        fontWeight: '700',
        color: trendGood ? '#059669' : '#DC2626',
        backgroundColor: trendGood ? '#D1FAE5' : '#FEE2E2',
        padding: '2px 6px',
        borderRadius: '4px'
      }}>
        {trend}
      </span>
    )}
  </div>
);

export default SmartReport;