import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import ForgivingInput from './ForgivingInput';
import './mobile-styles.css';

interface CampaignBuilderScreenProps {
  type?: 'email' | 'sms';
  onBack: () => void;
  onSend: (data: any) => void;
}

const CampaignBuilderScreen: React.FC<CampaignBuilderScreenProps> = ({ type = 'email', onBack, onSend }) => {
  const [step, setStep] = useState(1); // 1: Recipients, 2: Content, 3: Review
  const [recipients, setRecipients] = useState('all');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onSend({ type, recipients, subject, content });
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>
          {step === 1 ? 'Select Audience' : step === 2 ? 'Write Content' : 'Review & Send'}
        </h1>
      </div>

      {/* Step 1: Recipients */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <RecipientOption 
            label="All Leads" 
            count={1250} 
            selected={recipients === 'all'} 
            onClick={() => setRecipients('all')} 
          />
          <RecipientOption 
            label="High Intent (Hot)" 
            count={45} 
            selected={recipients === 'hot'} 
            onClick={() => setRecipients('hot')} 
            icon="🔥"
          />
          <RecipientOption 
            label="Past Clients" 
            count={120} 
            selected={recipients === 'clients'} 
            onClick={() => setRecipients('clients')} 
            icon="🤝"
          />
          <RecipientOption 
            label="Upload CSV" 
            count={0} 
            selected={recipients === 'csv'} 
            onClick={() => setRecipients('csv')} 
            icon="📂"
          />
        </div>
      )}

      {/* Step 2: Content */}
      {step === 2 && (
        <div>
          {type === 'email' && (
            <ForgivingInput 
              label="Subject Line" 
              placeholder="e.g. Exclusive Pre-Launch Opportunity" 
              value={subject} 
              onChange={(e: any) => setSubject(e.target.value)} 
            />
          )}
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
              Message Content
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', overflowX: 'auto' }}>
              {['[Name]', '[Project]', '[Link]'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setContent(prev => prev + ' ' + tag)}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontSize: '12px', cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                  {tag}
                </button>
              ))}
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === 'email' ? "Hi [Name], ..." : "Hey [Name], check this out..."}
              style={{ width: '100%', height: '200px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', resize: 'none' }}
            />
            {type === 'sms' && (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'right', marginTop: '4px' }}>
                {content.length} / 160 characters
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--bg-tertiary)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>To</span>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {recipients === 'all' ? 'All Leads (1,250)' : recipients === 'hot' ? 'High Intent (45)' : 'Selected List'}
            </div>
          </div>
          
          {type === 'email' && (
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--bg-tertiary)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Subject</span>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{subject}</div>
            </div>
          )}

          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Preview</span>
            <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '8px', whiteSpace: 'pre-wrap', backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}>
              {content}
            </div>
          </div>
        </div>
      )}

      <StickyFooter 
        label={step === 3 ? `Send ${type === 'email' ? 'Email' : 'SMS'} Blast` : 'Next Step'} 
        onClick={handleNext} 
        // @ts-ignore
        disabled={step === 2 && !content}
      />
    </div>
  );
};

interface RecipientOptionProps {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
  icon?: string;
}

const RecipientOption: React.FC<RecipientOptionProps> = ({ label, count, selected, onClick, icon = "👥" }) => (
  <div 
    onClick={onClick}
    className={`recipient-option ${selected ? 'selected' : ''}`}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ fontSize: '20px' }}>{icon}</div>
      <div>
        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{count} recipients</div>
      </div>
    </div>
    {selected && <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>✓</span>}
  </div>
);

export default CampaignBuilderScreen;