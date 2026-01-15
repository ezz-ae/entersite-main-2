import React, { useState } from 'react';
import './mobile-styles.css';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceAssistantScreenProps {
  onBack: () => void;
}

const VoiceAssistantScreen: React.FC<VoiceAssistantScreenProps> = ({ onBack }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('Tap the mic to ask me anything.');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);
    setResponse("Listening...");

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      processCommand(text);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const processCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    let reply = "I'm not sure about that. Try asking about leads or views.";

    if (lowerText.includes('lead')) {
      reply = "You received 12 new leads today. 3 of them are high intent.";
    } else if (lowerText.includes('view') || lowerText.includes('traffic')) {
      reply = "Your projects got 1,240 views today, mostly from Instagram.";
    } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
      reply = "Hello! How can I help you grow your business today?";
    } else if (lowerText.includes('schedule') || lowerText.includes('meeting')) {
      reply = "I can help with that. Please go to the Meeting Scheduler to set your availability.";
    }

    setResponse(reply);
    speak(reply);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
      <button onClick={onBack} style={{ position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-tertiary)' }}>←</button>
      
      <div style={{ marginBottom: '40px' }}>
        <div className={`voice-orb ${isListening ? 'listening' : isSpeaking ? 'speaking' : ''}`}>
          {isListening ? '👂' : isSpeaking ? '🗣️' : '🎙️'}
        </div>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
        {isListening ? 'Listening...' : 'Voice Assistant'}
      </h2>

      <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '8px', minHeight: '24px' }}>
        "{transcript}"
      </p>

      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', maxWidth: '300px', width: '100%', marginTop: '24px' }}>
        <p style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)', fontWeight: '500' }}>
          {response}
        </p>
      </div>

      <button 
        onClick={startListening}
        className="primary-button"
        style={{ marginTop: '40px', width: 'auto', padding: '0 40px', borderRadius: '30px' }}
        disabled={isListening || isSpeaking}
      >
        {isListening ? 'Listening...' : 'Tap to Speak'}
      </button>
    </div>
  );
};

export default VoiceAssistantScreen;