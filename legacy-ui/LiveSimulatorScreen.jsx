import React, { useState, useRef, useEffect } from 'react';
import './mobile-styles.css';

const LiveSimulatorScreen = ({ onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hi! I'm your AI assistant. Ask me anything about the Downtown Luxury Loft." }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate AI typing and response
    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: "That's a great question. The down payment is 10%, and we have a flexible 3-year payment plan available. Would you like me to send the brochure?" 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="screen-container" style={{ padding: '0', paddingBottom: '80px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <div>
          <h1 className="screen-title" style={{ marginBottom: '4px', fontSize: '18px' }}>Live Simulator</h1>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>● Testing Mode</span>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="simulator-input-area">
        <input 
          className="simulator-input"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="send-btn" onClick={handleSend}>➤</button>
      </div>
    </div>
  );
};

export default LiveSimulatorScreen;