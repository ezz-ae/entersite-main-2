import React, { useState } from 'react';
import SmartReport from './SmartReport';
import AudienceView from './AudienceView';
import './mobile-styles.css';

type Project = {
  id?: number;
  name: string;
  status: string;
  views: number;
  leads: number;
};

const CampaignHubScreen: React.FC<{ project: Project | null; onBack: () => void }> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'messaging' | 'audience'>('overview');

  if (!project) return null;

  return (
    <div
      className="screen-container"
      style={{ padding: '24px', paddingBottom: '100px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}
        >
          ←
        </button>
        <div>
          <h1 className="screen-title" style={{ marginBottom: '4px', fontSize: '20px' }}>
            {project.name}
          </h1>
          <span
            style={{
              fontSize: '12px',
              color: project.status === 'Live' ? '#059669' : '#D97706',
              backgroundColor: project.status === 'Live' ? '#D1FAE5' : '#FEF3C7',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 600,
            }}
          >
            {project.status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', padding: '4px', backgroundColor: '#E5E7EB', borderRadius: '12px' }}>
        {([
          { id: 'overview', label: 'Overview' },
          { id: 'messaging', label: 'Messaging' },
          { id: 'audience', label: 'Audience' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? 'black' : '#6B7280',
              fontWeight: 600,
              fontSize: '13px',
              boxShadow: activeTab === tab.id ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="fade-in">
          <SmartReport data={{ clicks: project.views, leads: project.leads, cost: 450, ctr: '2.4%' }} />

          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Landing Surface</h3>
            <div
              style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ display: 'block', fontWeight: 600, fontSize: '14px' }}>{project.name} Site</span>
                <a href="#" style={{ fontSize: '12px', color: 'var(--primary-color)' }}>
                  View live site ↗
                </a>
              </div>
              <button
                style={{ padding: '8px 16px', backgroundColor: '#F3F4F6', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'messaging' && (
        <div className="fade-in">
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Smart Sender</h3>
              <div style={{ width: '40px', height: '24px', backgroundColor: '#10B981', borderRadius: '12px', position: 'relative' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }} />
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>
              Automatically following up with <strong>{project.leads} leads</strong> via Email & SMS.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '11px', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '4px 8px', borderRadius: '4px' }}>
                📧 3 Emails
              </span>
              <span style={{ fontSize: '11px', backgroundColor: '#F0FDF4', color: '#15803D', padding: '4px 8px', borderRadius: '4px' }}>
                💬 1 SMS
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#6B7280' }}>Recent Activity</h3>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: 'white', borderRadius: '12px', marginBottom: '8px', border: '1px solid #E5E7EB' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                {i === 2 ? '💬' : '📧'}
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: 600 }}>{i === 2 ? 'SMS Sent' : 'Email Opened'}</span>
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Lead #{100 + i} • 2h ago</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'audience' && <AudienceView leads={project.leads} />}
    </div>
  );
};

export default CampaignHubScreen;
