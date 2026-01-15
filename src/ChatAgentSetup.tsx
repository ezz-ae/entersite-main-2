import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import ForgivingInput from './ForgivingInput';
import './mobile-styles.css';

interface ChatAgentSetupProps {
  onComplete: () => void;
  onBack: () => void;
}

const ChatAgentSetup: React.FC<ChatAgentSetupProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [agentName, setAgentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [conversionGoal, setConversionGoal] = useState('booking');

  const handleConnect = () => {
    // Simulate auth
    setTimeout(() => setIsConnected(true), 1000);
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      {/* Header / Marketing Hook */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>AI Chat Expert</h1>
      </div>

      <div style={{ backgroundColor: 'var(--bg-accent)', padding: '20px', borderRadius: '16px', marginBottom: '32px', border: '1px solid var(--primary-color)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-color)', marginTop: 0 }}>Turn DMs into Deals</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: 0 }}>
          Your AI agent replies instantly, knows every detail of your projects, and books meetings for you 24/7.
        </p>
      </div>

      {/* Step 1: Connect */}
      <div style={{ opacity: step >= 1 ? 1 : 0.5, marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step > 1 ? '#10B981' : 'var(--text-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', marginRight: '12px' }}>1</div>
          <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>Connect Instagram</span>
        </div>
        
        {step === 1 && (
          <button 
            onClick={handleConnect}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: isConnected ? '#ECFDF5' : '#E1306C', /* Insta Color */
              color: isConnected ? '#065F46' : 'white',
              fontWeight: '700',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {isConnected ? '✅ Connected as @RealEstatePro' : '📸 Connect Instagram Account'}
          </button>
        )}
      </div>

      {/* Step 2: Knowledge */}
      <div style={{ opacity: isConnected ? 1 : 0.5, transition: 'opacity 0.5s', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--text-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', marginRight: '12px' }}>2</div>
          <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>What should I sell?</span>
        </div>

        {isConnected && (
          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              fontSize: '16px',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          >
            <option value="">Select a Project...</option>
            <option value="downtown">Downtown Luxury Loft</option>
            <option value="marina">Marina 2-Bed</option>
            <option value="all">Everything (I'm an expert)</option>
          </select>
        )}
      </div>

      {/* Step 3: Branding */}
      <div style={{ opacity: selectedProject ? 1 : 0.5, transition: 'opacity 0.5s', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--text-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', marginRight: '12px' }}>3</div>
          <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>Agent Persona</span>
        </div>

        {selectedProject && (
          <>
            <ForgivingInput 
              label="Agent Name" 
              placeholder="e.g. Sarah (AI Assistant)" 
              value={agentName} 
              onChange={(e) => setAgentName(e.target.value)} 
            />
            <ForgivingInput 
              label="Company Name" 
              placeholder="e.g. Elite Properties" 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)} 
            />
          </>
        )}
      </div>

      {/* Step 4: Conversion Success */}
      <div style={{ opacity: agentName ? 1 : 0.5, transition: 'opacity 0.5s', marginBottom: '100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--text-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', marginRight: '12px' }}>4</div>
          <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)' }}>Success Goal</span>
        </div>

        {agentName && (
          <select 
            value={conversionGoal}
            onChange={(e) => setConversionGoal(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              fontSize: '16px',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          >
            <option value="booking">📅 Book a Meeting</option>
            <option value="whatsapp">💬 Send to WhatsApp</option>
            <option value="phone">📞 Collect Phone Number</option>
            <option value="event">🎟️ Register for Event</option>
          </select>
        )}
      </div>

      <StickyFooter 
        label="Activate AI Agent" 
        onClick={onComplete} 
        disabled={!isConnected || !selectedProject || !agentName} 
      />
    </div>
  );
};

export default ChatAgentSetup;