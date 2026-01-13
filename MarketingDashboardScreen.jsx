import React, { useState } from 'react';
import TemplateEditor from './TemplateEditor';
import './mobile-styles.css';

const MarketingDashboardScreen = ({ campaign, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, design, leads
  const [isEditing, setIsEditing] = useState(false);

  // Dummy data if no campaign passed
  const data = campaign || {
    name: "October Newsletter",
    type: "Email Campaign",
    status: "Completed",
    sent: 1250,
    delivered: 1240,
    opened: 560,
    clicked: 125,
    preview: "Subject: Exclusive Pre-Launch in Downtown\n\nHi [Name],\n\nWe have a new opportunity that matches your investment criteria..."
  };

  const openRate = Math.round((data.opened / data.delivered) * 100);
  const clickRate = Math.round((data.clicked / data.opened) * 100);

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <div>
          <h1 className="screen-title" style={{ marginBottom: '4px', fontSize: '18px' }}>{data.name}</h1>
          <span style={{ fontSize: '12px', color: '#059669', fontWeight: '600', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '12px' }}>● {data.status}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        {['Overview', 'Design', 'Recipients'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{ 
              flex: 1, 
              padding: '12px', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === tab.toLowerCase() ? '2px solid var(--primary-color)' : 'none',
              color: activeTab === tab.toLowerCase() ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="marketing-stat-row">
            <div className="marketing-stat-item">
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>{data.sent}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Sent</div>
            </div>
            <div className="marketing-stat-item">
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#059669' }}>{openRate}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Open Rate</div>
            </div>
            <div className="marketing-stat-item">
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-color)' }}>{clickRate}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Click Rate</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Delivery Funnel</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                <span>Delivered</span>
                <span>{data.delivered}</span>
              </div>
              <div className="funnel-bar"><div style={{ width: '99%', height: '100%', backgroundColor: '#3B82F6' }}></div></div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                <span>Opened</span>
                <span>{data.opened}</span>
              </div>
              <div className="funnel-bar"><div style={{ width: `${openRate}%`, height: '100%', backgroundColor: '#10B981' }}></div></div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                <span>Clicked Link</span>
                <span>{data.clicked}</span>
              </div>
              <div className="funnel-bar"><div style={{ width: `${(data.clicked/data.delivered)*100}%`, height: '100%', backgroundColor: '#F59E0B' }}></div></div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'design' && (
        <div className="marketing-preview-card">
          <div className="preview-header">
            <span>PREVIEW</span>
            <span>HTML / TEXT</span>
        isEditing ? (
          <TemplateEditor 
            initialContent={data.preview} 
            onSave={(newDesign) => {
              setIsEditing(false);
              alert("Design Saved!");
            }} 
          />
        ) : (
          <div className="marketing-preview-card">
            <div className="preview-header">
              <span>PREVIEW</span>
              <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>✎ EDIT DESIGN</button>
            </div>
            <div className="preview-body" style={{ whiteSpace: 'pre-wrap' }}>
              {data.preview}
            </div>
          </div>
          <div className="preview-body" style={{ whiteSpace: 'pre-wrap' }}>
            {data.preview}
          </div>
        </div>
        )
      )}

      {activeTab === 'recipients' && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <p>List of 1,250 recipients loaded.</p>
          <button style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'none', color: 'var(--primary-color)' }}>Download CSV</button>
        </div>
      )}
    </div>
  );
};

export default MarketingDashboardScreen;