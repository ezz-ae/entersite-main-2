import React from 'react';
import './mobile-styles.css';
import { Chat } from './ChatAgentDashboard';

interface ConversationViewScreenProps {
  chat: Chat | null;
  onBack: () => void;
}

const ConversationViewScreen: React.FC<ConversationViewScreenProps> = ({ chat, onBack }) => {
  // Mock full history based on the preview
  const history = [
    { id: 1, sender: 'user', text: "Hi, I saw your ad for the Downtown Loft.", time: "10:30 AM" },
    { id: 2, sender: 'ai', text: "Hello! Yes, it's a stunning property. Are you looking to buy or invest?", time: "10:30 AM" },
    { id: 3, sender: 'user', text: "Looking to invest mostly.", time: "10:32 AM" },
    { id: 4, sender: 'ai', text: "Great choice. The ROI for this unit is projected at 8%. Would you like to see the payment plan?", time: "10:32 AM" },
    { id: 5, sender: 'user', text: chat?.lastMsg || "Yes, send it over.", time: "10:35 AM" },
    { id: 6, sender: 'ai', text: chat?.aiResponse || "Here is the PDF. I can also book a viewing for you tomorrow?", time: "10:35 AM" }
  ];

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <div>
          <h1 className="screen-title" style={{ marginBottom: '4px', fontSize: '18px' }}>{chat?.user || 'Chat'}</h1>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>● AI Active</span>
        </div>
      </div>

      {/* Chat History */}
      <div style={{ flex: 1, overflowY: 'auto' }} className="chat-history-container">
        {history.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
            <span style={{ 
              fontSize: '10px', 
              marginTop: '4px', 
              opacity: 0.7, 
              display: 'block', 
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              color: msg.sender === 'user' ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)'
            }}>
              {msg.time}
            </span>
          </div>
        ))}
      </div>

      {/* Takeover Action */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        width: '100%', 
        padding: '16px 24px', 
        backgroundColor: 'var(--bg-primary)', 
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button className="takeover-btn" style={{ width: '100%', padding: '16px', fontSize: '14px' }}>✋ Takeover Conversation</button>
      </div>
    </div>
  );
};

export default ConversationViewScreen;