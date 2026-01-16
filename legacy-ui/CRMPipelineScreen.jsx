import React, { useState } from 'react';
import './mobile-styles.css';

const CRMPipelineScreen = ({ onBack }) => {
  const [leads, setLeads] = useState([
    { id: 1, name: 'Sarah Miller', stage: 'new', value: 'AED 2.5M' },
    { id: 2, name: 'Mike Ross', stage: 'contacted', value: 'AED 1.8M' },
    { id: 3, name: 'Ahmed Ali', stage: 'new', value: 'AED 5.0M' },
    { id: 4, name: 'John Doe', stage: 'closed', value: 'AED 3.2M' },
  ]);

  const stages = [
    { id: 'new', label: 'New Leads', color: '#3B82F6' },
    { id: 'contacted', label: 'Contacted', color: '#F59E0B' },
    { id: 'closed', label: 'Closed', color: '#10B981' }
  ];

  const moveLead = (leadId, newStage) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '40px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Pipeline</h1>
      </div>

      <div className="pipeline-container">
        {stages.map(stage => (
          <div key={stage.id} className="pipeline-column">
            <div className="column-header" style={{ borderTopColor: stage.color }}>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{stage.label}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {leads.filter(l => l.stage === stage.id).length}
              </span>
            </div>
            <div className="column-content" style={{ flex: 1, overflowY: 'auto' }}>
              {leads.filter(l => l.stage === stage.id).map(lead => (
                <div key={lead.id} className="pipeline-card">
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{lead.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{lead.value}</div>
                  
                  {/* Quick Move Actions */}
                  <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {stages.filter(s => s.id !== stage.id).map(s => (
                      <button 
                        key={s.id}
                        onClick={() => moveLead(lead.id, s.id)}
                        style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', cursor: 'pointer', color: 'var(--text-secondary)' }}
                      >
                        → {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CRMPipelineScreen;