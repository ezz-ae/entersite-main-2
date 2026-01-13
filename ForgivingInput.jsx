import React, { useState } from 'react';

const ForgivingInput = ({ label, type = "text", placeholder, helperText, value, onChange }) => {
  const [isListening, setIsListening] = useState(false);
  // Smart input mode: 'decimal' brings up the number pad on mobile immediately
  const inputMode = type === 'number' ? 'decimal' : 'text';

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const currentValue = value || '';
      // Append if there's existing text, otherwise just set it
      const newValue = currentValue ? `${currentValue} ${transcript}` : transcript;
      onChange({ target: { value: newValue } });
    };

    recognition.start();
  };
  
  return (
    <div className="input-group" style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
        {label}
      </label>
      
      <div style={{ position: 'relative' }}>
        <input 
          type={type === 'number' ? 'text' : type} // Using 'text' with inputMode prevents some browser validation quirks
          inputMode={inputMode}
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            padding: '16px',     /* Large touch target for thumbs */
            paddingRight: '48px', /* Space for mic button */
            fontSize: '16px',    /* CRITICAL: Prevents auto-zoom on iPhone */
            borderRadius: '12px',
            border: `1px solid ${isListening ? 'var(--primary-color)' : 'var(--border-color)'}`,
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
        <button
          onClick={handleVoiceInput}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            opacity: isListening ? 1 : 0.6
          }}
          title="Dictate"
        >
          {isListening ? '🔴' : '🎙️'}
        </button>
      </div>
      
      {helperText && (
        <span style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.4' }}>
          💡 {helperText}
        </span>
      )}
    </div>
  );
};

export default ForgivingInput;