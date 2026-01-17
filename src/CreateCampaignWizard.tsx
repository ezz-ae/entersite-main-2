import React, { useState } from 'react';
import ForgivingInput from './ForgivingInput';
import StickyFooter from './StickyFooter';
import './mobile-styles.css';
import SmartAdPlanner from './SmartAdPlanner';

interface CreateCampaignWizardProps {
  onBack: () => void;
  onLaunch: (data: any) => void;
}

const CreateCampaignWizard: React.FC<CreateCampaignWizardProps> = ({ onBack, onLaunch }) => {
  const [goal, setGoal] = useState('Lead Generation');
  const [location, setLocation] = useState('Dubai, UAE');
  const [budget, setBudget] = useState('150');
  const [duration, setDuration] = useState('30');
  const [landingPage, setLandingPage] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>AI Campaign Builder</h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Smart keywords, ad copy, and expected results in minutes.
      </p>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Goal</label>
        <select 
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }}
        >
          <option>Lead Generation</option>
          <option>Brand Awareness</option>
          <option>Website Traffic</option>
        </select>
      </div>

      <ForgivingInput 
        label="Location" 
        value={location} 
        onChange={(e) => setLocation(e.target.value)} 
      />

      <SmartAdPlanner
        market={location}
        budget={budget}
        onBudgetChange={(e) => setBudget(e.target.value)}
      />

      <ForgivingInput 
        label="Campaign Length (Days)" 
        type="number"
        value={duration} 
        onChange={(e) => setDuration(e.target.value)} 
      />

      <ForgivingInput 
        label="Landing Page (Optional)" 
        placeholder="https://your-listing.com"
        value={landingPage} 
        onChange={(e) => setLandingPage(e.target.value)} 
      />

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Focus Notes (Optional)</label>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Focus on luxury amenities..."
          style={{ width: '100%', height: '100px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', resize: 'none' }}
        />
      </div>

      <StickyFooter label="Launch Campaign" onClick={() => onLaunch({ goal, location, budget, duration, landingPage, notes })} />
    </div>
  );
};

export default CreateCampaignWizard;