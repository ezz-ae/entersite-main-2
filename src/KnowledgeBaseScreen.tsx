import React, { useState, useRef } from 'react';
import StickyFooter from './StickyFooter';
import './mobile-styles.css';

interface KnowledgeBaseScreenProps {
  onBack: () => void;
  onSave: () => void;
}

const KnowledgeBaseScreen: React.FC<KnowledgeBaseScreenProps> = ({ onBack, onSave }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [textData, setTextData] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Knowledge Base</h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Teach your Smart agent about your projects, pricing, and FAQs.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '24px', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px' }}>
        <button 
          onClick={() => setActiveTab('text')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'text' ? 'var(--bg-primary)' : 'transparent', color: activeTab === 'text' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: '600', boxShadow: activeTab === 'text' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
        >
          Paste Text
        </button>
        <button 
          onClick={() => setActiveTab('file')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'file' ? 'var(--bg-primary)' : 'transparent', color: activeTab === 'file' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: '600', boxShadow: activeTab === 'file' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
        >
          Upload PDF
        </button>
      </div>

      {activeTab === 'text' ? (
        <textarea
          placeholder="Paste your project details, payment plans, or FAQs here..."
          value={textData}
          onChange={(e) => setTextData(e.target.value)}
          style={{
            width: '100%',
            height: '300px',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '16px',
            resize: 'none',
            outline: 'none'
          }}
        />
      ) : (
        <div>
          <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📄</span>
            <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>Tap to Upload PDF</span>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Max 10MB</span>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf,.doc,.docx" onChange={handleFileUpload} multiple />
          </div>

          {files.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {files.map((file, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-accent)', borderRadius: '8px', border: '1px solid var(--primary-color)' }}>
                  <span style={{ marginRight: '8px' }}>📎</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary-color)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <StickyFooter label="Save Knowledge" onClick={onSave} disabled={activeTab === 'text' ? !textData : files.length === 0} />
    </div>
  );
};

export default KnowledgeBaseScreen;