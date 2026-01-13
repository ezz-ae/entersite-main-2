import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import ThemeCustomizer from './ThemeCustomizer';
import './mobile-styles.css';

const BuilderScreen = ({ onBack, onPublish }) => {
  const [sections, setSections] = useState([
    { id: 1, type: 'hero', variant: 'Image BG', content: 'Luxury Living in Downtown' },
    { id: 2, type: 'offer', variant: 'Features', content: '3 Bedrooms • 2,500 Sqft • Maid\'s Room' },
    { id: 3, type: 'contact', variant: 'WhatsApp', content: 'Book a Viewing Today' }
  ]);

  const [theme, setTheme] = useState({
    color: '#007AFF',
    fontPairId: 'inter',
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif'
  });
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);

  const sectionTypes = {
    hero: { label: "Top Section", variants: ["Image BG", "Video BG", "Minimal"] },
    proof: { label: "Social Proof", variants: ["Reviews", "Stats", "Logos"] },
    offer: { label: "The Offer", variants: ["Payment Plan", "Packages", "Features"] },
    tools: { label: "Calculators", variants: ["ROI Calculator", "Valuation Request"] },
    contact: { label: "Contact Forms", variants: ["WhatsApp", "Form", "Booking"] },
    compliance: { label: "Legal/Footer", variants: ["Standard"] }
  };

  const aiActions = [
    "Rewrite for luxury", "Shorten text", "Add social proof", "Make bilingual", "Add WhatsApp CTA"
  ];

  const handleAddSection = () => {
    // In a real app, this would open a modal to select type
    const newId = sections.length + 1;
    setSections([...sections, { id: newId, type: 'proof', variant: 'Stats', content: 'Trusted by 500+ Investors' }]);
  };

  const handleAIAction = (action) => {
    alert(`AI is working: ${action}...`);
    // Simulate AI update
    setTimeout(() => {
      setSections(sections.map(s => ({ ...s, content: s.content + ' (Optimized)' })));
    }, 1000);
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Site Builder</h1>
      {showThemeCustomizer && (
        <ThemeCustomizer 
          currentTheme={theme}
          onSave={setTheme}
          onClose={() => setShowThemeCustomizer(false)}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
          <h1 className="screen-title" style={{ marginBottom: 0 }}>Site Builder</h1>
        </div>
        <button 
          onClick={() => setShowThemeCustomizer(true)}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          🎨 Theme
        </button>
      </div>

      {/* AI Actions */}
      <div className="ai-action-bar">
        {aiActions.map((action, i) => (
          <button key={i} className="ai-action-chip" onClick={() => handleAIAction(action)}>
            ✨ {action}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="builder-canvas">
        {sections.map((section, index) => (
          <div key={section.id} className="builder-section">
            <span className="section-label">{sectionTypes[section.type]?.label || section.type} - {section.variant}</span>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
            <span className="section-label" style={{ fontFamily: theme.bodyFont }}>{sectionTypes[section.type]?.label || section.type} - {section.variant}</span>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: theme.headingFont }}>
              {section.content}
            </div>
            <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>✏️</button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
            </div>
          </div>
        ))}
        
        <button className="add-section-btn" onClick={handleAddSection}>
          + Add Section
        </button>
      </div>

      <StickyFooter label="Publish Website" onClick={onPublish} />
    </div>
  );
};

export default BuilderScreen;