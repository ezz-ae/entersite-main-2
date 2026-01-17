import React, { useState } from 'react';
import './mobile-styles.css';

const TemplateEditor = ({ initialContent, onSave }) => {
  const [heading, setHeading] = useState("Exclusive Opportunity");
  const [body, setBody] = useState(initialContent || "Hi [Name],\n\nWe have a new opportunity that matches your investment criteria.");
  const [buttonText, setButtonText] = useState("View Property");
  const [themeColor, setThemeColor] = useState("#007AFF");

  const colors = ["#007AFF", "#10B981", "#F59E0B", "#EF4444", "#111827"];

  return (
    <div>
      <div className="editor-controls">
        <div className="control-group">
          <label className="control-label">Brand Color</label>
          <div className="color-picker-row">
            {colors.map(c => (
              <div 
                key={c} 
                className={`color-swatch ${themeColor === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setThemeColor(c)}
              />
            ))}
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Heading</label>
          <input 
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>

        <div className="control-group">
          <label className="control-label">Body Text</label>
          <textarea 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', resize: 'none', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
      </div>

      <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>Live Preview</h3>
      
      <div className="preview-frame">
        <div style={{ backgroundColor: themeColor, height: '6px', width: '100%', marginBottom: '24px' }}></div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '16px', fontFamily: 'sans-serif' }}>{heading}</h1>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', whiteSpace: 'pre-wrap', marginBottom: '24px', fontFamily: 'sans-serif' }}>{body}</p>
        <button style={{ backgroundColor: themeColor, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '16px', width: '100%', cursor: 'pointer' }}>
          {buttonText}
        </button>
      </div>

      <button 
        onClick={() => onSave({ heading, body, themeColor })}
        className="primary-button"
        style={{ marginTop: '24px' }}
      >
        Save Design
      </button>
    </div>
  );
};

export default TemplateEditor;