import React, { useState, useEffect } from 'react';
import './mobile-styles.css';

const DocumentScannerScreen = ({ onBack, onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleCapture = () => {
    setIsScanning(true);
    // Simulate processing delay
    setTimeout(() => {
      setIsScanning(false);
      setCapturedImage('https://via.placeholder.com/400x250?text=Business+Card'); // Placeholder
    }, 1500);
  };

  const handleSave = () => {
    // Simulate extracted data
    const extractedData = {
      name: "John Smith",
      company: "Smith Realty",
      phone: "+971 50 123 4567",
      email: "john@smithrealty.com"
    };
    onScanComplete(extractedData);
  };

  return (
    <div className="screen-container" style={{ padding: 0, height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'black' }}>
      {/* Header Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '24px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <span style={{ color: 'white', fontWeight: '600' }}>Scan Business Card</span>
        <div style={{ width: '40px' }}></div>
      </div>

      {capturedImage ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'var(--bg-primary)' }}>
          <img src={capturedImage} alt="Scanned Card" style={{ width: '100%', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--border-color)' }} />
          
          <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: 'var(--text-primary)' }}>Extracted Details</h3>
            <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-primary)' }}><strong>Name:</strong> John Smith</div>
            <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-primary)' }}><strong>Company:</strong> Smith Realty</div>
            <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-primary)' }}><strong>Phone:</strong> +971 50 123 4567</div>
            <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}><strong>Email:</strong> john@smithrealty.com</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <button onClick={() => setCapturedImage(null)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)', fontWeight: '600' }}>Retake</button>
            <button onClick={handleSave} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: '600' }}>Save Lead</button>
          </div>
        </div>
      ) : (
        <>
          <div className="camera-viewfinder">
            <div className="scan-overlay"></div>
            {isScanning && (
              <div style={{ position: 'absolute', color: 'white', fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '20px' }}>
                Processing...
              </div>
            )}
          </div>

          <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <button 
              onClick={handleCapture}
              style={{ 
                width: '72px', height: '72px', borderRadius: '50%', 
                backgroundColor: 'white', border: '4px solid rgba(255,255,255,0.3)', 
                backgroundClip: 'content-box', padding: '4px',
                cursor: 'pointer'
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentScannerScreen;