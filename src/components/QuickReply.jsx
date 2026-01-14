import React from 'react';
import './mobile-styles.css';

const QuickReply = ({ onSelect }) => {
  const templates = [
    "👋 Is this still available?",
    "📅 When can you view?",
    "📄 Sending info now.",
    "📞 Call me back?",
    "👍 Thanks!",
    "📍 Send Location"
  ];

  return (
    <div className="quick-reply-container">
      {templates.map((text, index) => (
        <button key={index} className="quick-reply-chip" onClick={() => onSelect(text)}>
          {text}
        </button>
      ))}
    </div>
  );
};

export default QuickReply;