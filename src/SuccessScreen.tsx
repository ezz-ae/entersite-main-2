import React, { useState, useEffect } from 'react';
import StickyFooter from './StickyFooter';
import Confetti from './Confetti';
import ShareModal from './ShareModal';

interface SuccessScreenProps {
  publishedUrl: string;
  onDashboardClick: () => void;
  onNextStepClick: (step: string) => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ publishedUrl, onDashboardClick, onNextStepClick }) => {
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    // Play success sound on mount
    const audio = new Audio('/sounds/success.mp3'); // Ensure this file exists in your public folder
    audio.volume = 0.6;
    audio.play().catch(e => console.log("Audio play prevented:", e));
  }, []);

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px', textAlign: 'center' }}>
      <Confetti />
      {showShare && <ShareModal url={publishedUrl} onClose={() => setShowShare(false)} />}
      
      {/* Success Icon / Animation Placeholder */}
      <div style={{ fontSize: '64px', marginBottom: '24px', marginTop: '40px' }}>🎉</div>

      <h1 className="screen-title" style={{ color: '#10B981' }}>You're Live!</h1>
      
      <p style={{ color: '#6B7280', marginBottom: '32px', fontSize: '16px', lineHeight: '1.5' }}>
        Your project has been successfully published and is ready for visitors.
      </p>

      {/* Published URL Card - Highlighting the win */}
      {publishedUrl && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#F0FDF4', 
          border: '1px solid #BBF7D0', 
          borderRadius: '16px',
          marginBottom: '32px'
        }}>
          <span style={{ display: 'block', fontSize: '12px', color: '#15803D', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>
            Published URL
          </span>
          <a href={publishedUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '18px', color: '#15803D', fontWeight: '600', textDecoration: 'underline', wordBreak: 'break-all' }}>
            {publishedUrl}
          </a>

          {/* Share Button */}
          <button 
            onClick={() => setShowShare(true)}
            style={{
              marginTop: '16px',
              width: '100%',
              padding: '12px',
              backgroundColor: '#111827',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <span>📤 Share Project</span>
          </button>
        </div>
      )}

      {/* Next Steps Section - Upsell the next feature immediately */}
      <div style={{ textAlign: 'left' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>What's Next?</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={() => onNextStepClick('meta')}
              style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                border: '1px solid #E5E7EB', 
                backgroundColor: 'white',
                textAlign: 'left',
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <span>🚀 Run Facebook Ads</span>
              <span style={{ color: '#9CA3AF' }}>→</span>
            </button>
            
            <button 
              onClick={() => onNextStepClick('google')}
              style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                border: '1px solid #E5E7EB', 
                backgroundColor: 'white',
                textAlign: 'left',
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <span>🔍 Run Google Ads</span>
              <span style={{ color: '#9CA3AF' }}>→</span>
            </button>
        </div>
      </div>

      <StickyFooter label="Go to Dashboard" onClick={onDashboardClick} />
    </div>
  );
};

export default SuccessScreen;