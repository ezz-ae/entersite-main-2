import React, { useState } from 'react';
import './mobile-styles.css';

export interface Chat {
  id: number;
  user: string;
  time: string;
  lastMsg: string;
  aiResponse: string;
  status: string;
}

interface ChatAgentDashboardProps {
  onBack: () => void;
  onUpdateKnowledge: () => void;
  onViewChat: (chat: Chat) => void;
  onShowQR: () => void;
  onTestSimulator: () => void;
}

const ChatAgentDashboard: React.FC<ChatAgentDashboardProps> = ({ onBack, onUpdateKnowledge, onViewChat, onShowQR, onTestSimulator }) => {
  const [isActive, setIsActive] = useState(true);
  const [pausedChats, setPausedChats] = useState<number[]>([]);

  // Dummy feed data
  const [feed] = useState<Chat[]>([
    { id: 1, user: '@sarah_dxb', time: 'Just now', lastMsg: '"Yes, I am available tomorrow at 4 PM."', aiResponse: 'Booking confirmed. Sending calendar invite...', status: 'active' },
    { id: 2, user: '@mike_investor', time: '5m ago', lastMsg: '"How much is the down payment?"', aiResponse: 'It is 10% on booking. Would you like the payment plan PDF?', status: 'active' }
  ]);

  const toggleTakeover = (chatId: number) => {
    if (pausedChats.includes(chatId)) {
      setPausedChats(pausedChats.filter(id => id !== chatId));
    } else {
      setPausedChats([...pausedChats, chatId]);
    }
  };

  const handleChatClick = (chat: Chat) => {
    // Pass the chat object to the parent handler
    onViewChat(chat);
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '40px' }}>
      {/* Custom Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>AI Agent</h1>
      </div>

      {/* Status Card */}
      <div className="chat-dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>Status</span>
            <h2 style={{ margin: 0, fontSize: '28px' }}>{isActive ? 'Online 🟢' : 'Paused ⏸️'}</h2>
          </div>
          <div 
            onClick={() => setIsActive(!isActive)}
            style={{
              width: '60px', height: '32px', backgroundColor: isActive ? '#10B981' : '#4B5563', borderRadius: '16px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
            <div style={{
              width: '26px', height: '26px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: isActive ? '31px' : '3px', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          {isActive ? 'I am currently replying to DMs and booking meetings.' : 'I am sleeping. You need to reply manually.'}
        </p>
        
        <button 
          onClick={onTestSimulator}
          style={{
            marginTop: '16px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          🧪 Test Simulator
        </button>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>💬</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>142</span>
          <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>DMs Handled</span>
        </div>
        <div style={{ backgroundColor: 'var(--bg-accent)', padding: '16px', borderRadius: '16px', border: '1px solid var(--primary-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>📅</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-color)' }}>8</span>
          <span style={{ display: 'block', fontSize: '11px', color: 'var(--primary-color)', textTransform: 'uppercase', fontWeight: '700' }}>Meetings Booked</span>
        </div>
      </div>

      {/* Live Feed */}
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>Live Activity</h3>
      <div className="live-feed-container">
        {feed.map(chat => {
          const isPaused = pausedChats.includes(chat.id);
          return (
            <div 
              key={chat.id} 
              className="chat-message-preview" 
              style={{ borderLeftColor: isPaused ? '#EF4444' : '#10B981', cursor: 'pointer' }}
              onClick={() => handleChatClick(chat)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '12px' }}>{chat.user}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isPaused && <span className="takeover-badge takeover-active">✋ Human Mode</span>}
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{chat.time}</span>
                </div>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{chat.lastMsg}</p>
              {!isPaused && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--primary-color)', fontWeight: '600' }}>🤖 AI: {chat.aiResponse}</div>
              )}
              <button className="takeover-btn" onClick={(e) => { e.stopPropagation(); toggleTakeover(chat.id); }}>
                {isPaused ? '▶️ Resume AI' : '⏸️ Pause AI (Takeover)'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Knowledge Base Quick Action */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
        <button 
          onClick={onUpdateKnowledge}
          style={{ 
          padding: '16px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <span style={{ fontSize: '24px' }}>📚</span>
          <span style={{ fontSize: '12px' }}>Knowledge Base</span>
        </button>
        <button 
          onClick={onShowQR}
          style={{ 
          padding: '16px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <span style={{ fontSize: '24px' }}>🏁</span>
          <span style={{ fontSize: '12px' }}>Get QR Code</span>
        </button>
      </div>
    </div>
  );
};

export default ChatAgentDashboard;