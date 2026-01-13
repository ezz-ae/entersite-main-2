import React, { useState } from 'react';
import ForgivingInput from './ForgivingInput';
import StickyFooter from './StickyFooter';
import BudgetCalculator from './BudgetCalculator';
import SmartAdPlanner from './SmartAdPlanner';
import DomainSearch from './DomainSearch';
import CompetitorAnalysis from './CompetitorAnalysis';
import PersonaSelector from './PersonaSelector';
import '../mobile-styles.css';

const UniversalInputsScreen = ({ onNext, onBack, serviceType }) => {
  // State matches the questions in your flow-spec.json
  const [formData, setFormData] = useState({
    market: '',
    audience: 'Home Buyers',
    goal: 'Get Leads',
    language: 'English',
    budget: '',
    siteName: '',
    competitors: [],
    persona: 'professional'
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Helper to render a styled select box that matches ForgivingInput
  const renderSelect = (label, field, options) => (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px', /* Prevents iOS zoom */
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            appearance: 'none', /* Removes default OS styling */
            outline: 'none',
            color: 'var(--text-primary)'
          }}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {/* Custom Arrow for better UI */}
        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)', fontSize: '12px' }}>
          ▼
        </div>
      </div>
    </div>
  );

  // Dynamic Title based on Service
  const getTitle = () => {
    switch(serviceType) {
      case 'website': return 'Website Details';
      case 'googleAds': return 'Google Ads Setup';
      case 'metaLeadGen': return 'Meta Campaign';
      case 'smsCampaign': return 'SMS Blast Config';
      default: return 'Quick Details';
    }
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '24px', 
            marginRight: '16px', 
            cursor: 'pointer', 
            padding: 0,
            color: 'var(--text-tertiary)'
          }}
        >
          ←
        </button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>{getTitle()}</h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '16px', lineHeight: '1.5' }}>
        Help us write your content.
      </p>

      {/* 1. Market Input (Text) */}
      <ForgivingInput 
        label="Target City/Area"
        placeholder="e.g. Downtown Dubai"
        helperText="Where is the property located?"
        value={formData.market}
        onChange={(e) => handleChange('market', e.target.value)}
      />

      {/* Conditional Fields based on Service Type */}
      {serviceType === 'website' && (
        <>
          <ForgivingInput 
            label="Website Name"
            placeholder="e.g. Luxury Living Dubai"
            value={formData.siteName}
            onChange={(e) => handleChange('siteName', e.target.value)}
          />
          <DomainSearch onSelect={(domain) => handleChange('domain', domain)} />
        </>
      )}

      {(serviceType === 'website' || serviceType === 'aiMarketExpert') && (
        <CompetitorAnalysis 
          competitors={formData.competitors}
          onUpdate={(list) => handleChange('competitors', list)}
        />
      )}

      {serviceType === 'googleAds' && (
        <SmartAdPlanner 
          market={formData.market}
          budget={formData.budget}
          onBudgetChange={(e) => handleChange('budget', e.target.value)}
        />
      )}

      {serviceType === 'metaLeadGen' && (
        <BudgetCalculator 
          value={formData.budget}
          onChange={(e) => handleChange('budget', e.target.value)}
          platform="metaLeadGen"
        />
      )}

      {/* 2. Audience (Select) */}
      {renderSelect("Who are you targeting?", "audience", ["Home Buyers", "Investors/B2B"])}

      {/* 3. Goal (Select) */}
      {renderSelect("Main Goal", "goal", ["Get Leads", "Get Calls", "WhatsApp Chats", "Bookings", "File Downloads"])}

      {/* 4. Language (Select) */}
      {renderSelect("Language", "language", ["English", "Arabic", "Both"])}

      {/* 5. Persona Selector */}
      <PersonaSelector 
        selectedPersona={formData.persona} 
        onSelect={(p) => handleChange('persona', p)} 
      />

      {/* Sticky Footer - Only enabled if they typed a market */}
      <StickyFooter 
        label="Generate Blueprint" 
        onClick={() => onNext(formData)}
        disabled={!formData.market || formData.market.length < 2}
      />
    </div>
  );
};

export default UniversalInputsScreen;