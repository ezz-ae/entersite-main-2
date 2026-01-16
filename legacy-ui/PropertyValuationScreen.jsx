import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import ForgivingInput from './ForgivingInput';
import './mobile-styles.css';

const PropertyValuationScreen = ({ onBack }) => {
  const [formData, setFormData] = useState({
    location: 'Downtown Dubai',
    type: 'Apartment',
    bedrooms: '2',
    size: '1500'
  });
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setResult(null);
    setTimeout(() => {
      // Simulate result based on inputs
      const basePrice = 1000 * parseInt(formData.size || 1000);
      const range = basePrice * 0.1;
      const low = (basePrice - range).toLocaleString();
      const high = (basePrice + range).toLocaleString();
      
      setResult({
        range: `AED ${low} - AED ${high}`
      });
      setIsCalculating(false);
    }, 2000);
  };

  const renderSelect = (label, field, options) => (
    <div style={{ marginBottom: '24px' }}>
      <label className="control-label">{label}</label>
      <select 
        value={formData[field]} 
        onChange={(e) => handleChange(field, e.target.value)}
        style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Valuation Tool</h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Get an instant market estimate for any property.
      </p>

      <ForgivingInput 
        label="Location / Community"
        value={formData.location}
        onChange={(e) => handleChange('location', e.target.value)}
      />
      
      {renderSelect("Property Type", "type", ["Apartment", "Villa", "Townhouse", "Penthouse"])}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {renderSelect("Bedrooms", "bedrooms", ["Studio", "1", "2", "3", "4+"])}
        <ForgivingInput 
          label="Size (sqft)"
          type="number"
          value={formData.size}
          onChange={(e) => handleChange('size', e.target.value)}
        />
      </div>

      {isCalculating && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', margin: '0 auto 12px auto', borderWidth: '3px' }}></div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Analyzing market data...</p>
        </div>
      )}

      {result && (
        <div className="valuation-result-card">
          <span className="valuation-label">Estimated Market Value</span>
          <h2 className="valuation-range">{result.range}</h2>
          <p className="valuation-disclaimer">Based on 3 recent sales in {formData.location}.</p>
        </div>
      )}

      <StickyFooter 
        label="Calculate Valuation" 
        onClick={handleCalculate} 
        disabled={!formData.location || !formData.size}
      />
    </div>
  );
};

export default PropertyValuationScreen;